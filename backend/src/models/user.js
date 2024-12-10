'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    githubId: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    accessToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};