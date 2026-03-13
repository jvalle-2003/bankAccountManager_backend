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