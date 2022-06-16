const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller')
const followController = require('../../../controllers/pages/follow-controller')

router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replies', userController.getReplies)
router.get('/:id/likes', userController.getLikedTweets)
router.get('/:id/followers', followController.getFollowers)
router.get('/:id/followings', followController.getFollowings)
router.get('/:id/setting', userController.userSettingPage)
router.put('/:id/setting', userController.userSetting)

module.exports = router
