const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')
const AppError = require('.././middleware/appError')

const replyService = {
  getReplies: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      const [tweet, replies] = await Promise.all([
        Tweet.findOne({
          where: { id: TweetId },
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers', attributes: ['id'] }
          ]
        }),
        Reply.findAll({
          order: [['createdAt', 'DESC']],
          where: { TweetId },
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        })
      ])
      if (!tweet) throw new AppError('此篇貼文不存在', 400)

      const tweetData = {
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }

      const repliesData = replies.map(reply => ({
        ...reply.toJSON()
      }))

      cb(null, { tweet: tweetData, replies: repliesData, leftColTab: 'userHome' })
    } catch (err) {
      cb(err)
    }
  },
  postReplies: async (req, cb) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      const comment = helper.postValidation(req.body.comment)
      if (comment.length <= 0) throw new AppError('送出回覆不可為空白', 400)
      if (comment.length > 140) throw new AppError('送出回覆超過限制字數140個字', 400)
      const reply = await Reply.create({ UserId, TweetId, comment })
      if (!reply) throw new AppError('回覆不成功', 400)
      cb(null, reply)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = replyService
