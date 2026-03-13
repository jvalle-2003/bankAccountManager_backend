const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/category.routes");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// Permitir peticiones externas
app.use(cors());

// Leer JSON del body
app.use(express.json());

// Leer formularios
app.use(express.urlencoded({ extended: true }));


/* =========================
   RUTAS API
========================= */

app.use("/api/currencies", require("./routes/currency.routes"));

app.use("/api/permissions", require("./routes/permissions.routes")); // ← NUEVA LÍNEA
app.use("/api/reconciliations", require("./routes/reconciliations.routes"));
app.use("/api/balance-history", require("./routes/balanceHistory.routes"));
app.use("/api/role-permissions", require("./routes/rolePermissions.routes"));
app.use("/api/periods", require("./routes/periods.routes"));
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);


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