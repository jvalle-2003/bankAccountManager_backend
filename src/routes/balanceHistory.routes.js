const express = require("express");
const router = express.Router();
const controller = require("../controllers/balanceHistory.controller");
const { verifyToken, checkPermission } = require("../middlewares/auth.middleware");

router.use(verifyToken);

// ============================================
// PRIMERO: Rutas ESPECÍFICAS (sin parámetros ambiguos)
// ============================================

// Cierre de mes
router.post('/calculate-closing', controller.calculateMonthlyClosing);
router.post('/global-closing', controller.executeGlobalClosing);

// Historial y consultas específicas
router.get('/closing-history/:account_id', controller.getClosingHistory);
router.get('/monthly-closing/:account_id/:year/:month', controller.getMonthlyClosing);
router.get('/opening-balance/:account_id/:year/:month', controller.getOpeningBalance);
router.get('/balance/:account_id/:balance_date', controller.getBalanceByDate);
router.get('/statement/:account_id/:year/:month', controller.getMonthlyStatement);

// ============================================
// DESPUÉS: Rutas CRUD genéricas (con :id)
// ============================================
router.get("/", controller.findAll);
router.post("/", controller.create);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);      
router.delete("/:id", controller.delete);

// Verificar rutas cargadas
console.log('Rutas de balance-history cargadas:', router.stack.map(r => r.route?.path));

module.exports = router;