// _worker.js - Cloudflare Pages Worker
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // 设置CORS头部
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };
        
        // 处理预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders
            });
        }
        
        // API路由处理
        if (path.startsWith('/api/')) {
            return handleAPIRequest(request, env, path);
        }
        
        // 对于其他所有请求，交给Pages处理静态文件
        // 这里我们直接转发到Pages的静态文件服务
        return fetch(request);
    }
};

// 处理API请求
async function handleAPIRequest(request, env, path) {
    try {
        switch(path) {
            case '/api/data/get':
                return handleGetData(request, env);
            case '/api/data/set':
                return handleSetData(request, env);
            case '/api/data/sync':
                return handleSyncData(request, env);
            case '/api/data/backup':
                return handleBackupData(request, env);
            case '/api/data/restore':
                return handleRestoreData(request, env);
            case '/api/status':
                return handleStatusCheck(request, env);
            default:
                return jsonResponse({ 
                    success: false, 
                    error: 'API endpoint not found' 
                }, 404);
        }
    } catch (error) {
        console.error('API error:', error);
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 获取数据
async function handleGetData(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
        return jsonResponse({ 
            success: false, 
            error: 'Key parameter is required' 
        }, 400);
    }
    
    try {
        const value = await env.PEPT_KV.get(key, 'json');
        return jsonResponse({ 
            success: true, 
            data: value 
        });
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 设置数据
async function handleSetData(request, env) {
    try {
        const { key, data } = await request.json();
        
        if (!key || data === undefined) {
            return jsonResponse({ 
                success: false, 
                error: 'Key and data are required' 
            }, 400);
        }
        
        await env.PEPT_KV.put(key, JSON.stringify(data));
        
        return jsonResponse({ 
            success: true, 
            message: 'Data saved successfully' 
        });
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 同步数据
async function handleSyncData(request, env) {
    try {
        const { studentId, dataType, data } = await request.json();
        
        if (!studentId || !dataType || data === undefined) {
            return jsonResponse({ 
                success: false, 
                error: 'Student ID, data type and data are required' 
            }, 400);
        }
        
        const key = `${dataType}_${studentId}`;
        await env.PEPT_KV.put(key, JSON.stringify(data));
        
        // 更新学生列表
        if (dataType === 'student') {
            const students = await env.PEPT_KV.get('students', 'json') || [];
            if (!students.some(s => s.id === studentId)) {
                students.push({ id: studentId, name: data.name });
                await env.PEPT_KV.put('students', JSON.stringify(students));
            }
        }
        
        return jsonResponse({ 
            success: true, 
            message: 'Data synced successfully' 
        });
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 备份数据
async function handleBackupData(request, env) {
    try {
        const { name } = await request.json();
        const timestamp = new Date().toISOString();
        const backupKey = `backup_${name || timestamp}`;
        
        // 获取所有键
        const keys = await env.PEPT_KV.list();
        const backupData = {};
        
        // 获取所有数据
        for (const keyInfo of keys.keys) {
            const value = await env.PEPT_KV.get(keyInfo.name, 'json');
            backupData[keyInfo.name] = value;
        }
        
        // 保存备份
        await env.PEPT_KV.put(backupKey, JSON.stringify(backupData));
        
        // 更新备份列表
        const backups = await env.PEPT_KV.get('backups', 'json') || [];
        backups.push({
            key: backupKey,
            timestamp: timestamp,
            size: JSON.stringify(backupData).length,
            name: name || 'auto-backup'
        });
        
        // 只保留最近10个备份
        if (backups.length > 10) {
            backups.shift();
        }
        
        await env.PEPT_KV.put('backups', JSON.stringify(backups));
        
        return jsonResponse({ 
            success: true, 
            backupKey: backupKey,
            timestamp: timestamp
        });
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 恢复数据
async function handleRestoreData(request, env) {
    try {
        const { backupKey } = await request.json();
        
        if (!backupKey) {
            return jsonResponse({ 
                success: false, 
                error: 'Backup key is required' 
            }, 400);
        }
        
        const backupData = await env.PEPT_KV.get(backupKey, 'json');
        
        if (!backupData) {
            return jsonResponse({ 
                success: false, 
                error: 'Backup not found' 
            }, 404);
        }
        
        // 恢复所有数据
        for (const [key, value] of Object.entries(backupData)) {
            if (value !== null) {
                await env.PEPT_KV.put(key, JSON.stringify(value));
            }
        }
        
        return jsonResponse({ 
            success: true, 
            message: 'Data restored successfully' 
        });
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            error: error.message 
        }, 500);
    }
}

// 状态检查
async function handleStatusCheck(request, env) {
    try {
        // 测试KV连接
        const testKey = 'health_check';
        const testValue = { timestamp: new Date().toISOString() };
        
        await env.PEPT_KV.put(testKey, JSON.stringify(testValue));
        const retrievedValue = await env.PEPT_KV.get(testKey, 'json');
        
        const isKVWorking = retrievedValue && retrievedValue.timestamp === testValue.timestamp;
        
        return jsonResponse({
            success: true,
            status: 'online',
            kv: isKVWorking ? 'connected' : 'error',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return jsonResponse({
            success: false,
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

// 返回JSON响应
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
