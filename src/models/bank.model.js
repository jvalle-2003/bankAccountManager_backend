const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bank = sequelize.define("Bank", {
  bank_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bank_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  swift_code: {
    type: DataTypes.STRING(11),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN, // SQL Server BIT
    defaultValue: true
  }
}, {
  tableName: "Banks",
  timestamps: false
});

module.exports = Bank;