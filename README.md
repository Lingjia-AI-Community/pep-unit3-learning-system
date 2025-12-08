# PEP Unit3 Learning System 部署说明

## 系统概述
这是一个基于HTML/JavaScript的小学英语六年级上册Unit 3学练系统，包含学生训练模块和管理员后台管理模块。

## 系统功能
1. 学生训练模块
   - 基础学练（听、读训练）
   - 提升学练（阅读理解训练）
   - 实时分数计算和显示
   - 语音识别和评估

2. 管理员后台模块
   - 学生信息管理
   - 训练情况查看
   - 数据导入导出
   - 系统数据备份恢复

## 部署到Cloudflare Pages

### 步骤1：准备文件
1. 下载所有文件到本地文件夹
2. 确保文件夹包含以下文件：
   - index.html
   - login.html
   - admin.html
   - style.css
   - script.js
   - admin.js
   - db.js

### 步骤2：创建GitHub仓库
1. 访问 GitHub (https://github.com)
2. 点击 "New repository"
3. 输入仓库名称：pep-unit3-learning-system
4. 选择 "Public"（公开）
5. 点击 "Create repository"

### 步骤3：上传文件到GitHub
1. 在GitHub仓库页面，点击 "uploading an existing file"
2. 拖拽所有文件到上传区域
3. 输入提交信息："Initial commit"
4. 点击 "Commit changes"

### 步骤4：部署到Cloudflare Pages
1. 登录 Cloudflare Dashboard (https://dash.cloudflare.com)
2. 点击左侧菜单 "Pages"
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择你创建的GitHub仓库
6. 点击 "Begin setup"

### 步骤5：配置构建设置
1. 项目名称：pep-unit3-learning-system
2. 生产分支：main
3. 构建设置：
   - 框架预设：None
   - 构建命令：(留空)
   - 构建输出目录：/(留空，因为我们是纯静态文件)
4. 点击 "Save and Deploy"

### 步骤6：访问系统
1. 部署完成后，Cloudflare会提供一个URL
2. 访问URL即可使用系统
3. 默认URL格式：https://pep-unit3-learning-system.pages.dev

## 本地运行
1. 将文件保存在同一文件夹
2. 双击 `login.html` 在浏览器中打开
3. 系统支持本地存储数据

## 系统账户

### 管理员账户
- 用户名：叶金炎
- 密码：yjy897018@

### 测试学生账户
- 姓名：测试
- 学号：CL045
- 密码：123456yy

### 其他学生账户
使用《六1学练系统学生名册》中的姓名和密码登录

## 技术特点
1. 响应式设计：支持手机、平板、电脑
2. 离线功能：支持本地存储数据
3. 语音识别：使用Web Speech API
4. 数据持久化：使用localStorage
5. 无需数据库：所有数据存储在浏览器

## 注意事项
1. 语音识别功能需要HTTPS环境
2. 不同浏览器对Web Speech API支持不同
3. 本地存储数据有大小限制（约5MB）
4. 清除浏览器缓存会删除所有数据

## 更新和维护
1. 更新文件后，重新提交到GitHub
2. Cloudflare Pages会自动重新部署
3. 管理员可以在后台备份和恢复数据

## 故障排除
1. 如果系统不工作，检查浏览器控制台错误
2. 确保所有文件都在同一目录
3. 检查浏览器是否支持localStorage
4. 语音功能需要授予麦克风权限

## 联系方式
如有问题，请联系系统管理员。