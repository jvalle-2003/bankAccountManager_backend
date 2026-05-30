const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { verifyToken , isAdmin } = require("../middlewares/auth.middleware");

router.post("/setup-password", controller.setupPassword);
router.post("/forgot-password", controller.forgotPassword);

//RUTAS PUBLICAS
router.get("/", verifyToken, controller.findAll);            
router.get("/report/export", verifyToken, controller.exportReport);
router.get("/:id", verifyToken, controller.findOne);     

//RUTAS PROTEGIDAS
router.post("/", verifyToken, controller.create);  
router.put("/:id", verifyToken, controller.update);    
router.delete("/:id", verifyToken, controller.delete);       

module.exports = router;