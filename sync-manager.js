// 数据同步管理器
const SyncManager = {
    // 同步状态
    isSyncing: false,
    lastSyncTime: null,
    
    // 初始化
    init: async function() {
        try {
            // 初始化KV存储
            const kvInitialized = await CloudflareKV.init();
            
            if (kvInitialized) {
                console.log('云端同步功能已启用');
                
                // 监听网络状态变化
                window.addEventListener('online', this.handleOnline.bind(this));
                window.addEventListener('offline', this.handleOffline.bind(this));
                
                // 定期同步
                setInterval(this.autoSync.bind(this), 300000); // 每5分钟
                
                // 初始同步
                setTimeout(this.autoSync.bind(this), 5000);
                
                return true;
            } else {
                console.log('使用本地存储模式');
                return false;
            }
        } catch (error) {
            console.error('同步管理器初始化失败:', error);
            return false;
        }
    },
    
    // 自动同步
    autoSync: async function() {
        if (this.isSyncing || !navigator.onLine) {
            return;
        }
        
        try {
            this.isSyncing = true;
            console.log('开始自动同步...');
            
            // 同步待处理队列
            await CloudflareKV.syncQueue();
            
            this.lastSyncTime = new Date();
            this.isSyncing = false;
            
            console.log('自动同步完成');
        } catch (error) {
            console.error('自动同步失败:', error);
            this.isSyncing = false;
        }
    },
    
    // 手动同步
    manualSync: async function() {
        if (this.isSyncing) {
            return { success: false, message: '正在同步中...' };
        }
        
        try {
            this.isSyncing = true;
            console.log('开始手动同步...');
            
            // 同步所有重要数据
            const keysToSync = ['students', 'system_backups', 'last_backup'];
            
            for (const key of keysToSync) {
                const data = localStorage.getItem(key);
                if (data) {
                    await CloudflareKV.saveData(key, JSON.parse(data));
                }
            }
            
            // 同步学生训练数据
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            for (const student of students) {
                const sessions = localStorage.getItem(`sessions_${student.id}`);
                const progress = localStorage.getItem(`progress_${student.id}`);
                const score = localStorage.getItem(`score_${student.id}`);
                
                if (sessions) await CloudflareKV.saveData(`sessions_${student.id}`, JSON.parse(sessions));
                if (progress) await CloudflareKV.saveData(`progress_${student.id}`, JSON.parse(progress));
                if (score) await CloudflareKV.saveData(`score_${student.id}`, score);
            }
            
            // 同步待处理队列
            await CloudflareKV.syncQueue();
            
            this.lastSyncTime = new Date();
            this.isSyncing = false;
            
            console.log('手动同步完成');
            return { success: true, message: '同步完成' };
        } catch (error) {
            console.error('手动同步失败:', error);
            this.isSyncing = false;
            return { success: false, message: `同步失败: ${error.message}` };
        }
    },
    
    // 处理上线事件
    handleOnline: function() {
        console.log('网络已连接，开始同步...');
        this.autoSync();
    },
    
    // 处理下线事件
    handleOffline: function() {
        console.log('网络已断开，切换到离线模式');
    },
    
    // 获取同步状态
    getStatus: function() {
        return {
            isOnline: navigator.onLine,
            isSyncing: this.isSyncing,
            lastSyncTime: this.lastSyncTime,
            queueLength: JSON.parse(localStorage.getItem('sync_queue') || '[]').length
        };
    },
    
    // 清除同步队列
    clearQueue: function() {
        localStorage.setItem('sync_queue', '[]');
        console.log('同步队列已清除');
    }
};

// 全局可用
window.SyncManager = SyncManager;
