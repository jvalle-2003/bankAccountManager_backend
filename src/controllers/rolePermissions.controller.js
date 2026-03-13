const RolePermissions = require("../models/role_permissions.model");
// Asignar permiso a rol
exports.create = async (req, res) => {
  try {
    const assignment = await RolePermissions.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las asignaciones
exports.findAll = async (req, res) => {
  try {
    const assignments = await RolePermissions.findAll();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asignaciones por rol
exports.findByRole = async (req, res) => {
  try {
    const assignments = await RolePermissions.findAll({
      where: { role_id: req.params.roleId }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asignaciones por permiso
exports.findByPermission = async (req, res) => {
  try {
    const assignments = await RolePermissions.findAll({
      where: { permission_id: req.params.permissionId }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una asignación específica
exports.delete = async (req, res) => {
  try {
    const deleted = await RolePermissions.destroy({
      where: {
        role_id: req.params.roleId,
        permission_id: req.params.permissionId
      }
    });
    if (deleted) {
      res.json({ message: "Assignment deleted successfully" });
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};