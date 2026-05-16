const Tesseract = require('tesseract.js');
const fs = require('fs');
const pdf = require('pdf-parse');
const sharp = require('sharp');
const { Transaction } = require('../models');

exports.analizarEstadoCuenta = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: "Archivo no recibido"
            });
        }

        const accountId = req.body.accountId;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                msg: "Debe seleccionar una cuenta"
            });   
        }

        const filePath = req.file.path;
        let rawText = "";

        // ==========================
        // 📄 PDF o Imagen
        // ==========================
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);

            rawText = (pdfData.text && pdfData.text.trim().length > 50)
                ? pdfData.text
                : await ejecutarOCR(filePath);
        } else {
            rawText = await ejecutarOCR(filePath);
        }

        // ==========================
        // 🔤 NORMALIZACIÓN
        // ==========================
        const fullText = rawText
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const lineas = fullText.split('\n');
        const transaccionesProcesadas = [];

        // ==========================
        // 📅 FECHAS
        // ==========================
        const fechaRegex = /(\d{1,2}[\/\-\s]\d{1,2}[\/\-\s]\d{2,4})/;
        let ultimaFecha = "";

        const anioMatch = fullText.match(/(20\d{2})/);
        const anio = anioMatch ? anioMatch[1] : new Date().getFullYear();

        const meses = {
            ENERO: "01", FEBRERO: "02", MARZO: "03",
            ABRIL: "04", MAYO: "05", JUNIO: "06",
            JULIO: "07", AGOSTO: "08", SEPTIEMBRE: "09",
            OCTUBRE: "10", NOVIEMBRE: "11", DICIEMBRE: "12"
        };

        let mesDetectado = "01";
        Object.keys(meses).forEach(nombre => {
            if (fullText.includes(nombre)) {
                mesDetectado = meses[nombre];
            }
        });

        // ==========================
        // 🔍 PROCESAMIENTO OCR
        // ==========================
        lineas.forEach(l => {

            const f = l.match(fechaRegex);
            if (f) {
                ultimaFecha = f[1].replace(/\s/g, '');
            }

            const montos = l.match(/[0-9,]+\.[0-9]{2}/g);
            if (!montos) return;

            let fecha = ultimaFecha || "";

            // fallback con día
            if (!fecha) {
                const diaMatch = l.match(/^\s*(\d{1,2})\b/);
                if (diaMatch) {
                    const dia = diaMatch[1].padStart(2, '0');
                    fecha = `${dia}/${mesDetectado}/${anio}`;
                }
            }

            let debit = 0, credit = 0, balance = 0;

            if (montos.length === 3) {
                debit = parseFloat(montos[0].replace(/,/g, ''));
                credit = parseFloat(montos[1].replace(/,/g, ''));
                balance = parseFloat(montos[2].replace(/,/g, ''));
            } else if (montos.length === 2) {
                debit = parseFloat(montos[0].replace(/,/g, ''));
                balance = parseFloat(montos[1].replace(/,/g, ''));
            } else {
                debit = parseFloat(montos[0].replace(/,/g, ''));
            }

            // ==========================
            // 🧾 DESCRIPCIÓN
            // ==========================
            let descripcion = "";
            const montoIndex = l.search(/[0-9,]+\.[0-9]{2}/);

            if (montoIndex !== -1) {
                descripcion = l.substring(0, montoIndex)
                    .replace(/^\s*\d+\s+/, '')
                    .replace(/[^A-Z0-9\s]/g, '')
                    .trim();
            }

            if (!descripcion) return;

            transaccionesProcesadas.push({
                date: fecha,
                description: descripcion,
                debit,
                credit,
                balance,
                status: 'PENDIENTE'
            });
        });

        // ==========================
        // 🔥 CONCILIACIÓN
        // ==========================
        const resultadoFinal = await conciliarConDB(
            transaccionesProcesadas,
            accountId
        );

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return res.json({
            success: true,
            transactions: resultadoFinal
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ==========================
// OCR
// ==========================
async function ejecutarOCR(filePath) {
    const processedPath = filePath + "_processed.png";

    await sharp(filePath)
        .grayscale()
        .normalize()
        .sharpen()
        .toFile(processedPath);

    const { data: { text } } = await Tesseract.recognize(processedPath, 'spa');

    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

    return text;
}

// ==========================
// 🔥 CONCILIACIÓN ROBUSTA
// ==========================
async function conciliarConDB(transacciones, accountId) {

    const dbTransactions = await Transaction.findAll({
        where: { account_id: accountId }
    });

    return transacciones.map(t => {

        const montoOCR = t.debit > 0 ? t.debit : t.credit;

        const match = dbTransactions.find(db => {

            const montoDB = parseFloat(db.amount || 0);

            // 🔥 IGNORAR SIGNO
            const montoOK =
                Math.abs(Math.abs(montoDB) - Math.abs(montoOCR)) < 0.01;

            // 🔥 PARSE FECHA CORRECTO
            let fechaOK = true;

            if (t.date && db.date) {
                try {
                    const [dia, mes, anio] = t.date.split('/');
                    const fechaOCR = new Date(`${anio}-${mes}-${dia}`);
                    const fechaDB = new Date(db.date);

                    fechaOK =
                        Math.abs(fechaDB - fechaOCR) <=
                        (3 * 24 * 60 * 60 * 1000);
                } catch {
                    fechaOK = true;
                }
            }

            // 🧪 DEBUG (puedes borrar luego)
            console.log("OCR:", montoOCR, "DB:", montoDB);

            return montoOK && fechaOK;
        });

        return {
            ...t,
            status: match ? 'CONCILIADO' : 'PENDIENTE'
        };
    });
}