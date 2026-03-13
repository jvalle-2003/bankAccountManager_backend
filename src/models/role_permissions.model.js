const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RolePermissions = sequelize.define(
  "RolePermissions",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },

    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },

    assignment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "Role_Permissions",
    timestamps: false
  }
);

module.exports = RolePermissions;