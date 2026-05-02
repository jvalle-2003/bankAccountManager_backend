const Category = require("../models/category.model");
const { runWithAudit } = require("../utils/audit.helper");



/* =========================
   CREATE
========================= */
exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
    res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   GET ONE
========================= */
exports.findOne = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.update(req.body);

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   TOGGLE ACTIVE
========================= */
exports.toggleActive = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const currentState = Boolean(category.active);

    await category.update({
      active: !currentState
    });

    await category.reload();

    res.json(category);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};