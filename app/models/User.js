module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      digits: Sequelize.STRING(10),
      fotoUrl: Sequelize.STRING(10),
      workType: Sequelize.STRING(10),
      positionTitle: Sequelize.STRING(10),
      lat: Sequelize.FLOAT,
      lon: Sequelize.FLOAT,
      company: Sequelize.STRING(10),
      isLogin: Sequelize.BOOLEAN,
      dovote: Sequelize.BOOLEAN,
      dosurvey: Sequelize.BOOLEAN,
      dofeedback: Sequelize.BOOLEAN,
      fullName: Sequelize.STRING,
      cuurentLeave: Sequelize.INTEGER,
    },
    { timestamps: false }
  );
  return User
}