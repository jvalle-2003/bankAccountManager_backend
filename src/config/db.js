const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: "mssql",
    server: process.env.DB_HOST || 'localhost',  // ← CAMBIA host → server
    port: parseInt(process.env.DB_PORT) || 1433,
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'proyecto_GESBANCA',
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    },
    logging: false
});

module.exports = sequelize;