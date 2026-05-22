const Category = require('../models/category.model'); 
const Transaction = require('../models/transaction.model'); 
const Bank_Account = require('../models/bankAccount.model'); 
const { runWithAudit } = require("../utils/audit.helper");
const sequelize = require('../config/db'); 
const { Op } = require('sequelize');

// Función auxiliar para validar transacción
async function validateTransactionRules(transactionData, t) {
    const { account_id, currency_id, transaction_date, reference_number } = transactionData;
    
    // 1. Validar que la cuenta exista
    const account = await Bank_Account.findByPk(account_id, { transaction: t });
    if (!account) {
        throw new Error("Cuenta bancaria no encontrada");
    }
    
    // 2. ✅ VALIDACIÓN: La moneda de la transacción debe coincidir con la moneda de la cuenta
    if (account.currency_id !== currency_id) {
        // Obtener nombres de monedas para mensaje más claro
        const Currency = require('../models/currency.model');
        const accountCurrency = await Currency.findByPk(account.currency_id, { transaction: t });
        const txCurrency = await Currency.findByPk(currency_id, { transaction: t });
        
        throw new Error(`La cuenta está en ${accountCurrency?.name || 'otra moneda'}. No puede realizar transacciones en ${txCurrency?.name || 'esa moneda'}.`);
    }
    
    // 3. ✅ VALIDACIÓN: La fecha no puede ser anterior a la creación de la cuenta
    const accountCreatedDate = new Date(account.created_at);
    accountCreatedDate.setHours(0, 0, 0, 0);
    
    const transactionDate = new Date(transaction_date);
    transactionDate.setHours(0, 0, 0, 0);
    
    if (transactionDate < accountCreatedDate) {
        const formattedDate = accountCreatedDate.toLocaleDateString('es-GT');
        throw new Error(`La fecha de la transacción no puede ser anterior a la fecha de creación de la cuenta (${formattedDate}).`);
    }
    
    // 4. ✅ VALIDACIÓN: Número de referencia único (opcional)
    if (reference_number) {
        const existingTransaction = await Transaction.findOne({
            where: {
                reference_number: reference_number,
                account_id: account_id,
                transaction_id: { [Op.ne]: transactionData.transaction_id || null }
            },
            transaction: t
        });
        
        if (existingTransaction) {
            throw new Error(`El número de referencia ${reference_number} ya existe para esta cuenta.`);
        }
    }
    
    return account;
}

