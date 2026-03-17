const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Importamos solo lo que existe
const bankRoutes = require("./routes/bank.routes");
const accountTypeRoutes = require("./routes/accountType.routes");
const bankAccountRoutes = require("./routes/bankAccount.routes");

// Usamos las rutas
app.use("/api/banks", bankRoutes);
app.use("/api/account-types", accountTypeRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);

app.get("/", (req, res) => {
    res.json({ message: "SISTEMA FUNCIONANDO" });
});

module.exports = app;
// Esta es la línea 24 o cerca, ya no hay Currency aquí.