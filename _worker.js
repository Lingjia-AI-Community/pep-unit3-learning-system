
// Cloudflare Worker - 处理KV存储
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
        
        // 路由处理
        switch(path) {
            case '/api/data':
                return handleDataRequest(request, env);
            case '/api/sync':
                return handleSyncRequest(request, env);
            case '/api/backup':
                return handleBackupRequest(request, env);
            case '/api/restore':
                return handleRestoreRequest(request, env);
            default:
                // 对于其他路径，返回前端文件
                return serveStaticFiles(request, env);
        }
    }
};

// 处理数据请求
async function handleDataRequest(request, env) {
    try {
        const { action, key, data } = await request.json();
        
        switch(action) {
            case 'get':
                const value = await env.PEPT_KV.get(key, 'json');
                return jsonResponse({ success: true, data: value });
                
            case 'set':
                await env.PEPT_KV.put(key, JSON.stringify(data));
                return jsonResponse({ success: true });
                
            case 'delete':
                await env.PEPT_KV.delete(key);
                return jsonResponse({ success: true });
                
            case 'list':
                const keys = await env.PEPT_KV.list();
                return jsonResponse({ success: true, data: keys.keys });
                
            default:
                return jsonResponse({ success: false, error: '未知操作' }, 400);
        }
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500);
    }
}

// 处理同步请求
async function handleSyncRequest(request, env) {
    try {
        const { studentId, data } = await request.json();
        
        // 保存学生数据
        await env.PEPT_KV.put(`student_${studentId}`, JSON.stringify(data));
        
        // 更新学生列表
        const studentsList = await env.PEPT_KV.get('students', 'json') || [];
        if (!studentsList.some(s => s.id === studentId)) {
            studentsList.push({ id: studentId, name: data.name });
            await env.PEPT_KV.put('students', JSON.stringify(studentsList));
        }
        
        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500);
    }
}

// 处理备份请求
async function handleBackupRequest(request, env) {
    try {
        const { timestamp } = await request.json();
        const backupKey = `backup_${timestamp}`;
        
        // 获取所有数据
        const keys = await env.PEPT_KV.list();
        const allData = {};
        
        for (const key of keys.keys) {
            const value = await env.PEPT_KV.get(key.name, 'json');
            allData[key.name] = value;
        }
        
        // 保存备份
        await env.PEPT_KV.put(backupKey, JSON.stringify(allData));
        
        // 更新备份列表
        const backups = await env.PEPT_KV.get('backups', 'json') || [];
        backups.push({
            key: backupKey,
            timestamp: timestamp,
            size: JSON.stringify(allData).length
        });
        await env.PEPT_KV.put('backups', JSON.stringify(backups));
        
        return jsonResponse({ success: true, backupKey });
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500);
    }
}

// 处理恢复请求
async function handleRestoreRequest(request, env) {
    try {
        const { backupKey } = await request.json();
        
        const backupData = await env.PEPT_KV.get(backupKey, 'json');
        if (!backupData) {
            return jsonResponse({ success: false, error: '备份不存在' }, 404);
        }
        
        // 恢复数据（注意：这会覆盖现有数据）
        for (const [key, value] of Object.entries(backupData)) {
            await env.PEPT_KV.put(key, JSON.stringify(value));
        }
        
        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500);
    }
}

// 服务静态文件
async function serveStaticFiles(request, env) {
    // 默认返回index.html
    return new Response('Static file serving would be handled by Pages', {
        headers: { 'Content-Type': 'text/html' }
    });
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
