const replyService = require('../../service/reply-service')

const replyController = {
  getReplies: async (req, res, next) => {
    replyService.getReplies(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  postReplies: async (req, res, next) => {
    replyService.postReplies(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: 'You have posted reply successfully' }))
  }
}

module.exports = replyController
