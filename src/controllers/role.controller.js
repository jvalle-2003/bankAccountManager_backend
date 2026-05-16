const Role = require("../models/role.model");
const { runWithAudit } = require("../utils/audit.helper"); 

/* =========================
   CREAR ROL
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const role = await Role.create(req.body, { transaction: t });
      res.status(201).json(role);
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
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
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
   ACTUALIZAR (Auditado)
========================= */
exports.update = async (req, res) => {
  try {
    // Usamos runWithAudit para capturar qué cambió en el nombre o descripción del rol
    await runWithAudit(req, async (t) => {
      const role = await Role.findByPk(req.params.id);

      if (!role) return res.status(404).json({ message: "Role not found" });

      // Pasamos la transacción 't' para que la auditoría registre el cambio
      await role.update(req.body, { transaction: t });
      res.json(role);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (Borrado Lógico - Auditado)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const role = await Role.findByPk(req.params.id);

      if (!role) return res.status(404).json({ message: "Role not found" });

      // Al ser un borrado lógico (active: false), update capturará el cambio de estado
      await role.update({ active: false }, { transaction: t });
      res.json({ message: "Role deactivated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};