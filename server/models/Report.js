const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Resume = require('./Resume');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  resumeId: {
    type: DataTypes.INTEGER,
    references: {
      model: Resume,
      key: 'id'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matchedSkills: {
    type: DataTypes.JSON, 
    allowNull: false,
  },
  missingSkills: {
    type: DataTypes.JSON, 
    allowNull: false,
  },
  suggestions: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
});

Report.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });
Resume.hasMany(Report, { foreignKey: 'resumeId', as: 'reports' });

module.exports = Report;
