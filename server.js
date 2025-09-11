const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

// 导入路由模块
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const captchaRoutes = require('./routes/captcha');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// 存储验证码的简单内存存储（生产环境中应使用Redis等）
const captchaStore = new Map();
app.set('captchaStore', captchaStore);


// 路由：主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 路由：管理员登录页面
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// 路由：管理员面板 (需要认证)
app.get('/admin/dashboard', adminRoutes.authenticateToken, (req, res) => {
  console.log('收到访问/admin/dashboard的请求');
  console.log('发送admin-dashboard.html文件');
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// 路由：管理员账户管理页面 (需要认证)
app.get('/admin/accounts', adminRoutes.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-accounts.html'));
});

// 路由：用户管理页面 (需要认证)
app.get('/admin/users', adminRoutes.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-users.html'));
});

// 路由：编辑游戏页面 (需要认证)
app.get('/admin/edit-game', adminRoutes.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit-game.html'));
});

// 路由：用户注册页面
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 路由：用户登录页面
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 路由：用户个人中心 (需要认证)
app.get('/user/profile', userRoutes.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// 路由：游戏详情页面
app.get('/games/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game-detail.html'));
});

// 路由：游戏历史页面 (需要认证)
app.get('/game-history', userRoutes.authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game-history.html'));
});

// API路由
app.use('/api/captcha', captchaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('未处理的错误:', err);
  console.error('错误堆栈:', err.stack);
  console.error('请求URL:', req.url);
  console.error('请求方法:', req.method);
  console.error('请求头:', req.headers);
  
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.status(500).json({ 
      success: false, 
      message: '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' ? { 
        error: err.message,
        stack: err.stack 
      } : {})
    });
  } else {
    res.status(500).send(`
      <h1>服务器内部错误</h1>
      <p>发生了一个未处理的错误，请稍后再试。</p>
      ${process.env.NODE_ENV === 'development' ? `<pre>${err.message}\n${err.stack}</pre>` : ''}
    `);
  }
});

// 404处理
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  console.log(`User Agent: ${req.get('User-Agent')}`);
  console.log(`IP: ${req.ip}`);
  
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.status(404).json({ success: false, message: '请求的资源不存在' });
  } else {
    res.status(404).send(`
      <h1>页面未找到</h1>
      <p>请求的资源不存在: ${req.url}</p>
      <a href="/">返回首页</a>
    `);
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});