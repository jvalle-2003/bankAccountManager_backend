const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BalanceHistory = sequelize.define(
  "BalanceHistory",
  {
    history_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    balance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha del saldo (puede ser fin de mes o cualquier fecha)"
    },

    closing_balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    },

    // ✅ NUEVOS CAMPOS PARA CIERRE DE MES
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Año del cierre (ej: 2019)"
    },

    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Mes del cierre (1-12)"
    },

    is_monthly_closing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "TRUE = es un cierre de mes oficial"
    },

    previous_balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: "Saldo del mes anterior (para verificar consistencia)"
    },

    monthly_credits: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
      comment: "Total de ingresos del mes"
    },

    monthly_debits: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
      comment: "Total de egresos del mes"
    },

    transaction_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Número de transacciones en el mes"
    },

    closed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del usuario que ejecutó el cierre"
    },

    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      comment: "Fecha y hora en que se ejecutó el cierre"
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observaciones del cierre (ajustes, notas, etc.)"
    }
  },
  {
    tableName: "Balance_History",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["account_id", "balance_date"]
      },
      // ✅ NUEVOS ÍNDICES PARA BÚSQUEDAS RÁPIDAS
      {
        name: "idx_account_year_month",
        fields: ["account_id", "year", "month"],
        unique: true,
        where: {
          is_monthly_closing: true
        }
      },
      {
        name: "idx_balance_date",
        fields: ["balance_date"]
      },
      {
        name: "idx_account_closing",
        fields: ["account_id", "is_monthly_closing"]
      }
    ]
  }
);

module.exports = BalanceHistory;