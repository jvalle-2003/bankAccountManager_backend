const express = require("express");
const router = express.Router();
const controller = require("../controllers/accountType.controller");
const { verifyToken } = require("../middlewares/auth.middleware"); 

router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);
router.get("/:id",verifyToken, controller.findOne);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;