const Category = require('../models/category.model'); 
const Transaction = require('../models/transaction.model'); 
const Bank_Account = require('../models/bankAccount.model'); 
const { runWithAudit } = require("../utils/audit.helper");
const sequelize = require('../config/db'); 
const { Op } = require('sequelize')

/* =========================
   1. CREATE (Auditado)
========================= */
exports.create = async (req, res) => {
    try {
        await runWithAudit(req, async (t) => {
            const { account_id, category_id, amount } = req.body;

            const category = await Category.findByPk(category_id, { transaction: t });
            if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

            const account = await Bank_Account.findByPk(account_id, { transaction: t });
            if (!account) return res.status(404).json({ message: "Cuenta bancaria no encontrada" });

            let nuevoSaldo = parseFloat(account.current_balance || account.initial_balance);
            const montoTransaccion = parseFloat(amount);

            if (category.movement_type === "EGRESO" || category.movement_type === "TRANSFERENCIA") {
                nuevoSaldo -= montoTransaccion;
            } else if (category.movement_type === "INGRESO") {
                nuevoSaldo += montoTransaccion;
            }

            await account.update({ current_balance: nuevoSaldo, initial_balance: nuevoSaldo }, { transaction: t });
            const transaction = await Transaction.create(req.body, { transaction: t });

            res.status(201).json(transaction);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   2. FIND ALL (Lectura)
========================= */
exports.findAll = async (req, res) => {
  try {
    const data = await Transaction.findAll({
      order: [["transaction_id", "DESC"]]
    });

    const cleanedData = data.map(t => {
        const item = t.toJSON();
        if(item.transaction_date) {
            item.transaction_date = item.transaction_date.split('T')[0];
        }
        return item;
    });

    res.json(cleanedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   3. FIND ONE (Lectura) -> ¡ESTE FALTABA!
========================= */
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   4. UPDATE (Auditado)
========================= */
exports.update = async (req, res) => {
    try {
        await runWithAudit(req, async (t) => {
            const { id } = req.params;
            const { account_id, category_id, amount } = req.body;

            const originalTransaction = await Transaction.findByPk(id, { transaction: t });
            if (!originalTransaction) return res.status(404).json({ message: "Transacción no encontrada" });

            // REVERTIR SALDO ANTERIOR
            const originalCategory = await Category.findByPk(originalTransaction.category_id, { transaction: t });
            const originalAccount = await Bank_Account.findByPk(originalTransaction.account_id, { transaction: t });

            if (originalAccount && originalCategory) {
                let saldoRevertido = parseFloat(originalAccount.current_balance || originalAccount.initial_balance);
                const montoAnterior = parseFloat(originalTransaction.amount);

                if (originalCategory.movement_type === "EGRESO" || originalCategory.movement_type === "TRANSFERENCIA") {
                    saldoRevertido += montoAnterior;
                } else if (originalCategory.movement_type === "INGRESO") {
                    saldoRevertido -= montoAnterior;
                }
                await originalAccount.update({ current_balance: saldoRevertido, initial_balance: saldoRevertido }, { transaction: t });
            }

            // APLICAR NUEVO SALDO
            const newCategory = await Category.findByPk(category_id || originalTransaction.category_id, { transaction: t });
            const newAccount = await Bank_Account.findByPk(account_id || originalTransaction.account_id, { transaction: t });

            let nuevoSaldoFinal = parseFloat(newAccount.current_balance || newAccount.initial_balance);
            const nuevoMonto = parseFloat(amount || originalTransaction.amount);

            if (newCategory.movement_type === "EGRESO" || newCategory.movement_type === "TRANSFERENCIA") {
                nuevoSaldoFinal -= nuevoMonto;
            } else if (newCategory.movement_type === "INGRESO") {
                nuevoSaldoFinal += nuevoMonto;
            }

            await newAccount.update({ current_balance: nuevoSaldoFinal, initial_balance: nuevoSaldoFinal }, { transaction: t });
            
            // Actualizar la transacción
            await originalTransaction.update(req.body, { transaction: t });

            res.json(originalTransaction);
        });
    } catch (error) {
        console.error("Error en Update:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   5. CANCEL (Auditado)
========================= */
exports.cancel = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
        const { reason, user_id } = req.body;
        const transaction = await Transaction.findByPk(req.params.id, { transaction: t });

        if (!transaction) return res.status(404).json({ message: "Not found" });

        await transaction.update({
          cancelled: true,
          cancellation_reason: reason,
          cancelled_by: user_id,
          cancellation_date: new Date()
        }, { transaction: t });

        res.json(transaction);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/transaction.controller.js (agrega esta función)
exports.reconcileBatch = async (req, res) => {
    const { transactions } = req.body;
    // transactions = [{ reference, date, amount, type }]

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ error: 'No transactions provided' });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const results = [];

    for (const tx of transactions) {
        try {
            // Buscar en BD por referencia y monto
            const found = await Transaction.findOne({
                where: {
                    reference_number: tx.reference,
                    amount: tx.amount,
                    reconciled: false,
                    transaction_date: { [Op.gte]: threeMonthsAgo }
                }
            });

            if (found) {
                await found.update({
                    reconciled: true,
                    reconciliation_date: new Date()
                });
                results.push({ reference: tx.reference, status: 'CONCILIADO' });
            } else {
                // Verificar si existe pero está vencida (> 3 meses)
                const expired = await Transaction.findOne({
                    where: {
                        reference_number: tx.reference,
                        amount: tx.amount,
                        transaction_date: { [Op.lt]: threeMonthsAgo }
                    }
                });
                results.push({
                    reference: tx.reference,
                    status: expired ? 'VENCIDO' : 'NO_ENCONTRADO'
                });
            }
        } catch (err) {
            results.push({ reference: tx.reference, status: 'ERROR' });
        }
    }

    return res.json({ results });
};