const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/apis/tweet-controller')
const replyController = require('../../../controllers/apis/reply-controller')
const likeController = require('../../../controllers/apis/like-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:tweetId/replies', replyController.getReplies)
router.post('/:tweetId/replies', replyController.postReplies)
router.post('/:tweetId/like', likeController.likeTweets)
router.post('/:tweetId/unlike', likeController.unlikeTweets)

module.exports = router
