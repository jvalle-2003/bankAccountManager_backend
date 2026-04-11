const express = require("express");
const router = express.Router();
const controller = require("../controllers/balanceHistory.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

router.use(verifyToken);

// PRIMERO las rutas específicas
router.get("/balance/:account_id/:balance_date", controller.getBalanceByDate);

// DESPUÉS las rutas CRUD
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// Verificar rutas cargadas
console.log('Rutas de balance-history cargadas:', router.stack.map(r => r.route?.path));

module.exports = router;