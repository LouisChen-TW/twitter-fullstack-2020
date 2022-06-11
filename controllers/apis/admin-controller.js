const adminService = require('../../service/admin-service')

const adminController = {
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
