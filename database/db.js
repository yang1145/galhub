 const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'games.db');
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
    console.error('Database path:', dbPath);
    console.error('Error code:', err.code);
    console.error('Error errno:', err.errno);
  } else {
    console.log('Connected to the SQLite database.');
    console.log('Database path:', dbPath);
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
          console.error('创建games表失败:', err.message);
          console.error('SQL语句:', 'CREATE TABLE IF NOT EXISTS games (...)');
          reject(err);
        } else {
          console.log('Games table created or already exists.');
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
          console.error('创建admins表失败:', err.message);
          console.error('SQL语句:', 'CREATE TABLE IF NOT EXISTS admins (...)');
          reject(err);
        } else {
          console.log('Admins table created or already exists.');
          
          // 检查是否已存在默认管理员账户
          db.get("SELECT COUNT(*) as count FROM admins", [], (err, row) => {
            if (err) {
              console.error('查询管理员账户数量失败:', err.message);
              reject(err);
            } else if (row.count === 0) {
              // 创建默认管理员账户 (admin/admin123)
              console.log('未找到管理员账户，创建默认管理员账户');
              bcrypt.hash('admin123', 10, (err, hash) => {
                if (err) {
                  console.error('默认管理员密码哈希失败:', err.message);
                  reject(err);
                } else {
                  db.run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", 
                    ['admin', hash], 
                    (err) => {
                      if (err) {
                        console.error('创建默认管理员账户失败:', err.message);
                        reject(err);
                      } else {
                        console.log('Default admin account created (admin/admin123)');
                        resolve();
                      }
                    }
                  );
                }
              });
            } else {
              console.log(`已存在 ${row.count} 个管理员账户`);
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
    console.log('执行查询:', sql);
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('查询所有游戏失败:', err.message);
        console.error('SQL语句:', sql);
        reject(err);
      } else {
        console.log('查询所有游戏成功，共', rows.length, '条记录');
        resolve(rows);
      }
    });
  });
};

// 根据ID获取游戏
const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ? AND is_maintained = 1';
    console.log('执行查询:', sql, '参数:', id);
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('根据ID查询游戏失败:', err.message);
        console.error('SQL语句:', sql, '参数:', id);
        reject(err);
      } else {
        console.log('根据ID查询游戏完成:', row ? '找到' : '未找到');
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
    
    console.log('执行插入:', sql, '参数:', params.map(p => typeof p === 'string' && p.length > 20 ? `${p.substring(0, 20)}...` : p));
    
    db.run(sql, params, function (err) {
      if (err) {
        console.error('添加游戏失败:', err.message);
        console.error('SQL语句:', sql);
        console.error('参数:', params);
        reject(err);
      } else {
        console.log('添加游戏成功，ID:', this.lastID);
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
    
    console.log('执行更新:', sql, '参数:', params.map(p => typeof p === 'string' && p.length > 20 ? `${p.substring(0, 20)}...` : p));
    
    db.run(sql, params, function (err) {
      if (err) {
        console.error('更新游戏失败:', err.message);
        console.error('SQL语句:', sql);
        console.error('参数:', params);
        reject(err);
      } else {
        console.log('更新游戏完成，影响行数:', this.changes);
        resolve({ changes: this.changes });
      }
    });
  });
};

// 删除游戏（软删除）
const deleteGame = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET is_maintained = 0 WHERE id = ?';
    console.log('执行软删除:', sql, '参数:', id);
    
    db.run(sql, [id], function (err) {
      if (err) {
        console.error('软删除游戏失败:', err.message);
        console.error('SQL语句:', sql, '参数:', id);
        reject(err);
      } else {
        console.log('软删除游戏完成，影响行数:', this.changes);
        resolve({ changes: this.changes });
      }
    });
  });
};

