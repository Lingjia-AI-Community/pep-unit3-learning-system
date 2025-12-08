// 管理员系统配置
const ADMIN_CONFIG = {
    SYSTEM_NAME: 'Pep unit3 learning system - Admin',
    EXPORT_FORMATS: ['csv', 'json', 'xlsx'],
    BACKUP_KEY: 'pep_system_backup'
};

// 全局变量
let currentAdminSection = 'students';
let selectedStudents = new Set();
let allTrainingSessions = [];

// 初始化管理员页面
function initAdminPage() {
    // 检查管理员登录状态
    checkAdminLogin();
    
    // 初始化导航
    initAdminNavigation();
    
    // 初始化学生管理
    initStudentManagement();
    
    // 初始化训练情况
    initTrainingManagement();
    
    // 初始化数据管理
    initDataManagement();
    
    // 初始化事件监听
    initAdminEventListeners();
    
    // 加载数据
    loadAllData();
}

// 检查管理员登录
function checkAdminLogin() {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
        window.location.href = 'login.html';
    }
}

// 初始化管理员导航
function initAdminNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            
            // 更新按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}Section`) {
                    section.classList.add('active');
                }
            });
            
            currentAdminSection = sectionId;
        });
    });
}

// 初始化学生管理
function initStudentManagement() {
    // 添加学生按钮
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        toggleAddStudentForm(true);
    });
    
    // 取消添加
    document.getElementById('cancelAdd').addEventListener('click', () => {
        toggleAddStudentForm(false);
    });
    
    // 提交新学生表单
    document.getElementById('newStudentForm').addEventListener('submit', addNewStudent);
    
    // 批量导入按钮
    document.getElementById('importStudentsBtn').addEventListener('click', () => {
        toggleImportSection(true);
    });
    
    // 粘贴导入
    document.getElementById('pasteImportBtn').addEventListener('click', importFromPaste);
    
    // 文件导入
    document.getElementById('uploadImportBtn').addEventListener('click', importFromFile);
    
    // 搜索学生
    document.getElementById('studentSearch').addEventListener('input', searchStudents);
}

// 初始化训练管理
function initTrainingManagement() {
    // 日期筛选
    document.getElementById('dateFilter').addEventListener('change', filterTrainingData);
    
    // 学生筛选
    document.getElementById('studentFilter').addEventListener('change', filterTrainingData);
    
    // 全选
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
    
    // 导出数据
    document.getElementById('exportTrainingBtn').addEventListener('click', exportAllTrainingData);
    document.getElementById('exportSelectedBtn').addEventListener('click', exportSelectedTrainingData);
}

// 初始化数据管理
function initDataManagement() {
    // 备份数据
    document.getElementById('backupDataBtn').addEventListener('click', backupSystemData);
    
    // 恢复数据
    document.getElementById('restoreDataBtn').addEventListener('click', () => {
        document.getElementById('restoreFile').click();
    });
    
    document.getElementById('restoreFile').addEventListener('change', restoreSystemData);
    
    // 清除训练数据
    document.getElementById('clearTrainingDataBtn').addEventListener('click', () => {
        showConfirmDialog(
            '清除训练数据',
            '确定要清除所有训练记录吗？此操作不可恢复。',
            clearTrainingData
        );
    });
    
    // 重置系统
    document.getElementById('resetSystemBtn').addEventListener('click', () => {
        showConfirmDialog(
            '重置系统',
            '确定要重置系统到初始状态吗？所有数据都将被清除。',
            resetSystem
        );
    });
}

// 初始化管理员事件监听
function initAdminEventListeners() {
    // 退出登录
    document.getElementById('adminLogout').addEventListener('click', adminLogout);
    
    // 确认对话框
    document.getElementById('dialogConfirm').addEventListener('click', confirmDialogAction);
    document.getElementById('dialogCancel').addEventListener('click', hideConfirmDialog);
}

// 加载所有数据
function loadAllData() {
    loadStudents();
    loadTrainingSessions();
    updateSystemStats();
}

