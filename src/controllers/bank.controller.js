const { Bank } = require("../models");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREAR BANCO
========================= */
exports.create = async (req, res) => {
  try {   
    await runWithAudit(req, async (t) => {
      const bank = await Bank.create(req.body, { transaction: t });
      res.status(201).json(bank);
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
    const banks = await Bank.findAll();
    res.json(banks);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);
    if (!bank) return res.status(404).json({ message: "Bank not found" });
    res.json(bank);
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
      const bank = await Bank.findByPk(req.params.id);
      
      if (!bank) return res.status(404).json({ message: "Bank not found" });
      
      // Añadimos la transacción 't' aquí
      await bank.update(req.body, { transaction: t });
      
      res.json(bank);
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
      const bank = await Bank.findByPk(req.params.id);
      
      if (!bank) return res.status(404).json({ message: "Bank not found" });
      
      // Cambiamos update por destroy para borrar la fila físicamente, pasando 't'
      await bank.destroy({ transaction: t }); 
      
      res.json({ message: "Bank deleted permanently from database" });
    });
  } catch (error) { 
    res.status(500).json({ message: "No se puede eliminar: el banco tiene registros asociados o hubo un error." }); 
  }
};