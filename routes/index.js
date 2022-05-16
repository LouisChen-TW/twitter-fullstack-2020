const express = require('express')
const router = express.Router()
const passport = require('passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const userController = require('../controllers/user-controller')
const apiController = require('../controllers/api-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// api 路由入口
router.post('/api/users/:id/avatar', authenticated, upload.single('image'), apiController.putAvatar)
router.post('/api/users/:id', authenticated, apiController.putUser)
router.get('/api/users/:id', authenticated, apiController.getUser)

// admin 路由入口
router.use('/admin', authenticatedAdmin, admin)

// users 路由入口
router.use('/users', authenticated, users)
router.delete('/followships/:id', authenticated, userController.removeFollowing)
router.post('/followships', authenticated, userController.addFollowing)

// tweets 路由入口
router.use('/tweets', authenticated, tweets)

// 以下註冊、登入、登出路由以及followships
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('user-local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

// fallback 路由
router.get('/', (req, res) => {
  res.redirect('/tweets')
})
router.use('/', generalErrorHandler)
module.exports = router
