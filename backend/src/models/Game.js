const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  brief_description: {
    type: DataTypes.TEXT
  },
  detailed_description: {
    type: DataTypes.TEXT
  },
  game_link: {
    type: DataTypes.STRING(255)
  },
  cover_image_link: {
    type: DataTypes.STRING(255)
  },
  tag1: {
    type: DataTypes.STRING(50)
  },
  tag2: {
    type: DataTypes.STRING(50)
  },
  tag3: {
    type: DataTypes.STRING(50)
  },
  tag4: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'games',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Game;