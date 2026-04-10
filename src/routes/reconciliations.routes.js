const express = require("express");
const router = express.Router();
const controller = require("../controllers/reconciliations.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ⚠️ TEMPORAL: CheckPermissions comentados para pruebas
// Todos los usuarios autenticados pueden hacer todo

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// ORIGINAL (con permisos):
// router.post("/", checkPermission('CREAR_CONCILIACION'), controller.create);
// router.get("/", checkPermission('VER_CONCILIACIONES'), controller.findAll);
// router.get("/:id", checkPermission('VER_CONCILIACIONES'), controller.findOne);
// router.put("/:id", checkPermission('EDITAR_CONCILIACION'), controller.update);
// router.delete("/:id", checkPermission('ELIMINAR_CONCILIACION'), controller.delete);

module.exports = router;