// 加载学生数据
function loadStudents() {
    const students = getStudents();
    const tableBody = document.getElementById('studentsTable').querySelector('tbody');
    const studentFilter = document.getElementById('studentFilter');
    
    tableBody.innerHTML = '';
    studentFilter.innerHTML = '<option value="all">所有学生</option>';
    
    students.forEach((student, index) => {
        // 添加到表格
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.password}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${student.id}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="delete-btn" data-id="${student.id}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        tableBody.appendChild(row);
        
        // 添加到筛选器
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentFilter.appendChild(option);
    });
    
    // 更新计数
    document.getElementById('studentCount').textContent = students.length;
    document.getElementById('systemStudentCount').textContent = students.length;
    
    // 添加事件监听
    tableBody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editStudent(btn.dataset.id));
    });
    
    tableBody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteStudent(btn.dataset.id));
    });
}

// 加载训练会话
function loadTrainingSessions() {
    allTrainingSessions = [];
    const students = getStudents();
    
    students.forEach(student => {
        const sessions = JSON.parse(localStorage.getItem(`sessions_${student.id}`) || '[]');
        sessions.forEach(session => {
            allTrainingSessions.push({
                ...session,
                studentName: student.name,
                studentId: student.id
            });
        });
    });
    
    updateTrainingTable();
    updateTrainingStats();
}

// 更新训练表格
function updateTrainingTable(filteredSessions = allTrainingSessions) {
    const tableBody = document.getElementById('trainingTable').querySelector('tbody');
    tableBody.innerHTML = '';
    
    filteredSessions.forEach((session, index) => {
        const startTime = new Date(session.startTime);
        const endTime = session.endTime ? new Date(session.endTime) : null;
        
        let duration = '进行中';
        if (endTime) {
            const diffMs = endTime - startTime;
            const diffMins = Math.floor(diffMs / 60000);
            duration = `${diffMins}分钟`;
        }
        
        const totalScore = (session.basicScore || 0) + (session.advancedScore || 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="session-checkbox" data-index="${index}"></td>
            <td>${session.studentName}</td>
            <td>${startTime.toLocaleDateString('zh-CN')}</td>
            <td>${duration}</td>
            <td>${session.basicScore || 0}</td>
            <td>${session.advancedScore || 0}</td>
            <td>${totalScore}</td>
            <td>${session.completed ? '已完成' : '未完成'}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // 添加复选框事件监听
    tableBody.querySelectorAll('.session-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (e.target.checked) {
                selectedStudents.add(index);
            } else {
                selectedStudents.delete(index);
            }
        });
    });
}

// 更新训练统计
function updateTrainingStats() {
    const completedSessions = allTrainingSessions.filter(s => s.completed);
    const totalTime = completedSessions.reduce((sum, session) => {
        if (session.endTime) {
            const start = new Date(session.startTime);
            const end = new Date(session.endTime);
            return sum + (end - start);
        }
        return sum;
    }, 0);
    
    const avgTime = completedSessions.length > 0 ? 
        Math.floor(totalTime / completedSessions.length / 60000) : 0;
    
    const totalScore = completedSessions.reduce((sum, session) => {
        return sum + (session.basicScore || 0) + (session.advancedScore || 0);
    }, 0);
    
    const avgScore = completedSessions.length > 0 ? 
        Math.floor(totalScore / completedSessions.length) : 0;
    
    document.getElementById('totalStudents').textContent = getStudents().length;
    document.getElementById('avgTime').textContent = avgTime;
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('completedCount').textContent = completedSessions.length;
    document.getElementById('trainingRecordCount').textContent = allTrainingSessions.length;
}

// 更新系统统计
function updateSystemStats() {
    const storageUsed = calculateStorageUsage();
    document.getElementById('storageStatus').textContent = storageUsed;
    
    const lastBackup = localStorage.getItem('last_backup');
    document.getElementById('lastBackup').textContent = lastBackup || '无';
}

// 计算存储使用
function calculateStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage.getItem(key).length * 2; // 近似字节数
        }
    }
    return `${(total / 1024).toFixed(2)} KB`;
}

// 切换添加学生表单
function toggleAddStudentForm(show) {
    const form = document.getElementById('addStudentForm');
    const importSection = document.getElementById('importSection');
    
    if (show) {
        form.style.display = 'block';
        importSection.style.display = 'none';
    } else {
        form.style.display = 'none';
        document.getElementById('newStudentForm').reset();
    }
}

