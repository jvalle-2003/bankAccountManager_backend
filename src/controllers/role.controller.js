const Role = require("../models/role.model");
const { runWithAudit } = require("../utils/audit.helper"); 

/* =========================
   CREAR ROLE
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      // Pasamos { transaction: t } para que ocurra dentro del mismo contexto
      const role = await Role.create(req.body, { transaction: t });
      res.status(201).json(role);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODAS (No necesita auditoría)
========================= */
exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID (No necesita auditoría)
========================= */
exports.findOne = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
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
      const role = await Role.findByPk(req.params.id, { transaction: t });

      if (!role) return res.status(404).json({ message: "Role not found" });

      await role.update(req.body, { transaction: t });
      res.json(role);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const role = await Role.findByPk(req.params.id, { transaction: t });

      if (!role) return res.status(404).json({ message: "Role not found" });

      await role.update({ active: false }, { transaction: t });
      res.json({ message: "Role deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};