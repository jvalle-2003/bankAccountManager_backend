const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

// Rutas CRUD normales
router.post("/", controller.create);           // Crear usuario (admin)
router.get("/", controller.findAll);            // Listar todos
router.get("/:id", controller.findOne);         // Obtener uno
router.put("/:id", controller.update);          // Actualizar
router.delete("/:id", controller.delete);       // Eliminar

// NUEVAS RUTAS PARA REGISTRO Y CONFIRMACIÓN
router.post("/register", controller.register);  // Registro público (con token)
router.post("/confirm", controller.confirm);    // Confirmar token

module.exports = router;