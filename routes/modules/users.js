const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replies', userController.getReplies)
router.get('/:id/likes', userController.getLikedTweets)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)

module.exports = router
