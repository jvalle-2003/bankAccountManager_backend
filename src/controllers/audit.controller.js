const Audit = require("../models/audit.model");

/* =========================
   CREAR AUDITORIA
========================= */
exports.create = async (req, res) => {
  try {
    const audit = await Audit.create(req.body);
    res.status(201).json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODAS
========================= */
exports.findAll = async (req, res) => {
  try {
    const audit = await Audit.findAll();
    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);

    if (!audit)
      return res.status(404).json({ message: "Audit not found" });

    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACTUALIZAR
========================= */
exports.update = async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);

    if (!audit)
      return res.status(404).json({ message: "Audit not found" });

    await audit.update(req.body);

    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);

    if (!audit)
      return res.status(404).json({ message: "Audit not found" });

   await audit.update({ activa: false });

    res.json({ message: "Audit delete sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};