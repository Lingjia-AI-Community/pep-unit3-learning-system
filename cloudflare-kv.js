// Cloudflare KV 存储模块
const CloudflareKV = {
    // KV命名空间绑定（在Cloudflare Pages中配置）
    KV_NAMESPACE: null,
    
    // 初始化KV
    init: async function() {
        try {
            // 在Cloudflare Pages环境中，KV命名空间通过环境变量绑定
            if (typeof PEPT_KV !== 'undefined') {
                this.KV_NAMESPACE = PEPT_KV;
                console.log('KV存储初始化成功');
                return true;
            }
            return false;
        } catch (error) {
            console.error('KV初始化失败:', error);
            return false;
        }
    },
    
    // 检查是否在线
    isOnline: function() {
        return navigator.onLine && this.KV_NAMESPACE !== null;
    },
    
    // 获取数据（先从本地缓存，再从云端）
    getData: async function(key) {
        try {
            // 先尝试从云端获取
            if (this.isOnline()) {
                const cloudData = await this.getFromCloud(key);
                if (cloudData) {
                    // 同时更新本地缓存
                    localStorage.setItem(key, JSON.stringify(cloudData));
                    return cloudData;
                }
            }
            
            // 回退到本地存储
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : null;
        } catch (error) {
            console.error('获取数据失败:', error);
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : null;
        }
    },
    
    // 从云端获取数据
    getFromCloud: async function(key) {
        try {
            const response = await this.KV_NAMESPACE.get(key, 'json');
            return response;
        } catch (error) {
            console.error('从云端获取数据失败:', error);
            return null;
        }
    },
    
    // 保存数据（先到本地，再同步到云端）
    saveData: async function(key, data) {
        try {
            // 先保存到本地
            localStorage.setItem(key, JSON.stringify(data));
            
            // 如果在线，同步到云端
            if (this.isOnline()) {
                await this.saveToCloud(key, data);
            } else {
                // 如果离线，添加到待同步队列
                this.addToSyncQueue(key, data);
            }
            
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    },
    
    // 保存到云端
    saveToCloud: async function(key, data) {
        try {
            await this.KV_NAMESPACE.put(key, JSON.stringify(data));
            console.log(`数据已同步到云端: ${key}`);
            return true;
        } catch (error) {
            console.error('保存到云端失败:', error);
            return false;
        }
    },
    
    // 添加到同步队列
    addToSyncQueue: function(key, data) {
        const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
        queue.push({
            key: key,
            data: data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('sync_queue', JSON.stringify(queue));
    },
    
    // 处理同步队列
    syncQueue: async function() {
        if (!this.isOnline()) return;
        
        const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
        if (queue.length === 0) return;
        
        console.log(`开始同步 ${queue.length} 条数据...`);
        
        const failedItems = [];
        
        for (const item of queue) {
            try {
                await this.saveToCloud(item.key, item.data);
            } catch (error) {
                console.error(`同步失败: ${item.key}`, error);
                failedItems.push(item);
            }
        }
        
        // 更新队列（保留失败的）
        localStorage.setItem('sync_queue', JSON.stringify(failedItems));
        
        if (failedItems.length === 0) {
            console.log('所有数据同步完成！');
        } else {
            console.log(`${failedItems.length} 条数据同步失败，将重试`);
        }
    },
    
    // 获取所有数据（管理员用）
    getAllData: async function() {
        try {
            if (!this.isOnline()) {
                throw new Error('需要网络连接');
            }
            
            const keys = [
                'students',
                'system_backups',
                'last_backup'
            ];
            
            const data = {};
            
            // 获取所有学生数据
            const students = await this.getData('students');
            if (students) {
                data.students = students;
                data.trainingData = {};
                
                // 获取每个学生的训练数据
                for (const student of students) {
                    const sessions = await this.getData(`sessions_${student.id}`);
                    const progress = await this.getData(`progress_${student.id}`);
                    const score = await this.getData(`score_${student.id}`);
                    
                    data.trainingData[student.id] = {
                        sessions: sessions || [],
                        progress: progress || null,
                        score: score || 0
                    };
                }
            }
            
            // 获取系统数据
            data.systemData = {
                backups: await this.getData('system_backups') || [],
                lastBackup: await this.getData('last_backup') || null
            };
            
            // 元数据
            data.metadata = {
                timestamp: new Date().toISOString(),
                source: 'cloudflare_kv',
                recordCount: data.students ? data.students.length : 0
            };
            
            return data;
        } catch (error) {
            console.error('获取所有数据失败:', error);
            throw error;
        }
    }
};

// 全局可用
window.CloudflareKV = CloudflareKV;
