const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// ==========================================
// RUTAS PÚBLICAS (no requieren token)
// ==========================================
router.post("/register", controller.register);  // Registro público
router.post("/confirm", controller.confirm);    // Confirmar token

// ==========================================
// RUTAS PROTEGIDAS (requieren token y permisos)
// ==========================================

// Aplicar middleware de autenticación a todas las rutas debajo
router.use(verifyToken);

// Rutas CRUD con permisos
router.post("/", checkPermission('CREAR_USUARIO'), controller.create);
router.get("/", checkPermission('VER_USUARIOS'), controller.findAll);
router.get("/:id", checkPermission('VER_USUARIOS'), controller.findOne);
router.put("/:id", checkPermission('EDITAR_USUARIO'), controller.update);
router.delete("/:id", checkPermission('ELIMINAR_USUARIO'), controller.delete);

module.exports = router;