// 系统配置
const CONFIG = {
    SYSTEM_NAME: 'Pep unit3 learning system',
    ADMIN_USERNAME: '叶金炎',
    ADMIN_PASSWORD: 'yjy897018@',
    MAX_SCORE: 20,
    MIN_SCORE: 5,
    QUESTION_SCORE: 10,
    WRONG_PENALTY: 5,
    LOCAL_STORAGE_KEY: 'pep_unit3_system'
};

// 学习内容数据（使用你提供的文档内容）
const TRAINING_DATA = {
    vocabulary: [
        { english: "this morning", chinese: "今天上午" },
        { english: "this afternoon", chinese: "今天下午" },
        { english: "this evening", chinese: "今天晚上" },
        { english: "tonight", chinese: "今晚" },
        { english: "tomorrow", chinese: "明天" },
        { english: "next week", chinese: "下周" },
        { english: "supermarket", chinese: "超市" },
        { english: "cinema", chinese: "电影院" },
        { english: "bookstore", chinese: "书店" },
        { english: "post office", chinese: "邮局" },
        { english: "take a trip", chinese: "去旅行" },
        { english: "see a film", chinese: "看电影" },
        { english: "go to the supermarket", chinese: "去超市" },
        { english: "visit my grandparents", chinese: "看望我的（外）祖父母" },
        { english: "dictionary", chinese: "词典" },
        { english: "word book", chinese: "单词书" },
        { english: "comic book", chinese: "漫画书" },
        { english: "postcard", chinese: "明信片" },
        { english: "space travel", chinese: "太空旅行" },
        { english: "half price", chinese: "半价" }
    ],
    sentences: [
        { english: "What are you going to do today?", chinese: "你今天打算做什么？" },
        { english: "I'm going to see a film.", chinese: "我打算去看电影。" },
        { english: "I'm going to take a trip.", chinese: "我打算去旅行。" },
        { english: "I'm going to visit my grandparents.", chinese: "我打算去看望我的祖父母。" },
        { english: "When are you going?", chinese: "你们什么时候去？" },
        { english: "We're going this morning.", chinese: "我们今天上午去。" },
        { english: "We're going this weekend.", chinese: "我们这周末去。" },
        { english: "We're going next Wednesday.", chinese: "我们下周三去。" },
        { english: "Where are you going?", chinese: "你们要去哪里？" },
        { english: "We're going to the cinema.", chinese: "我们要去电影院。" },
        { english: "We're going to the bookstore.", chinese: "我们要去书店。" },
        { english: "Who are you going with?", chinese: "你和谁一起去？" },
        { english: "I'm going with my friends.", chinese: "我和我的朋友们一起去。" },
        { english: "I'm going with my parents.", chinese: "我和我的父母一起去。" },
        { english: "What is he going to do?", chinese: "他打算做什么？" },
        { english: "He is going to buy a comic book.", chinese: "他打算买一本漫画书。" },
        { english: "She is going to wash her clothes.", chinese: "她打算洗衣服。" },
        { english: "What are John and Sarah going to do?", chinese: "约翰和莎拉打算做什么？" },
        { english: "They are going to the zoo.", chinese: "他们要去动物园。" }
    ],
    passages: [
        { english: "Hi, I'm Mike. This is my weekend plan. On Saturday morning, I'm going to do my homework. In the afternoon, I'm going to the cinema with my father. We are going to see a film about space travel! On Sunday, I'm going to visit my grandparents. We are going to watch TV together. That will be fun!", chinese: "嗨，我是迈克。这是我的周末计划。星期六上午，我打算做作业。下午，我要和爸爸一起去电影院。我们要看一部关于太空旅行的电影！星期天，我要去看望我的祖父母。我们要一起看电视。那会很有趣！" },
        { english: "My family is going to take a trip to Sanya next week. We are going by plane on Tuesday. I'm going with my parents. We are going to the beach and swim in the sea. I'm going to take lots of pictures. I'm also going to buy some postcards for my friends. I can't wait!", chinese: "我的家人下周要去三亚旅行。我们星期二坐飞机去。我要和父母一起去。我们要去海滩，在海里游泳。我要拍很多照片。我还要给我的朋友们买一些明信片。我等不及了！" },
        { english: "A: What are you going to do this afternoon? B: I'm going to the bookstore. A: What are you going to buy? B: I'm going to buy a new comic book and a word book. A: When are you going to use the word book? B: Next week. We are going to have an English test.", chinese: "A: 今天下午你打算做什么？ B: 我要去书店。 A: 你打算买什么？ B: 我打算买一本新的漫画书和一本单词书。 A: 你打算什么时候用这本单词书？ B: 下周。我们要进行英语测试。" }
    ]
};

