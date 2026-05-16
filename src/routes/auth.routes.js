const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const authController = require('../controllers/auth.controller');

router.post("/login", controller.login);
router.post("/logout", authController.logout);

module.exports = router;