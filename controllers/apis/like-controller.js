const likeService = require('../../service/like-service')

const likeController = {
  likeTweets: (req, res, next) => {
    likeService.likeTweets(req, (err, data) => err ? next(err) : res.status(302).json({ status: 'success' }))
  },
  unlikeTweets: (req, res, next) => {
    likeService.unlikeTweets(req, (err, data) => err ? next(err) : res.status(302).json({ status: 'success' }))
  }
}

module.exports = likeController
