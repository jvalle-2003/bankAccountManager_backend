const Category = require("../models/category.model");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const category = await Category.create(req.body, { transaction: t });
      res.json(category);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ONE
========================= */
exports.findOne = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Añadimos la transacción para registrar los cambios en los campos
      await category.update(req.body, { transaction: t });

      res.json(category);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   TOGGLE ACTIVE (Auditable)
========================= */
exports.toggleActive = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const currentState = Boolean(category.active);

      // El cambio de estado también se audita al pasar la transacción 't'
      await category.update({
        active: !currentState
      }, { transaction: t });

      await category.reload({ transaction: t });

      res.json(category);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};