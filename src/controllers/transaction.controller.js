const Category = require('../models/category.model'); // Ajusta la ruta al archivo real
const Transaction = require('../models/transaction.model'); 
const Bank_Account = require('../models/bankAccount.model'); 
const sequelize = require('../config/db'); 

exports.create = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        const { account_id, category_id, amount } = req.body;

        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const account = await Bank_Account.findByPk(account_id);
        if (!account) {
            return res.status(404).json({ message: "Cuenta bancaria no encontrada" });
        }

        let nuevoSaldo = parseFloat(account.initial_balance);
        const montoTransaccion = parseFloat(amount);

        if (category.movement_type === "EGRESO" || category.movement_type === "TRANSFERENCIA") {
            nuevoSaldo -= montoTransaccion;
        } else if (category.movement_type === "INGRESO") {
            nuevoSaldo += montoTransaccion;
        }

        await account.update({ initial_balance: nuevoSaldo, current_balance: nuevoSaldo  }, { transaction: t });

        const transaction = await Transaction.create(req.body, { transaction: t });

        await t.commit();

        res.status(201).json(transaction);
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


exports.findAll = async (req, res) => {
  try {
    const data = await Transaction.findAll({
      order: [["transaction_id", "DESC"]]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.update = async (req, res) => {
    // Iniciamos la transacción
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { account_id, category_id, amount } = req.body;

        // 1. OBTENER ORIGINAL (Agregado { transaction: t })
        const originalTransaction = await Transaction.findByPk(id, { transaction: t });
        if (!originalTransaction) {
            await t.rollback();
            return res.status(404).json({ message: "Transacción no encontrada" });
        }

        // 2. REVERTIR SALDO (Agregado { transaction: t } a todas las consultas)
        const originalCategory = await Category.findByPk(originalTransaction.category_id, { transaction: t });
        const originalAccount = await Bank_Account.findByPk(originalTransaction.account_id, { transaction: t });

        if (originalAccount && originalCategory) {
            let saldoRevertido = parseFloat(originalAccount.initial_balance);
            const montoAnterior = parseFloat(originalTransaction.amount);

            if (originalCategory.movement_type === "EGRESO" || originalCategory.movement_type === "TRANSFERENCIA") {
                saldoRevertido += montoAnterior;
            } else if (originalCategory.movement_type === "INGRESO") {
                saldoRevertido -= montoAnterior;
            }
            
            originalAccount.initial_balance = saldoRevertido;
             originalAccount.current_balance = saldoRevertido;
            await originalAccount.save({ transaction: t }); // GUARDAR DENTRO DE LA TX
        }

        // 3. APLICAR NUEVO EFECTO (Agregado { transaction: t })
        const newCategory = await Category.findByPk(category_id || originalTransaction.category_id, { transaction: t });
        const newAccount = await Bank_Account.findByPk(account_id || originalTransaction.account_id, { transaction: t });

        if (!newAccount || !newCategory) {
            await t.rollback();
            return res.status(404).json({ message: "Cuenta o Categoría nueva no encontrada" });
        }

        let nuevoSaldoFinal = parseFloat(newAccount.initial_balance);
        const nuevoMonto = parseFloat(amount || originalTransaction.amount);

        if (newCategory.movement_type === "EGRESO" || newCategory.movement_type === "TRANSFERENCIA") {
            nuevoSaldoFinal -= nuevoMonto;
        } else if (newCategory.movement_type === "INGRESO") {
            nuevoSaldoFinal += nuevoMonto;
        }

        // 4. ACTUALIZAR CUENTA Y TRANSACCIÓN (Agregado { transaction: t })
        newAccount.initial_balance = nuevoSaldoFinal;
                     newAccount.current_balance = nuevoSaldoFinal;

        await newAccount.save({ transaction: t });

        await Transaction.update(req.body, {
            where: { transaction_id: id },
            transaction: t
        });

        // 5. OBTENER RESULTADO FINAL
        const updatedTransaction = await Transaction.findByPk(id, { transaction: t });

        // FINALIZAR
        await t.commit();
        res.json(updatedTransaction);

    } catch (error) {
        // MUY IMPORTANTE: Rollback si algo falla
        if (t) await t.rollback();
        console.error("Error en Update:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.cancel = async (req, res) => {
  try {
    const { reason, user_id } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Not found" });

    await transaction.update({
      cancelled: true,
      cancellation_reason: reason,
      cancelled_by: user_id,
      cancellation_date: new Date()
    });

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};