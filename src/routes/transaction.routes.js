const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);

// acciones del negocio
router.patch("/:id/cancel", controller.cancel);

module.exports = router;