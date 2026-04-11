const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Audit = sequelize.define("Audit", {
    audit_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING(250), allowNull: false },
    // NUEVOS CAMPOS PARA EL TRIGGER
    previous_values: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    }, 
    new_values: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    last_login: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    last_activity: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    last_ip: { 
      type: DataTypes.STRING(45), 
      allowNull: true 
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: "user_id" } 
    },
    table_name: { 
      type: DataTypes.STRING(50), 
      allowNull: true 
    },
    record_id: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
}, 
{
    tableName: "Audits",
    timestamps: false,
});

Audit.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Audit, { foreignKey: "user_id" });

module.exports = Audit;