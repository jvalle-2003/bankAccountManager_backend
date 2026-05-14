const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/category.routes");
const transactionRoutes = require("./routes/transaction.routes");
const bankAccountRoutes = require("./routes/bankAccount.routes");
const accountTypeRoutes = require("./routes/accountType.routes");
const bankRoutes = require("./routes/bank.routes");
const dashboardRoutes = require("./routes/dashboardRoutes");

//const statementRoutes = require('./routes/statementRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   RUTAS API
========================= */

app.use("/api/currencies", require("./routes/currency.routes"));
app.use("/api/roles", require("./routes/role.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/audits", require("./routes/audit.routes"));
app.use("/api/permissions", require("./routes/permissions.routes"));
app.use("/api/reconciliations", require("./routes/reconciliations.routes"));
app.use("/api/balance-history", require("./routes/balanceHistory.routes"));
app.use("/api/role-permissions", require("./routes/rolePermissions.routes"));
app.use("/api/periods", require("./routes/periods.routes"));
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/account-types", accountTypeRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use('/api/statements', require('./routes/statements'));


app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/dashboard", dashboardRoutes);
//app.use('/api/statements', statementRoutes);
app.use('/api/ocr', ocrRoutes);

/* =========================
   RUTA TEST
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Server running successfully"
  });
});

/* =========================
   MANEJO DE ERRORES 404
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "route not found"
  });
});

module.exports = app;