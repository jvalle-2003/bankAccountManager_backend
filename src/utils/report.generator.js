// backend/src/utils/report.generator.js
const excelJS = require("exceljs");
const PDFDocument = require("pdfkit-table");

/**
 * Genera y envía un reporte en Excel, PDF o CSV dinámicamente.
 * @param {Object} res - El objeto de respuesta de Express
 * @param {string} format - 'excel', 'pdf' o 'csv'
 * @param {string} filename - Nombre del archivo a descargar
 * @param {Object} excelConfig - Configuración para Excel/CSV { columns, data }
 * @param {Object} pdfConfig - Configuración para PDF { title, headers, rows }
 */
exports.generateSummary = (
    transactions = []
) => {

    const summary = {

        total: transactions.length,

        ingresos: 0,

        egresos: 0,

        conciliados: 0,

        pendientes: 0
    };

    transactions.forEach(t => {

        if (t.type === 'INGRESO')
            summary.ingresos += t.amount;

        if (t.type === 'EGRESO')
            summary.egresos += t.amount;

        if (t.status === 'CONCILIADO')
            summary.conciliados++;

        if (t.status === 'PENDIENTE')
            summary.pendientes++;
    });

    return summary;
};