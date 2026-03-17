const app = require("./app");
const { sequelize } = require("./models"); 

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Verificar conexión
    await sequelize.authenticate();
    console.log("✅ Connected to SQL Server");

    // 2. Sincronización Segura
    // Quitamos { alter: true } para evitar el error de sintaxis "DEFAULT" en SQL Server.
    // .sync() sin parámetros creará las tablas si NO existen, pero respetará las actuales.
    await sequelize.sync(); 
    console.log("✅ Models synchronized successfully");

    // 3. Iniciar Servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

startServer();