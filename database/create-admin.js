const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'games.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Database path:', dbPath);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database.');
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
  console.log(`未提供用户名和密码，使用默认值: ${username}/${password}`);
}

// 创建管理员账户
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err.message);
    console.error('Password:', password ? `${password.substring(0, 3)}***` : 'undefined');
    db.close();
    process.exit(1);
  } else {
    const sql = 'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)';
    db.run(sql, [username, hash], function(err) {
      if (err) {
        console.error('Error creating admin:', err.message);
        console.error('SQL statement:', sql);
        console.error('Username:', username);
        db.close();
        process.exit(1);
      } else {
        if (this.changes > 0) {
          console.log(`Admin account created successfully: ${username}`);
        } else {
          console.log(`Admin account already exists: ${username}`);
        }
        db.close();
      }
    });
  }
});