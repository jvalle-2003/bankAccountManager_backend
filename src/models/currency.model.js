const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Currency = sequelize.define(
  "Currency",
  {
    id_currency: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
state: {
  type: DataTypes.INTEGER, // 👈 NO BOOLEAN
  allowNull: false,
  defaultValue: 1,
  get() {
    return this.getDataValue("state") === 1;
  },
  set(value) {
    this.setDataValue("state", value ? 1 : 0);
  }
}
  },
  {
    tableName: "currencies",
    timestamps: false
  }
);

module.exports = Currency;