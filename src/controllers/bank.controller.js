const { Bank } = require("../models");
const { runWithAudit } = require("../utils/audit.helper");

exports.create = async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json(bank);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.findAll = async (req, res) => {
  try {
    const banks = await Bank.findAll();
    res.json(banks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: "Bank not found" });
    res.json(bank);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: "Bank not found" });
    await bank.update(req.body);
    res.json(bank);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.delete = async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: "Bank not found" });
    
    // Cambiamos update por destroy para borrar la fila físicamente
    await bank.destroy(); 
    
    res.json({ message: "Bank deleted permanently from database" });
  } catch (error) { 
    res.status(500).json({ message: "No se puede eliminar: el banco tiene registros asociados o hubo un error." }); 
  }
};