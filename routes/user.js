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
  // 提取令牌
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('认证失败：访问令牌缺失');
    // 对于HTML页面请求，重定向到登录页面
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/login');
    }
    // 对于API请求，返回JSON错误
    return res.status(401).json({ success: false, message: '访问令牌缺失' });
  }

  // 验证令牌
  const jwt = require('jsonwebtoken');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('令牌验证失败:', err);
      // 对于HTML页面请求，重定向到登录页面
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect('/login');
      }
      // 对于API请求，返回JSON错误
      return res.status(403).json({ 
        success: false, 
        message: '访问令牌无效' 
      });
    }
    
    req.user = user;
    next();
  });
};

// API路由：获取所有用户（需要认证）
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 验证用户权限
    if (!req.user || !req.user.id) {
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
      const database = new db.Database(dbPath, (err) => {
        if (err) {
          reject(err);
        }
      });
      
      database.all('SELECT id, username, email, created_at, is_active FROM users', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        database.close();
      });
    });
    
    // 记录操作日志（可选）
    console.log(`管理员 ${req.user.username} 请求获取用户列表`);
    
    res.json({ 
      success: true, 
      data: users 
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false, 
      message: '获取用户列表失败',
      error: err.message
    });
  }
});

// API路由：创建用户（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, is_active } = req.body;
    
    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: '用户名、邮箱和密码是必需的' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: '密码长度至少为6位' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: '邮箱已被注册' });
    }
    
    // 注册用户
    const user = await registerUser(username, email, password);
    
    // 如果需要设置激活状态
    if (is_active === false) {
      await new Promise((resolve, reject) => {
        const db = require('sqlite3').verbose();
        const path = require('path');
        const dbPath = path.join(__dirname, '../database', 'users.db');
        const database = new db.Database(dbPath, (err) => {
          if (err) {
            reject(err);
          }
        });
        
        database.run('UPDATE users SET is_active = 0 WHERE id = ?', [user.id], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
          database.close();
        });
      });
    }
    
    res.status(201).json({ success: true, message: '用户创建成功', user });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: '用户名或邮箱已存在' });
    } else {
      console.error('Error creating user:', err);
      res.status(500).json({ success: false, message: '服务器内部错误' });
    }
  }
});

// API路由：删除用户（需要认证）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    // 防止用户删除自己
    if (req.user.id == id) {
      return res.status(400).json({ success: false, message: '不能删除当前登录的账户' });
    }
    
    // 从用户数据库删除用户
    const result = await new Promise((resolve, reject) => {
      const { db } = require('../database/user-db');
      
      db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
    
    if (result.changes > 0) {
      res.json({ success: true, message: '用户删除成功' });
    } else {
      res.status(404).json({ success: false, message: '用户不存在' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// API路由：用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 简单验证
    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少为6位' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }
    
    // 注册用户
    const user = await registerUser(username, email, password);
    res.status(201).json({ message: '注册成功', user });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

// API路由：用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 简单验证
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码都是必填项' });
    }
    
    // 验证用户
    const user = await validateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, username: user.username, type: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

// API路由：记录用户玩游戏历史
router.post('/games/:gameId/play', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    
    // 验证游戏是否存在
    const { getGameById } = require('../database/db');
    const game = await getGameById(gameId);
    if (!game) {
      return res.status(404).json({ error: '游戏不存在' });
    }
    
    // 记录游戏历史
    await recordGamePlay(userId, gameId);
    
    res.json({ message: '游戏历史记录成功' });
  } catch (err) {
    console.error('Error recording game play:', err);
    res.status(500).json({ error: '记录游戏历史失败' });
  }
});

// API路由：获取用户游戏历史
router.get('/games/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await getUserGameHistory(userId);
    res.json(history);
  } catch (err) {
    console.error('Error fetching game history:', err);
    res.status(500).json({ error: '获取游戏历史失败' });
  }
});

// API路由：获取用户玩过的游戏数量
router.get('/games/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await getUserGameCount(userId);
    res.json({ count });
  } catch (err) {
    console.error('Error fetching game count:', err);
    res.status(500).json({ error: '获取游戏数量失败' });
  }
});

module.exports = router;

// 单独导出中间件，以便在其他地方使用
module.exports.authenticateToken = authenticateToken;
