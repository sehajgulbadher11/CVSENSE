const sequelize = require('./server/config/db');

async function listDatabases() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SHOW DATABASES");
    console.log("Databases on server:", JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

listDatabases();
