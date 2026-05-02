const Reconciliations = require("../models/reconciliations.model");
const { runWithAudit } = require("../utils/audit.helper");

exports.create = async (req, res) => {
  try {
    const reconciliation = await Reconciliations.create(req.body);
    res.status(201).json(reconciliation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const reconciliations = await Reconciliations.findAll();
    res.json(reconciliations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const reconciliation = await Reconciliations.findByPk(req.params.id);
    if (!reconciliation) return res.status(404).json({ message: "Reconciliation not found" });
    res.json(reconciliation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const reconciliation = await Reconciliations.findByPk(req.params.id);
    if (!reconciliation) return res.status(404).json({ message: "Reconciliation not found" });
    await reconciliation.update(req.body);
    res.json(reconciliation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const reconciliation = await Reconciliations.findByPk(req.params.id);
    if (!reconciliation) return res.status(404).json({ message: "Reconciliation not found" });
    await reconciliation.destroy();
    res.json({ message: "Reconciliation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};