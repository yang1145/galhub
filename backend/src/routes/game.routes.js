const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

// Public routes
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);

// User routes (require authentication)
router.post('/recent/:gameId', gameController.addRecentGame);
router.get('/recent/user', gameController.getUserRecentGames);

// Admin routes would typically be protected by an admin middleware
// For simplicity, we're not implementing admin middleware in this example
// In a production app, you would add admin authentication middleware to these routes
router.post('/', gameController.createGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

module.exports = router;