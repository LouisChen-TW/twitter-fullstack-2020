const jwt = require('jsonwebtoken')
const adminService = require('../../service/admin-service')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const user = req.user
      if (!user) throw new Error('帳號或密碼錯誤')
      if (user.role !== 'admin') throw new Error('帳號或密碼錯誤')
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
  getTweets: (req, res, next) => {
    adminService.getTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getUsers: (req, res, next) => {
    adminService.getUsers(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) => {
    adminService.deleteTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: 'You have delete the tweet successfully' }))
  }
}

module.exports = adminController
