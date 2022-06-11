const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')

const tweetService = {
  getTweets: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
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
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers' }
          ]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }))
      cb(null, { user, tweets: data, leftColTab: 'userHome' })
    } catch (err) {
      cb(err)
    }
  },
  postTweets: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const postDescription = helper.postValidation(req.body.description)
      if (postDescription.length <= 0) throw new Error('送出推文不可為空白')
      if (postDescription.length > 140) throw new Error('送出推文超過限制字數140個字')
      const tweet = await Tweet.create({
        UserId: userId,
        description: postDescription
      })
      if (!tweet) throw new Error('推文不成功')
      cb(null, tweet)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = tweetService
