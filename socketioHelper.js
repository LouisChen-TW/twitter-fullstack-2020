const dayjs = require('dayjs')
const { User } = require('./models')

const users = []

const socketioHelpers = {
  formatSelfMessages: data => {
    return {
      userId: data.userId,
      msg: data.msg,
      time: dayjs().format('MMM D h:mm a')
    }
  },
  formatOtherMessages: async data => {
    try {
      const user = await User.findByPk(data.userId, {
        attributes: ['avatar'],
        raw: true
      })
      if (!user) throw new Error('請稍後再試')
      return {
        userId: data.userId,
        msg: data.msg,
        avatar: user.avatar,
        time: dayjs().format('MMM D h:mm a')
      }
    } catch (err) {
      console.log(err)
    }
  },
  userJoin: async (id, userId, username) => {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['account', 'avatar'],
        raw: true
      })
      const data = {
        id,
        userId,
        username,
        account: user.account,
        avatar: user.avatar
      }
      users.push(data)
    } catch (err) {
      console.log(err)
    }
  },
  getCurrentUser: id => {
    return users.find(user => user.id === id)
  },
  userLeave: id => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
      return users.splice(index, 1)[0]
    }
  },
  getAllUsers: () => {
    return users
  }
}

module.exports = socketioHelpers
