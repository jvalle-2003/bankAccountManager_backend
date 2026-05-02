const Periods = require("../models/periods.model");
const { runWithAudit } = require("../utils/audit.helper");

exports.create = async (req, res) => {
  try {
    const period = await Periods.create(req.body);
    res.status(201).json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const periods = await Periods.findAll();
    res.json(periods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const period = await Periods.findByPk(req.params.id);
    if (!period) return res.status(404).json({ message: "Period not found" });
    res.json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const period = await Periods.findByPk(req.params.id);
    if (!period) return res.status(404).json({ message: "Period not found" });
    await period.update(req.body);
    res.json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const period = await Periods.findByPk(req.params.id);
    if (!period) return res.status(404).json({ message: "Period not found" });
    await period.destroy();
    res.json({ message: "Period deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};