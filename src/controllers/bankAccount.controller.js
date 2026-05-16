const { BankAccount, Bank, AccountType } = require("../models");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREAR CUENTA BANCARIA
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const bankAccount = await BankAccount.create(req.body, { transaction: t });
      res.status(201).json(bankAccount);
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   OBTENER TODAS
========================= */
exports.findAll = async (req, res) => {
  try {
    const accounts = await BankAccount.findAll({
      include: [
        { model: Bank, attributes: ['bank_name'] },
        { model: AccountType, attributes: ['type_name'] }
      ]
    });
    res.json(accounts);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const account = await BankAccount.findByPk(req.params.id, {
      include: [{ model: Bank }, { model: AccountType }]
    });
    if (!account) return res.status(404).json({ message: "Bank Account not found" });
    res.json(account);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   ACTUALIZAR
========================= */
exports.update = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const account = await BankAccount.findByPk(req.params.id);
      
      if (!account) return res.status(404).json({ message: "Bank Account not found" });
      
      // Añadimos la transacción para registrar la actualización
      await account.update(req.body, { transaction: t });
      
      res.json(account);
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   ELIMINAR (Físico)
========================= */
exports.delete = async (req, res) => {
    try {
        await runWithAudit(req, async (t) => {
            const { id } = req.params;
            
            // Buscamos si la cuenta existe
            const account = await BankAccount.findByPk(id);
            
            if (!account) {
                return res.status(404).json({ message: "La cuenta no existe" });
            }

            // ELIMINACIÓN FÍSICA con transacción para la auditoría
            await account.destroy({ transaction: t });

            res.json({ message: "Cuenta eliminada definitivamente de la base de datos" });
        });
    } catch (error) {
        // Si la cuenta ya tiene transacciones asociadas, SQL Server 
        // lanzará un error de llave foránea para proteger la integridad.
        res.status(500).json({ 
            message: "No se puede eliminar la cuenta porque tiene registros asociados (movimientos/transacciones)." 
        });
    }
};