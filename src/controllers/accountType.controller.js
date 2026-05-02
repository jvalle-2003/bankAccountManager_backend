const { AccountType } = require("../models");
const { runWithAudit } = require("../utils/audit.helper");

exports.create = async (req, res) => {
  try {
    const type = await AccountType.create(req.body);
    res.status(201).json(type);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.findAll = async (req, res) => {
  try {
    const types = await AccountType.findAll();
    res.json(types);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const type = await AccountType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Account Type not found" });
    res.json(type);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const type = await AccountType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Account Type not found" });
    await type.update(req.body);
    res.json(type);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Borrado Físico (Elimina la fila de la BD)
exports.delete = async (req, res) => {
  try {
    const type = await AccountType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Account Type not found" });

    // destroy() elimina el registro permanentemente
    await type.destroy(); 
    
    res.json({ message: "Account Type deleted permanently" });
  } catch (error) { 
    // Si hay cuentas amarradas a este tipo, saltará aquí por restricción de llave foránea
    res.status(500).json({ 
      message: "No se puede eliminar: Existen cuentas monetarias asociadas a este tipo." 
    }); 
  }
};