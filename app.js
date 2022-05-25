if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const { getUser, handlebarsHelpers } = require('./_helpers')
const routes = require('./routes')
const socketioHelpers = require('./socketioHelper')
const { userLeave } = require('./socketioHelper')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.errors_messages = req.flash('errors_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

// 當使用者連線時就跑以下的function
io.on('connection', socket => {
  // 使用者進入聊天室
  socket.on('joinPublicRoom', async ({ userId, username }) => {
    // 將id & name 存入陣列中
    await socketioHelpers.userJoin(socket.id, userId, username)
    // 只針對特定使用者(歡迎連線)
    socket.emit('noticeMessage', (`歡迎 ${username}`))
    // 針對所有除了自己外的使用者(OOO上線了)
    socket.broadcast.emit('noticeMessage', (`${username} 上線`))
    // 傳送所有連線中的使用者名單給前端
    io.emit('roomUsers', socketioHelpers.getAllUsers())
  })

  // 監聽前端傳來的chatMessage
  socket.on('chatMessage', async msg => {
    // 只針對自己的訊息
    socket.emit('selfMessage', socketioHelpers.formatSelfMessages(msg))
    // 針對除了自己外的使用者
    socket.broadcast.emit('otherMessage', await socketioHelpers.formatOtherMessages(msg))
  })

  // 當使用者離線時
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
    // 針對所有使用者（OOO下線了）
      io.emit('noticeMessage', (`${user.username} 離線`))
    }
  })
  io.emit('roomUsers', socketioHelpers.getAllUsers())
})

server.listen(port, () => console.log(`Simple Twitter listening on port ${port}!`))

module.exports = app
