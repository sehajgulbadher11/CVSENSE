const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extractedText: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  freezeTableName: true,
  tableName: 'Resumes'
});

Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });

module.exports = Resume;
