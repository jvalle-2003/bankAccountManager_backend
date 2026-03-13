const { Sequelize } = require("sequelize");
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

console.log("📌 DB_SERVER desde .env:", process.env.DB_SERVER);
console.log("📌 DB_USER desde .env:", process.env.DB_USER);
console.log("📌 DB_PASSWORD desde .env:", process.env.DB_PASSWORD);
console.log("📌 DB_DATABASE desde .env:", process.env.DB_DATABASE);

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectModule: require("tedious"),
    logging: false,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  }
);

module.exports = sequelize;