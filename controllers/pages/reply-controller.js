const replyService = require('../../service/reply-service')

const replyController = {
  getReplies: async (req, res, next) => {
    replyService.getReplies(req, (err, data) => {
      if (err) return next(err)
      return res.render('reply', { ...data })
    })
  },
  postReplies: async (req, res, next) => {
    replyService.postReplies(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功送出回覆')
      return res.redirect('back')
    })
  }
}

module.exports = replyController
