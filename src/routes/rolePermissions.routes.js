const express = require("express");
const router = express.Router();
const controller = require("../controllers/rolePermissions.controller");

// Asignar permiso a rol
router.post("/", controller.create);

// Obtener todas las asignaciones
router.get("/", controller.findAll);

// Obtener asignaciones por rol
router.get("/role/:roleId", controller.findByRole);

// Obtener asignaciones por permiso
router.get("/permission/:permissionId", controller.findByPermission);

// Eliminar una asignación específica
router.delete("/role/:roleId/permission/:permissionId", controller.delete);

module.exports = router;