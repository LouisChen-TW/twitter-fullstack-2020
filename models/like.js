'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  Like.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes'
    }
  )
  return Like
}
