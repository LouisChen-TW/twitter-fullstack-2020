const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const onlineUsers = document.getElementById('online-users')
const numberOfOnlineUsers = document.getElementById('numberOfOnlineUsers')
const textSubmitBtn = document.getElementById('text-submit-btn')
const msg = document.getElementById('msg')

const { userId, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})
const socket = io()

// join
socket.emit('joinPublicRoom', { userId, username })

// message from server
socket.on('noticeMessage', message => {
  noticeMessage(message)
})

// message from self
socket.on('selfMessage', message => {
  selfMessage(message)
})

// message from other
socket.on('otherMessage', message => {
  otherMessage(message)
})

// 拿到在聊天室內所有的使用者
socket.on('roomUsers', users => {
  outputUsers(users)
  updateOnlineUsers(users)
})

// message submit
msg.addEventListener('keyup', e => {
  const key = e.key
  if (key === 'Enter' && !e.shiftKey) {
    textSubmitBtn.click()
  }
})

chatForm.addEventListener('submit', e => {
  e.preventDefault()
  // get msg text
  const msg = e.target.elements.msg.value
  // emit msg to server
  socket.emit('chatMessage', { msg, userId, username })
  // clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// Output notice message to DOM
function noticeMessage (message) {
  const div = document.createElement('div')
  div.classList.add('notice-message')
  div.innerHTML = `
    <span class="content">${message}</span>
  `
  document.querySelector('.chat-messages').appendChild(div)
  // scroll down
  chatMessages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

// Output self message to DOM
function selfMessage (message) {
  const div = document.createElement('div')
  div.classList.add('self-message')
  div.innerHTML = `
    <span class="content">${message.msg}</span>
    <span class="time">${message.time}</span>
  `
  document.querySelector('.chat-messages').appendChild(div)
  // scroll down
  chatMessages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

// Output other message to DOM
function otherMessage (message) {
  const div = document.createElement('div')
  div.classList.add('other-message')
  div.innerHTML = `
    <img src='${message.avatar}'>
    <div class='message-box'>
      <span class="content">${message.msg}<br></span>
      <span class="time">${message.time}</span>
    </div>
  `
  document.querySelector('.chat-messages').appendChild(div)
  // scroll down
  chatMessages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

function outputUsers (users) {
  onlineUsers.innerHTML = `
    ${users.map(user => `
      <div class="user-card">
        <img src ='${user.avatar}'>
        <div class="user-file">
          <div class="who">
            <div class="name-place">
              <span class="name">${user.username}</span>
              <span class="at-name">@${user.account}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  `
}

function updateOnlineUsers (users) {
  numberOfOnlineUsers.innerText = users.length
}
