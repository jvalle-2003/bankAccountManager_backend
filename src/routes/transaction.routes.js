const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas CRUD con permisos
router.post("/", checkPermission('CREAR_TRANSACCION'), controller.create);
router.get("/", checkPermission('VER_TRANSACCIONES'), controller.findAll);
router.get("/:id", checkPermission('VER_TRANSACCIONES'), controller.findOne);
router.put("/:id", checkPermission('EDITAR_TRANSACCION'), controller.update);

// Acción de negocio: cancelar transacción
router.patch("/:id/cancel", checkPermission('CANCELAR_TRANSACCION'), controller.cancel);

module.exports = router;