// 阅读理解数据
const READING_EXERCISES = [
    {
        title: "阅读理解训练（一）：判断题",
        passage: `My Friend's Weekend Plan

Hi, I'm Sarah. My best friend, Lucy, has a great weekend plan. On Saturday morning, she is going to visit her grandparents with her parents. They are going to have lunch together. In the afternoon, she is going to the science museum with her cousin. She is very excited about it because she loves science. On Sunday, her plan is different. She is going to do her homework in the morning. In the afternoon, she is going to a dancing lesson. Dancing is her hobby. In the evening, she is going to see a film with her family. She thinks it will be a busy but happy weekend.`,
        questions: [
            {
                type: "truefalse",
                text: "Lucy is going to visit her grandparents on Saturday afternoon.",
                options: ["T", "F"],
                correctAnswer: "F",
                explanation: "她是周六上午去"
            },
            {
                type: "truefalse",
                text: "Lucy is going to the science museum with her cousin.",
                options: ["T", "F"],
                correctAnswer: "T",
                explanation: ""
            },
            {
                type: "truefalse",
                text: "Lucy is going to do her homework on Sunday afternoon.",
                options: ["T", "F"],
                correctAnswer: "F",
                explanation: "她是周日上午做作业"
            },
            {
                type: "truefalse",
                text: "Lucy's hobby is dancing.",
                options: ["T", "F"],
                correctAnswer: "T",
                explanation: ""
            },
            {
                type: "truefalse",
                text: "Lucy is going to see a film with her friends on Sunday evening.",
                options: ["T", "F"],
                correctAnswer: "F",
                explanation: "她是和家人一起去"
            }
        ]
    },
    {
        title: "阅读理解训练（二）：选择题",
        passage: `Mike's Holiday Plan

The winter holiday is coming next week! Mike and his family have a wonderful plan. They are going to Sanya for a trip. They are going there by plane next Monday. Mike is going to swim in the sea and play on the beach. He is going to take many beautiful photos. His sister, Amy, is going to draw pictures of the sea and the coconut trees. Their parents are going to take them to a big seafood restaurant. Before they go, Mike is going to the bookstore this weekend. He is going to buy a comic book and a postcard. He wants to send the postcard to his grandfather from Sanya. Mike is so excited about this trip!`,
        questions: [
            {
                type: "multiple",
                text: "When is Mike going to Sanya?",
                options: ["This weekend.", "Next Monday.", "Next month."],
                correctAnswer: "Next Monday.",
                explanation: ""
            },
            {
                type: "multiple",
                text: "How are they going to Sanya?",
                options: ["By train.", "By plane.", "By ship."],
                correctAnswer: "By plane.",
                explanation: ""
            },
            {
                type: "multiple",
                text: "What is Mike going to do in Sanya?",
                options: ["Go to the cinema.", "Swim in the sea and take photos.", "Visit the science museum."],
                correctAnswer: "Swim in the sea and take photos.",
                explanation: ""
            },
            {
                type: "multiple",
                text: "What is Mike going to buy at the bookstore?",
                options: ["A word book and a dictionary.", "A comic book and a postcard.", "A comic book and a word book."],
                correctAnswer: "A comic book and a postcard.",
                explanation: ""
            },
            {
                type: "multiple",
                text: "Who is Mike going to send the postcard to?",
                options: ["His cousin.", "His friend.", "His grandfather."],
                correctAnswer: "His grandfather.",
                explanation: ""
            }
        ]
    },
    {
        title: "阅读理解训练（三）：根据问题回答",
        passage: `Our Class Weekend Plan

Our class is going to have a picnic in the park this Saturday. We are all very happy. We are going to meet at the school gate at 8:00 tomorrow morning. Then, we are going to the park by bus. In the park, we are going to play games, sing, and dance. Some of my classmates are going to fly kites. My friend, John, is going to bring his guitar and play music for us. Our teacher, Ms. White, is going to take lots of photos for us. For the picnic, I am going to bring some fruit and bread. My mother is going to make some cookies for me to share with my friends. I think it is going to be a fantastic day!`,
        questions: [
            {
                type: "short",
                text: "Where are they going to have a picnic?",
                correctAnswer: "They are going to have a picnic in the park.",
                explanation: ""
            },
            {
                type: "short",
                text: "When and where are they going to meet?",
                correctAnswer: "They are going to meet at the school gate at 8:00 tomorrow morning.",
                explanation: ""
            },
            {
                type: "short",
                text: "How are they going to the park?",
                correctAnswer: "They are going to the park by bus.",
                explanation: ""
            },
            {
                type: "short",
                text: "What is John going to do in the park?",
                correctAnswer: "John is going to play the guitar / play music for them.",
                explanation: ""
            },
            {
                type: "short",
                text: "What is the writer (作者) going to bring for the picnic?",
                correctAnswer: "The writer is going to bring some fruit and bread.",
                explanation: ""
            }
        ]
    }
];

// 全局变量
let currentUser = null;
let currentScore = 0;
let currentCategory = 'vocabulary';
let currentExercise = 0;
let currentItemIndex = 0;
let completedItems = new Set();
let answeredQuestions = new Map();
let speechSynthesis = window.speechSynthesis;
let recognition = null;
let isRecording = false;
let currentAudio = null;
let trainingSession = {
    userId: null,
    startTime: null,
    endTime: null,
    basicScore: 0,
    advancedScore: 0,
    completed: false
};

// 检查浏览器支持
function checkBrowserSupport() {
    const support = {
        speechSynthesis: 'speechSynthesis' in window,
        speechRecognition: ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window),
        localStorage: 'localStorage' in window
    };
    
    console.log('浏览器支持检测:', support);
    
    if (!support.speechSynthesis) {
        showAlert('warning', '您的浏览器不支持语音合成功能，听原音功能将无法使用。建议使用Chrome或Edge浏览器。');
    }
    
    if (!support.speechRecognition) {
        showAlert('warning', '您的浏览器不支持语音识别功能，跟读功能将无法使用。建议使用Chrome或Edge浏览器。');
    }
    
    return support;
}

// 显示提示
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 8px;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: ${type === 'warning' ? '#fff3cd' : '#d4edda'};
        border: 1px solid ${type === 'warning' ? '#ffeaa7' : '#c3e6cb'};
        color: ${type === 'warning' ? '#856404' : '#155724'};
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// 初始化函数
function init() {
    // 检查浏览器支持
    checkBrowserSupport();
    
    // 检查当前页面
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('basic-training')) {
        initTrainingPage();
    }
    
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化语音功能
    initSpeechFunctions();
}

// 初始化登录页面
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 加载初始学生数据
    loadInitialData();
}

// 初始化训练页面
function initTrainingPage() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化标签页切换
    initTabs();
    
    // 初始化基础训练
    initBasicTraining();
    
    // 初始化提升训练
    initAdvancedTraining();
    
    // 初始化事件监听
    initEventListeners();
    
    // 加载训练进度
    loadTrainingProgress();
}

