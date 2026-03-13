const express = require("express");
const cors = require("cors");

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
app.use("/api/roles", require("./routes/role.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/audits", require("./routes/audit.routes"));



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