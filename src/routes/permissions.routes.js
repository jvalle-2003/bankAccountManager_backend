const express = require("express");
const router = express.Router();
const controller = require("../controllers/permissions.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

//RUTAS PUBLICAS
router.get("/", verifyToken, controller.findAll);
router.get("/:id", verifyToken, controller.findOne);

//RUTAS PROTEGIDAS SOLO PARA ADMINISTRADORES
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;