// 切换导入区域
function toggleImportSection(show) {
    const form = document.getElementById('addStudentForm');
    const importSection = document.getElementById('importSection');
    
    if (show) {
        importSection.style.display = 'block';
        form.style.display = 'none';
    } else {
        importSection.style.display = 'none';
    }
}

// 添加新学生
function addNewStudent(event) {
    event.preventDefault();
    
    const name = document.getElementById('newName').value.trim();
    const studentId = document.getElementById('newStudentId').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    
    if (!name || !studentId || !password) {
        showToast('请填写所有字段', 'error');
        return;
    }
    
    const students = getStudents();
    
    // 检查学号是否重复
    if (students.some(s => s.id === studentId)) {
        showToast('学号已存在', 'error');
        return;
    }
    
    // 添加新学生
    students.push({
        id: studentId,
        name: name,
        password: password
    });
    
    localStorage.setItem('students', JSON.stringify(students));
    
    // 重置表单并更新显示
    toggleAddStudentForm(false);
    loadStudents();
    showToast('学生添加成功', 'success');
}

// 编辑学生
function editStudent(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    // 使用对话框进行编辑
    const newName = prompt('请输入新的姓名:', student.name);
    if (newName === null) return;
    
    const newPassword = prompt('请输入新的密码:', student.password);
    if (newPassword === null) return;
    
    student.name = newName.trim();
    student.password = newPassword.trim();
    
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
    showToast('学生信息更新成功', 'success');
}

// 删除学生
function deleteStudent(studentId) {
    if (!confirm(`确定要删除学号为 ${studentId} 的学生吗？此操作不可恢复。`)) {
        return;
    }
    
    const students = getStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);
    
    localStorage.setItem('students', JSON.stringify(filteredStudents));
    
    // 删除相关的训练数据
    localStorage.removeItem(`sessions_${studentId}`);
    localStorage.removeItem(`progress_${studentId}`);
    localStorage.removeItem(`score_${studentId}`);
    
    loadStudents();
    loadTrainingSessions();
    showToast('学生删除成功', 'success');
}

// 搜索学生
function searchStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const tableBody = document.getElementById('studentsTable').querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        const id = row.children[2].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || id.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 从粘贴板导入
function importFromPaste() {
    const data = document.getElementById('excelData').value.trim();
    if (!data) {
        showToast('请粘贴数据', 'error');
        return;
    }
    
    const lines = data.split('\n').filter(line => line.trim());
    const students = getStudents();
    let imported = 0;
    let skipped = 0;
    
    lines.forEach((line, index) => {
        // 跳过标题行
        if (index === 0 && (line.includes('姓名') || line.includes('学号'))) {
            return;
        }
        
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const id = parts[1].trim();
            const password = parts[2] ? parts[2].trim() : '123456yy';
            
            // 检查是否已存在
            if (!students.some(s => s.id === id)) {
                students.push({ id, name, password });
                imported++;
            } else {
                skipped++;
            }
        }
    });
    
    if (imported > 0) {
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        showToast(`成功导入 ${imported} 名学生，跳过 ${skipped} 名已存在学生`, 'success');
    } else if (skipped > 0) {
        showToast(`所有学生都已存在，跳过了 ${skipped} 名学生`, 'warning');
    } else {
        showToast('没有找到有效数据', 'error');
    }
}

// 从文件导入
function importFromFile() {
    const fileInput = document.getElementById('studentFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showToast('请选择文件', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let students = [];
            
            if (file.name.endsWith('.json')) {
                students = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                students = parseCSV(content);
            }
            
            if (Array.isArray(students) && students.length > 0) {
                importStudents(students);
            } else {
                showToast('文件格式不正确', 'error');
            }
        } catch (error) {
            console.error('导入错误:', error);
            showToast('文件解析失败', 'error');
        }
    };
    
    if (file.name.endsWith('.json')) {
        reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
        reader.readAsText(file, 'UTF-8');
    } else {
        showToast('不支持的文件格式', 'error');
    }
}

// 解析CSV
function parseCSV(content) {
    const lines = content.split('\n');
    const students = [];
    
    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return;
        
        const parts = line.split(',');
        if (parts.length >= 2) {
            students.push({
                id: parts[0].trim(),
                name: parts[1].trim(),
                password: parts[2] ? parts[2].trim() : '123456yy'
            });
        }
    });
    
    return students;
}