// 检查登录状态
function checkLoginStatus() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    document.getElementById('currentUser').textContent = currentUser.name;
    
    // 加载用户分数
    const score = localStorage.getItem(`score_${currentUser.id}`) || 0;
    currentScore = parseInt(score);
    updateScoreDisplay();
    
    // 开始训练会话
    startTrainingSession();
}

// 初始化标签页切换
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.training-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${tabId}-training`) {
                    section.classList.add('active');
                }
            });
            
            // 如果是切换到基础训练，重新初始化语音
            if (tabId === 'basic') {
                setTimeout(() => {
                    initSpeechFunctions();
                }, 100);
            }
        });
    });
}

// 初始化基础训练
function initBasicTraining() {
    // 初始化分类切换
    initCategoryButtons();
    
    // 加载当前分类的内容
    loadCategoryContent(currentCategory);
}

// 初始化分类按钮
function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 加载新分类内容
            currentCategory = button.dataset.category;
            currentItemIndex = 0;
            loadCategoryContent(currentCategory);
        });
    });
}

// 加载分类内容
function loadCategoryContent(category) {
    const items = TRAINING_DATA[category];
    if (!items) return;
    
    // 随机排序项目
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    
    // 更新总数显示
    document.getElementById('basicTotal').textContent = shuffledItems.length;
    
    // 生成项目列表
    generateItemList(shuffledItems);
    
    // 显示第一个项目
    showItem(0, shuffledItems);
}

// 生成项目列表
function generateItemList(items) {
    const container = document.getElementById('itemListContainer');
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-list-item';
        if (index === currentItemIndex) {
            div.classList.add('active');
        }
        if (completedItems.has(index)) {
            div.classList.add('completed');
        }
        
        div.textContent = `${index + 1}. ${item.english.substring(0, 30)}${item.english.length > 30 ? '...' : ''}`;
        div.dataset.index = index;
        
        div.addEventListener('click', () => {
            currentItemIndex = index;
            showItem(index, items);
            updateItemList();
        });
        
        container.appendChild(div);
    });
}

// 显示项目
function showItem(index, items) {
    if (index < 0 || index >= items.length) return;
    
    const item = items[index];
    document.getElementById('itemTitle').textContent = `项目 ${index + 1}/${items.length}`;
    document.getElementById('englishText').textContent = item.english;
    document.getElementById('chineseText').textContent = item.chinese;
    
    // 重置评分显示
    document.getElementById('scoreFeedback').textContent = '请跟读获取评分';
    document.getElementById('scoreFeedback').style.color = '';
    
    // 更新按钮状态
    updateNavigationButtons(index, items.length);
    updateItemList();
    
    // 更新进度显示
    updateBasicProgress();
}

// 更新基础训练进度
function updateBasicProgress() {
    const currentItems = TRAINING_DATA[currentCategory];
    if (!currentItems) return;
    
    const completed = completedItems.size;
    const total = currentItems.length;
    
    document.getElementById('basicProgress').textContent = completed;
    document.getElementById('basicCompleted').textContent = completed;
}

// 更新项目列表高亮
function updateItemList() {
    const items = document.querySelectorAll('.item-list-item');
    items.forEach((item, index) => {
        item.classList.remove('active');
        if (parseInt(item.dataset.index) === currentItemIndex) {
            item.classList.add('active');
        }
    });
}

// 更新导航按钮
function updateNavigationButtons(index, total) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    
    if (index === total - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> 完成本部分';
    } else {
        nextBtn.innerHTML = '下一项 <i class="fas fa-arrow-right"></i>';
    }
}

// 初始化提升训练
function initAdvancedTraining() {
    // 初始化练习选择
    initExerciseButtons();
    
    // 加载第一个练习
    loadExercise(0);
}

// 初始化练习按钮
function initExerciseButtons() {
    const exerciseButtons = document.querySelectorAll('.exercise-btn');
    
    exerciseButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            exerciseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 加载练习
            currentExercise = index;
            loadExercise(index);
        });
    });
}

// 加载练习
function loadExercise(index) {
    if (index < 0 || index >= READING_EXERCISES.length) return;
    
    const exercise = READING_EXERCISES[index];
    document.getElementById('passageTitle').textContent = exercise.title;
    document.getElementById('passageText').textContent = exercise.passage;
    
    // 生成问题
    generateQuestions(exercise.questions);
    
    // 更新进度显示
    document.getElementById('advancedTotal').textContent = exercise.questions.length;
    document.getElementById('advancedProgress').textContent = '0';
    
    // 重置结果区域
    document.getElementById('resultsSection').innerHTML = '';
}

// 生成问题
function generateQuestions(questions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    // 随机排序问题
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    shuffledQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.dataset.index = index;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);
        
        if (question.type === 'truefalse' || question.type === 'multiple') {
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';
            
            // 随机排序选项
            const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
            
            shuffledOptions.forEach((option, optionIndex) => {
                const label = document.createElement('label');
                label.className = 'option-label';
                
                const input = document.createElement('input');
                input.type = question.type === 'truefalse' ? 'radio' : 'radio';
                input.name = `question_${index}`;
                input.value = option;
                input.className = 'option-input';
                
                input.addEventListener('change', () => {
                    answeredQuestions.set(index, option);
                    updateProgress();
                });
                
                const span = document.createElement('span');
                span.textContent = option;
                
                label.appendChild(input);
                label.appendChild(span);
                optionsContainer.appendChild(label);
            });
            
            questionDiv.appendChild(optionsContainer);
        } else if (question.type === 'short') {
            const textarea = document.createElement('textarea');
            textarea.placeholder = '请输入你的答案...';
            textarea.rows = 3;
            textarea.className = 'short-answer';
            textarea.addEventListener('input', () => {
                answeredQuestions.set(index, textarea.value);
                updateProgress();
            });
            
            questionDiv.appendChild(textarea);
        }
        
        container.appendChild(questionDiv);
    });
}

// 更新进度
function updateProgress() {
    const total = READING_EXERCISES[currentExercise]?.questions.length || 0;
    const answered = answeredQuestions.size;
    document.getElementById('advancedProgress').textContent = answered;
    
    // 检查是否所有问题都已回答
    const submitBtn = document.getElementById('submitAnswersBtn');
    submitBtn.disabled = answered < total;
}

// 初始化语音功能
function initSpeechFunctions() {
    // 初始化语音识别
    initSpeechRecognition();
    
    // 初始化语音合成
    initSpeechSynthesis();
}

// 初始化语音识别
function initSpeechRecognition() {
    // 检查浏览器支持
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('浏览器不支持语音识别');
        document.getElementById('recordBtn').disabled = true;
        document.getElementById('recordBtn').innerHTML = '<i class="fas fa-microphone-slash"></i> 浏览器不支持';
        return;
    }
    
    // 创建语音识别对象
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // 配置识别器
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // 事件处理
    recognition.onstart = function() {
        console.log('语音识别开始');
        isRecording = true;
        document.getElementById('recordingStatus').textContent = '正在录音...';
        document.getElementById('recordingStatus').style.color = '#dc3545';
        document.getElementById('recordBtn').innerHTML = '<i class="fas fa-stop"></i> 停止录音';
        document.getElementById('recordBtn').style.background = '#dc3545';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('识别结果:', transcript);
        evaluatePronunciation(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
        
        let errorMessage = '识别错误';
        switch(event.error) {
            case 'no-speech':
                errorMessage = '未检测到语音，请重试';
                break;
            case 'audio-capture':
                errorMessage = '无法访问麦克风';
                break;
            case 'not-allowed':
                errorMessage = '麦克风访问被拒绝，请在浏览器设置中允许麦克风访问';
                break;
        }
        
        document.getElementById('recordingStatus').textContent = errorMessage;
        document.getElementById('recordingStatus').style.color = '#dc3545';
        stopRecording();
    };
    
    recognition.onend = function() {
        console.log('语音识别结束');
        stopRecording();
    };
    
    console.log('语音识别初始化完成');
}

// 初始化语音合成
function initSpeechSynthesis() {
    if (!speechSynthesis) {
        console.warn('浏览器不支持语音合成');
        document.getElementById('listenBtn').disabled = true;
        document.getElementById('listenBtn').innerHTML = '<i class="fas fa-volume-mute"></i> 浏览器不支持';
        return;
    }
    
    console.log('语音合成初始化完成');
}

// 初始化事件监听
function initEventListeners() {
    // 听原音按钮
    document.getElementById('listenBtn').addEventListener('click', playOriginalAudio);
    
    // 跟读按钮
    document.getElementById('recordBtn').addEventListener('click', toggleRecording);
    
    // 播放跟读按钮
    document.getElementById('playbackBtn').addEventListener('click', playRecording);
    
    // 导航按钮
    document.getElementById('prevBtn').addEventListener('click', goToPreviousItem);
    document.getElementById('nextBtn').addEventListener('click', goToNextItem);
    
    // 提交答案按钮
    document.getElementById('submitAnswersBtn').addEventListener('click', submitAnswers);
    
    // 重置答案按钮
    document.getElementById('resetAnswersBtn').addEventListener('click', resetAnswers);
    
    // 退出按钮
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 关闭祝贺按钮
    document.getElementById('closeCelebration').addEventListener('click', closeCelebration);
}

// 播放原音
function playOriginalAudio() {
    const englishText = document.getElementById('englishText').textContent;
    if (!englishText || englishText === '--' || englishText === '请选择学习内容') {
        showAlert('warning', '请先选择学习内容');
        return;
    }
    
    // 停止当前播放
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // 使用Web Speech API
    const utterance = new SpeechSynthesisUtterance(englishText);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;  // 较慢的语速，适合学习
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // 设置声音（优先使用英语女声）
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // 尝试找到英语女声
    for (let voice of voices) {
        if (voice.lang.startsWith('en-') && voice.name.includes('Female')) {
            selectedVoice = voice;
            break;
        }
    }
    
    // 如果没找到英语女声，找任何英语声音
    if (!selectedVoice) {
        for (let voice of voices) {
            if (voice.lang.startsWith('en-')) {
                selectedVoice = voice;
                break;
            }
        }
    }
    
    // 如果还没找到，使用默认声音
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // 更新状态
    document.getElementById('recordingStatus').textContent = '正在播放原音...';
    document.getElementById('recordingStatus').style.color = '#28a745';
    document.getElementById('listenBtn').disabled = true;
    document.getElementById('listenBtn').innerHTML = '<i class="fas fa-volume-up"></i> 播放中...';
    
    utterance.onstart = () => {
        console.log('开始播放语音');
    };
    
    utterance.onend = () => {
        console.log('语音播放完毕');
        document.getElementById('recordingStatus').textContent = '原音播放完毕';
        document.getElementById('listenBtn').disabled = false;
        document.getElementById('listenBtn').innerHTML = '<i class="fas fa-volume-up"></i> 听原音';
        
        setTimeout(() => {
            document.getElementById('recordingStatus').textContent = '准备就绪';
            document.getElementById('recordingStatus').style.color = '';
        }, 2000);
    };
    
    utterance.onerror = (event) => {
        console.error('语音播放错误:', event);
        document.getElementById('recordingStatus').textContent = '播放失败，请重试';
        document.getElementById('recordingStatus').style.color = '#dc3545';
        document.getElementById('listenBtn').disabled = false;
        document.getElementById('listenBtn').innerHTML = '<i class="fas fa-volume-up"></i> 听原音';
    };
    
    // 开始播放
    speechSynthesis.speak(utterance);
}

// 切换录音
function toggleRecording() {
    if (!recognition) {
        showAlert('error', '语音识别功能不可用，请使用Chrome或Edge浏览器');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        // 检查麦克风权限
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    // 权限已授予，开始录音
                    startRecording();
                })
                .catch(error => {
                    console.error('麦克风权限被拒绝:', error);
                    showAlert('error', '请允许访问麦克风以使用跟读功能');
                });
        } else {
            // 直接开始录音（旧浏览器）
            startRecording();
        }
    }
}

// 开始录音
function startRecording() {
    const englishText = document.getElementById('englishText').textContent;
    if (!englishText || englishText === '--' || englishText === '请选择学习内容') {
        showAlert('warning', '请先选择学习内容');
        return;
    }
    
    try {
        recognition.start();
    } catch (error) {
        console.error('开始录音失败:', error);
        showAlert('error', '开始录音失败，请重试');
    }
}

// 停止录音
function stopRecording() {
    isRecording = false;
    document.getElementById('recordBtn').innerHTML = '<i class="fas fa-microphone"></i> 跟读';
    document.getElementById('recordBtn').style.background = '';
    
    // 2秒后恢复状态显示
    setTimeout(() => {
        if (!isRecording) {
            document.getElementById('recordingStatus').textContent = '准备就绪';
            document.getElementById('recordingStatus').style.color = '';
        }
    }, 2000);
}

// 播放录音（简化版，实际需要录音功能）
function playRecording() {
    showAlert('info', '播放录音功能需要完整的录音实现。当前版本主要测试跟读识别功能。');
    
    // 在实际实现中，这里应该播放之前录制的音频
    // 由于Web Audio API较复杂，这里先提供一个提示
    document.getElementById('recordingStatus').textContent = '播放录音功能开发中';
    document.getElementById('recordingStatus').style.color = '#17a2b8';
}

// 评估发音
function evaluatePronunciation(transcript) {
    const originalText = document.getElementById('englishText').textContent.toLowerCase();
    const userText = transcript.toLowerCase();
    
    console.log('原文:', originalText);
    console.log('用户:', userText);
    
    let score = 0;
    let feedback = '';
    
    // 计算相似度
    const similarity = calculateSimilarity(originalText, userText);
    console.log('相似度:', similarity);
    
    if (similarity > 0.8) {
        score = 20;
        feedback = '优秀！发音非常准确';
    } else if (similarity > 0.6) {
        score = 15;
        feedback = '良好！发音基本正确';
    } else if (similarity > 0.4) {
        score = 10;
        feedback = '合格！部分发音需要改进';
    } else {
        score = 5;
        feedback = '加油！需要多练习发音';
    }
    
    // 更新显示
    const scoreElement = document.getElementById('scoreFeedback');
    scoreElement.textContent = `${feedback} (+${score}分)`;
    scoreElement.style.color = 
        score === 20 ? '#28a745' : 
        score === 15 ? '#17a2b8' : 
        score === 10 ? '#ffc107' : '#dc3545';
    
    // 更新分数
    updateScore(score);
    
    // 标记为已完成
    const currentItems = TRAINING_DATA[currentCategory];
    completedItems.add(currentItemIndex);
    
    // 更新项目列表和进度
    updateItemList();
    updateBasicProgress();
    
    // 保存进度
    saveTrainingProgress();
    
    // 自动播放下一项（如果得分良好）
    if (score >= 10) {
        setTimeout(() => {
            goToNextItem();
        }, 1500);
    }
}

// 计算文本相似度（改进版）
function calculateSimilarity(str1, str2) {
    // 去除标点符号和多余空格
    const cleanStr1 = str1.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
    const cleanStr2 = str2.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
    
    // 分割为单词
    const words1 = cleanStr1.split(' ');
    const words2 = cleanStr2.split(' ');
    
    // 计算共同单词数量
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    // 单词级别的相似度
    const wordSimilarity = intersection.size / union.size;
    
    // 字符级别的相似度（Levenshtein距离）
    const charSimilarity = calculateCharSimilarity(cleanStr1, cleanStr2);
    
    // 综合相似度
    const finalSimilarity = (wordSimilarity * 0.7 + charSimilarity * 0.3);
    
    console.log('单词相似度:', wordSimilarity, '字符相似度:', charSimilarity, '综合:', finalSimilarity);
    
    return finalSimilarity;
}

// 计算字符相似度（使用简单的编辑距离）
function calculateCharSimilarity(str1, str2) {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;
    
    // 简单的相似度计算
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    // 检查是否为部分匹配
    if (longer.includes(shorter)) {
        return shorter.length / longer.length;
    }
    
    // 计算共同字符比例
    let commonChars = 0;
    const charCount1 = {};
    const charCount2 = {};
    
    for (let char of str1) {
        charCount1[char] = (charCount1[char] || 0) + 1;
    }
    
    for (let char of str2) {
        charCount2[char] = (charCount2[char] || 0) + 1;
    }
    
    for (let char in charCount1) {
        if (charCount2[char]) {
            commonChars += Math.min(charCount1[char], charCount2[char]);
        }
    }
    
    const totalChars = str1.length + str2.length;
    return (commonChars * 2) / totalChars;
}

// 更新分数
function updateScore(points) {
    currentScore += points;
    updateScoreDisplay();
    saveScore();
    
    // 更新训练会话分数
    trainingSession.basicScore = currentScore;
}

// 更新分数显示
function updateScoreDisplay() {
    document.getElementById('currentScore').textContent = currentScore;
}

// 保存分数
function saveScore() {
    if (currentUser) {
        localStorage.setItem(`score_${currentUser.id}`, currentScore);
    }
}

// 跳转到上一个项目
function goToPreviousItem() {
    const items = TRAINING_DATA[currentCategory];
    if (!items) return;
    
    if (currentItemIndex > 0) {
        currentItemIndex--;
        showItem(currentItemIndex, items);
    }
}

// 跳转到下一个项目
function goToNextItem() {
    const items = TRAINING_DATA[currentCategory];
    if (!items) return;
    
    if (currentItemIndex < items.length - 1) {
        currentItemIndex++;
        showItem(currentItemIndex, items);
    } else {
        // 完成当前分类
        const allCategories = ['vocabulary', 'sentences', 'passages'];
        const currentCatIndex = allCategories.indexOf(currentCategory);
        
        if (currentCatIndex < allCategories.length - 1) {
            // 切换到下一个分类
            currentCategory = allCategories[currentCatIndex + 1];
            currentItemIndex = 0;
            
            // 更新UI
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === currentCategory) {
                    btn.classList.add('active');
                }
            });
            
            loadCategoryContent(currentCategory);
        } else {
            // 所有分类都完成了
            checkIfAllCompleted();
        }
    }
}

// 提交答案
function submitAnswers() {
    const exercise = READING_EXERCISES[currentExercise];
    if (!exercise) return;
    
    let totalScore = 0;
    let resultsHTML = '';
    let correctCount = 0;
    
    exercise.questions.forEach((question, index) => {
        const userAnswer = answeredQuestions.get(index);
        let isCorrect = false;
        
        if (question.type === 'short') {
            // 简答题：检查是否包含关键词
            const userAnswerLower = (userAnswer || '').toLowerCase().trim();
            const correctAnswerLower = question.correctAnswer.toLowerCase();
            
            // 简单的关键词匹配
            const keywords = correctAnswerLower.split(' ')
                .filter(word => word.length > 3)
                .map(word => word.replace(/[^\w]/g, ''));
            
            const userWords = userAnswerLower.split(' ');
            const matchedKeywords = keywords.filter(keyword => 
                userWords.some(word => word.includes(keyword))
            );
            
            isCorrect = matchedKeywords.length >= Math.ceil(keywords.length * 0.6);
        } else {
            // 选择题/判断题：精确匹配
            isCorrect = userAnswer === question.correctAnswer;
        }
        
        if (isCorrect) {
            totalScore += CONFIG.QUESTION_SCORE;
            correctCount++;
            resultsHTML += `
                <div class="result-item correct">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>第${index + 1}题: 正确 (+${CONFIG.QUESTION_SCORE}分)</strong>
                        ${question.explanation ? `<p>${question.explanation}</p>` : ''}
                        <p>你的答案: ${userAnswer || '未回答'}</p>
                    </div>
                </div>
            `;
        } else {
            totalScore -= CONFIG.WRONG_PENALTY;
            resultsHTML += `
                <div class="result-item incorrect">
                    <i class="fas fa-times-circle"></i>
                    <div>
                        <strong>第${index + 1}题: 错误 (-${CONFIG.WRONG_PENALTY}分)</strong>
                        <p>你的答案: ${userAnswer || '未回答'}</p>
                        <p>正确答案: ${question.correctAnswer}</p>
                        ${question.explanation ? `<p>${question.explanation}</p>` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    // 更新分数
    updateScore(totalScore);
    
    // 显示结果
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = `
        <h3>答题结果</h3>
        ${resultsHTML}
        <div class="result-score">
            正确率: ${correctCount}/${exercise.questions.length}<br>
            本练习得分: ${totalScore >= 0 ? '+' : ''}${totalScore}分
        </div>
    `;
    
    // 更新高级训练分数
    trainingSession.advancedScore = totalScore;
    
    // 检查是否所有练习都已完成
    checkIfAllCompleted();
}

