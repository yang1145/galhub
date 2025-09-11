const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'games.db');
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
    error('打开数据库时出错:', {
      message: err.message,
      databasePath: dbPath,
      code: err.code,
      errno: err.errno
    });
  } else {
    info('已连接到SQLite数据库', { databasePath: dbPath });
  }
});

// 初始化数据库
const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 创建games表
      db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        alias TEXT,
        cover_link TEXT,
        game_address TEXT,
        add_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        author TEXT,
        is_commercial BOOLEAN DEFAULT 0,
        is_repost BOOLEAN DEFAULT 0,
        is_maintained BOOLEAN DEFAULT 1
      )`, (err) => {
        if (err) {
          error('创建games表时出错:', {
            message: err.message,
            sql: 'CREATE TABLE IF NOT EXISTS games (...)'
          });
          reject(err);
        } else {
          info('游戏表创建完成或已存在');
        }
      });
      
      // 创建管理员表
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          error('创建admins表时出错:', {
            message: err.message,
            sql: 'CREATE TABLE IF NOT EXISTS admins (...)'
          });
          reject(err);
        } else {
          info('管理员表创建完成或已存在');
          
          // 检查是否已存在默认管理员账户
          db.get("SELECT COUNT(*) as count FROM admins", [], (err, row) => {
            if (err) {
              error('查询管理员账户数量时出错:', { message: err.message });
              reject(err);
            } else if (row.count === 0) {
              // 创建默认管理员账户 (admin/admin123)
              info('未找到管理员账户，创建默认管理员账户');
              bcrypt.hash('admin123', 10, (err, hash) => {
                if (err) {
                  error('默认管理员密码哈希处理时出错:', { message: err.message });
                  reject(err);
                } else {
                  db.run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", 
                    ['admin', hash], 
                    (err) => {
                      if (err) {
                        error('创建默认管理员账户时出错:', { message: err.message });
                        reject(err);
                      } else {
                        info('默认管理员账户创建成功 (admin/admin123)');
                        resolve();
                      }
                    }
                  );
                }
              });
            } else {
              info(`已存在 ${row.count} 个管理员账户`);
              resolve();
            }
          });
        }
      });
    });
  });
};

// 获取所有游戏
const getAllGames = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE is_maintained = 1';
    info('执行查询:', { sql });
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        error('查询所有游戏时出错:', {
          message: err.message,
          sql: sql
        });
        reject(err);
      } else {
        info('查询所有游戏成功', { count: rows.length });
        resolve(rows);
      }
    });
  });
};

// 根据ID获取游戏
const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ? AND is_maintained = 1';
    info('执行查询:', { sql, id });
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        error('根据ID查询游戏时出错:', {
          message: err.message,
          sql: sql,
          id: id
        });
        reject(err);
      } else {
        info('根据ID查询游戏完成', { found: !!row });
        resolve(row);
      }
    });
  });
};

// 添加游戏
const addGame = (game) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO games 
      (name, alias, cover_link, game_address, author, is_commercial, is_repost, is_maintained) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
    const params = [
      game.name,
      game.alias,
      game.cover_link,
      game.game_address,
      game.author,
      game.is_commercial ? 1 : 0,
      game.is_repost ? 1 : 0,
      game.is_maintained ? 1 : 0
    ];
    
    info('执行插入:', { sql, params: params.map(p => typeof p === 'string' && p.length > 20 ? `${p.substring(0, 20)}...` : p) });
    
    db.run(sql, params, function (err) {
      if (err) {
        error('添加游戏时出错:', {
          message: err.message,
          sql: sql,
          params: params
        });
        reject(err);
      } else {
        info('添加游戏成功', { id: this.lastID });
        resolve({ id: this.lastID });
      }
    });
  });
};

// 更新游戏
const updateGame = (id, game) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE games SET 
      name = ?, alias = ?, cover_link = ?, game_address = ?, author = ?, 
      is_commercial = ?, is_repost = ?, is_maintained = ? 
      WHERE id = ?`;
      
    const params = [
      game.name,
      game.alias,
      game.cover_link,
      game.game_address,
      game.author,
      game.is_commercial ? 1 : 0,
      game.is_repost ? 1 : 0,
      game.is_maintained ? 1 : 0,
      id
    ];
    
    info('执行更新:', { sql, params: params.map(p => typeof p === 'string' && p.length > 20 ? `${p.substring(0, 20)}...` : p) });
    
    db.run(sql, params, function (err) {
      if (err) {
        error('更新游戏时出错:', {
          message: err.message,
          sql: sql,
          params: params
        });
        reject(err);
      } else {
        info('更新游戏完成', { changes: this.changes });
        resolve({ changes: this.changes });
      }
    });
  });
};

