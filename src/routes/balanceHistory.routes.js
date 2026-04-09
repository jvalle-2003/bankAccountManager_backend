const express = require("express");
const router = express.Router();
const controller = require("../controllers/balanceHistory.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas CRUD normales
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// NUEVA RUTA: Consultar saldo por fecha
router.get("/balance/:account_id/:balance_date", controller.getBalanceByDate);

module.exports = router;