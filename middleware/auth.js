const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      req.flash('warning_messages', '請先登入才能使用！')
      return res.redirect('/signin')
    }
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next()
  req.flash('warning_messages', '請從前台登入才能使用！')
  return res.redirect('/admin/tweets')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  req.flash('warning_messages', '請從後台登入才能使用！')
  return res.redirect('/tweets')
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}
