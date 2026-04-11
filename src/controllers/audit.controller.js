const Audit = require("../models/audit.model");
const User = require("../models/user.model");

/* =========================
   OBTENER TODAS (Lectura)
========================= */
exports.findAll = async (req, res) => {
  try {
    const audits = await Audit.findAll({
      include: [{ 
        model: User, 
        attributes: ['user_id', 'username', 'email'] // Traemos datos del autor
      }],
      order: [['last_activity', 'DESC']] // Lo más reciente primero
    });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'email'] }]
    });

    if (!audit) return res.status(404).json({ message: "Registro no encontrado" });

    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};