// 删除游戏（软删除）
const deleteGame = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET is_maintained = 0 WHERE id = ?';
    info('执行软删除:', { sql, id });
    
    db.run(sql, [id], function (err) {
      if (err) {
        error('软删除游戏时出错:', {
          message: err.message,
          sql: sql,
          id: id
        });
        reject(err);
      } else {
        info('软删除游戏完成', { changes: this.changes });
        resolve({ changes: this.changes });
      }
    });
  });
};

// 验证管理员
const validateAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    info('验证管理员:', { sql, username });
    
    db.get(sql, [username], (err, row) => {
      if (err) {
        error('查询管理员时出错:', {
          message: err.message,
          sql: sql,
          username: username
        });
        reject(err);
      } else if (row) {
        bcrypt.compare(password, row.password_hash, (err, result) => {
          if (err) {
            error('密码验证时出错:', { message: err.message });
            reject(err);
          } else if (result) {
            info('管理员验证成功:', { username });
            resolve({ id: row.id, username: row.username });
          } else {
            info('管理员密码错误:', { username });
            resolve(null);
          }
        });
      } else {
        info('管理员不存在:', { username });
        resolve(null);
      }
    });
  });
};

// 创建管理员
const createAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        error('管理员密码哈希处理时出错:', { message: err.message });
        reject(err);
      } else {
        const sql = 'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)';
        info('创建管理员:', { sql, username });
        
        db.run(sql, [username, hash], function (err) {
          if (err) {
            error('创建管理员时出错:', {
              message: err.message,
              sql: sql,
              username: username
            });
            reject(err);
          } else {
            if (this.changes > 0) {
              info('管理员创建成功', { username, id: this.lastID });
              resolve({ id: this.lastID, username });
            } else {
              info('管理员已存在:', { username });
              reject(new Error('用户名已存在'));
            }
          }
        });
      }
    });
  });
};

// 获取所有管理员
const getAllAdmins = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, created_at FROM admins ORDER BY id';
    info('查询所有管理员:', { sql });
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        error('查询所有管理员时出错:', {
          message: err.message,
          sql: sql
        });
        reject(err);
      } else {
        info('查询所有管理员成功', { count: rows.length });
        resolve(rows);
      }
    });
  });
};

// 删除管理员
const deleteAdmin = (adminId, currentAdminId) => {
  return new Promise((resolve, reject) => {
    // 防止管理员删除自己
    if (adminId === currentAdminId) {
      info('尝试删除当前登录的账户:', { adminId });
      return reject(new Error('不能删除当前登录的账户'));
    }
    
    const sql = 'DELETE FROM admins WHERE id = ?';
    info('删除管理员:', { sql, adminId });
    
    db.run(sql, [adminId], function (err) {
      if (err) {
        error('删除管理员时出错:', {
          message: err.message,
          sql: sql,
          adminId: adminId
        });
        reject(err);
      } else {
        info('删除管理员完成', { changes: this.changes });
        resolve({ changes: this.changes });
      }
    });
  });
};

// 获取所有用户
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    // 连接到用户数据库
    const userDbPath = path.join(__dirname, 'users.db');
    info('连接用户数据库:', { userDbPath });
    
    const userDb = new sqlite3.Database(userDbPath, (err) => {
      if (err) {
        error('连接用户数据库时出错:', { message: err.message });
        return reject(err);
      }
      info('用户数据库连接成功');
    });
    
    const sql = 'SELECT id, username, email, created_at, is_active FROM users';
    info('查询所有用户:', { sql });
    
    userDb.all(sql, [], (err, rows) => {
      if (err) {
        error('查询所有用户时出错:', {
          message: err.message,
          sql: sql
        });
        userDb.close();
        reject(err);
      } else {
        info('查询所有用户成功', { count: rows.length });
        userDb.close();
        resolve(rows);
      }
    });
  });
};

// 检查数据库连接是否已建立
let connectionEstablished = false;
const isConnectionEstablished = () => {
  return connectionEstablished;
};

// 建立数据库连接
const connect = () => {
  return new Promise((resolve, reject) => {
    if (connectionEstablished) {
      info('数据库连接已建立');
      return resolve();
    }
    
    // 重新初始化数据库连接
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        error('连接数据库时出错:', { message: err.message });
        reject(err);
      } else {
        info('数据库连接成功');
        connectionEstablished = true;
        resolve();
      }
    });
  });
};

// 关闭数据库连接
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        error('关闭数据库时出错:', { message: err.message });
        reject(err);
      } else {
        info('数据库连接已关闭');
        connectionEstablished = false;
        resolve();
      }
    });
  });
};

module.exports = {
  initDb,
  getAllGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
  validateAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  getAllUsers,
  isConnectionEstablished,
  connect,
  close,
  db
};

