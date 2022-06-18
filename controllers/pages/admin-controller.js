const adminService = require('../../service/admin-service')

const adminController = {
  signInPage: async (req, res, next) => {
    try {
      res.render('admin/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        req.flash('error_messages', '此帳號不存在！')
        req.logout()
        return res.redirect('/admin/signin')
      }
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  getTweets: (req, res, next) => {
    adminService.getTweets(req, (err, data) => err ? next(err) : res.render('admin/tweets', data))
  },
  deleteTweet: (req, res, next) => {
    adminService.deleteTweet(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功刪除')
      res.redirect('back')
    })
  },
  getUsers: (req, res, next) => {
    adminService.getUsers(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  }
}
module.exports = adminController
