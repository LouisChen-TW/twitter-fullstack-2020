const { Tweet, User, Reply, Like } = require('../models')
const helper = require('../_helpers')
const AppError = require('.././middleware/appError')

const adminService = {
  getTweets: async (req, cb) => {
    try {
      const userId = helper.getUser(req)?.id
      const [user, tweets] = await Promise.all([
        User.findByPk(userId,
          {
            attributes: ['id', 'name', 'avatar'],
            raw: true
          }),
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        })
      ])
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        description: tweet.description.substring(0, 50)
      }))
      return cb(null, { user, tweets: data, adminMenu: 'tweets' })
    } catch (err) {
      cb(err)
    }
  },
  deleteTweet: async (req, cb) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new AppError("Tweet didn't exist!", 400)
      const deletedTweet = await tweet.destroy()
      const reply = await Reply.destroy({ where: { TweetId } })
      const like = await Like.destroy({ where: { TweetId } })
      if (!deletedTweet || !reply || !like) throw new AppError('發生錯誤，請稍後再試', 400)

      cb(null, deletedTweet)
    } catch (err) {
      cb(err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, as: 'LikedUsers' }] }
        ]
      })

      const data = users.map(user => ({
        ...user.toJSON(),
        tweetCounts: user.Tweets.length,
        followingCounts: user.Followers.length,
        followerCounts: user.Followings.length,
        beenLikedTweets: user.Tweets.reduce((acc, obj) => {
          return acc + obj.LikedUsers.length
        }, 0)
      }))
        .sort((a, b) => b.tweetCounts - a.tweetCounts)
      cb(null, { users: data, adminMenu: 'users' })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminService
