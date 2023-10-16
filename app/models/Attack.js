module.exports = (sequelize, Sequelize) => {
  const Attack = sequelize.define(
    "attacks",
    {
      sourceCountry: Sequelize.STRING(5),
      destinationCountry: Sequelize.STRING(5),
      millisecond: Sequelize.INTEGER,
      type: Sequelize.STRING(50),
      weight: Sequelize.INTEGER,
      attackTime: Sequelize.STRING(50)
    },
    { timestamps: false }
  );
  return Attack
}