const express = require("express");
const router = express.Router();
const controller = require("../controllers/currency.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);

router.put("/:id", controller.update);          // editar datos
router.patch("/:id/toggle", controller.toggleState); // activar/desactivar

module.exports = router;