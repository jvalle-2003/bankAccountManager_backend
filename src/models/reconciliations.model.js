const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reconciliations = sequelize.define(
  "Reconciliations",
  {
    reconciliation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    account_id: {
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

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    reconciliation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    bank_initial_balance: {
      type: DataTypes.DECIMAL(18, 2)
    },

    bank_final_balance: {
      type: DataTypes.DECIMAL(18, 2)
    },

    book_initial_balance: {
      type: DataTypes.DECIMAL(18, 2)
    },

    book_final_balance: {
      type: DataTypes.DECIMAL(18, 2)
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "IN_PROCESS",
      validate: {
        isIn: [["IN_PROCESS", "RECONCILED", "DIFFERENCES"]]
      }
    },

    reconciled_by: {
      type: DataTypes.INTEGER
    },

    observations: {
      type: DataTypes.STRING(500)
    }
  },
  {
    tableName: "Reconciliations",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["account_id", "month", "year"]
      }
    ]
  }
);

module.exports = Reconciliations;