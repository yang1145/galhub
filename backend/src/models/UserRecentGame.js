const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Game = require('./Game');

const UserRecentGame = sequelize.define('UserRecentGame', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'uid'
    }
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id'
    }
  },
  played_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_recent_games',
  timestamps: false
});

// Associations
User.belongsToMany(Game, {
  through: UserRecentGame,
  foreignKey: 'uid',
  otherKey: 'game_id',
  as: 'recentGames'
});

Game.belongsToMany(User, {
  through: UserRecentGame,
  foreignKey: 'game_id',
  otherKey: 'uid',
  as: 'recentPlayers'
});

// Add a hook to limit recent games to 32 per user
UserRecentGame.addHook('afterCreate', async (userRecentGame) => {
  const recentGamesCount = await UserRecentGame.count({
    where: { uid: userRecentGame.uid }
  });

  // If user has more than 32 recent games, remove the oldest one
  if (recentGamesCount > 32) {
    const oldestGame = await UserRecentGame.findOne({
      where: { uid: userRecentGame.uid },
      order: [['played_at', 'ASC']]
    });

    if (oldestGame) {
      await oldestGame.destroy();
    }
  }
});

// Define association for include in controller
UserRecentGame.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'Game'
});

module.exports = UserRecentGame;