const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Audit = sequelize.define("Audit", {
    audit_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    description: { 
      type: DataTypes.STRING(250), 
      allowNull: false 
    },
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
        
    },
    table_name: { 
      type: DataTypes.STRING(50), 
      allowNull: true 
    },
    record_id: { 
      type: DataTypes.STRING(50), 
      allowNull: true 
    },
}, 
{
    tableName: "Audits",
    timestamps: false,
});


module.exports = Audit;