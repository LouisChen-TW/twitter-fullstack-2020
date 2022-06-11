const express = require('express')
const router = express.Router()

const followController = require('../../../controllers/apis/follow-controller')

router.post('/', followController.addFollowing)
router.delete('/:id', followController.removeFollowing)
router.get('/topfollowed', followController.topFollowed)

module.exports = router
