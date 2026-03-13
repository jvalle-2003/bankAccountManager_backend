module.exports = (sequelize, DataTypes) => {
  const Periods = sequelize.define('Periods', {
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
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    closed_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    closed_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'Periods',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['year', 'month']
      }
    ]
  });

  return Periods;
};