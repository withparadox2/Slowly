const KEY_TOKEN = "slowly-key-token"
const KEY_ACCOUNT = "slowly-key-account"

let token, account

//TODO deal with token expired
function getToken() {
  if (!token) {
    token = localStorage.getItem(KEY_TOKEN)
  }
  return token
}

function setToken(input) {
  token = input
  localStorage.setItem(KEY_TOKEN, token)
}

function getAccount() {
  if (!account) {
    let str = localStorage.getItem(KEY_ACCOUNT)
    try {
      account = str ? JSON.parse(str) : null
    } catch (e) {
      setAccount('')
      account = null
    }
  }
  return account
}

function setAccount(user) {
  account = user
  localStorage.setItem(KEY_ACCOUNT, JSON.stringify(user))
}

function clear() {
  setToken('')
  setAccount('')
}

export {
  setToken,
  getToken,
  getAccount,
  setAccount,
  clear
}