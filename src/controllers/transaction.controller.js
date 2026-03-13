const Transaction = require("../models/transaction.model");

// CREATE
exports.create = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.findAll = async (req, res) => {
  try {
    const data = await Transaction.findAll({
      order: [["transaction_id", "DESC"]]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    await Transaction.update(req.body, {
      where: { transaction_id: req.params.id }
    });

    const updated = await Transaction.findByPk(req.params.id);

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL TRANSACTION
exports.cancel = async (req, res) => {
  try {
    const { reason, user_id } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Not found" });

    await transaction.update({
      cancelled: true,
      cancellation_reason: reason,
      cancelled_by: user_id,
      cancellation_date: new Date()
    });

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};