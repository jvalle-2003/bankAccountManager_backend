const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");
const { verifyToken } = require("../middlewares/auth.middleware");


// Acción de negocio: cancelar transacción
router.patch("/:id/cancel", verifyToken, controller.cancel);
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);
router.get("/:id", verifyToken,  controller.findOne);
router.put("/:id", verifyToken,  controller.update);


module.exports = router;