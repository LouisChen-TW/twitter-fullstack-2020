const jwt = require('jsonwebtoken')
const userService = require('../../service/user-service')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = req.user
      if (!user) throw new Error('帳號或密碼錯誤')
      if (user.role !== 'user') throw new Error('帳號或密碼錯誤')
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.cookie('jwt', token, { expiresIn: '30d', httpOnly: true })
      res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) => {
      if (err) return next(err)
      if (data.errors_messages) {
        return res.status(400).json({ status: 'error', message: [...data.errors_messages.map(item => (item.message))] })
      }
      return res.status(200).json({ status: 'success', message: 'Account has been created successfully' })
    })
  },
  logout: (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      res.cookie('jwt', 'logout', { expiresIn: '10s', httpOnly: true })
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getTweets: (req, res, next) => {
    userService.getTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getReplies: (req, res, next) => {
    userService.getReplies(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getLikedTweets: (req, res, next) => {
    userService.getLikedTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userService.getUser(req, (err, data) => {
      if (err) return res.status(200).json({ status: 'error' })
      res.status(200).json({ status: 'success', ...data })
    })
  },
  putUser: (req, res, next) => {
    userService.putUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '成功編輯個人資料' }))
  },
  userSettingPage: (req, res, next) => {
    userService.userSettingPage(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  userSetting: (req, res, next) => {
    userService.userSetting(req, (err, data) => {
      if (err) return next(err)
      if (data.errors_messages) {
        return res.status(500).json({ status: 'error', message: [...data.errors_messages.map(item => (item.message))], user: data.queryUser })
      }
      return res.status(200).json({ status: 'success', message: '成功儲存設定' })
    })
  }
}

module.exports = userController
