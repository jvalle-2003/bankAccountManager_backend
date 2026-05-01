const express = require('express');
const router = express.Router();
const ocrController = require('../controllers/ocrCrontroller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/reconciliar-ocr', upload.single('estado_cuenta'), ocrController.analizarEstadoCuenta);

module.exports = router;