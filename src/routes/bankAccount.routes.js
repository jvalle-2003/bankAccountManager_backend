const express = require("express");
const router = express.Router();
// Importamos el controlador correcto
const controller = require("../controllers/bankAccount.controller");

// Definición de rutas para Cuentas Bancarias
router.post("/", controller.create);           // Crear cuenta
router.get("/", controller.findAll);          // Obtener todas
router.get("/:id", controller.findOne);       // Obtener una por ID
router.put("/:id", controller.update);        // Actualizar
router.delete("/:id", controller.delete);     // Desactivar/Borrar

module.exports = router;