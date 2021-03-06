module.exports = (sequelize, DataTypes, User, Skill) => {
  var UserSkills = sequelize.define("UserSkills", {
    Id: {
      field: "id",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    skilltype: DataTypes.ENUM("guide", "learner"),
    userId: DataTypes.INTEGER,
    skillId: DataTypes.INTEGER,
  });
  return UserSkills;
};
