const sequelize = require("../config/db");
const BalanceHistory = require("../models/balance_history.model");

exports.create = async (req, res) => {
  try {
    const record = await BalanceHistory.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const records = await BalanceHistory.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const record = await BalanceHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await BalanceHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    await record.update(req.body);
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const record = await BalanceHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    await record.destroy();
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// NUEVO: Obtener saldo por fecha específica
// ============================================
exports.getBalanceByDate = async (req, res) => {
  try {
    const { account_id, balance_date } = req.params;
    
    const [result] = await sequelize.query(
      `SELECT TOP 1 
        account_id, 
        balance_date, 
        closing_balance 
       FROM Balance_History 
       WHERE account_id = :account_id 
         AND balance_date <= :balance_date 
       ORDER BY balance_date DESC`,
      {
        replacements: { 
          account_id: account_id, 
          balance_date: balance_date 
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró saldo para esa fecha'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error en getBalanceByDate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};