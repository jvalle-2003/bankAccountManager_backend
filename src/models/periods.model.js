const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Periods = sequelize.define(
  "Periods",
  {
    period_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    is_closed: {
      type: DataTypes.INTEGER, // SQL Server BIT manejado como 1/0
      allowNull: false,
      defaultValue: 0,
      get() {
        return this.getDataValue("is_closed") === 1;
      },
      set(value) {
        this.setDataValue("is_closed", value ? 1 : 0);
      }
    },

    closed_by: {
      type: DataTypes.INTEGER
    },

    closed_at: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: "Periods",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["year", "month"]
      }
    ]
  }
);

module.exports = Periods;