const { AccountType } = require("../models");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREAR TIPO DE CUENTA
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const type = await AccountType.create(req.body, { transaction: t });
      res.status(201).json(type);
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   OBTENER TODOS
========================= */
exports.findAll = async (req, res) => {
  try {
    const types = await AccountType.findAll();
    res.json(types);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const type = await AccountType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "Account Type not found" });
    
    res.json(type);
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
      const type = await AccountType.findByPk(req.params.id);
      
      if (!type) return res.status(404).json({ message: "Account Type not found" });
      
      // Pasamos la transacción para que la auditoría capture el cambio
      await type.update(req.body, { transaction: t });
      
      res.json(type);
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
      const type = await AccountType.findByPk(req.params.id);
      
      if (!type) return res.status(404).json({ message: "Account Type not found" });

      // Pasamos la transacción al destroy
      await type.destroy({ transaction: t }); 
      
      res.json({ message: "Account Type deleted permanently" });
    });
  } catch (error) { 
    // Si hay cuentas amarradas a este tipo, saltará aquí por restricción de llave foránea
    res.status(500).json({ 
      message: "No se puede eliminar: Existen cuentas monetarias asociadas a este tipo." 
    }); 
  }
};