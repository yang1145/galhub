const express = require('express');
const { 
  getAllGames, 
  getGameById, 
  addGame, 
  updateGame, 
  deleteGame
} = require('../database/db');

// 创建路由实例
const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'galhub_secret_key';

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  // 提取令牌
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('认证失败：访问令牌缺失');
    return res.status(401).json({ success: false, message: '访问令牌缺失' });
  }

  // 验证令牌
  const jwt = require('jsonwebtoken');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('令牌验证失败:', err);
      return res.status(403).json({ 
        success: false, 
        message: '访问令牌无效' 
      });
    }
    
    req.user = user;
    next();
  });
};

// API路由：获取所有游戏（公开访问）
router.get('/', async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：根据ID获取游戏（公开访问）
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const game = await getGameById(id);
    
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：添加新游戏（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const game = req.body;
    const result = await addGame(game);
    res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：更新游戏（需要认证）
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const game = req.body;
    const result = await updateGame(id, game);
    
    if (result.changes > 0) {
      res.json({ message: 'Game updated successfully' });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API路由：删除游戏（软删除）（需要认证）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteGame(id);
    
    if (result.changes > 0) {
      res.json({ message: 'Game deleted successfully' });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// 单独导出中间件，以便在其他地方使用
module.exports.authenticateToken = authenticateToken;
