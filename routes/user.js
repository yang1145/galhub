const express = require('express');
const jwt = require('jsonwebtoken'); // 添加JWT模块
const { 
  registerUser,
  validateUser,
  findUserByUsername,
  findUserByEmail,
  recordGamePlay,
  getUserGameHistory,
  getUserGameCount
} = require('../database/user-db');

// 创建路由实例
const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'galhub_secret_key';

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  // 记录请求信息
  console.log('用户认证中间件启动:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // 提取令牌
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('认证中间件: 请求URL:', req.url);
  console.log('认证中间件: Authorization头:', authHeader ? `${authHeader.substring(0, 20)}...` : null);
  console.log('认证中间件: 提取的令牌:', token ? `${token.substring(0, 10)}...` : '无');
  
  if (!token) {
    console.log('认证失败：访问令牌缺失', {
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    
    // 对于HTML页面请求，重定向到登录页面
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      console.log('HTML请求，重定向到用户登录页面');
      return res.redirect('/login');
    }
    // 对于API请求，返回JSON错误
    console.log('API请求，返回401错误');
    return res.status(401).json({ success: false, message: '访问令牌缺失' });
  }

  // 验证令牌
  const jwt = require('jsonwebtoken');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('用户令牌验证失败:', err);
      console.error('用户令牌验证错误详情:', {
        name: err.name,
        message: err.message,
        expiredAt: err.expiredAt
      });
      
      // 对于HTML页面请求，重定向到登录页面
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        console.log('HTML请求令牌验证失败，重定向到用户登录页面');
        return res.redirect('/login');
      }
      // 对于API请求，返回JSON错误
      console.log('API请求令牌验证失败，返回认证错误');
      return res.status(403).json({ 
        success: false, 
        message: '访问令牌无效' 
      });
    }
    
    console.log('用户令牌验证成功，用户信息:', {
      id: user.id,
      username: user.username
    });
    req.user = user;
    next();
  });
};

// API路由：获取所有用户（需要认证）
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('收到获取所有用户请求:', {
      requester: req.user?.username,
      requesterId: req.user?.id
    });
    
    // 验证用户权限
    if (!req.user || !req.user.id) {
      console.log('权限验证失败:', {
        user: req.user,
        url: req.url,
        ip: req.ip
      });
      
      return res.status(403).json({ 
        success: false, 
        message: '无访问权限',
        code: 'NO_PERMISSION'
      });
    }
    
    // 从用户数据库获取所有用户
    const users = await new Promise((resolve, reject) => {
      const db = require('sqlite3').verbose();
      const path = require('path');
      const dbPath = path.join(__dirname, '../database', 'users.db');
      
      console.log('连接用户数据库:', dbPath);
      const database = new db.Database(dbPath, (err) => {
        if (err) {
          console.error('连接用户数据库失败:', err);
          return reject(err);
        }
        console.log('用户数据库连接成功');
      });
      
      database.all('SELECT id, username, email, created_at, is_active FROM users', [], (err, rows) => {
        if (err) {
          console.error('查询用户数据失败:', err);
          database.close();
          return reject(err);
        } else {
          console.log('查询用户数据成功，共', rows.length, '条记录');
          database.close();
          resolve(rows);
        }
      });
    });
    
    // 记录操作日志（可选）
    console.log(`管理员 ${req.user.username} 请求获取用户列表，共${users.length}条记录`);
    
    res.json({ 
      success: true, 
      data: users,
      count: users.length
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    console.error('获取用户列表错误详情:', {
      message: err.message,
      stack: err.stack,
      user: req.user?.username,
      url: req.url
    });
    
    res.status(500).json({ 
      success: false, 
      message: '获取用户列表失败',
      ...(process.env.NODE_ENV === 'development' ? { 
        error: err.message,
        stack: err.stack
      } : {}),
      error: err.message
    });
  }
});

