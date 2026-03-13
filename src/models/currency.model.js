module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define(
    "Currency",
    {
      id_currency: {
        type: DataTypes.STRING(3),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      symbol: {
        type: DataTypes.STRING(5),
        allowNull: false
      },
      state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "currencies",
      timestamps: false
    }
  );

  return Currency;
};