// 导入学生
function importStudents(newStudents) {
    const existingStudents = getStudents();
    let imported = 0;
    let skipped = 0;
    
    newStudents.forEach(newStudent => {
        if (!existingStudents.some(s => s.id === newStudent.id)) {
            existingStudents.push(newStudent);
            imported++;
        } else {
            skipped++;
        }
    });
    
    localStorage.setItem('students', JSON.stringify(existingStudents));
    loadStudents();
    
    if (imported > 0) {
        showToast(`成功导入 ${imported} 名学生，跳过 ${skipped} 名已存在学生`, 'success');
    } else {
        showToast(`所有学生都已存在，跳过了 ${skipped} 名学生`, 'warning');
    }
}

// 筛选训练数据
function filterTrainingData() {
    const dateFilter = document.getElementById('dateFilter').value;
    const studentFilter = document.getElementById('studentFilter').value;
    const now = new Date();
    
    let filtered = allTrainingSessions;
    
    // 按日期筛选
    if (dateFilter !== 'all') {
        filtered = filtered.filter(session => {
            const startDate = new Date(session.startTime);
            
            switch (dateFilter) {
                case 'today':
                    return startDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    return startDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return startDate >= monthAgo;
                default:
                    return true;
            }
        });
    }
    
    // 按学生筛选
    if (studentFilter !== 'all') {
        filtered = filtered.filter(session => session.studentId === studentFilter);
    }
    
    updateTrainingTable(filtered);
}

// 切换全选
function toggleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.session-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
        const index = parseInt(checkbox.dataset.index);
        if (e.target.checked) {
            selectedStudents.add(index);
        } else {
            selectedStudents.delete(index);
        }
    });
}

// 导出所有训练数据
function exportAllTrainingData() {
    exportTrainingData(allTrainingSessions, 'all_training_data');
}

// 导出选中训练数据
function exportSelectedTrainingData() {
    if (selectedStudents.size === 0) {
        showToast('请先选择要导出的数据', 'warning');
        return;
    }
    
    const selectedSessions = Array.from(selectedStudents)
        .map(index => allTrainingSessions[index])
        .filter(Boolean);
    
    exportTrainingData(selectedSessions, 'selected_training_data');
}

// 导出训练数据
function exportTrainingData(sessions, filename) {
    // 转换为CSV格式
    const headers = ['学生姓名', '学号', '登录日期', '训练时间', '基础训练分', '提升训练分', '总分', '完成状态'];
    const rows = sessions.map(session => {
        const startTime = new Date(session.startTime);
        const endTime = session.endTime ? new Date(session.endTime) : null;
        
        let duration = '进行中';
        if (endTime) {
            const diffMs = endTime - startTime;
            const diffMins = Math.floor(diffMs / 60000);
            duration = `${diffMins}分钟`;
        }
        
        const totalScore = (session.basicScore || 0) + (session.advancedScore || 0);
        
        return [
            session.studentName,
            session.studentId,
            startTime.toLocaleDateString('zh-CN'),
            duration,
            session.basicScore || 0,
            session.advancedScore || 0,
            totalScore,
            session.completed ? '已完成' : '未完成'
        ];
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    showToast('数据导出成功', 'success');
}

// 备份系统数据
function backupSystemData() {
    const backup = {
        students: getStudents(),
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    // 收集所有训练数据
    backup.trainingData = {};
    const students = getStudents();
    students.forEach(student => {
        const sessions = JSON.parse(localStorage.getItem(`sessions_${student.id}`) || '[]');
        const progress = localStorage.getItem(`progress_${student.id}`);
        const score = localStorage.getItem(`score_${student.id}`);
        
        if (sessions.length > 0 || progress || score) {
            backup.trainingData[student.id] = {
                sessions: sessions,
                progress: progress ? JSON.parse(progress) : null,
                score: score
            };
        }
    });
    
    // 创建备份文件
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pep_system_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    
    // 保存备份时间
    localStorage.setItem('last_backup', new Date().toLocaleString('zh-CN'));
    updateSystemStats();
    
    showToast('系统数据备份成功', 'success');
}

// 恢复系统数据
function restoreSystemData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            showConfirmDialog(
                '恢复系统数据',
                '确定要恢复系统数据吗？当前数据将被覆盖。',
                () => {
                    performRestore(backup);
                }
            );
        } catch (error) {
            console.error('恢复错误:', error);
            showToast('备份文件格式不正确', 'error');
        }
    };
    
    reader.readAsText(file);
}

