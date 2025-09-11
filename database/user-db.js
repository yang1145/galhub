const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// 确保database目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite user database.');
    initializeDatabase();
  }
});

// 初始化数据库
let dbInitialized = false;
const initializeDatabase = () => {
  if (dbInitialized) return Promise.resolve();
  
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
          reject(err);
        } else {
          console.log('Users table created or already exists.');
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
          reject(err);
        } else {
          console.log('User game history table created or already exists.');
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
    console.error('Database initialization failed:', err);
    return { success: false, error: err };
  }
};

// 用户注册
const registerUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hash],
          function (err) {
            if (err) {
              reject(err);
            } else {
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
    db.get(
      'SELECT id, username, email, password_hash FROM users WHERE username = ? AND is_active = 1',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          bcrypt.compare(password, row.password_hash, (err, result) => {
            if (err) {
              reject(err);
            } else if (result) {
              const { password_hash, ...user } = row;
              resolve(user);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      }
    );
  });
};

// 根据用户名查找用户
const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// 根据邮箱查找用户
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// 记录用户玩游戏历史
const recordGamePlay = (userId, gameId) => {
  return new Promise((resolve, reject) => {
    // 首先检查游戏是否存在且处于维护状态
    const mainDb = require('./db');
    mainDb.getGameById(gameId)
      .then(game => {
        if (!game || !game.is_maintained) {
          reject(new Error('Game not found or not maintained'));
        } else {
          // 游戏存在，记录游戏历史
          db.run(
            `INSERT OR REPLACE INTO user_game_history (user_id, game_id, played_at) 
             VALUES (?, ?, datetime('now'))`,
            [userId, gameId],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve({ userId, gameId, playedAt: new Date() });
              }
            }
          );
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 获取用户游戏历史
const getUserGameHistory = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.id, g.name, g.alias, g.cover_link, g.game_address, g.add_time, 
             g.author, g.is_commercial, g.is_repost, g.is_maintained, ugh.played_at
      FROM user_game_history ugh
      JOIN games g ON ugh.game_id = g.id
      WHERE ugh.user_id = ?
      ORDER BY ugh.played_at DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 获取用户玩过的游戏数量
const getUserGameCount = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) as count
      FROM user_game_history
      WHERE user_id = ?
    `;
    
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.count : 0);
      }
    });
  });
};

// 关闭数据库连接
const closeUserDb = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing user database:', err.message);
    } else {
      console.log('User database connection closed.');
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