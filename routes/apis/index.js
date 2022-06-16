const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')
const passport = require('../../config/passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const pageAuth = require('../../middleware/auth')

const userController = require('../../controllers/apis/user-controller')

router.get('/users/:id', pageAuth.authenticated, pageAuth.authenticatedUser, userController.getUser)
router.post('/users/:id', pageAuth.authenticated, pageAuth.authenticatedUser, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUser)

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

// api user&admin登入、註冊
router.post('/admin/signin', passport.authenticate('admin-local', { session: false }), userController.signIn)
router.post('/signin', passport.authenticate('user-local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)

router.use('/', apiErrorHandler)

module.exports = router