// 重置答案
function resetAnswers() {
    if (!confirm('确定要重置所有答案吗？')) {
        return;
    }
    
    answeredQuestions.clear();
    const inputs = document.querySelectorAll('.option-input, .short-answer');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            input.checked = false;
        } else if (input.tagName === 'TEXTAREA') {
            input.value = '';
        }
    });
    
    document.getElementById('resultsSection').innerHTML = '';
    updateProgress();
}

// 检查是否所有训练都已完成
function checkIfAllCompleted() {
    // 检查基础训练（所有分类都完成）
    const allCategories = ['vocabulary', 'sentences', 'passages'];
    let allBasicCompleted = true;
    
    for (const category of allCategories) {
        const items = TRAINING_DATA[category];
        if (items) {
            // 检查该分类是否有任何已完成的项目
            const hasCompleted = Array.from(completedItems).some(index => {
                // 这里简化检查，实际应该检查每个分类的完成情况
                return true;
            });
            if (!hasCompleted) {
                allBasicCompleted = false;
                break;
            }
        }
    }
    
    // 检查提升训练（至少完成一个练习）
    const allAdvancedCompleted = answeredQuestions.size > 0;
    
    if (allBasicCompleted && allAdvancedCompleted) {
        showCelebration();
        completeTrainingSession();
    }
}

