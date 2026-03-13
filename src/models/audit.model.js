const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Audit = sequelize.define(
  "Audit",
  {
    audit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    last_login: {
     type: DataTypes.DATE,
     allowNull: true, // Se actualiza cada vez que hace Login
    },
    last_activity: {
     type: DataTypes.DATE,
     defaultValue: DataTypes.NOW, // Se actualiza en cada petición a la API
    },
    last_ip: {
      type: DataTypes.STRING(45), // 45 caracteres es ideal para soportar IPv6
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,    
        key: "user_id", 
      },
    },
  },
  {
    tableName: "Audits", 
    timestamps: false,  
  }
);


Audit.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Audit, { foreignKey: "user_id" });

module.exports = Audit;