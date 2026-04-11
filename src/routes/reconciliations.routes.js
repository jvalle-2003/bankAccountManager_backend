const express = require("express");
const router = express.Router();
const controller = require("../controllers/reconciliations.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas con permisos específicos
router.post("/", checkPermission('CREAR_CONCILIACION'), controller.create);
router.get("/", checkPermission('VER_CONCILIACIONES'), controller.findAll);
router.get("/:id", checkPermission('VER_CONCILIACIONES'), controller.findOne);
router.put("/:id", checkPermission('EDITAR_CONCILIACION'), controller.update);
router.delete("/:id", checkPermission('ELIMINAR_CONCILIACION'), controller.delete);

module.exports = router;