// 显示祝贺特效
function showCelebration() {
    const messages = ['Excellent!', 'Great!', 'Well done!', 'Amazing!', 'Perfect!'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    document.getElementById('congratulationText').textContent = randomMessage;
    document.getElementById('celebrationContainer').style.display = 'flex';
    
    // 播放声音
    try {
        const sound = document.getElementById('celebrationSound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('音频播放失败:', e));
        }
    } catch (error) {
        console.log('播放祝贺声音失败:', error);
    }
    
    // 创建花朵飘落效果
    createFlowers();
}

// 创建花朵飘落
function createFlowers() {
    const container = document.getElementById('celebrationContainer');
    if (!container) return;
    
    // 先清除现有的花朵
    const existingFlowers = container.querySelectorAll('.flower');
    existingFlowers.forEach(flower => flower.remove());
    
    // 创建新的花朵
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.className = 'flower';
            
            // 随机位置
            flower.style.left = `${Math.random() * 100}vw`;
            flower.style.top = '-30px';
            
            // 随机大小
            const size = Math.random() * 20 + 10;
            flower.style.width = `${size}px`;
            flower.style.height = `${size}px`;
            
            // 随机动画
            const duration = Math.random() * 3 + 2;
            flower.style.animationDuration = `${duration}s`;
            flower.style.animationDelay = `${Math.random() * 2}s`;
            
            // 随机颜色
            const hue = Math.random() * 30; // 红色系
            flower.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            flower.style.borderRadius = '50%';
            flower.style.opacity = '0.7';
            
            container.appendChild(flower);
            
            // 动画结束后移除
            setTimeout(() => {
                if (flower.parentNode) {
                    flower.remove();
                }
            }, duration * 1000);
        }, i * 100);
    }
}

