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
  // 记录请求信息
  console.log('游戏认证中间件启动:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // 提取令牌
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('认证中间件: 请求URL:', req.url);
  console.log('认证中间件: Authorization头:', authHeader ? `${authHeader.substring(0, 20)}...` : null);
  console.log('认证中间件: 提取的令牌:', token ? `${token.substring(0, 10)}...` : '无');
  
  if (!token) {
    console.log('认证失败：访问令牌缺失', {
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({ success: false, message: '访问令牌缺失' });
  }

  // 验证令牌
  const jwt = require('jsonwebtoken');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('游戏令牌验证失败:', err);
      console.error('游戏令牌验证错误详情:', {
        name: err.name,
        message: err.message,
        expiredAt: err.expiredAt
      });
      
      return res.status(403).json({ 
        success: false, 
        message: '访问令牌无效' 
      });
    }
    
    console.log('游戏令牌验证成功，用户信息:', {
      id: user.id,
      username: user.username
    });
    req.user = user;
    next();
  });
};

// API路由：获取所有游戏（公开访问）
router.get('/', async (req, res) => {
  try {
    console.log('收到获取所有游戏请求');
    
    const games = await getAllGames();
    console.log('获取游戏列表成功，共', games.length, '条记录');
    
    res.json({
      success: true,
      data: games,
      count: games.length
    });
  } catch (err) {
    console.error('Error fetching games:', err);
    console.error('获取游戏列表错误详情:', {
      message: err.message,
      stack: err.stack
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message,
        stack: err.stack
      } : {})
    });
  }
});

// API路由：根据ID获取游戏（公开访问）
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    console.log('收到获取游戏详情请求:', {
      gameId: id
    });
    
    const game = await getGameById(id);
    
    if (game) {
      console.log('获取游戏详情成功:', {
        gameId: id,
        gameName: game.name
      });
      
      res.json({
        success: true,
        data: game
      });
    } else {
      console.log('游戏未找到:', id);
      res.status(404).json({ 
        success: false,
        error: 'Game not found' 
      });
    }
  } catch (err) {
    console.error('Error fetching game:', err);
    console.error('获取游戏详情错误详情:', {
      message: err.message,
      stack: err.stack,
      gameId: req.params.id
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message,
        stack: err.stack
      } : {})
    });
  }
});

// API路由：添加新游戏（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const game = req.body;
    
    console.log('收到添加游戏请求:', {
      requester: req.user?.username,
      gameName: game?.name ? `${game.name.substring(0, 10)}...` : null
    });
    
    const result = await addGame(game);
    
    console.log('游戏添加成功:', {
      gameId: result?.id,
      gameName: game?.name,
      requester: req.user?.username
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Game added successfully',
      id: result.id 
    });
  } catch (err) {
    console.error('Error adding game:', err);
    console.error('添加游戏错误详情:', {
      message: err.message,
      stack: err.stack,
      game: req.body,
      requester: req.user?.username
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message,
        stack: err.stack
      } : {})
    });
  }
});

// API路由：更新游戏（需要认证）
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const game = req.body;
    
    console.log('收到更新游戏请求:', {
      gameId: id,
      requester: req.user?.username,
      gameName: game?.name ? `${game.name.substring(0, 10)}...` : null
    });
    
    const result = await updateGame(id, game);
    
    if (result.changes > 0) {
      console.log('游戏更新成功:', {
        gameId: id,
        gameName: game?.name,
        requester: req.user?.username
      });
      
      res.json({ 
        success: true,
        message: 'Game updated successfully' 
      });
    } else {
      console.log('游戏未找到:', id);
      res.status(404).json({ 
        success: false,
        error: 'Game not found' 
      });
    }
  } catch (err) {
    console.error('Error updating game:', err);
    console.error('更新游戏错误详情:', {
      message: err.message,
      stack: err.stack,
      gameId: req.params.id,
      game: req.body,
      requester: req.user?.username
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message,
        stack: err.stack
      } : {})
    });
  }
});

// API路由：删除游戏（软删除）（需要认证）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    
    console.log('收到删除游戏请求:', {
      gameId: id,
      requester: req.user?.username
    });
    
    const result = await deleteGame(id);
    
    if (result.changes > 0) {
      console.log('游戏删除成功:', {
        gameId: id,
        requester: req.user?.username
      });
      
      res.json({ 
        success: true,
        message: 'Game deleted successfully' 
      });
    } else {
      console.log('游戏未找到:', id);
      res.status(404).json({ 
        success: false,
        error: 'Game not found' 
      });
    }
  } catch (err) {
    console.error('Error deleting game:', err);
    console.error('删除游戏错误详情:', {
      message: err.message,
      stack: err.stack,
      gameId: req.params.id,
      requester: req.user?.username
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { 
        details: err.message,
        stack: err.stack
      } : {})
    });
  }
});

module.exports = router;

// 单独导出中间件，以便在其他地方使用
module.exports.authenticateToken = authenticateToken;
