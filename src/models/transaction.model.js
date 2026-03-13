const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    transaction_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },

    category_id: {
      type: DataTypes.INTEGER
    },

    supplier_id: {
      type: DataTypes.INTEGER
    },

    reference_number: {
      type: DataTypes.STRING(50)
    },

    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    },

    currency_id: {
      type: DataTypes.STRING(3),
      allowNull: false
    },

    exchange_rate: {
      type: DataTypes.DECIMAL(10, 4),
      defaultValue: 1
    },

    concept: {
      type: DataTypes.STRING(500),
      allowNull: false
    },

    beneficiary: {
      type: DataTypes.STRING(200)
    },

    // ---------- AUTHORIZATION ----------
    requires_authorization: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    authorized_by: {
      type: DataTypes.INTEGER
    },

    authorization_date: {
      type: DataTypes.DATE
    },

    // ---------- RECONCILIATION ----------
    reconciled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    reconciliation_date: {
      type: DataTypes.DATEONLY
    },

    reconciliation_id: {
      type: DataTypes.INTEGER
    },

    // ---------- CANCELLATION ----------
    cancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    cancellation_reason: {
      type: DataTypes.STRING(500)
    },

    cancellation_date: {
      type: DataTypes.DATE
    },

    cancelled_by: {
      type: DataTypes.INTEGER
    },

    // ---------- AUDIT ----------
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    modified_by: {
      type: DataTypes.INTEGER
    },

    modification_date: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: "Transactions",
    timestamps: false
  }
);

module.exports = Transaction;