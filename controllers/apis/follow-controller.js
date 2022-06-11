const followService = require('../../service/follow-service')

const followController = {
  getFollowers: (req, res, next) => {
    followService.getFollowers(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getFollowings: (req, res, next) => {
    followService.getFollowings(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  addFollowing: (req, res, next) => {
    followService.addFollowing(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '成功追蹤' }))
  },
  removeFollowing: (req, res, next) => {
    followService.removeFollowing(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '成功取消追蹤' }))
  },
  topFollowed: (req, res, next) => {
    followService.topFollow(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = followController
