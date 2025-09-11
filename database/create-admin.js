const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { info, error } = require('../log');

const dbPath = path.join(__dirname, 'games.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    error('打开数据库时出错:', {
      message: err.message,
      databasePath: dbPath
    });
    process.exit(1);
  } else {
    info('已连接到SQLite数据库', { databasePath: dbPath });
  }
});

// 从命令行参数获取用户名和密码
const args = process.argv.slice(2);
let username, password;

if (args.length >= 2) {
  username = args[0];
  password = args[1];
} else {
  // 使用默认值
  username = 'admin';
  password = 'admin123';
  info(`未提供用户名和密码，使用默认值: ${username}/${password}`);
}

// 创建管理员账户
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    error('密码哈希处理出错:', {
      message: err.message,
      password: password ? `${password.substring(0, 3)}***` : '未定义'
    });
    db.close();
    process.exit(1);
  } else {
    const sql = 'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)';
    db.run(sql, [username, hash], function(err) {
      if (err) {
        error('创建管理员时出错:', {
          message: err.message,
          sql: sql,
          username: username
        });
        db.close();
        process.exit(1);
      } else {
        if (this.changes > 0) {
          info(`管理员账户创建成功: ${username}`);
        } else {
          info(`管理员账户已存在: ${username}`);
        }
        db.close();
      }
    });
  }
});