// api-worker.js - 处理所有API请求
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // 设置CORS头部
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        
        // 处理预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        try {
            // API路由
            if (path.startsWith('/api/')) {
                return await handleAPI(request, env, path);
            }
            
            // 默认返回404
            return new Response('Not Found', { status: 404, headers: corsHeaders });
        } catch (error) {
            console.error('API Error:', error);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: error.message || 'Internal Server Error' 
                }),
                { 
                    status: 500, 
                    headers: { 
                        'Content-Type': 'application/json',
                        ...corsHeaders 
                    } 
                }
            );
        }
    }
};

// 处理API请求
async function handleAPI(request, env, path) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };
    
    const method = request.method;
    
    switch(path) {
        case '/api/health':
            return new Response(
                JSON.stringify({ 
                    status: 'ok', 
                    timestamp: new Date().toISOString(),
                    service: 'PEP Unit3 Learning System API'
                }),
                { headers: corsHeaders }
            );
            
        case '/api/auth/login':
            if (method === 'POST') {
                return await handleLogin(request, env);
            }
            break;
            
        case '/api/data/save':
            if (method === 'POST') {
                return await handleSaveData(request, env);
            }
            break;
            
        case '/api/data/get':
            if (method === 'GET') {
                return await handleGetData(request, env);
            }
            break;
            
        case '/api/admin/students':
            if (method === 'GET') {
                return await handleGetStudents(request, env);
            }
            break;
            
        case '/api/admin/training':
            if (method === 'GET') {
                return await handleGetTrainingData(request, env);
            }
            break;
            
        case '/api/admin/stats':
            if (method === 'GET') {
                return await handleGetStats(request, env);
            }
            break;
            
        case '/api/sync/all':
            if (method === 'POST') {
                return await handleSyncAll(request, env);
            }
            break;
    }
    
    return new Response(
        JSON.stringify({ error: 'Not Found' }),
        { status: 404, headers: corsHeaders }
    );
}

// 处理登录
async function handleLogin(request, env) {
    const { username, password, type } = await request.json();
    
    // 管理员登录
    if (type === 'admin') {
        if (username === '叶金炎' && password === 'yjy897018@') {
            return jsonResponse({ 
                success: true, 
                user: { 
                    type: 'admin', 
                    name: username 
                } 
            });
        }
        return jsonResponse({ success: false, error: '管理员账号或密码错误' });
    }
    
    // 学生登录
    const students = await env.PEPT_KV.get('students', 'json') || [];
    const student = students.find(s => 
        (s.name === username || s.id === username) && s.password === password
    );
    
    if (student) {
        return jsonResponse({ 
            success: true, 
            user: { 
                type: 'student',
                ...student 
            } 
        });
    }
    
    return jsonResponse({ success: false, error: '学生账号或密码错误' });
}

// 保存数据
async function handleSaveData(request, env) {
    const { key, data, userId } = await request.json();
    
    if (!key || !userId) {
        return jsonResponse({ success: false, error: '缺少必要参数' });
    }
    
    // 存储数据到KV
    await env.PEPT_KV.put(`${userId}_${key}`, JSON.stringify(data));
    
    // 如果是训练数据，更新训练记录
    if (key === 'training_session') {
        const sessionsKey = `sessions_${userId}`;
        const sessions = await env.PEPT_KV.get(sessionsKey, 'json') || [];
        sessions.push(data);
        await env.PEPT_KV.put(sessionsKey, JSON.stringify(sessions));
    }
    
    return jsonResponse({ success: true });
}

// 获取数据
async function handleGetData(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const userId = url.searchParams.get('userId');
    
    if (!key || !userId) {
        return jsonResponse({ success: false, error: '缺少必要参数' });
    }
    
    const data = await env.PEPT_KV.get(`${userId}_${key}`, 'json');
    return jsonResponse({ success: true, data });
}

// 获取所有学生
async function handleGetStudents(request, env) {
    const students = await env.PEPT_KV.get('students', 'json') || [];
    return jsonResponse({ success: true, data: students });
}

// 获取训练数据
async function handleGetTrainingData(request, env) {
    const students = await env.PEPT_KV.get('students', 'json') || [];
    const allTrainingData = [];
    
    for (const student of students) {
        const sessions = await env.PEPT_KV.get(`sessions_${student.id}`, 'json') || [];
        
        sessions.forEach(session => {
            allTrainingData.push({
                studentName: student.name,
                studentId: student.id,
                ...session
            });
        });
    }
    
    return jsonResponse({ success: true, data: allTrainingData });
}

// 获取统计信息
async function handleGetStats(request, env) {
    const students = await env.PEPT_KV.get('students', 'json') || [];
    
    let totalScore = 0;
    let totalSessions = 0;
    let completedSessions = 0;
    
    for (const student of students) {
        const sessions = await env.PEPT_KV.get(`sessions_${student.id}`, 'json') || [];
        totalSessions += sessions.length;
        
        sessions.forEach(session => {
            if (session.completed) {
                completedSessions++;
                totalScore += (session.basicScore || 0) + (session.advancedScore || 0);
            }
        });
    }
    
    const avgScore = completedSessions > 0 ? Math.round(totalScore / completedSessions) : 0;
    
    return jsonResponse({
        success: true,
        data: {
            totalStudents: students.length,
            totalSessions,
            completedSessions,
            avgScore,
            lastUpdated: new Date().toISOString()
        }
    });
}

// 同步所有数据
async function handleSyncAll(request, env) {
    const { data } = await request.json();
    
    // 同步学生数据
    if (data.students) {
        await env.PEPT_KV.put('students', JSON.stringify(data.students));
    }
    
    // 同步训练数据
    if (data.trainingData) {
        for (const [userId, userData] of Object.entries(data.trainingData)) {
            if (userData.sessions) {
                await env.PEPT_KV.put(`sessions_${userId}`, JSON.stringify(userData.sessions));
            }
        }
    }
    
    return jsonResponse({ success: true, message: '数据同步成功' });
}

// 返回JSON响应
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}
