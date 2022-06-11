const express = require('express')
const router = express.Router()

const followController = require('../../../controllers/pages/follow-controller')
const apiFollowController = require('../../../controllers/apis/follow-controller')

router.post('/', followController.addFollowing)
router.delete('/:id', followController.removeFollowing)
router.get('/topfollowed', apiFollowController.topFollowed)

module.exports = router
