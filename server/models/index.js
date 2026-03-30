const sequelize = require('../config/db');
const User = require('./User');
const Resume = require('./Resume');
const Report = require('./Report');

// Synchronize all models
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created/synced!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

module.exports = {
  User,
  Resume,
  Report,
  sequelize
};
