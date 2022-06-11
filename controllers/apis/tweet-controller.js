const tweetService = require('../../service/tweet-service')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetService.getTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  postTweets: (req, res, next) => {
    tweetService.postTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: 'You have posted tweet successfully' }))
  }
}

module.exports = tweetController
