const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'games.db');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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
    console.log('Connected to the SQLite database.');
  }
});

// 创建游戏表
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
      console.error('Error creating games table:', err.message);
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
      console.error('Error creating admins table:', err.message);
    } else {
      console.log('Admins table created or already exists.');
    }
  });
});

// 插入一些示例数据
const sampleGames = [
  {
    name: "命运石之门",
    alias: "Steins;Gate",
    cover_link: "img/steinsgate.jpg",
    game_address: "/games/steinsgate",
    author: "5pb.",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  },
  {
    name: "潜龙谍影",
    alias: "Metal Gear Solid",
    cover_link: "img/mgs.jpg",
    game_address: "/games/mgs",
    author: "小岛秀夫",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  },
  {
    name: "尼尔：机械纪元",
    alias: "NieR: Automata",
    cover_link: "img/nier.jpg",
    game_address: "/games/nier",
    author: "横尾太郎",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  },
  {
    name: "最终幻想VII",
    alias: "Final Fantasy VII",
    cover_link: "img/ffvii.jpg",
    game_address: "/games/ffvii",
    author: "史克威尔",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  },
  {
    name: "女神异闻录5",
    alias: "Persona 5",
    cover_link: "img/p5.jpg",
    game_address: "/games/p5",
    author: " ATLUS",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  },
  {
    name: "巫师3：狂猎",
    alias: "The Witcher 3: Wild Hunt",
    cover_link: "img/witcher3.jpg",
    game_address: "/games/witcher3",
    author: "CD Projekt RED",
    is_commercial: 1,
    is_repost: 0,
    is_maintained: 1
  }
];

// 默认管理员账户信息
const defaultAdmin = {
  username: "admin",
  password: "admin123"
};

db.serialize(() => {
  const stmt = db.prepare(`INSERT OR IGNORE INTO games 
    (name, alias, cover_link, game_address, author, is_commercial, is_repost, is_maintained) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  
  sampleGames.forEach(game => {
    stmt.run([
      game.name,
      game.alias,
      game.cover_link,
      game.game_address,
      game.author,
      game.is_commercial ? 1 : 0,
      game.is_repost ? 1 : 0,
      game.is_maintained ? 1 : 0
    ]);
  });
  
  stmt.finalize();
  
  // 创建默认管理员账户
  bcrypt.hash(defaultAdmin.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing default admin password:', err.message);
    } else {
      const adminStmt = db.prepare('INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)');
      adminStmt.run([defaultAdmin.username, hash], function(err) {
        if (err) {
          console.error('Error creating default admin:', err.message);
        } else {
          if (this.changes > 0) {
            console.log(`Default admin account created: ${defaultAdmin.username}/${defaultAdmin.password}`);
          } else {
            console.log('Default admin account already exists');
          }
        }
      });
      adminStmt.finalize();
    }
  });
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});