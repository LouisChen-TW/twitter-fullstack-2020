const tweetService = require('../../service/tweet-service')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetService.getTweets(req, (err, data) => err ? next(err) : res.render('tweet', { ...data })
    )
  },
  postTweets: (req, res, next) => {
    tweetService.postTweets(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功送出推文')
      return res.redirect('/tweets')
    })
  }
}
module.exports = tweetController