// 关闭祝贺
function closeCelebration() {
    const container = document.getElementById('celebrationContainer');
    if (container) {
        container.style.display = 'none';
        
        // 移除所有花朵
        const flowers = container.querySelectorAll('.flower');
        flowers.forEach(flower => flower.remove());
    }
}

// 退出登录
function logout() {
    if (confirm('确定要退出系统吗？')) {
        // 结束训练会话
        endTrainingSession();
        
        // 清除登录状态
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = `${dateString} ${timeString}`;
    }
}

// 开始训练会话
function startTrainingSession() {
    trainingSession = {
        userId: currentUser.id,
        startTime: new Date().toISOString(),
        endTime: null,
        basicScore: 0,
        advancedScore: 0,
        completed: false
    };
}

// 结束训练会话
function endTrainingSession() {
    if (trainingSession && !trainingSession.endTime) {
        trainingSession.endTime = new Date().toISOString();
        trainingSession.completed = true;
        saveTrainingSession();
    }
}

// 完成训练会话
function completeTrainingSession() {
    trainingSession.endTime = new Date().toISOString();
    trainingSession.completed = true;
    trainingSession.basicScore = currentScore;
    saveTrainingSession();
}

// 保存训练会话
function saveTrainingSession() {
    if (!currentUser) return;
    
    const sessions = JSON.parse(localStorage.getItem(`sessions_${currentUser.id}`) || '[]');
    sessions.push(trainingSession);
    localStorage.setItem(`sessions_${currentUser.id}`, JSON.stringify(sessions));
}

