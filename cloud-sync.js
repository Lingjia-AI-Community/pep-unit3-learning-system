// cloud-sync.js - 云端数据同步模块
class CloudSync {
    constructor() {
        this.API_BASE = 'https://pep-api.your-worker.workers.dev'; // 替换为你的Worker地址
        this.isOnline = false;
        this.pendingSync = [];
        this.init();
    }
    
    // 初始化
    async init() {
        try {
            // 测试API连接
            const response = await fetch(`${this.API_BASE}/api/health`);
            if (response.ok) {
                this.isOnline = true;
                console.log('云端API连接成功');
                
                // 处理待同步的数据
                await this.processPendingSync();
                
                // 开始定期同步
                this.startPeriodicSync();
            } else {
                console.log('云端API不可用，使用本地模式');
            }
        } catch (error) {
            console.log('云端API连接失败:', error.message);
        }
    }
    
    // 处理待同步数据
    async processPendingSync() {
        const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]');
        if (pending.length === 0) return;
        
        console.log(`有 ${pending.length} 条待同步数据`);
        
        for (const item of pending) {
            try {
                await this.syncData(item.key, item.data, item.userId);
                console.log(`同步成功: ${item.key}`);
            } catch (error) {
                console.error(`同步失败: ${item.key}`, error);
                // 保留失败的项目
                this.pendingSync.push(item);
            }
        }
        
