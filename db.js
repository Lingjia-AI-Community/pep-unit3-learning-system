// 数据库操作模块
const Database = {
    // 获取学生数据
    getStudents: function() {
        try {
            const students = localStorage.getItem('students');
            return students ? JSON.parse(students) : [];
        } catch (error) {
            console.error('获取学生数据失败:', error);
            return [];
        }
    },

    // 保存学生数据
    saveStudents: function(students) {
        try {
            localStorage.setItem('students', JSON.stringify(students));
            return true;
        } catch (error) {
            console.error('保存学生数据失败:', error);
            return false;
        }
    },

    // 获取学生训练记录
    getStudentSessions: function(studentId) {
        try {
            const sessions = localStorage.getItem(`sessions_${studentId}`);
            return sessions ? JSON.parse(sessions) : [];
        } catch (error) {
            console.error('获取训练记录失败:', error);
            return [];
        }
    },

    // 保存学生训练记录
    saveStudentSession: function(studentId, session) {
        try {
            const sessions = this.getStudentSessions(studentId);
            sessions.push(session);
            localStorage.setItem(`sessions_${studentId}`, JSON.stringify(sessions));
            return true;
        } catch (error) {
            console.error('保存训练记录失败:', error);
            return false;
        }
    },

    // 获取学生进度
    getStudentProgress: function(studentId) {
        try {
            const progress = localStorage.getItem(`progress_${studentId}`);
            return progress ? JSON.parse(progress) : null;
        } catch (error) {
            console.error('获取进度失败:', error);
            return null;
        }
    },

    // 保存学生进度
    saveStudentProgress: function(studentId, progress) {
        try {
            localStorage.setItem(`progress_${studentId}`, JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('保存进度失败:', error);
            return false;
        }
    },

    // 获取学生分数
    getStudentScore: function(studentId) {
        try {
            const score = localStorage.getItem(`score_${studentId}`);
            return score ? parseInt(score) : 0;
        } catch (error) {
            console.error('获取分数失败:', error);
            return 0;
        }
    },

    // 保存学生分数
    saveStudentScore: function(studentId, score) {
        try {
            localStorage.setItem(`score_${studentId}`, score.toString());
            return true;
        } catch (error) {
            console.error('保存分数失败:', error);
            return false;
        }
    },

    // 清除所有数据
    clearAllData: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清除数据失败:', error);
            return false;
        }
    },

    // 导出所有数据
    exportAllData: function() {
        try {
            const data = {};
            
            // 导出学生数据
            data.students = this.getStudents();
            
            // 导出训练数据
            data.trainingData = {};
            data.students.forEach(student => {
                data.trainingData[student.id] = {
                    sessions: this.getStudentSessions(student.id),
                    progress: this.getStudentProgress(student.id),
                    score: this.getStudentScore(student.id)
                };
            });
            
            // 添加元数据
            data.metadata = {
                exportDate: new Date().toISOString(),
                systemName: 'Pep unit3 learning system',
                version: '1.0'
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('导出数据失败:', error);
            return null;
        }
    },

    // 导入数据
    importData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.students && Array.isArray(data.students)) {
                this.saveStudents(data.students);
            }
            
            if (data.trainingData && typeof data.trainingData === 'object') {
                for (const [studentId, studentData] of Object.entries(data.trainingData)) {
                    if (studentData.sessions && Array.isArray(studentData.sessions)) {
                        localStorage.setItem(`sessions_${studentId}`, JSON.stringify(studentData.sessions));
                    }
                    if (studentData.progress) {
                        localStorage.setItem(`progress_${studentId}`, JSON.stringify(studentData.progress));
                    }
                    if (studentData.score !== undefined) {
                        localStorage.setItem(`score_${studentId}`, studentData.score.toString());
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    },

    // 检查存储空间
    checkStorageSpace: function() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage.getItem(key).length * 2;
                }
            }
            
            const usedKB = (total / 1024).toFixed(2);
            const totalKB = 5120; // 5MB的近似值
            
            return {
                used: parseFloat(usedKB),
                total: totalKB,
                percentage: ((usedKB / totalKB) * 100).toFixed(2)
            };
        } catch (error) {
            console.error('检查存储空间失败:', error);
            return { used: 0, total: 5120, percentage: 0 };
        }
    },

    // 备份数据
    backup: function() {
        try {
            const backupData = this.exportAllData();
            if (!backupData) {
                throw new Error('导出数据失败');
            }
            
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `pep_system_backup_${timestamp}.json`;
            
            // 保存备份记录
            const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
            backups.push({
                filename: filename,
                date: new Date().toISOString(),
                size: backupData.length
            });
            
            // 只保留最近的10个备份
            if (backups.length > 10) {
                backups.shift();
            }
            
            localStorage.setItem('system_backups', JSON.stringify(backups));
            localStorage.setItem('last_backup', new Date().toISOString());
            
            return { data: backupData, filename: filename };
        } catch (error) {
            console.error('备份失败:', error);
            return null;
        }
    },

    // 获取备份列表
    getBackups: function() {
        try {
            return JSON.parse(localStorage.getItem('system_backups') || '[]');
        } catch (error) {
            console.error('获取备份列表失败:', error);
            return [];
        }
    }
};

// 使Database对象全局可用
window.Database = Database;