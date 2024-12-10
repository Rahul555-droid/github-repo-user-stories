'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRepository extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRepository.belongsTo(models.User, { foreignKey: 'userId' });
      UserRepository.belongsTo(models.Repository, { foreignKey: 'repositoryId' });
    }
  }
  UserRepository.init({
    userId: DataTypes.INTEGER,
    repositoryId: DataTypes.INTEGER,
    seenReleases: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'UserRepository',
  });
  return UserRepository;
};