// API路由：创建用户（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, is_active } = req.body;
    
    console.log('收到创建用户请求:', {
      requester: req.user?.username,
      newUsername: username ? `${username.substring(0, 3)}***` : null,
      newEmail: email ? `${email.substring(0, 3)}***@***` : null
    });
    
    // 验证输入
    if (!username || !email || !password) {
      console.log('创建用户参数缺失');
      return res.status(400).json({ success: false, message: '用户名、邮箱和密码是必需的' });
    }
    
    if (password.length < 6) {
      console.log('密码长度不足');
      return res.status(400).json({ success: false, message: '密码长度至少为6位' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log('用户名已存在:', username);
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      console.log('邮箱已被注册:', email);
      return res.status(400).json({ success: false, message: '邮箱已被注册' });
    }
    
    // 注册用户
    console.log('开始注册新用户');
    const user = await registerUser(username, email, password);
    console.log('用户注册成功:', {
      id: user?.id,
      username: user?.username
    });
    
    // 如果需要设置激活状态
    if (is_active === false) {
      console.log('设置用户为非激活状态');
      await new Promise((resolve, reject) => {
        const db = require('sqlite3').verbose();
        const path = require('path');
        const dbPath = path.join(__dirname, '../database', 'users.db');
        
        console.log('连接用户数据库以更新状态:', dbPath);
        const database = new db.Database(dbPath, (err) => {
          if (err) {
            console.error('连接用户数据库失败:', err);
            return reject(err);
          }
          console.log('用户数据库连接成功');
        });
        
        database.run('UPDATE users SET is_active = 0 WHERE id = ?', [user.id], (err) => {
          if (err) {
            console.error('更新用户状态失败:', err);
            database.close();
            reject(err);
          } else {
            console.log('用户状态更新成功');
            database.close();
            resolve();
          }
        });
      });
    }
    
    res.status(201).json({ success: true, message: '用户创建成功', user });
  } catch (err) {
    console.error('Error creating user:', err);
    console.error('创建用户错误详情:', {
      message: err.message,
      stack: err.stack,
      username: req.body?.username ? `${req.body.username.substring(0, 3)}***` : null,
      email: req.body?.email ? `${req.body.email.substring(0, 3)}***@***` : null,
      requester: req.user?.username
    });
    
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('用户名或邮箱已存在');
      res.status(400).json({ success: false, message: '用户名或邮箱已存在' });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' ? { 
          error: err.message 
        } : {})
      });
    }
  }
});

// API路由：删除用户（需要认证）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    console.log('收到删除用户请求:', {
      targetId: id,
      requesterId: req.user?.id,
      requester: req.user?.username
    });
    
    // 防止用户删除自己
    if (req.user.id == id) {
      console.log('尝试删除当前登录的账户');
      return res.status(400).json({ success: false, message: '不能删除当前登录的账户' });
    }
    
    // 从用户数据库删除用户
    const result = await new Promise((resolve, reject) => {
      const { db } = require('../database/user-db');
      
      console.log('执行删除用户操作:', id);
      db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('删除用户失败:', err);
          reject(err);
        } else {
          console.log('删除用户操作完成，影响行数:', this.changes);
          resolve({ changes: this.changes });
        }
      });
    });
    
    if (result.changes > 0) {
      console.log('用户删除成功:', id);
      res.json({ success: true, message: '用户删除成功' });
    } else {
      console.log('未找到指定用户:', id);
      res.status(404).json({ success: false, message: '用户不存在' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    console.error('删除用户错误详情:', {
      message: err.message,
      stack: err.stack,
      targetId: req.params.id,
      requester: req.user?.username
    });
    
    res.status(500).json({ 
      success: false, 
      message: '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' ? { 
        error: err.message 
      } : {})
    });
  }
});

