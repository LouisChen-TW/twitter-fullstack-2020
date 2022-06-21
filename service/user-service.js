const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { removeAllSpace, removeOuterSpace } = require('../_helpers')
const helpers = require('../_helpers')
const AppError = require('.././middleware/appError')

const userService = {
  signUp: async (req, cb) => {
    try {
      const errors_messages = []
      let { account, name, email, password, checkPassword } = req.body

      if (!account || !email || !password) {
        errors_messages.push({ message: '請確認必填欄位' })
      }

      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) errors_messages.push({ message: '帳號已被註冊' })

      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) errors_messages.push({ message: '信箱已被註冊' })

      if (password !== checkPassword) errors_messages.push({ message: '密碼輸入不相同' })

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (name.length > 50) errors_messages.push({ message: '名稱長度限制50字元以內' })
      if (!name) name = account

      if (errors_messages.length) {
        return cb(null, { errors_messages, account, name, email })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const user = await User.create({ account, name, email, password: hash })

      return cb(null, user)
    } catch (err) {
      cb(err)
    }
  },
  getTweets: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, tweets, originalUser] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        Tweet.findAll({
          include: [
            Reply,
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: User,
              as: 'LikedUsers',
              attributes: ['id']
            }
          ],
          where: { UserId: queryUserId },
          order: [['createdAt', 'DESC']]
        }),
        User.findByPk(userId, { attributes: ['id'], raw: true })
      ])
      if (!queryUserData) throw new AppError('使用者不存在 !', 400)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      tweets.forEach(function (tweet, index) {
        this[index] = {
          ...tweet.toJSON(),
          isLiked: tweet.LikedUsers.some(item => item.id === userId)
        }
      }, tweets)
      cb(null, { user: originalUser, queryUser, tweets, tab: 'getTweets', leftColTab: 'userInfo' })
    } catch (err) {
      cb(err)
    }
  },
  getReplies: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, replies, originalUser] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        Reply.findAll({
          where: { UserId: queryUserId },
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: Tweet,
              include: [{ model: User, attributes: ['id', 'account'] }]
            }
          ],
          order: [['createdAt', 'DESC']]
        }),
        User.findByPk(userId, { attributes: ['id'], raw: true })
      ])
      if (!queryUserData) throw new AppError('使用者不存在 !', 400)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      replies.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, replies)

      cb(null, { user: originalUser, queryUser, replies, tab: 'getReplies', leftColTab: 'userInfo' })
    } catch (err) {
      cb(err)
    }
  },
  getLikedTweets: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, likedTweets, originalUser] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        Like.findAll({
          where: { UserId: queryUserId },
          attributes: ['id', 'createdAt'],
          include: [{
            model: Tweet,
            attributes: ['id', 'description', 'createdAt'],
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
              { model: Reply, attributes: ['id'] },
              { model: User, as: 'LikedUsers', attributes: ['id'] }
            ]
          }],
          order: [['createdAt', 'DESC']]
        }),
        User.findByPk(userId, { attributes: ['id'], raw: true })
      ])
      if (!queryUserData) throw new AppError("User didn't exist!", 400)

      likedTweets.forEach(function (likedTweet, index) {
        this[index] = {
          ...likedTweet.toJSON(),
          isLiked: likedTweet.Tweet.LikedUsers.some(item => item.id === userId),
          isSelf: userId === queryUserId
        }
      }, likedTweets)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      cb(null, { user: originalUser, queryUser, likedTweets, tab: 'getLikedTweets', leftColTab: 'userInfo' })
    } catch (err) {
      cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId !== queryUserId) throw new Error('您無權限編輯使用者 !')

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) throw new Error('使用者不存在 !')

      delete queryUser.password
      cb(null, queryUser)
    } catch (err) {
      cb(err)
    }
  },
  putUser: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      const { name, introduction, acCover } = req.body

      if (name?.length > 50) throw new AppError('名稱長度限制 50 字元以內 !', 400)
      if (introduction?.length > 160) throw new AppError('名稱長度限制 160 字元以內 !', 400)
      if (userId !== queryUserId) throw new AppError('您無權限編輯使用者 !', 400)

      const cover = req.files?.cover
      const avatar = req.files?.avatar

      const [queryUser, coverFilePath, avatarFilePath] = await Promise.all([User.findByPk(queryUserId), cover ? helpers.imgurFileHandler(cover[0]) : null, avatar ? helpers.imgurFileHandler(avatar[0]) : null])

      if (!queryUser) throw new AppError('使用者不存在 !', 400)

      const updatedQueryUser = await queryUser.update({ name, introduction, cover: coverFilePath || acCover || queryUser.cover, avatar: avatarFilePath || queryUser.avatar })

      const user = updatedQueryUser.toJSON()
      delete user.password

      cb(null, user)
    } catch (err) {
      cb(err)
    }
  },
  userSettingPage: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId !== queryUserId) throw new AppError('您沒有權限瀏覽他人頁面 !', 403)

      const queryUserData = await User.findByPk(queryUserId)
      if (!queryUserData) throw new AppError('使用者不存在 !', 400)

      const queryUser = queryUserData.toJSON()
      delete queryUser.password

      cb(null, { user: queryUser, leftColTab: 'userSetting' })
    } catch (err) {
      cb(err)
    }
  },
  userSetting: async (req, cb) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      let { account, name, email, password, confirmPassword } = req.body
      const errors_messages = []
      if (account == null || email == null) {
        errors_messages.push({ message: '帳號或 email 必填欄位未填寫完整' })
      }
      if (password !== confirmPassword) {
        errors_messages.push({ message: '密碼與密碼再確認不相符 !' })
      }
      if (name?.length > 50) {
        errors_messages.push({ message: '名稱長度限制 50 字元以內 !' })
      }
      if (userId !== queryUserId) {
        errors_messages.push({ message: '您沒有權限編輯使用者 !' })
      }

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (!name) name = account

      const queryUser = await User.findByPk(queryUserId)
      if (!queryUser) {
        errors_messages.push({ message: '使用者不存在 !' })
      }
      if (account !== queryUser.account) {
        const matchedAccount = await User.findOne({ where: { account } })
        if (matchedAccount) {
          errors_messages.push({ message: '此帳號已被其他使用者使用了 !' })
        }
      }
      if (email !== queryUser.email) {
        const matchedEmail = await User.findOne({ where: { email } })
        if (matchedEmail) {
          errors_messages.push({ message: '此 email 已被其他使用者使用了 !' })
        }
      }
      if (password && await bcrypt.compareSync(password, queryUser.password)) {
        errors_messages.push({ message: '新密碼不能與舊密碼相同 !' })
      }
      if (errors_messages.length) {
        return cb(null, { errors_messages, queryUser: queryUser.toJSON() })
      }

      const hash = password ? await bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : queryUser.password
      const updatedQueryUser = await queryUser.update({ account, name, email, password: hash })
      const data = updatedQueryUser.toJSON()
      delete data.password
      return cb(null, updatedQueryUser)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userService
