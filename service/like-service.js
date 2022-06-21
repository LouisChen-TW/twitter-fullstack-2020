const { Like } = require('../models')
const helper = require('../_helpers')
const AppError = require('.././middleware/appError')

const likeServices = {
  likeTweets: async (req, cb) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new AppError('該篇貼文已不存在', 400)
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (existLike) throw new AppError('您已喜歡過該篇貼文', 400)
      const like = await Like.create({ UserId, TweetId })
      if (!like) throw new AppError('發生錯誤，請稍後再試', 500)
      cb(null, { like })
    } catch (err) {
      cb(err)
    }
  },
  unlikeTweets: async (req, cb) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new AppError('該篇貼文不存在，請重新整理', 400)
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (!existLike) throw new AppError('您尚未喜歡該篇貼文', 400)
      const unlike = await Like.destroy({
        where: { UserId, TweetId }
      })
      if (!unlike) throw new AppError('發生錯誤，請稍後再試', 500)
      cb(null, { unlike })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = likeServices
