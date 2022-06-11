const express = require('express')
const router = express.Router()
const passport = require('passport')

const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/pages/admin-controller')
const userController = require('../../controllers/pages/user-controller')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

// 以下註冊、登入、登出路由
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

// admin 登入、登出路由
router.get('/admin/signin', adminController.signInPage)
router.post(
  '/admin/signin',
  passport.authenticate('admin-local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.signIn
)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)

// fallback 路由
router.get('*', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', generalErrorHandler)
module.exports = router