        // 更新本地存储
        localStorage.setItem('pending_sync', JSON.stringify(this.pendingSync));
    }
    
    // 开始定期同步
    startPeriodicSync() {
        // 每30秒同步一次
        setInterval(() => {
            if (this.isOnline && this.pendingSync.length > 0) {
                this.processPendingSync();
            }
        }, 30000);
        
        // 监听网络状态
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processPendingSync();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }
    
    // 保存数据（先本地，后云端）
    async saveData(key, data, userId = null) {
        // 1. 保存到本地
        if (userId) {
            localStorage.setItem(`${userId}_${key}`, JSON.stringify(data));
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
        
        // 2. 尝试同步到云端
        try {
            await this.syncData(key, data, userId);
        } catch (error) {
            console.log('云端保存失败，添加到待同步队列:', error.message);
            this.addToPendingSync(key, data, userId);
        }
    }
    
    // 同步数据到云端
    async syncData(key, data, userId = null) {
        if (!this.isOnline) {
            throw new Error('网络未连接');
        }
        
        const response = await fetch(`${this.API_BASE}/api/data/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, data, userId })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || '未知错误');
        }
        
        return result;
    }
    
    // 添加到待同步队列
    addToPendingSync(key, data, userId = null) {
        const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]');
        pending.push({ key, data, userId, timestamp: new Date().toISOString() });
        localStorage.setItem('pending_sync', JSON.stringify(pending));
        this.pendingSync = pending;
    }
    
    // 获取数据（先尝试云端，后本地）
    async getData(key, userId = null, forceLocal = false) {
        // 如果强制本地或离线，直接返回本地数据
        if (forceLocal || !this.isOnline) {
            const localKey = userId ? `${userId}_${key}` : key;
            const data = localStorage.getItem(localKey);
            return data ? JSON.parse(data) : null;
        }
        
        try {
            // 尝试从云端获取
            const url = `${this.API_BASE}/api/data/get?key=${key}&userId=${userId || ''}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    // 同时更新本地缓存
                    const localKey = userId ? `${userId}_${key}` : key;
                    localStorage.setItem(localKey, JSON.stringify(result.data));
                    return result.data;
                }
            }
        } catch (error) {
            console.log('从云端获取失败，使用本地数据:', error.message);
        }
        
        // 回退到本地数据
        const localKey = userId ? `${userId}_${key}` : key;
        const data = localStorage.getItem(localKey);
        return data ? JSON.parse(data) : null;
    }
    
    // 登录（云端验证）
    async login(username, password, type = 'student') {
        try {
            const response = await fetch(`${this.API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, type })
            });
            
            if (!response.ok) {
                throw new Error('登录请求失败');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.log('云端登录失败，使用本地验证:', error.message);
            
            // 回退到本地验证
            if (type === 'admin') {
                if (username === '叶金炎' && password === 'yjy897018@') {
                    return {
                        success: true,
                        user: { type: 'admin', name: username }
                    };
                }
                return { success: false, error: '管理员账号或密码错误' };
            }
            
            // 学生本地验证
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const student = students.find(s => 
                (s.name === username || s.id === username) && s.password === password
            );
            
            if (student) {
                return {
                    success: true,
                    user: { type: 'student', ...student }
                };
            }
            
            return { success: false, error: '账号或密码错误' };
        }
    }
    
    // 管理员：获取所有学生
    async getAllStudents() {
        try {
            const response = await fetch(`${this.API_BASE}/api/admin/students`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.data;
                }
            }
        } catch (error) {
            console.log('从云端获取学生失败，使用本地数据:', error.message);
        }
        
        // 回退到本地数据
        return JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // 管理员：获取所有训练数据
    async getAllTrainingData() {
        try {
            const response = await fetch(`${this.API_BASE}/api/admin/training`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.data;
                }
            }
        } catch (error) {
            console.log('从云端获取训练数据失败，使用本地数据:', error.message);
        }
        
        // 回退到本地数据：收集所有学生的训练数据
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const allTrainingData = [];
        
        students.forEach(student => {
            const sessions = JSON.parse(localStorage.getItem(`sessions_${student.id}`) || '[]');
            sessions.forEach(session => {
                allTrainingData.push({
                    studentName: student.name,
                    studentId: student.id,
                    ...session
                });
            });
        });
        
        return allTrainingData;
    }
    
    // 管理员：获取统计信息
    async getStats() {
        try {
            const response = await fetch(`${this.API_BASE}/api/admin/stats`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.data;
                }
            }
        } catch (error) {
            console.log('从云端获取统计信息失败:', error.message);
        }
        
        // 计算本地统计
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        let totalScore = 0;
        let totalSessions = 0;
        let completedSessions = 0;
        
        students.forEach(student => {
            const sessions = JSON.parse(localStorage.getItem(`sessions_${student.id}`) || '[]');
            totalSessions += sessions.length;
            
            sessions.forEach(session => {
                if (session.completed) {
                    completedSessions++;
                    totalScore += (session.basicScore || 0) + (session.advancedScore || 0);
                }
            });
        });
        
        const avgScore = completedSessions > 0 ? Math.round(totalScore / completedSessions) : 0;
        
        return {
            totalStudents: students.length,
            totalSessions,
            completedSessions,
            avgScore,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // 同步所有本地数据到云端（管理员用）
    async syncAllToCloud() {
        try {
            // 收集所有本地数据
            const allData = {
                students: JSON.parse(localStorage.getItem('students') || '[]'),
                trainingData: {}
            };
            
            // 收集所有训练数据
            allData.students.forEach(student => {
                const sessions = JSON.parse(localStorage.getItem(`sessions_${student.id}`) || '[]');
                const progress = localStorage.getItem(`progress_${student.id}`);
                const score = localStorage.getItem(`score_${student.id}`);
                
                if (sessions.length > 0 || progress || score) {
                    allData.trainingData[student.id] = {
                        sessions: sessions,
                        progress: progress ? JSON.parse(progress) : null,
                        score: score ? parseInt(score) : 0
                    };
                }
            });
            
            // 同步到云端
            const response = await fetch(`${this.API_BASE}/api/sync/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: allData })
            });
            
            if (!response.ok) {
                throw new Error('同步失败');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('同步所有数据失败:', error);
            throw error;
        }
    }
}

// 创建全局实例
window.cloudSync = new CloudSync();