// 执行恢复
function performRestore(backup) {
    // 恢复学生数据
    if (backup.students && Array.isArray(backup.students)) {
        localStorage.setItem('students', JSON.stringify(backup.students));
    }
    
    // 恢复训练数据
    if (backup.trainingData) {
        for (const [studentId, data] of Object.entries(backup.trainingData)) {
            if (data.sessions) {
                localStorage.setItem(`sessions_${studentId}`, JSON.stringify(data.sessions));
            }
            if (data.progress) {
                localStorage.setItem(`progress_${studentId}`, JSON.stringify(data.progress));
            }
            if (data.score) {
                localStorage.setItem(`score_${studentId}`, data.score);
            }
        }
    }
    
    // 更新备份时间
    if (backup.timestamp) {
        localStorage.setItem('last_backup', new Date(backup.timestamp).toLocaleString('zh-CN'));
    }
    
    // 重新加载数据
    loadAllData();
    showToast('系统数据恢复成功', 'success');
}

// 清除训练数据
function clearTrainingData() {
    const students = getStudents();
    
    students.forEach(student => {
        localStorage.removeItem(`sessions_${student.id}`);
        localStorage.removeItem(`progress_${student.id}`);
        localStorage.removeItem(`score_${student.id}`);
    });
    
    // 重新加载
    loadTrainingSessions();
    showToast('训练数据已清除', 'success');
}

// 重置系统
function resetSystem() {
    // 清除所有数据
    localStorage.clear();
    
    // 重新加载初始数据
    loadInitialData();
    loadAllData();
    
    showToast('系统已重置到初始状态', 'success');
}

// 管理员退出
function adminLogout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
}

// 显示确认对话框
function showConfirmDialog(title, message, confirmCallback) {
    document.getElementById('dialogTitle').textContent = title;
    document.getElementById('dialogMessage').textContent = message;
    document.getElementById('confirmDialog').style.display = 'flex';
    
    // 保存回调函数
    document.getElementById('dialogConfirm').onclick = () => {
        confirmCallback();
        hideConfirmDialog();
    };
}

// 隐藏确认对话框
function hideConfirmDialog() {
    document.getElementById('confirmDialog').style.display = 'none';
}

// 确认对话框操作
function confirmDialogAction() {
    // 回调函数在showConfirmDialog中设置
}

