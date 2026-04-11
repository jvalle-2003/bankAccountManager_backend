const express = require("express");
const router = express.Router();
const controller = require("../controllers/audit.controller");

// SOLO LECTURA
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);

module.exports = router;