// 验证管理员
const validateAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    console.log('验证管理员:', sql, '参数:', username);
    
    db.get(sql, [username], (err, row) => {
      if (err) {
        console.error('查询管理员失败:', err.message);
        console.error('SQL语句:', sql, '参数:', username);
        reject(err);
      } else if (row) {
        bcrypt.compare(password, row.password_hash, (err, result) => {
          if (err) {
            console.error('密码验证失败:', err.message);
            reject(err);
          } else if (result) {
            console.log('管理员验证成功:', username);
            resolve({ id: row.id, username: row.username });
          } else {
            console.log('管理员密码错误:', username);
            resolve(null);
          }
        });
      } else {
        console.log('管理员不存在:', username);
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
        console.error('管理员密码哈希失败:', err.message);
        reject(err);
      } else {
        const sql = 'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)';
        console.log('创建管理员:', sql, '参数:', username);
        
        db.run(sql, [username, hash], function (err) {
          if (err) {
            console.error('创建管理员失败:', err.message);
            console.error('SQL语句:', sql);
            console.error('参数:', username);
            reject(err);
          } else {
            if (this.changes > 0) {
              console.log('管理员创建成功:', username, 'ID:', this.lastID);
              resolve({ id: this.lastID, username });
            } else {
              console.log('管理员已存在:', username);
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
    console.log('查询所有管理员:', sql);
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('查询所有管理员失败:', err.message);
        console.error('SQL语句:', sql);
        reject(err);
      } else {
        console.log('查询所有管理员成功，共', rows.length, '条记录');
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
      console.log('尝试删除当前登录的账户:', adminId);
      return reject(new Error('不能删除当前登录的账户'));
    }
    
    const sql = 'DELETE FROM admins WHERE id = ?';
    console.log('删除管理员:', sql, '参数:', adminId);
    
    db.run(sql, [adminId], function (err) {
      if (err) {
        console.error('删除管理员失败:', err.message);
        console.error('SQL语句:', sql, '参数:', adminId);
        reject(err);
      } else {
        console.log('删除管理员完成，影响行数:', this.changes);
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
    console.log('连接用户数据库:', userDbPath);
    
    const userDb = new sqlite3.Database(userDbPath, (err) => {
      if (err) {
        console.error('连接用户数据库失败:', err.message);
        return reject(err);
      }
      console.log('用户数据库连接成功');
    });
    
    const sql = 'SELECT id, username, email, created_at, is_active FROM users';
    console.log('查询所有用户:', sql);
    
    userDb.all(sql, [], (err, rows) => {
      if (err) {
        console.error('查询所有用户失败:', err.message);
        console.error('SQL语句:', sql);
        userDb.close();
        reject(err);
      } else {
        console.log('查询所有用户成功，共', rows.length, '条记录');
        userDb.close();
        resolve(rows);
      }
    });
  });
};

const initSampleData = () => {
  return new Promise((resolve, reject) => {
    // 检查是否已有数据
    db.get('SELECT COUNT(*) as count FROM games', (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      const count = row.count;
      console.log(`当前游戏数量: ${count}`);

      if (count > 0) {
        console.log('Sample data already exists.');
        resolve();
        return;
      }

      // 插入示例数据
      const sampleGames = [
        {
          name: '星之梦',
          alias: 'Stellaris',
          cover_link: 'https://example.com/cover1.jpg',
          game_address: 'https://galhub.example/star-nights',
          author: '猫薄荷工作室',
          is_commercial: true,
          is_repost: false
        },
        {
          name: '命运的抉择',
          alias: 'Fate: Decision',
          cover_link: 'https://example.com/cover2.jpg',
          game_address: 'https://galhub.example/fate-choice',
          author: '橙光游戏',
          is_commercial: false,
          is_repost: true
        },
        {
          name: '月影之谜',
          alias: 'Moon Shadow',
          cover_link: 'https://example.com/cover3.jpg',
          game_address: 'https://galhub.example/moon-shadow',
          author: '幻想组',
          is_commercial: false,
          is_repost: false
        }
      ];

      let completed = 0;
      let hasError = false;

      const insertSql = `INSERT INTO games 
        (name, alias, cover_link, game_address, author, is_commercial, is_repost, is_maintained) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      if (sampleGames.length === 0) {
        console.log('No sample games to insert.');
        resolve();
        return;
      }

      sampleGames.forEach(game => {
        if (hasError) return;

        const params = [
          game.name,
          game.alias,
          game.cover_link,
          game.game_address,
          game.author,
          game.is_commercial ? 1 : 0,
          game.is_repost ? 1 : 0,
          1 // is_maintained 默认为 true
        ];
        
        db.run(insertSql, params, (err) => {
          if (err) {
            if (!hasError) {
              hasError = true;
              reject(err);
            }
            return;
          }
          
          completed++;
          console.log(`Inserted game: ${game.name}`);
          
          if (completed === sampleGames.length) {
            console.log(`${sampleGames.length} sample games inserted successfully.`);
            resolve();
          }
        });
      });
    });
  });
};

// Export the database instance and functions
module.exports = {
  db, // Exported first for clarity
  initDb,
  initSampleData,
  getAllGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
  validateAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  getAllUsers
};

