const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excel.controller');

router.post('/download-excel', excelController.descargarExcelComparativo);

module.exports = router;