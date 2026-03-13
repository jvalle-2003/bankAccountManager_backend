const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BalanceHistory = sequelize.define(
  "BalanceHistory",
  {
    history_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    balance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    closing_balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    }
  },
  {
    tableName: "Balance_History",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["account_id", "balance_date"]
      }
    ]
  }
);

module.exports = BalanceHistory;