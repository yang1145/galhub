const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { 
  validateAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin
} = db;

// 创建路由实例
const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'galhub_secret_key';

// 确保数据库连接的中间件
const ensureDBConnection = async (req, res, next) => {
  try {
    // 如果数据库连接未建立，尝试连接
    if (!db.isConnectionEstablished()) {
      await db.connect();
    }
    next();
  } catch (err) {
    console.error('数据库连接失败:', err);
    res.status(500).json({ 
      success: false, 
      message: '数据库连接失败，请稍后再试',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
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

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  // 提取令牌
  let token;
  
  // 首先尝试从Authorization头获取令牌
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    token = authHeader.split(' ')[1];
  }
  
  // 如果头中没有令牌，尝试从cookie获取
  if (!token && req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
    console.log('从cookie中获取令牌:', token);
  }
  
  // 如果cookie中也没有令牌，尝试从查询参数获取（用于页面跳转）
  if (!token && req.query && req.query.token) {
    token = req.query.token;
    console.log('从查询参数中获取令牌:', token);
  }
  
  console.log('认证中间件: 请求URL:', req.url);
  console.log('认证中间件: Authorization头:', authHeader);
  console.log('认证中间件: 提取的令牌:', token);
  
  if (!token) {
    console.log('认证失败：访问令牌缺失');
    // 对于HTML页面请求，重定向到登录页面
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/admin/login');
    }
    // 对于API请求，返回JSON错误
    return res.status(401).json({ success: false, message: '访问令牌缺失' });
  }

  // 验证令牌
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('令牌验证失败:', err);
      // 对于HTML页面请求，重定向到登录页面
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        // 清除无效的令牌
        if (req.cookies && req.cookies.adminToken) {
          res.clearCookie('adminToken');
        }
        return res.redirect('/admin/login');
      }
      // 对于API请求，返回JSON错误
      return res.status(err.name === 'TokenExpiredError' ? 401 : 403)
                .json({ success: false, message: '访问令牌无效' });
    }
    
    console.log('令牌验证成功，用户信息:', user);
    req.user = user;
    
    // 如果是通过查询参数传递的令牌，将其设置为cookie
    if (req.query && req.query.token) {
      res.cookie('adminToken', token, { 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 // 24小时
      });
      // 重定向以移除URL中的令牌参数
      const urlWithoutToken = req.url.split('?')[0];
      return res.redirect(urlWithoutToken);
    }
    
    next();
  });
};

// API路由：管理员登录
router.post('/login', ensureDBConnection, async (req, res) => {
  try {
    console.log('收到管理员登录请求');
    const { username, password, captcha, captchaId } = req.body;
    console.log('登录请求参数:', { username, captcha, captchaId });
    
    // 验证验证码
    if (!captchaId || !captcha) {
      console.log('验证码缺失');
      return res.status(400).json({ success: false, message: '请输入验证码' });
    }
    
    const storedCaptcha = req.app.get('captchaStore').get(captchaId);
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
    req.app.get('captchaStore').delete(captchaId);
    
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
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});

// API路由：获取所有管理员账户（需要认证）
router.get('/', ensureDBConnection, authenticateToken, async (req, res) => {
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
router.post('/', ensureDBConnection, authenticateToken, async (req, res) => {
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

// API路由：删除管理员账户 (需要认证)
router.delete('/admins/:id', authenticateToken, async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const currentAdminId = req.user.id;
    
    // 验证参数
    if (isNaN(adminId)) {
      return res.status(400).json({ success: false, message: '无效的管理员ID' });
    }
    
    // 防止删除默认管理员账户（ID为1）
    if (adminId === 1) {
      return res.status(400).json({ success: false, message: '不能删除默认管理员账户' });
    }
    
    const result = await deleteAdmin(adminId, currentAdminId);
    if (result.changes > 0) {
      res.json({ success: true, message: '管理员账户删除成功' });
    } else {
      res.status(404).json({ success: false, message: '未找到指定的管理员账户' });
    }
  } catch (err) {
    console.error('删除管理员账户时出错:', err);
    if (err.message === '不能删除当前登录的账户') {
      res.status(400).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: '删除管理员账户失败' });
    }
  }
});

// API路由：获取所有用户 (需要认证)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: '获取用户列表失败' });
  }
});

// 导出路由和中间件
module.exports = router;

// 单独导出中间件，以便在其他地方使用
module.exports.authenticateToken = authenticateToken;
