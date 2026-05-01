const Currency = require("../models/currency.model");
const { runWithAudit } = require("../utils/audit.helper");

/* =========================
   CREAR MONEDA
========================= */
exports.create = async (req, res) => {
  try {
    const currency = await Currency.create(req.body);
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODAS
========================= */
exports.findAll = async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id);

    if (!currency)
      return res.status(404).json({ message: "Currency not found" });

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACTUALIZAR
========================= */
exports.update = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id);

    if (!currency)
      return res.status(404).json({ message: "Currency not found" });

    await currency.update(req.body);

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR (lógico)
========================= */
exports.toggleState = async (req, res) => {
  try {
    const id = req.params.id.toUpperCase();

    const currency = await Currency.findByPk(id);

    if (!currency) {
      return res.status(404).json({
        message: "Currency not found"
      });
    }

    // 👇 usar getter correctamente
    currency.state = !currency.state;

    await currency.save();

    // recargar desde BD
    await currency.reload();

    res.json(currency);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};