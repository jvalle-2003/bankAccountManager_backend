const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    second_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    third_name: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    first_surname: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    second_surname: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

module.exports = User;