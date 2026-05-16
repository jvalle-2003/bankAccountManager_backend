const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);
router.get("/:id", verifyToken, controller.findOne);
router.put("/:id", verifyToken, controller.update);          // actualizar datos
router.patch("/:id/toggle", verifyToken, controller.toggleActive); // activar/desactivar

module.exports = router;