// API路由：用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('收到用户注册请求:', {
      username: username ? `${username.substring(0, 3)}***` : null,
      email: email ? `${email.substring(0, 3)}***@***` : null
    });
    
    // 简单验证
    if (!username || !email || !password) {
      console.log('注册参数缺失');
      return res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
    }
    
    if (password.length < 6) {
      console.log('密码长度不足');
      return res.status(400).json({ error: '密码长度至少为6位' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log('用户名已存在:', username);
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      console.log('邮箱已被注册:', email);
      return res.status(400).json({ error: '邮箱已被注册' });
    }
    
    // 注册用户
    console.log('开始注册新用户');
    const user = await registerUser(username, email, password);
    console.log('用户注册成功:', {
      id: user?.id,
      username: user?.username
    });
    
    res.status(201).json({ message: '注册成功', user });
  } catch (err) {
    console.error('Error registering user:', err);
    console.error('用户注册错误详情:', {
      message: err.message,
      stack: err.stack,
      username: req.body?.username ? `${req.body.username.substring(0, 3)}***` : null,
      email: req.body?.email ? `${req.body.email.substring(0, 3)}***@***` : null
    });
    
    res.status(500).json({ 
      error: '注册失败，请稍后重试',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message 
      } : {})
    });
  }
});

// API路由：用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('收到用户登录请求:', {
      username: username ? `${username.substring(0, 3)}***` : null
    });
    
    // 简单验证
    if (!username || !password) {
      console.log('登录参数缺失');
      return res.status(400).json({ error: '用户名和密码都是必填项' });
    }
    
    // 验证用户
    const user = await validateUser(username, password);
    if (!user) {
      console.log('用户名或密码错误');
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, username: user.username, type: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('用户登录成功:', {
      id: user.id,
      username: user.username
    });
    
    res.json({ 
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    console.error('用户登录错误详情:', {
      message: err.message,
      stack: err.stack,
      username: req.body?.username ? `${req.body.username.substring(0, 3)}***` : null
    });
    
    res.status(500).json({ 
      error: '登录失败，请稍后重试',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message 
      } : {})
    });
  }
});

// API路由：记录用户玩游戏历史
router.post('/games/:gameId/play', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    
    console.log('收到记录游戏历史请求:', {
      gameId,
      userId,
      username: req.user?.username
    });
    
    // 验证游戏是否存在
    const { getGameById } = require('../database/db');
    const game = await getGameById(gameId);
    if (!game) {
      console.log('游戏不存在:', gameId);
      return res.status(404).json({ error: '游戏不存在' });
    }
    
    // 记录游戏历史
    console.log('开始记录游戏历史');
    await recordGamePlay(userId, gameId);
    console.log('游戏历史记录成功:', {
      userId,
      gameId,
      username: req.user?.username,
      gameName: game.name
    });
    
    res.json({ message: '游戏历史记录成功' });
  } catch (err) {
    console.error('Error recording game play:', err);
    console.error('记录游戏历史错误详情:', {
      message: err.message,
      stack: err.stack,
      gameId: req.params.gameId,
      userId: req.user?.id,
      username: req.user?.username
    });
    
    res.status(500).json({ 
      error: '记录游戏历史失败',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message 
      } : {})
    });
  }
});

// API路由：获取用户游戏历史
router.get('/games/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('收到获取游戏历史请求:', {
      userId,
      username: req.user?.username
    });
    
    const history = await getUserGameHistory(userId);
    console.log('获取游戏历史成功，共', history.length, '条记录');
    
    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (err) {
    console.error('Error fetching game history:', err);
    console.error('获取游戏历史错误详情:', {
      message: err.message,
      stack: err.stack,
      userId: req.user?.id,
      username: req.user?.username
    });
    
    res.status(500).json({ 
      success: false,
      error: '获取游戏历史失败',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message 
      } : {})
    });
  }
});

// API路由：获取用户玩过的游戏数量
router.get('/games/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('收到获取游戏数量请求:', {
      userId,
      username: req.user?.username
    });
    
    const count = await getUserGameCount(userId);
    console.log('获取游戏数量成功:', {
      userId,
      username: req.user?.username,
      count
    });
    
    res.json({ 
      success: true,
      count 
    });
  } catch (err) {
    console.error('Error fetching game count:', err);
    console.error('获取游戏数量错误详情:', {
      message: err.message,
      stack: err.stack,
      userId: req.user?.id,
      username: req.user?.username
    });
    
    res.status(500).json({ 
      success: false,
      error: '获取游戏数量失败',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message 
      } : {})
    });
  }
});

module.exports = router;

// 单独导出中间件，以便在其他地方使用
module.exports.authenticateToken = authenticateToken;
