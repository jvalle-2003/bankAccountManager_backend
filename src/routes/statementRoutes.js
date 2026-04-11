const express = require('express');
const router = express.Router();
const multer = require('multer');
const statementController = require('../controllers/statementController');

// 1. Configuración de Multer
// Usamos memoryStorage para no llenar el servidor de archivos basura.
// El PDF se procesa en la RAM y luego desaparece.
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por PDF
});

/**
 * RUTA: POST /api/statements/process
 * DESCRIPCIÓN: Recibe el PDF del banco y activa el motor DataMatch
 */
router.post('/process', upload.single('statement'), statementController.processStatement);
router.post('/download-excel', statementController.downloadComparisonExcel);

module.exports = router;