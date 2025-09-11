const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');
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
    console.error('Database path:', dbPath);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite user database.');
  }
});

// 创建用户表
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
      console.error('SQL statement:', `CREATE TABLE IF NOT EXISTS users (...)`);
      process.exit(1);
    } else {
      console.log('Users table created or already exists.');
    }
  });
  
  // 创建用户游戏历史表
  db.run(`CREATE TABLE IF NOT EXISTS user_game_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    UNIQUE(user_id, game_id)
  )`, (err) => {
    if (err) {
      console.error('Error creating user game history table:', err.message);
      console.error('SQL statement:', `CREATE TABLE IF NOT EXISTS user_game_history (...)`);
      process.exit(1);
    } else {
      console.log('User game history table created or already exists.');
    }
    
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      } else {
        console.log('User database initialized and connection closed.');
      }
    });
  });
});