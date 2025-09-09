const express = require('express');
const path = require('path');
const svgCaptcha = require('svg-captcha');
const jwt = require('jsonwebtoken');
const { 
  initDb, 
  getAllGames, 
  getGameById, 
  addGame, 
  updateGame, 
  deleteGame,
  validateAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin
} = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'galhub_secret_key'; // 在生产环境中应该使用环境变量

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 存储验证码的简单内存存储（生产环境中应使用Redis等）
const captchaStore = new Map();

// 初始化数据库
initDb().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Error initializing database:', err);
});

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  // 提取令牌
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return handleAuthError(req, res, '访问令牌缺失', 401);
  }

  // 验证令牌
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('令牌验证失败:', err);
      return handleAuthError(req, res, '访问令牌无效', err.name === 'TokenExpiredError' ? 401 : 403);
    }
    
    req.user = user;
    next();
  });
};

// 处理认证错误的辅助函数
const handleAuthError = (req, res, message, statusCode) => {
  const isHtmlRequest = req.headers.accept?.includes('text/html');
  
  if (isHtmlRequest) {
    // 对于HTML请求，重定向到登录页面
    return res.redirect('/admin/login');
  } else {
    // 对于API请求，返回JSON错误
    return res.status(statusCode).json({ 
      success: false, 
      message,
      ...(statusCode === 401 ? { isAuthenticated: false } : {})
    });
  }
};

// 路由：主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 路由：搜索页面
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 路由：管理员登录页面
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// 路由：管理员面板 (不再需要服务端认证，完全依赖客户端认证)
app.get('/admin/dashboard', (req, res) => {
  console.log('收到访问/admin/dashboard的请求');
  console.log('发送admin-dashboard.html文件');
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// 路由：管理员账户管理页面 (需要认证)
app.get('/admin/accounts', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-accounts.html'));
});

// 路由：编辑游戏页面 (需要认证)
app.get('/admin/edit-game', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit-game.html'));
});

// API路由：生成验证码
app.get('/api/captcha', (req, res) => {
  // 生成验证码
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1iIl', // 排除易混淆字符
    noise: 2,
    color: true,
    background: '#f0f0f0'
  });
  
  // 保存验证码（实际应用中应设置过期时间）
  const captchaId = Math.random().toString(36).substring(2, 15);
  captchaStore.set(captchaId, captcha.text.toLowerCase());
  
  // 5分钟后过期
  setTimeout(() => {
    captchaStore.delete(captchaId);
  }, 5 * 60 * 1000);
  
  res.type('svg');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.status(200).send({
    svg: captcha.data,
    captchaId: captchaId
  });
});

// API路由：管理员登录
app.post('/api/admin/login', async (req, res) => {
  try {
    console.log('收到管理员登录请求');
    const { username, password, captcha, captchaId } = req.body;
    console.log('登录请求参数:', { username, captcha, captchaId });
    
    // 验证验证码
    if (!captchaId || !captcha) {
      console.log('验证码缺失');
      return res.status(400).json({ success: false, message: '请输入验证码' });
    }
    
    const storedCaptcha = captchaStore.get(captchaId);
    console.log('存储的验证码:', storedCaptcha);
    if (!storedCaptcha) {
      console.log('验证码已过期');
      return res.status(400).json({ success: false, message: '验证码已过期，请重新获取' });
    }
    
    if (storedCaptcha !== captcha.toLowerCase()) {
      console.log('验证码错误');
      return res.status(400).json({ success: false, message: '验证码错误' });
    }
    
    // 验证通过后删除验证码
    console.log('验证码验证通过，删除验证码');
    captchaStore.delete(captchaId);
    
    const admin = await validateAdmin(username, password);
    console.log('管理员验证结果:', admin);
    
    if (admin) {
      // 生成JWT令牌
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('生成JWT令牌成功');
      res.json({ 
        success: true, 
        message: '登录成功', 
        token: token,
        admin: { id: admin.id, username: admin.username } 
      });
    } else {
      console.log('用户名或密码错误');
      res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});


// API路由：验证管理员令牌（需要认证）
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});

// API路由：获取所有管理员账户（需要认证）
app.get('/api/admins', authenticateToken, async (req, res) => {
  try {
    // 验证用户权限
    if (!req.user || !req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: '无访问权限',
        code: 'NO_PERMISSION'
      });
    }
    
    const admins = await getAllAdmins();
    
    // 记录操作日志（可选）
    console.log(`管理员 ${req.user.username} 请求获取管理员列表`);
    
    res.json({ 
      success: true, 
      data: admins 
    });
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ 
      success: false, 
      message: '获取管理员列表失败',
      error: err.message
    });
  }
});

// API路由：创建管理员账户（需要认证）
app.post('/api/admins', authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码是必需的' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: '密码长度至少为6位' });
    }
    
    const admin = await createAdmin(username, password); // 调用数据库函数创建管理员
    res.status(201).json({ success: true, message: '管理员账户创建成功', admin });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: '用户名已存在' });
    } else {
      console.error('Error creating admin:', err);
      res.status(500).json({ success: false, message: '服务器内部错误' });
    }
  }
});

// API路由：删除管理员账户（需要认证）
app.delete('/api/admins/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    // 检查是否是当前登录用户
    if (req.user.id == id) {
      return res.status(400).json({ success: false, message: '不能删除当前登录的账户' });
    }
    
    const result = await deleteAdmin(id);
    
    if (result.changes > 0) {
      res.json({ success: true, message: '管理员账户删除成功' });
    } else {
      res.status(404).json({ success: false, message: '管理员账户不存在' });
    }
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// API路由：获取所有游戏（公开访问）
app.get('/api/games', async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：根据ID获取游戏（公开访问）
app.get('/api/games/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const game = await getGameById(id);
    
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：添加新游戏（需要认证）
app.post('/api/games', authenticateToken, async (req, res) => {
  try {
    const game = req.body;
    const result = await addGame(game);
    res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：更新游戏（需要认证）
app.put('/api/games/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const game = req.body;
    const result = await updateGame(id, game);
    
    if (result.changes > 0) {
      res.json({ message: 'Game updated successfully' });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：删除游戏（软删除）（需要认证）
app.delete('/api/games/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteGame(id);
    
    if (result.changes > 0) {
      res.json({ message: 'Game deleted successfully' });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});