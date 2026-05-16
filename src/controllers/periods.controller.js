const Periods = require("../models/periods.model");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREAR PERIODO
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const period = await Periods.create(req.body, { transaction: t });
      res.status(201).json(period);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODOS (No requiere auditoría)
========================= */
exports.findAll = async (req, res) => {
  try {
    const periods = await Periods.findAll();
    res.json(periods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID (No requiere auditoría)
========================= */
exports.findOne = async (req, res) => {
  try {
    const period = await Periods.findByPk(req.params.id);
    if (!period) return res.status(404).json({ message: "Period not found" });
    res.json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACTUALIZAR (Auditado)
========================= */
exports.update = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const period = await Periods.findByPk(req.params.id);
      if (!period) return res.status(404).json({ message: "Period not found" });

      // Se pasa la transacción 't' para registrar el cambio en auditoría
      await period.update(req.body, { transaction: t });
      res.json(period);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (Auditado)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const period = await Periods.findByPk(req.params.id);
      if (!period) return res.status(404).json({ message: "Period not found" });

      // Se pasa la transacción 't' para auditar la eliminación
      await period.destroy({ transaction: t });
      res.json({ message: "Period deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
