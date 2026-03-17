const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

// Importar los modelos ya definidos
const Bank = require("./bank.model");
const AccountType = require("./accountType.model");
const BankAccount = require("./bankAccount.model");


// ==========================================
// DEFINICIÓN DE ASOCIACIONES (Relaciones)
// ==========================================

// Relaciones de BankAccount
BankAccount.belongsTo(Bank, { foreignKey: "bank_id" });
Bank.hasMany(BankAccount, { foreignKey: "bank_id" });

BankAccount.belongsTo(AccountType, { foreignKey: "account_type_id" });
AccountType.hasMany(BankAccount, { foreignKey: "account_type_id" });

// Si Periods tiene relaciones con Users u otros, agrégalas aquí abajo

module.exports = {
  sequelize,
  Sequelize,
  Bank,
  AccountType,
  BankAccount,
 
};