const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'games.db');
const bcrypt = require('bcryptjs');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
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
          reject(err);
        } else {
          console.log('Admins table created or already exists.');
          resolve();
        }
      });
    });
  });
};

// 获取所有游戏
const getAllGames = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE is_maintained = 1';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 根据ID获取游戏
const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// 添加新游戏
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
    
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

// 更新游戏信息
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
    
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

// 删除游戏（软删除，设置为非维护状态）
const deleteGame = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET is_maintained = 0 WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

// 管理员登录验证
const validateAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, password_hash FROM admins WHERE username = ?';
    db.get(sql, [username], async (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        try {
          const isValid = await bcrypt.compare(password, row.password_hash);
          if (isValid) {
            resolve({ id: row.id, username: row.username });
          } else {
            resolve(null);
          }
        } catch (bcryptErr) {
          reject(bcryptErr);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// 创建管理员账户
const createAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        const sql = 'INSERT INTO admins (username, password_hash) VALUES (?, ?)';
        db.run(sql, [username, hash], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username });
          }
        });
      }
    });
  });
};

// 获取所有管理员账户
const getAllAdmins = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, created_at FROM admins';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 删除管理员账户
const deleteAdmin = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM admins WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

const initSampleData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // 检查是否已有数据
      const count = await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM games', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      });

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

      const insertSql = `INSERT INTO games 
        (name, alias, cover_link, game_address, author, is_commercial, is_repost, is_maintained) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.serialize(() => {
        sampleGames.forEach(game => {
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
              reject(err);
              return;
            }
          });
        });
        
        console.log(`${sampleGames.length} sample games inserted successfully.`);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
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
  db
};