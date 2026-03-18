const app = require("./app");
const { sequelize } = require("./models"); 

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log("Connected to SQL Server");


    await sequelize.sync(); 
    console.log("Models synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();