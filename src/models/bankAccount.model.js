const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BankAccount = sequelize.define("BankAccount", {
  account_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bank_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency_id: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  account_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  account_number: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  account_alias: {
    type: DataTypes.STRING(50)
  },
  initial_balance: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  current_balance: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "Bank_Accounts",
  timestamps: false
});

module.exports = BankAccount;