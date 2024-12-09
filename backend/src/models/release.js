'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Release extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Release.belongsTo(models.Repository, { foreignKey: 'repositoryId' });
    }
  }
  Release.init({
    repositoryId: DataTypes.INTEGER,
    version: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    seen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Release',
  });
  return Release;
};