/* =========================
   1. CREATE (Auditado con validaciones)
========================= */
exports.create = async (req, res) => {
    try {
        await runWithAudit(req, async (t) => {
            const { account_id, category_id, amount, currency_id, transaction_date } = req.body;
            
            // ✅ VALIDAR REGLAS DE NEGOCIO
            const account = await validateTransactionRules(req.body, t);
            
            const category = await Category.findByPk(category_id, { transaction: t });
            if (!category) {
                throw new Error("Categoría no encontrada");
            }

            let nuevoSaldo = parseFloat(account.current_balance || account.initial_balance);
            const montoTransaccion = parseFloat(amount);

            if (category.movement_type === "EGRESO" || category.movement_type === "TRANSFERENCIA") {
                // Validar que haya saldo suficiente para egresos
                if (nuevoSaldo < montoTransaccion) {
                    throw new Error(`Saldo insuficiente. Saldo actual: ${nuevoSaldo}, Monto a debitar: ${montoTransaccion}`);
                }
                nuevoSaldo -= montoTransaccion;
            } else if (category.movement_type === "INGRESO") {
                nuevoSaldo += montoTransaccion;
            }

            await account.update({ 
                current_balance: nuevoSaldo, 
                initial_balance: nuevoSaldo 
            }, { transaction: t });
            
            const transaction = await Transaction.create(req.body, { transaction: t });

            res.status(201).json(transaction);
        });
    } catch (error) {
        console.error("Error en Create:", error);
        res.status(400).json({ message: error.message }); // Cambiado a 400 para errores de validación
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
   3. FIND ONE (Lectura)
========================= */
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   4. UPDATE (Auditado con validaciones)
========================= */
exports.update = async (req, res) => {
    try {
        await runWithAudit(req, async (t) => {
            const { id } = req.params;
            const { account_id, category_id, amount, currency_id, transaction_date } = req.body;

            const originalTransaction = await Transaction.findByPk(id, { transaction: t });
            if (!originalTransaction) {
                throw new Error("Transacción no encontrada");
            }
            
            // ✅ Validar reglas de negocio para la actualización
            const updateData = {
                ...req.body,
                transaction_id: id // Para la validación de referencia única
            };
            await validateTransactionRules(updateData, t);

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
                await originalAccount.update({ 
                    current_balance: saldoRevertido, 
                    initial_balance: saldoRevertido 
                }, { transaction: t });
            }

            // APLICAR NUEVO SALDO
            const newCategory = await Category.findByPk(category_id || originalTransaction.category_id, { transaction: t });
            const newAccount = await Bank_Account.findByPk(account_id || originalTransaction.account_id, { transaction: t });

            let nuevoSaldoFinal = parseFloat(newAccount.current_balance || newAccount.initial_balance);
            const nuevoMonto = parseFloat(amount || originalTransaction.amount);

            if (newCategory.movement_type === "EGRESO" || newCategory.movement_type === "TRANSFERENCIA") {
                // Validar saldo suficiente
                if (nuevoSaldoFinal < nuevoMonto) {
                    throw new Error(`Saldo insuficiente. Saldo actual: ${nuevoSaldoFinal}, Monto a debitar: ${nuevoMonto}`);
                }
                nuevoSaldoFinal -= nuevoMonto;
            } else if (newCategory.movement_type === "INGRESO") {
                nuevoSaldoFinal += nuevoMonto;
            }

            await newAccount.update({ 
                current_balance: nuevoSaldoFinal, 
                initial_balance: nuevoSaldoFinal 
            }, { transaction: t });
            
            // Actualizar la transacción
            await originalTransaction.update(req.body, { transaction: t });

            res.json(originalTransaction);
        });
    } catch (error) {
        console.error("Error en Update:", error);
        res.status(400).json({ message: error.message }); // Cambiado a 400
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

        if (!transaction) {
            throw new Error("Transacción no encontrada");
        }
        
        // Verificar si ya está cancelada
        if (transaction.cancelled) {
            throw new Error("La transacción ya está cancelada");
        }

        // Revertir el saldo al cancelar la transacción
        const category = await Category.findByPk(transaction.category_id, { transaction: t });
        const account = await Bank_Account.findByPk(transaction.account_id, { transaction: t });
        
        if (account && category) {
            let saldoActual = parseFloat(account.current_balance);
            const montoTransaccion = parseFloat(transaction.amount);
            
            if (category.movement_type === "EGRESO" || category.movement_type === "TRANSFERENCIA") {
                // Si era egreso, sumar de vuelta
                saldoActual += montoTransaccion;
            } else if (category.movement_type === "INGRESO") {
                // Si era ingreso, restar
                saldoActual -= montoTransaccion;
            }
            
            await account.update({ 
                current_balance: saldoActual,
                initial_balance: saldoActual
            }, { transaction: t });
        }

        await transaction.update({
          cancelled: true,
          cancellation_reason: reason,
          cancelled_by: user_id,
          cancellation_date: new Date()
        }, { transaction: t });

        res.json(transaction);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   6. RECONCILE BATCH
========================= */
exports.reconcileBatch = async (req, res) => {
    const { transactions } = req.body;
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ error: 'No transactions provided' });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const results = [];

    for (const tx of transactions) {
        try {
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
            results.push({ reference: tx.reference, status: 'ERROR', error: err.message });
        }
    }

    return res.json({ results });
};