// 显示提示消息
function showToast(message, type = 'success') {
    const toast = document.getElementById('messageToast');
    const messageSpan = document.getElementById('toastMessage');
    
    messageSpan.textContent = message;
    toast.style.display = 'block';
    
    // 设置颜色
    if (type === 'success') {
        toast.style.background = '#28a745';
    } else if (type === 'error') {
        toast.style.background = '#dc3545';
    } else if (type === 'warning') {
        toast.style.background = '#ffc107';
    }
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// 获取学生数据
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAdminPage);
// 云端数据管理功能
const CloudAdmin = {
    // 从云端加载所有数据
    loadFromCloud: async function() {
        try {
            showToast('正在从云端加载数据...', 'info');
            
            const cloudData = await CloudflareKV.getAllData();
            
            if (cloudData.students) {
                // 更新本地存储
                localStorage.setItem('students', JSON.stringify(cloudData.students));
                
                // 更新训练数据
                if (cloudData.trainingData) {
                    for (const [studentId, data] of Object.entries(cloudData.trainingData)) {
                        if (data.sessions) {
                            localStorage.setItem(`sessions_${studentId}`, JSON.stringify(data.sessions));
                        }
                        if (data.progress) {
                            localStorage.setItem(`progress_${studentId}`, JSON.stringify(data.progress));
                        }
                        if (data.score !== undefined) {
                            localStorage.setItem(`score_${studentId}`, data.score.toString());
                        }
                    }
                }
                
                // 更新系统数据
                if (cloudData.systemData) {
                    if (cloudData.systemData.backups) {
                        localStorage.setItem('system_backups', JSON.stringify(cloudData.systemData.backups));
                    }
                    if (cloudData.systemData.lastBackup) {
                        localStorage.setItem('last_backup', cloudData.systemData.lastBackup);
                    }
                }
                
                // 重新加载UI
                loadAllData();
                showToast('云端数据加载成功', 'success');
                return true;
            } else {
                showToast('云端没有数据', 'warning');
                return false;
            }
        } catch (error) {
            console.error('从云端加载失败:', error);
            showToast(`加载失败: ${error.message}`, 'error');
            return false;
        }
    },
    
    // 强制同步到云端
    forceSyncToCloud: async function() {
        try {
            showToast('正在同步到云端...', 'info');
            
            const result = await SyncManager.manualSync();
            
            if (result.success) {
                showToast('同步到云端成功', 'success');
            } else {
                showToast(result.message, 'error');
            }
            
            return result;
        } catch (error) {
            console.error('强制同步失败:', error);
            showToast(`同步失败: ${error.message}`, 'error');
            return { success: false, message: error.message };
        }
    },
    
    // 比较云端和本地数据
    compareData: async function() {
        try {
            const localStudents = getStudents();
            let cloudStudents = [];
            
            try {
                const cloudData = await CloudflareKV.getFromCloud('students');
                cloudStudents = cloudData || [];
            } catch (error) {
                console.log('无法获取云端学生数据');
            }
            
            const differences = {
                localOnly: localStudents.filter(local => 
                    !cloudStudents.some(cloud => cloud.id === local.id)
                ),
                cloudOnly: cloudStudents.filter(cloud => 
                    !localStudents.some(local => local.id === cloud.id)
                ),
                conflicts: []
            };
            
            // 找出冲突（同ID但内容不同）
            for (const local of localStudents) {
                const cloud = cloudStudents.find(c => c.id === local.id);
                if (cloud && JSON.stringify(local) !== JSON.stringify(cloud)) {
                    differences.conflicts.push({
                        id: local.id,
                        local: local,
                        cloud: cloud
                    });
                }
            }
            
            return differences;
        } catch (error) {
            console.error('比较数据失败:', error);
            return null;
        }
    },
    
    // 解决数据冲突
    resolveConflict: async function(studentId, useCloudData) {
        try {
            if (useCloudData) {
                // 使用云端数据覆盖本地
                const cloudData = await CloudflareKV.getAllData();
                if (cloudData.trainingData[studentId]) {
                    const data = cloudData.trainingData[studentId];
                    localStorage.setItem(`sessions_${studentId}`, JSON.stringify(data.sessions || []));
                    localStorage.setItem(`progress_${studentId}`, JSON.stringify(data.progress || null));
                    localStorage.setItem(`score_${studentId}`, (data.score || 0).toString());
                }
                showToast(`已使用云端数据覆盖 ${studentId}`, 'success');
            } else {
                // 使用本地数据覆盖云端
                const sessions = localStorage.getItem(`sessions_${studentId}`);
                const progress = localStorage.getItem(`progress_${studentId}`);
                const score = localStorage.getItem(`score_${studentId}`);
                
                if (sessions) await CloudflareKV.saveData(`sessions_${studentId}`, JSON.parse(sessions));
                if (progress) await CloudflareKV.saveData(`progress_${studentId}`, JSON.parse(progress));
                if (score) await CloudflareKV.saveData(`score_${studentId}`, score);
                
                showToast(`已将本地数据同步到云端 ${studentId}`, 'success');
            }
            
            return true;
        } catch (error) {
            console.error('解决冲突失败:', error);
            showToast(`解决冲突失败: ${error.message}`, 'error');
            return false;
        }
    }
};

