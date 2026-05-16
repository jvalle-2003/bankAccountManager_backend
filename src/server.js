const app = require("./app");
const { sequelize } = require("./models"); 
const { createDefaultAdmin } = require("./utils/initialSetup");


const PORT = process.env.PORT || 3001;

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log("Connected to SQL Server");

    
    await sequelize.sync(); 
    console.log("Models synchronized successfully");

    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();