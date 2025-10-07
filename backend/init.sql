-- 创建数据库
CREATE DATABASE IF NOT EXISTS galhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE galhub;

-- 管理员账户表
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE users (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 游戏表
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brief_description TEXT,
    detailed_description TEXT,
    game_link VARCHAR(255),
    cover_image_link VARCHAR(255),
    tag1 VARCHAR(50),
    tag2 VARCHAR(50),
    tag3 VARCHAR(50),
    tag4 VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户最近游玩游戏表
CREATE TABLE user_recent_games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    game_id INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_game (uid, game_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_recent_games_uid ON user_recent_games(uid);
CREATE INDEX idx_user_recent_games_played_at ON user_recent_games(played_at);
CREATE INDEX idx_games_name ON games(name);

-- 插入示例数据
INSERT INTO admins (username, password) VALUES 
('admin', '$2b$10$example_hashed_password');

INSERT INTO users (username, password) VALUES 
('testuser', '$2b$10$example_hashed_password');

INSERT INTO games (name, brief_description, detailed_description, game_link, cover_image_link, tag1, tag2, tag3, tag4) VALUES 
('示例游戏1', '这是一款有趣的冒险游戏', '详细描述：这是一款非常有趣的冒险游戏，玩家可以在广阔的世界中探索，完成各种任务和挑战。', 'https://example.com/game1', 'https://example.com/cover1.jpg', '冒险', 'RPG', '开放世界', '单人'),
('示例游戏2', '这是一款刺激的动作游戏', '详细描述：这是一款快节奏的动作游戏，拥有精美的画面和流畅的操作体验。', 'https://example.com/game2', 'https://example.com/cover2.jpg', '动作', '射击', '多人', '竞技');