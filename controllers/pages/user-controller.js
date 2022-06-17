const userService = require('../../service/user-service')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) => {
      if (err) return next(err)
      if (data.errors_messages) {
        return res.render('signup', data)
      }
      req.flash('success_messages', '您已成功註冊帳號！')
      return res.redirect('/signin')
    })
  },
  signInPage: async (req, res, next) => {
    try {
      res.render('signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      if (req.user.role !== 'user') {
        req.flash('error_messages', '此帳號不存在！')
        req.logout()
        return res.redirect('/signin')
      }
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getTweets: (req, res, next) => {
    userService.getTweets(req, (err, data) => {
      if (err) return next(err)
      return res.render('user', { ...data })
    })
  },
  getReplies: (req, res, next) => {
    userService.getReplies(req, (err, data) => {
      if (err) return next(err)
      return res.render('user', { ...data })
    })
  },
  getLikedTweets: (req, res, next) => {
    userService.getLikedTweets(req, (err, data) => {
      if (err) return next(err)
      return res.render('user', { ...data })
    })
  },
  getUser: (req, res, next) => {
    userService.getUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', ...data }))
  },
  putUser: (req, res, next) => {
    userService.putUser(req, (err, data) => {
      if (err) return next(err)
      return req.flash('success_messages', '成功編輯個人資料')
    })
  },
  userSettingPage: (req, res, next) => {
    userService.userSettingPage(req, (err, data) => {
      if (err) return next(err)
      return res.render('setting', { ...data })
    })
  },
  userSetting: (req, res, next) => {
    userService.userSetting(req, (err, data) => {
      if (err) return next(err)
      if (data.errors_messages) {
        return res.render('setting', data)
      }
      req.flash('success_messages', '成功儲存設定')
      return res.redirect('back')
    })
  }
}

module.exports = userController
