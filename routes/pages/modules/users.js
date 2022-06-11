const express = require('express')
const router = express.Router()

const upload = require('../../../middleware/multer')

const apiController = require('../../../controllers/pages/api-controller')
const userController = require('../../../controllers/pages/user-controller')
const followController = require('../../../controllers/pages/follow-controller')

router.get('/:id', userController.getUser)
router.post('/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), apiController.putUser)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replies', userController.getReplies)
router.get('/:id/likes', userController.getLikedTweets)
router.get('/:id/followers', followController.getFollowers)
router.get('/:id/followings', followController.getFollowings)
router.get('/:id/setting', userController.userSettingPage)
router.put('/:id/setting', userController.userSetting)

module.exports = router