// 在admin页面添加云端管理界面
function addCloudManagementUI() {
    const dataSection = document.getElementById('dataSection');
    
    const cloudManagementHTML = `
        <div class="cloud-management">
            <h3><i class="fas fa-cloud"></i> 云端数据管理</h3>
            
            <div class="cloud-controls">
                <div class="cloud-status" id="cloudStatus">
                    检查云端状态...
                </div>
                
                <div class="cloud-buttons">
                    <button id="loadFromCloudBtn" class="action-btn">
                        <i class="fas fa-cloud-download-alt"></i> 从云端加载
                    </button>
                    <button id="syncToCloudBtn" class="action-btn">
                        <i class="fas fa-cloud-upload-alt"></i> 同步到云端
                    </button>
                    <button id="compareDataBtn" class="action-btn">
                        <i class="fas fa-exchange-alt"></i> 比较数据
                    </button>
                </div>
                
                <div class="sync-status" id="syncStatus">
                    同步状态: 检查中...
                </div>
                
                <div id="dataComparison" style="display: none; margin-top: 20px;">
                    <!-- 数据比较结果会显示在这里 -->
                </div>
            </div>
        </div>
    `;
    
    dataSection.insertAdjacentHTML('afterbegin', cloudManagementHTML);
    
    // 添加事件监听
    document.getElementById('loadFromCloudBtn').addEventListener('click', () => {
        CloudAdmin.loadFromCloud();
    });
    
    document.getElementById('syncToCloudBtn').addEventListener('click', () => {
        CloudAdmin.forceSyncToCloud();
    });
    
    document.getElementById('compareDataBtn').addEventListener('click', async () => {
        const differences = await CloudAdmin.compareData();
        displayDataComparison(differences);
    });
    
    // 更新状态
    updateCloudStatus();
    setInterval(updateCloudStatus, 60000); // 每分钟更新一次
}

// 更新云端状态显示
function updateCloudStatus() {
    const status = SyncManager.getStatus();
    const cloudStatus = document.getElementById('cloudStatus');
    const syncStatus = document.getElementById('syncStatus');
    
    let cloudText = '';
    let syncText = '';
    
    if (CloudflareKV.isOnline()) {
        cloudText = '<span style="color: #28a745;">✓ 云端连接正常</span>';
    } else {
        cloudText = '<span style="color: #dc3545;">✗ 云端不可用（使用本地模式）</span>';
    }
    
    syncText = `同步状态: ${status.isSyncing ? '同步中...' : '就绪'}`;
    if (status.lastSyncTime) {
        const lastSync = new Date(status.lastSyncTime).toLocaleTimeString('zh-CN');
        syncText += ` | 上次同步: ${lastSync}`;
    }
    if (status.queueLength > 0) {
        syncText += ` | 待同步: ${status.queueLength} 条`;
    }
    
    cloudStatus.innerHTML = cloudText;
    syncStatus.textContent = syncText;
}

// 显示数据比较结果
function displayDataComparison(differences) {
    const container = document.getElementById('dataComparison');
    
    if (!differences) {
        container.innerHTML = '<div class="alert alert-danger">无法获取比较结果</div>';
        container.style.display = 'block';
        return;
    }
    
    let html = '<h4>数据比较结果</h4>';
    
    // 本地独有的数据
    if (differences.localOnly.length > 0) {
        html += `<div class="alert alert-info">
            <strong>本地独有 (${differences.localOnly.length}):</strong><br>
            ${differences.localOnly.map(s => s.name).join(', ')}
        </div>`;
    }
    
    // 云端独有的数据
    if (differences.cloudOnly.length > 0) {
        html += `<div class="alert alert-warning">
            <strong>云端独有 (${differences.cloudOnly.length}):</strong><br>
            ${differences.cloudOnly.map(s => s.name).join(', ')}
        </div>`;
    }
    
    // 冲突数据
    if (differences.conflicts.length > 0) {
        html += `<div class="alert alert-danger">
            <strong>数据冲突 (${differences.conflicts.length}):</strong>
        </div>`;
        
        differences.conflicts.forEach(conflict => {
            html += `
                <div class="conflict-item">
                    <p><strong>学号: ${conflict.id}</strong></p>
                    <div class="row">
                        <div class="col">
                            <strong>本地数据:</strong>
                            <pre>${JSON.stringify(conflict.local, null, 2)}</pre>
                        </div>
                        <div class="col">
                            <strong>云端数据:</strong>
                            <pre>${JSON.stringify(conflict.cloud, null, 2)}</pre>
                        </div>
                    </div>
                    <div class="conflict-actions">
                        <button class="btn btn-sm btn-success" onclick="resolveConflict('${conflict.id}', true)">
                            使用云端数据
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="resolveConflict('${conflict.id}', false)">
                            使用本地数据
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    // 没有差异
    if (differences.localOnly.length === 0 && 
        differences.cloudOnly.length === 0 && 
        differences.conflicts.length === 0) {
        html += '<div class="alert alert-success">本地和云端数据完全一致</div>';
    }
    
    container.innerHTML = html;
    container.style.display = 'block';
}