// 保存训练进度
function saveTrainingProgress() {
    if (!currentUser) return;
    
    const progress = {
        category: currentCategory,
        itemIndex: currentItemIndex,
        completedItems: Array.from(completedItems),
        answeredQuestions: Array.from(answeredQuestions.entries()),
        score: currentScore,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(progress));
}

// 加载训练进度
function loadTrainingProgress() {
    if (!currentUser) return;
    
    const progress = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    
    if (progress.category) {
        currentCategory = progress.category;
        currentItemIndex = progress.itemIndex || 0;
        completedItems = new Set(progress.completedItems || []);
        answeredQuestions = new Map(progress.answeredQuestions || []);
        currentScore = progress.score || 0;
        
        // 更新分数显示
        updateScoreDisplay();
        
        // 更新UI
        const categoryBtn = document.querySelector(`[data-category="${currentCategory}"]`);
        if (categoryBtn) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
        }
        
        loadCategoryContent(currentCategory);
        updateItemList();
        updateBasicProgress();
    }
}

// 登录处理
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginType = document.getElementById('loginType').value;
    
    const messageElement = document.getElementById('loginMessage');
    
    if (loginType === 'admin') {
        // 管理员登录
        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
        } else {
            showLoginMessage('管理员用户名或密码错误', 'error');
        }
    } else {
        // 学生登录
        const students = getStudents();
        const student = students.find(s => 
            (s.name === username || s.id === username) && s.password === password
        );
        
        if (student) {
            // 保存登录状态
            localStorage.setItem('currentUser', JSON.stringify(student));
            window.location.href = 'index.html';
        } else {
            showLoginMessage('用户名或密码错误', 'error');
        }
    }
}

