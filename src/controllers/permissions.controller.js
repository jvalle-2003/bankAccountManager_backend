const Permissions = require("../models/permissions.model");
const { runWithAudit } = require("../utils/audit.helper");
/* =========================
   CREAR PERMISO
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
    const permission = await Permissions.create(req.body,{ transaction: t });
    res.status(201).json(permission);
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
    const permissions = await Permissions.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const permission = await Permissions.findByPk(req.params.id);

    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    res.json(permission);
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
      const permission = await Permissions.findByPk(req.params.id);

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      await permission.update(req.body, { transaction: t }); 

      res.json(permission);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (físico)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const permission = await Permissions.findByPk(req.params.id);

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      await permission.destroy({ transaction: t });

      res.json({ message: "Permission deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};