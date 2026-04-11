const pdf = require('pdf-parse');
const bankMapper = require('../utils/bankMapper');
const ExcelJS = require('exceljs');
const db = require('../models'); 


/**
 * Procesa el PDF, realiza el match con la cuenta en SQL y extrae transacciones.
 */
const processStatement = async (req, res) => {
    console.log("🚀 Iniciando procesamiento de PDF...");
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se recibió archivo" });
        }

        const pdfData = await pdf(req.file.buffer);
        const lines = pdfData.text.split('\n');
        
        // 1. Identificar cuenta
        const potentialAccounts = bankMapper.findPotentialAccounts(pdfData.text);
        console.log("🔍 Cuentas en PDF:", potentialAccounts);

        const BankAccountModel = db.BankAccount;
        const dbAccounts = await BankAccountModel.findAll({ where: { active: 1 } });

        // 2. Hacer el Match (Limpieza doble de guiones)
        const matchedAccount = dbAccounts.find(acc => {
            const cleanDbAcc = acc.account_number.replace(/-/g, '').trim();
            return potentialAccounts.some(pdfAcc => {
                const cleanPdfAcc = pdfAcc.replace(/-/g, '').trim();
                return cleanPdfAcc === cleanDbAcc;
            });
        });

        if (!matchedAccount) {
            console.log("❌ No se encontró coincidencia de cuenta.");
            return res.status(404).json({ 
                error: "Cuenta no vinculada",
                detectedInPdf: potentialAccounts 
            });
        }

        console.log(`✅ Match encontrado: ${matchedAccount.account_alias}`);

        // 3. Extraer transacciones
        const transactions = bankMapper.extractUniversalTransactions(lines) || [];
        console.log(`📊 Transacciones procesadas: ${transactions.length}`);

        // 4. Enviar respuesta
        return res.json({
            success: true,
            meta: {
                accountId: matchedAccount.account_id,
                accountName: matchedAccount.account_alias,
                accountNumber: matchedAccount.account_number,
                bank: matchedAccount.bank_name || "G&T Continental"
            },
            transactions: transactions
        });

    } catch (error) {
        console.error("💥 ERROR CRÍTICO EN CONTROLADOR:", error.message);
        return res.status(500).json({ error: "Error interno", details: error.message });
    }
};

/**
 * Genera y descarga el archivo Excel comparando PDF vs Base de Datos (GESBANCA).
 */
const downloadComparisonExcel = async (req, res) => {
    try {
        const { pdfTransactions, accountId } = req.body;

        // 1. Buscamos el modelo dinámicamente (por si se llama transaction.model)
        const modelName = Object.keys(db).find(key => 
            key.toLowerCase().includes('transaction')
        );
        
        const TransactionModel = db[modelName];

        if (!TransactionModel) {
            console.error("❌ Modelos en db:", Object.keys(db));
            return res.status(500).json({ 
                error: "Modelo de transacciones no encontrado", 
                nombresDisponibles: Object.keys(db) 
            });
        }

        console.log(`✅ Usando modelo detectado: ${modelName}`);

        // 2. Obtener transacciones de GESBANCA
        const dbTransactions = await TransactionModel.findAll({
            where: { account_id: accountId }
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Conciliación Bancaria');

        sheet.columns = [
            { header: 'FECHA PDF', key: 'date', width: 15 },
            { header: 'DESCRIPCIÓN PDF', key: 'desc', width: 45 },
            { header: 'MONTO PDF', key: 'amount', width: 15 },
            { header: 'ESTADO', key: 'status', width: 20 },
            { header: 'APP GESBANCA', key: 'appMatch', width: 45 }
        ];

        sheet.getRow(1).font = { bold: true };

        pdfTransactions.forEach(pdfTr => {
            // Buscamos coincidencia por monto absoluto
            const match = dbTransactions.find(dbTr => 
                Math.abs(parseFloat(dbTr.amount)) === Math.abs(parseFloat(pdfTr.amount))
            );

            const row = sheet.addRow({
                date: pdfTr.date,
                desc: pdfTr.description,
                amount: pdfTr.amount,
                status: match ? '✅ CONCILIADO' : '❌ NO ENCONTRADO',
                appMatch: match ? `${match.description} (Q ${match.amount})` : 'Faltante en Sistema'
            });

            // Colores para el estado
            row.getCell('status').font = { 
                color: { argb: match ? 'FF00B050' : 'FFFF0000' }, 
                bold: true 
            };
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Conciliacion_GT.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("💥 Error detallado:", error);
        res.status(500).json({ error: "Error al generar Excel", details: error.message });
    }
};
module.exports = { 
    processStatement, 
    downloadComparisonExcel 
};