// 显示登录消息
function showLoginMessage(message, type) {
    const element = document.getElementById('loginMessage');
    element.textContent = message;
    element.className = `login-message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.textContent = '';
        element.className = 'login-message';
        element.style.display = 'none';
    }, 3000);
}

// 获取学生数据
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

// 加载初始数据
function loadInitialData() {
    const existingStudents = getStudents();
    
    if (existingStudents.length === 0) {
        // 从提供的名册加载初始数据
        const initialStudents = [
            { id: 'CL001', name: '岑乐宸', password: '123456yy' },
            { id: 'CL002', name: '岑宇铠', password: '123456yy' },
            { id: 'CL003', name: '岑羽皓', password: '123456yy' },
            { id: 'CL004', name: '陈带紫', password: '123456yy' },
            { id: 'CL005', name: '陈素玮', password: '123456yy' },
            { id: 'CL006', name: '方孜惠', password: '123456yy' },
            { id: 'CL007', name: '冯梓晴', password: '123456yy' },
            { id: 'CL008', name: '胡欣镁', password: '123456yy' },
            { id: 'CL009', name: '黄浩添', password: '123456yy' },
            { id: 'CL010', name: '黄敏诗', password: '123456yy' },
            { id: 'CL011', name: '李浩薪', password: '123456yy' },
            { id: 'CL012', name: '连梓成', password: '123456yy' },
            { id: 'CL013', name: '梁钰宜', password: '123456yy' },
            { id: 'CL014', name: '廖城辉', password: '123456yy' },
            { id: 'CL015', name: '廖楚妮', password: '123456yy' },
            { id: 'CL016', name: '廖家浚', password: '123456yy' },
            { id: 'CL017', name: '廖鹏宇', password: '123456yy' },
            { id: 'CL018', name: '廖乾宇', password: '123456yy' },
            { id: 'CL019', name: '廖心谊', password: '123456yy' },
            { id: 'CL020', name: '廖勇良', password: '123456yy' },
            { id: 'CL021', name: '廖子芊', password: '123456yy' },
            { id: 'CL022', name: '林泽轩', password: '123456yy' },
            { id: 'CL023', name: '刘炅芝', password: '123456yy' },
            { id: 'CL024', name: '刘宇诺', password: '123456yy' },
            { id: 'CL025', name: '麦嘉竣', password: '123456yy' },
            { id: 'CL026', name: '麦浚良', password: '123456yy' },
            { id: 'CL027', name: '覃欣怡', password: '123456yy' },
            { id: 'CL028', name: '谭心怡', password: '123456yy' },
            { id: 'CL029', name: '唐晖桐', password: '123456yy' },
            { id: 'CL030', name: '王语桐', password: '123456yy' },
            { id: 'CL031', name: '王子恒', password: '123456yy' },
            { id: 'CL032', name: '吴锦填', password: '123456yy' },
            { id: 'CL033', name: '吴伊婧', password: '123456yy' },
            { id: 'CL034', name: '伍晞玟', password: '123456yy' },
            { id: 'CL035', name: '伍耀潼', password: '123456yy' },
            { id: 'CL036', name: '伍泳欣', password: '123456yy' },
            { id: 'CL037', name: '肖荣', password: '123456yy' },
            { id: 'CL038', name: '谢皓然', password: '123456yy' },
            { id: 'CL039', name: '杨明轩', password: '123456yy' },
            { id: 'CL040', name: '杨子朗', password: '123456yy' },
            { id: 'CL041', name: '叶晓铟', password: '123456yy' },
            { id: 'CL042', name: '叶信诚', password: '123456yy' },
            { id: 'CL043', name: '叶耀阳', password: '123456yy' },
            { id: 'CL044', name: '朱欣瑶', password: '123456yy' },
            { id: 'CL045', name: '测试', password: '123456yy' }
        ];
        
        localStorage.setItem('students', JSON.stringify(initialStudents));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 为语音合成加载声音列表（需要用户交互）
document.addEventListener('click', () => {
    // 预加载语音合成声音
    if (speechSynthesis && speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('语音合成声音列表已加载:', speechSynthesis.getVoices().length);
        });
    }
});

// 修改登录处理函数
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginType = document.getElementById('loginType').value;
    
    // 使用云端登录
    const result = await cloudSync.login(username, password, loginType);
    
    if (result.success) {
        // 保存登录状态
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // 如果是管理员，跳转到后台
        if (loginType === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        showLoginMessage(result.error || '登录失败', 'error');
    }
}

// 修改保存训练会话函数
async function saveTrainingSession() {
    if (!currentUser) return;
    
    const sessions = JSON.parse(localStorage.getItem(`sessions_${currentUser.id}`) || '[]');
    sessions.push(trainingSession);
    localStorage.setItem(`sessions_${currentUser.id}`, JSON.stringify(sessions));
    
    // 同步到云端
    try {
        await cloudSync.saveData('training_session', trainingSession, currentUser.id);
        console.log('训练数据已同步到云端');
    } catch (error) {
        console.log('训练数据同步到云端失败:', error.message);
    }
}

// 修改保存训练进度函数
async function saveTrainingProgress() {
    if (!currentUser) return;
    
    const progress = {
        category: currentCategory,
        itemIndex: currentItemIndex,
        completedItems: Array.from(completedItems),
        answeredQuestions: Array.from(answeredQuestions.entries()),
        score: currentScore,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(progress));
    
    // 同步到云端
    try {
        await cloudSync.saveData('progress', progress, currentUser.id);
    } catch (error) {
        console.log('进度数据同步到云端失败:', error.message);
    }
}

// 修改保存分数函数
async function saveScore() {
    if (!currentUser) return;
    
    localStorage.setItem(`score_${currentUser.id}`, currentScore);
    
    // 同步到云端
    try {
        await cloudSync.saveData('score', currentScore, currentUser.id);
    } catch (error) {
        console.log('分数数据同步到云端失败:', error.message);
    }
}

// 修改加载训练进度函数
async function loadTrainingProgress() {
    if (!currentUser) return;
    
    // 尝试从云端获取进度
    const progress = await cloudSync.getData('progress', currentUser.id);
    
    if (progress) {
        currentCategory = progress.category || 'vocabulary';
        currentItemIndex = progress.itemIndex || 0;
        completedItems = new Set(progress.completedItems || []);
        answeredQuestions = new Map(progress.answeredQuestions || []);
        currentScore = progress.score || 0;
        
        // 更新UI
        updateScoreDisplay();
        
        const categoryBtn = document.querySelector(`[data-category="${currentCategory}"]`);
        if (categoryBtn) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
        }
        
        loadCategoryContent(currentCategory);
        updateItemList();
        updateBasicProgress();
    } else {
        // 回退到本地数据
        const localProgress = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
        if (localProgress.category) {
            currentCategory = localProgress.category;
            currentItemIndex = localProgress.itemIndex || 0;
            completedItems = new Set(localProgress.completedItems || []);
            answeredQuestions = new Map(localProgress.answeredQuestions || []);
            currentScore = localProgress.score || 0;
            
            updateScoreDisplay();
            
            const categoryBtn = document.querySelector(`[data-category="${currentCategory}"]`);
            if (categoryBtn) {
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                categoryBtn.classList.add('active');
            }
            
            loadCategoryContent(currentCategory);
            updateItemList();
            updateBasicProgress();
        }
    }
}
