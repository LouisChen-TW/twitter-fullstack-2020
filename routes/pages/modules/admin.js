const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/pages/admin-controller')

router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/logout', adminController.logout)

module.exports = router
