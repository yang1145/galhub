const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { info, error } = require('../log');

// 确保database目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('打开用户数据库时出错:', err.message);
    console.error('用户数据库路径:', dbPath);
    console.error('错误代码:', err.code);
    console.error('错误编号:', err.errno);
  } else {
    console.log('已连接到SQLite用户数据库');
    console.log('User database path:', dbPath);
    initializeDatabase();
  }
});

// 初始化数据库
let dbInitialized = false;
const initializeDatabase = () => {
  if (dbInitialized) {
    console.log('用户数据库已初始化，跳过重复初始化');
    return Promise.resolve();
  }
  
  console.log('开始初始化用户数据库');
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 创建用户表
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )`, (err) => {
        if (err) {
          error('创建users表时出错:', {
            message: err.message,
            sql: 'CREATE TABLE IF NOT EXISTS users (...)' 
          });
          reject(err);
        } else {
          info('用户表创建完成或已存在');
        }
      });
      
      // 创建用户游戏历史表，直接引用主数据库的games表
      db.run(`CREATE TABLE IF NOT EXISTS user_game_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, game_id)
      )`, (err) => {
        if (err) {
          error('创建用户游戏历史表时出错:', {
            message: err.message,
            sql: 'CREATE TABLE IF NOT EXISTS user_game_history (...)' 
          });
          reject(err);
        } else {
          info('用户游戏历史表创建完成或已存在');
          dbInitialized = true;
          resolve();
        }
      });
    });
  });
};

// 修改initUserDb函数，使用async/await
const initUserDb = async () => {
  try {
    await initializeDatabase();
    return { success: true };
  } catch (err) {
    error('数据库初始化失败:', { message: err.message });
    return { success: false, error: err };
  }
};

// 用户注册
const registerUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    info('开始注册用户:', { username });
    
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        error('用户密码哈希处理时出错:', { message: err.message });
        reject(err);
      } else {
        info('用户密码哈希处理成功');
        
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hash],
          function (err) {
            if (err) {
              error('插入用户数据时出错:', {
                message: err.message,
                sql: 'INSERT INTO users ...',
                username: username,
                email: email ? `${email.substring(0, 3)}***@***` : null
              });
              reject(err);
            } else {
              info('用户注册成功', {
                id: this.lastID,
                username: username,
                email: email ? `${email.substring(0, 3)}***@***` : null
              });
              resolve({ id: this.lastID, username, email });
            }
          }
        );
      }
    });
  });
};

// 用户登录验证
const validateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    info('验证用户:', { username });
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        error('查询用户时出错:', {
          message: err.message,
          sql: 'SELECT * FROM users WHERE username = ?',
          username: username
        });
        reject(err);
      } else if (row) {
        bcrypt.compare(password, row.password_hash, (err, result) => {
          if (err) {
            console.error('密码验证时出错:', err.message);
            reject(err);
          } else if (result) {
            info('用户验证成功:', { username });
            resolve({ id: row.id, username: row.username, email: row.email });
          } else {
            info('用户密码错误:', { username });
            resolve(null);
          }
        });
      } else {
        info('用户不存在:', { username });
        resolve(null);
      }
    });
  });
};

// 根据用户名查找用户
const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    info('根据用户名查找用户:', { username });
    
    db.get('SELECT id, username, email FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        error('根据用户名查找用户时出错:', {
          message: err.message,
          sql: 'SELECT id, username, email FROM users WHERE username = ?',
          username: username
        });
        reject(err);
      } else {
        info('根据用户名查找用户完成', { found: !!row });
        resolve(row);
      }
    });
  });
};

// 根据邮箱查找用户
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    info('根据邮箱查找用户:', { email: email ? `${email.substring(0, 3)}***@***` : null });
    
    db.get('SELECT id, username, email FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        error('根据邮箱查找用户时出错:', {
          message: err.message,
          sql: 'SELECT id, username, email FROM users WHERE email = ?',
          email: email ? `${email.substring(0, 3)}***@***` : null
        });
        reject(err);
      } else {
        info('根据邮箱查找用户完成', { found: !!row });
        resolve(row);
      }
    });
  });
};

// 记录游戏历史
const recordGamePlay = (userId, gameId) => {
  return new Promise((resolve, reject) => {
    info('记录游戏历史:', { userId, gameId });
    
    // 使用 INSERT OR REPLACE 确保唯一性并更新时间戳
    db.run(
      'INSERT OR REPLACE INTO user_game_history (user_id, game_id, played_at) VALUES (?, ?, datetime(\'now\'))',
      [userId, gameId],
      function (err) {
        if (err) {
          error('记录游戏历史时出错:', {
            message: err.message,
            sql: 'INSERT OR REPLACE INTO user_game_history ...',
            userId: userId,
            gameId: gameId
          });
          reject(err);
        } else {
          info('游戏历史记录成功', { id: this.lastID });
          resolve({ id: this.lastID });
        }
      }
    );
  });
};

// 获取用户游戏历史
const getUserGameHistory = (userId) => {
  return new Promise((resolve, reject) => {
    info('获取用户游戏历史:', { userId });
    
    // 连接到主数据库获取游戏信息
    const mainDbPath = path.join(__dirname, 'games.db');
    info('连接主数据库以获取游戏信息:', { mainDbPath });
    
    const mainDb = new sqlite3.Database(mainDbPath, (err) => {
      if (err) {
        error('连接主数据库时出错:', { message: err.message });
        return reject(err);
      }
      info('主数据库连接成功');
    });
    
    const sql = `
      SELECT 
        ugh.id,
        ugh.user_id,
        ugh.game_id,
        ugh.played_at,
        g.name as game_name,
        g.alias as game_alias,
        g.cover_link
      FROM user_game_history ugh
      JOIN games g ON ugh.game_id = g.id
      WHERE ugh.user_id = ? AND g.is_maintained = 1
      ORDER BY ugh.played_at DESC
    `;
    
    info('执行查询:', { sql, userId });
    
    mainDb.all(sql, [userId], (err, rows) => {
      if (err) {
        error('获取用户游戏历史时出错:', {
          message: err.message,
          sql: sql,
          userId: userId
        });
        mainDb.close();
        reject(err);
      } else {
        info('获取用户游戏历史成功', { count: rows.length });
        mainDb.close();
        resolve(rows);
      }
    });
  });
};

// 获取用户游戏数量
const getUserGameCount = (userId) => {
  return new Promise((resolve, reject) => {
    info('获取用户游戏数量:', { userId });
    
    const sql = 'SELECT COUNT(*) as count FROM user_game_history WHERE user_id = ?';
    info('执行查询:', { sql, userId });
    
    db.get(sql, [userId], (err, row) => {
      if (err) {
        error('获取用户游戏数量时出错:', {
          message: err.message,
          sql: sql,
          userId: userId
        });
        reject(err);
      } else {
        info('获取用户游戏数量成功', { count: row.count });
        resolve(row.count);
      }
    });
  });
};

// 关闭数据库连接
const closeUserDb = () => {
  db.close((err) => {
    if (err) {
      error('关闭用户数据库时出错:', { message: err.message });
    } else {
      info('用户数据库连接已关闭');
    }
  });
};

module.exports = {
  initUserDb,
  registerUser,
  validateUser,
  findUserByUsername,
  findUserByEmail,
  recordGamePlay,
  getUserGameHistory,
  getUserGameCount,
  closeUserDb
};