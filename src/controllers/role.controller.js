const Role = require("../models/role.model");

/* =========================
   CREAR ROLE
========================= */
exports.create = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODAS
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

    if (!role)
      return res.status(404).json({ message: "Role not found" });

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
    const role = await Role.findByPk(req.params.id);

    if (!role)
      return res.status(404).json({ message: "Role not found" });

    await role.update(req.body);

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role)
      return res.status(404).json({ message: "Role not found" });

   await role.update({ active: false });

    res.json({ message: "Role delete sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};