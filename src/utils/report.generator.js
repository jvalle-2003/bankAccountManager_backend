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
exports.generateReport = async (res, format, filename, excelConfig, pdfConfig) => {
    try {
        if (format === "excel") {
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Reporte");

            worksheet.columns = excelConfig.columns;
            worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
            worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF0070C0" } };

            excelConfig.data.forEach((row) => worksheet.addRow(row));

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();

        } else if (format === "csv") {
            // ==========================================
            // NUEVO: Generación de archivo CSV
            // ==========================================
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Reporte");

            // Pasamos las columnas y los datos (sin estilos porque es texto plano)
            worksheet.columns = excelConfig.columns;
            excelConfig.data.forEach((row) => worksheet.addRow(row));

            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);

            await workbook.csv.write(res);
            res.end();

        } else if (format === "pdf") {
            const doc = new PDFDocument({ margin: 30, size: 'A4' });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

            doc.pipe(res);
            doc.fontSize(20).text(pdfConfig.title, { align: 'center' });
            doc.moveDown();

            const table = {
                title: pdfConfig.title,
                headers: pdfConfig.headers,
                rows: pdfConfig.rows,
            };

            await doc.table(table, {
                width: 500,
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10),
            });

            doc.end();
        } else {
            res.status(400).json({ message: "Formato no soportado" });
        }
    } catch (error) {
        throw new Error("Error al generar el archivo: " + error.message);
    }
};