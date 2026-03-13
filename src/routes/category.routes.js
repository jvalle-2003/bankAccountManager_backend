const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);

router.put("/:id", controller.update);          // actualizar datos
router.patch("/:id/toggle", controller.toggleActive); // activar/desactivar

module.exports = router;