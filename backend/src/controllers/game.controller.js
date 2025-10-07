const { body, query, validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const Game = require('../models/Game');
const UserRecentGame = require('../models/UserRecentGame');
const { authenticate } = require('../middleware/auth');

// Get all games with optional search and pagination
exports.getAllGames = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const offset = (page - 1) * limit;

      // Build where clause for search
      const whereClause = search 
        ? { 
            name: {
              [Sequelize.Op.like]: `%${search}%`
            }
          } 
        : {};

      const { count, rows } = await Game.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      res.json({
        games: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Get game by ID
exports.getGameById = [
  async (req, res) => {
    try {
      const gameId = req.params.id;
      
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Create a new game (admin only)
exports.createGame = [
  // Validation
  body('name').notEmpty().withMessage('Game name is required'),
  body('brief_description').optional().isString(),
  body('detailed_description').optional().isString(),
  body('game_link').optional().isURL().withMessage('Game link must be a valid URL'),
  body('cover_image_link').optional().isURL().withMessage('Cover image link must be a valid URL'),
  body('tag1').optional().isString(),
  body('tag2').optional().isString(),
  body('tag3').optional().isString(),
  body('tag4').optional().isString(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const gameData = {
        name: req.body.name,
        brief_description: req.body.brief_description,
        detailed_description: req.body.detailed_description,
        game_link: req.body.game_link,
        cover_image_link: req.body.cover_image_link,
        tag1: req.body.tag1,
        tag2: req.body.tag2,
        tag3: req.body.tag3,
        tag4: req.body.tag4
      };

      const game = await Game.create(gameData);
      
      res.status(201).json({
        message: 'Game created successfully',
        game
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Update a game (admin only)
exports.updateGame = [
  async (req, res) => {
    try {
      const gameId = req.params.id;
      
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      // Update game fields if provided
      const updateFields = [
        'name', 'brief_description', 'detailed_description', 
        'game_link', 'cover_image_link', 'tag1', 'tag2', 'tag3', 'tag4'
      ];

      updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
          game[field] = req.body[field];
        }
      });

      await game.save();

      res.json({
        message: 'Game updated successfully',
        game
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Delete a game (admin only)
exports.deleteGame = [
  async (req, res) => {
    try {
      const gameId = req.params.id;
      
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      await game.destroy();

      res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Add game to user's recent games
exports.addRecentGame = [
  authenticate,

  async (req, res) => {
    try {
      const uid = req.user.uid;
      const gameId = req.params.gameId;

      // Check if game exists
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      // Check if the game is already in user's recent games
      const existingRecord = await UserRecentGame.findOne({
        where: { uid, game_id: gameId }
      });

      if (existingRecord) {
        // Update the played_at timestamp
        existingRecord.played_at = new Date();
        await existingRecord.save();
      } else {
        // Add new record
        await UserRecentGame.create({
          uid,
          game_id: gameId,
          played_at: new Date()
        });
      }

      res.json({ message: 'Game added to recent games' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Get user's recent games
exports.getUserRecentGames = [
  authenticate,

  async (req, res) => {
    try {
      const uid = req.user.uid;

      const recentGames = await UserRecentGame.findAll({
        where: { uid },
        include: [{
          model: Game,
          as: 'game',
          attributes: ['id', 'name', 'brief_description', 'cover_image_link', 'tag1', 'tag2', 'tag3', 'tag4']
        }],
        order: [['played_at', 'DESC']],
        limit: 32
      });

      // Extract game data from the join
      const games = recentGames.map(record => record.Game);

      res.json({
        games
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];