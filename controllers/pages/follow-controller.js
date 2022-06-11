const followService = require('../../service/follow-service')

const followController = {
  getFollowers: (req, res, next) => {
    followService.getFollowers(req, (err, data) => {
      if (err) return next(err)
      return res.render('followship', { ...data })
    })
  },
  getFollowings: (req, res, next) => {
    followService.getFollowings(req, (err, data) => {
      if (err) return next(err)
      return res.render('followship', { ...data })
    })
  },
  addFollowing: (req, res, next) => {
    followService.addFollowing(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功追蹤')
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res, next) => {
    followService.removeFollowing(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功取消追蹤')
      return res.redirect('back')
    })
  }
}

module.exports = followController
