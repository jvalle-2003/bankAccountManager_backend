const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        dialect: "mssql",
        timezone: '-06:00', 
        port: 1433,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            options: {
                encrypt: false,
                trustServerCertificate: true,
                useUTC: false, 
            }
        },
        logging: false,
        define:{
            hasTrigger: true
        }
    }
);
module.exports = sequelize;