const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Hash password before saving
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

// Compare password method
Admin.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Admin;