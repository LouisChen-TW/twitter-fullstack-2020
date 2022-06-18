
const signIn = document.querySelector('.signup-form')

signIn.addEventListener('submit', e => {
  e.preventDefault()
  const account = document.querySelector('#account').value
  const password = document.querySelector('#password').value
  login(account, password)
})

async function login (account, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BASE_URL}api/signin`,
      data: {
        account,
        password
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', '成功登入')
      const alert = document.querySelector('.alert')
      window.setTimeout(() => {
        alert.classList.add('cb')
      }, 500)
      window.setTimeout(() => {
        alert.classList.remove('cb')
      }, 3500)
      window.setTimeout(() => {
        location.assign('/tweets')
      }, 3500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
    const alert = document.querySelector('.alert')
    window.setTimeout(() => {
      alert.classList.add('cb')
    }, 500)
    window.setTimeout(() => {
      alert.classList.remove('cb')
    }, 3000)
  }
}

const hideAlert = () => {
  const el = document.querySelector('.alert')
  if (el) el.parentElement.removeChild(el)
}

// type is 'success' or 'error'
const showAlert = (type, msg, time = 5) => {
  hideAlert()
  const markup = `
  <div class='alert alert-${type} d-flex align-items-center flash' role='alert'>
    <div class='text'>
      ${msg}
    </div>
    <i class="${type}"></i>
  </div>
`
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
  window.setTimeout(hideAlert, time * 1000)
}
