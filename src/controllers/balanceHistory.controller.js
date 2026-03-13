const db = require("../models");
const BalanceHistory = db.BalanceHistory;

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