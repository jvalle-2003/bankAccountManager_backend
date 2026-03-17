const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AccountType = sequelize.define("AccountType", {
  account_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "Account_Types",
  timestamps: false
});

module.exports = AccountType;