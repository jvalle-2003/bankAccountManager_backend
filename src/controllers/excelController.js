const ExcelJS = require('exceljs');
const { Transaction } = require('../models');

exports.descargarExcelComparativo = async (req, res) => {
    try {
        const { transactions, accountId } = req.body;

        if (!transactions || transactions.length === 0) {
            return res.status(400).json({ error: "No hay transacciones" });
        }

        if (!accountId) {
            return res.status(400).json({ error: "Falta accountId" });
        }

        // 🔥 FILTRAR POR CUENTA
        const dbTransactions = await Transaction.findAll({
            where: { account_id: accountId }
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Conciliacion');

        sheet.columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Descripción OCR', key: 'descOCR', width: 35 },
            { header: 'Débito', key: 'debit', width: 15 },
            { header: 'Crédito', key: 'credit', width: 15 },
            { header: 'Estado', key: 'status', width: 15 },
            { header: 'Monto DB', key: 'dbAmount', width: 15 },
            { header: 'Descripción DB', key: 'dbDesc', width: 35 },
            { header: 'Coincidencia', key: 'match', width: 15 }
        ];

        transactions.forEach(t => {

            const montoOCR = t.debit || t.credit;

            const match = dbTransactions.find(db =>
                Math.abs((db.amount || 0) - montoOCR) < 0.01
            );

            sheet.addRow({
                date: t.date,
                descOCR: t.description,
                debit: t.debit,
                credit: t.credit,
                status: t.status,
                dbAmount: match ? match.amount : '',
                dbDesc: match ? match.description : '',
                match: match ? 'SI' : 'NO'
            });
        });

        // estilos
        sheet.getRow(1).font = { bold: true };

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const estado = row.getCell(5).value;

                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: estado === 'CONCILIADO'
                            ? 'C6EFCE'
                            : 'FFC7CE'
                    }
                };
            }
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=Conciliacion.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};