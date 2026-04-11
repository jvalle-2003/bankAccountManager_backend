const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    movement_type: {
      type: DataTypes.ENUM("INGRESO", "EGRESO", "TRANSFERENCIA"),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      get() {
        return this.getDataValue("active") === true;
      },
      set(value) {
        this.setDataValue("active", value ? 1 : 0);
      }
    }
  },
  {
    tableName: "Categories",
    timestamps: false
  }
);

module.exports = Category;