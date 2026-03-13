const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Verificar conexión a la BD
    await sequelize.authenticate();
    console.log("Connected to SQL Server");

    // Crear tablas SOLO si no existen
    await sequelize.sync(); // usar alter o force si se modifican modelos
    console.log("Syncronized models");

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`Server running in port: ${PORT} `);
    });

  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}

startServer();