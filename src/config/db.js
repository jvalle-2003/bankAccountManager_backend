const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        dialect: "mssql",
        timezone: '-06:00', // Zona horaria de SQL Server, importante para que los triggers guarden la hora correcta en la auditoría
        port: 1433,
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
                useUTC: true //Zona horaria de SQL Server, importante para que los triggers guarden la hora correcta en la auditoría
            }
        },
        logging: false,
        define:{
            hasTrigger: true
        }
    }
);

module.exports = sequelize;