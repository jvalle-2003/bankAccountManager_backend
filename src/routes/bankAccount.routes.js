const express = require("express");
const router = express.Router();
// Importamos el controlador correcto
const controller = require("../controllers/bankAccount.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken; // Asegúrate de importar el middleware de autenticación

// Definición de rutas para Cuentas Bancarias
router.post("/",verifyToken, controller.create);           // Crear cuenta
router.get("/", verifyToken, controller.findAll);          // Obtener todas
router.get("/:id",verifyToken, controller.findOne);       // Obtener una por ID
router.put("/:id", verifyToken, controller.update);        // Actualizar
router.delete("/:id", verifyToken, controller.delete);     // Desactivar/Borrar

module.exports = router;