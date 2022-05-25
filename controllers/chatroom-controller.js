const chatroomController = {
  getPublic: async (req, res, next) => {
    try {
      res.render('publicChatRoom', { leftColTab: 'publicChatRoom' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = chatroomController
