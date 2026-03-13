const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Permissions = sequelize.define(
  "Permissions",
  {
    id_permission: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    permission_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    description: {
      type: DataTypes.STRING(255)
    },

    module: {
      type: DataTypes.STRING(50)
    }
  },
  {
    tableName: "Permissions",
    timestamps: false
  }
);

module.exports = Permissions;