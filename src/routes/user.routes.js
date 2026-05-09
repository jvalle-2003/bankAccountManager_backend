const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

const { verifyToken } = require("../middlewares/auth.middleware");


router.post("/", verifyToken, controller.create);          
router.get("/", verifyToken, controller.findAll);            

router.get("/report/export", verifyToken, controller.exportReport);

router.get("/:id", verifyToken, controller.findOne);        
router.put("/:id", verifyToken, controller.update); // <-- ¡Esta es la que fallaba en tu frontend!      
router.delete("/:id", verifyToken, controller.delete);       


router.post("/register", controller.register);  
router.post("/confirm", controller.confirm);    

module.exports = router;