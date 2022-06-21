const { User, Tweet, Followship } = require('../models')
const helpers = require('../_helpers')
const AppError = require('.././middleware/appError')

const followService = {
  getFollowers: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, originalUser] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            {
              model: User,
              as: 'Followers',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        User.findByPk(userId, { attributes: ['id'], raw: true })
      ])
      if (!queryUserData) throw new AppError('使用者不存在 !', 400)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followers.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })
      console.log(originalUser)
      cb(null, { user: originalUser, queryUser, tab: 'getFollowers' })
    } catch (err) {
      cb(err)
    }
  },
  getFollowings: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, originalUser] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            {
              model: User,
              as: 'Followings',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        User.findByPk(userId, { attributes: ['id'], raw: true })
      ])
      if (!queryUserData) throw new AppError('使用者不存在 !', 400)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followings.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })
      cb(null, { user: originalUser, queryUser, tab: 'getFollowings' })
    } catch (err) {
      cb(err)
    }
  },
  addFollowing: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.body.id)
      if (userId === queryUserId) throw new AppError('您不能追蹤自己 !', 400)

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) throw new AppError('使用者不存在 !', 400)

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) throw new AppError('使用者不存在 !', 400)

      const followingUserId = user.Followings.map(user => user.id)
      if (followingUserId.includes(queryUserId)) throw new AppError('您已經追蹤過此使用者了 !', 400)

      const followShip = await Followship.create({ followerId: userId, followingId: queryUserId })
      cb(null, followShip)
    } catch (err) {
      cb(err)
    }
  },
  removeFollowing: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId === queryUserId) throw new AppError('您不能取消追蹤自己 !', 400)

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) throw new AppError('使用者不存在 !', 400)

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) throw new AppError('使用者不存在 !', 400)

      const followingUserId = user.Followings.map(user => user.id)
      if (!followingUserId.includes(queryUserId)) throw new AppError('您還未追蹤此使用者 !', 400)

      const followShip = await Followship.destroy({
        where: { followerId: userId, followingId: queryUserId }
      })
      cb(null, followShip)
    } catch (err) {
      cb(err)
    }
  },
  topFollow: async (req, cb) => {
    try {
      const userId = helpers.getUser(req).id
      const topFollowed = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [{ model: User, as: 'Followers', attributes: ['id'] }],
        where: [{ role: 'user' }]
      })
      const topFollowedData = topFollowed.map(follow => ({
        ...follow.toJSON(),
        followerCounts: follow.Followers.length,
        isFollowed: follow.Followers.some(item => item.id === userId),
        isSelf: (userId !== follow.id)
      }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      cb(null, { topFollowed: topFollowedData })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = followService
