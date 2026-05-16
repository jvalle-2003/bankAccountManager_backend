const sequelize = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        // 1. Saldos por Símbolo de Moneda
        const [saldosPorMoneda] = await sequelize.query(`
            SELECT c.symbol AS id, SUM(a.current_balance) AS total 
            FROM Bank_Accounts a
            INNER JOIN currencies c ON a.currency_id = c.id_currency
            WHERE a.active = 1 
            GROUP BY c.symbol
        `);

        // 2. Obtener Tipo de Cambio
        const [tipoCambio] = await sequelize.query(`
            SELECT TOP 1 exchange_rate FROM Transactions 
            WHERE currency_id = 'USD' AND cancelled = 0
            ORDER BY registration_date DESC
        `);

        // 3. Distribución para la gráfica (Por Banco y Moneda)
        const [distribucion] = await sequelize.query(`
            SELECT 
                b.bank_name AS bank, 
                c.symbol AS currency,
                ISNULL(SUM(a.current_balance), 0) AS total 
            FROM Banks b
            LEFT JOIN Bank_Accounts a ON b.bank_id = a.bank_id AND a.active = 1
            LEFT JOIN currencies c ON a.currency_id = c.id_currency
            WHERE b.active = 1
            GROUP BY b.bank_name, c.symbol
        `);

        // 4. Conteo de Transacciones del Mes
        const [transaccionesMes] = await sequelize.query(`
            SELECT COUNT(*) AS total FROM Transactions 
            WHERE MONTH(transaction_date) = MONTH(GETDATE()) 
            AND YEAR(transaction_date) = YEAR(GETDATE()) 
            AND cancelled = 0
        `);

        // 5. Pendientes de Conciliar
        const [pendientes] = await sequelize.query(`
            SELECT COUNT(*) AS total FROM Transactions 
            WHERE reconciled = 0 AND cancelled = 0
        `);

        // --- PROCESAMIENTO DE DATOS ---
        const totalTransacciones = transaccionesMes[0]?.total ?? transaccionesMes[0]?.TOTAL ?? 0;
        const totalPendientes = pendientes[0]?.total ?? pendientes[0]?.TOTAL ?? 0;

        res.json({
            saldos: saldosPorMoneda, 
            tasaReferencia: tipoCambio[0]?.exchange_rate ?? tipoCambio[0]?.EXCHANGE_RATE ?? 7.66,
            distribucionBancos: distribucion,
            transaccionesMes: totalTransacciones,
            conciliacionesPendientes: totalPendientes
        });

    } catch (error) {
        console.error("Error en el controlador de Dashboard:", error);
        res.status(500).json({ 
            error: "Error interno del servidor", 
            message: error.message 
        });
    }
};

module.exports = { getDashboardStats };