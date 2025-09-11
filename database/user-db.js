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
  }
});

// 初始化用户数据库
const initUserDb = () => {
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
          resolve();
        }
      });
    });
  });
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

// 获取所有用户
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, email, created_at, is_active FROM users', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
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
  getAllUsers,
  closeUserDb
};