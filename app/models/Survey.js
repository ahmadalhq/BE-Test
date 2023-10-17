const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define(
    "surveys",
    {
      values: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      }
    },
    { timestamps: false }
  );
  return Survey
}