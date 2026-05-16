const express = require("express");
const router = express.Router();
const controller = require("../controllers/reconciliations.controller");
const multer = require("multer");



const upload = multer ({
    dest: "uploads/"
});


router.post(
    "/analyze",
    upload.single("file"),
    controller.analizarEstadoCuenta
);



//const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
//router.use(verifyToken);

// Rutas con permisos específicos
router.post("/",  controller.create);
router.get("/",  controller.findAll);
router.get("/:id",  controller.findOne);
router.put("/:id",  controller.update);
router.delete("/:id", controller.delete);

module.exports = router;