const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 设置静态文件目录
app.use(express.static('.'));

// API 端点：获取游戏列表
app.get('/api/games', (req, res) => {
    const gamesDir = path.join(__dirname, 'games');
    
    // 检查 games 目录是否存在
    if (!fs.existsSync(gamesDir)) {
        return res.json([]);
    }
    
    // 读取 games 目录中的所有子目录
    fs.readdir(gamesDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('读取 games 目录时出错:', err);
            return res.status(500).json({ error: '无法读取游戏目录' });
        }
        
        // 过滤出目录（游戏文件夹）
        const gameDirs = files.filter(file => file.isDirectory());
        
        // 为每个游戏目录创建游戏对象
        const games = gameDirs.map(dir => {
            const gameName = dir.name;
            const gamePath = path.join('games', gameName, 'index.html');
            const imagePath = path.join('games', gameName, 'title.jpg');
            
            return {
                name: gameName,
                path: gamePath,
                image: fs.existsSync(path.join(__dirname, imagePath)) ? imagePath : 'https://via.placeholder.com/600x400?text=No+Image'
            };
        });
        
        res.json(games);
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行: http://localhost:${PORT}`);
});