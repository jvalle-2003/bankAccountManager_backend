const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");
//const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
//router.use(verifyToken);

// Acción de negocio: cancelar transacción
router.patch("/:id/cancel",  controller.cancel);
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id",  controller.findOne);
router.put("/:id",  controller.update);


module.exports = router;