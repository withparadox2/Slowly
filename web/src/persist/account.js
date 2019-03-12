const KEY_TOKEN = "key-token"
const KEY_USER = "key-user"

//TODO deal with token expired
function getToken() {
  return localStorage.getItem(KEY_TOKEN)
}

function setToken(token) {
  localStorage.setItem(KEY_TOKEN, token)
}

function getAccount() {
  let userStr = localStorage.getItem(KEY_USER)
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    setUser('')
    return null
  }
}

function setAccount(user) {
  localStorage.setItem(KEY_USER, JSON.stringify(user))
}

export {
  setToken,
  getToken,
  getAccount,
  setAccount
}