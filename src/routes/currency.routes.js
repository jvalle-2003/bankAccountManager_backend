const express = require("express");
const router = express.Router();
const controller = require("../controllers/currency.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

      
router.post("/",verifyToken, controller.create);
router.get("/",  verifyToken,controller.findAll);
router.get("/:id", verifyToken, controller.findOne);
router.put("/:id",  verifyToken, controller.update);          // editar datos
router.patch("/:id/toggle",verifyToken, controller.toggleState); // activar/desactivar

module.exports = router;