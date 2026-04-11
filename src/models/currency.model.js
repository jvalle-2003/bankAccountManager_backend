const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Currency = sequelize.define(
  "Currency",
  {
    id_currency: {
      type: DataTypes.INTEGER,     // Cambiado de STRING a INTEGER
      primaryKey: true,
      autoIncrement: true,        // Esto habilita el IDENTITY(1,1)
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
      type: DataTypes.BOOLEAN,    // Ahora usamos BOOLEAN directamente
      allowNull: false,
      defaultValue: true          // El valor por defecto es true (1 en DB)
    }
  },
  {
    tableName: "currencies",
    timestamps: false
  }
);

module.exports = Currency;