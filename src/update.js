import axios from 'axios'

const localVersion = SLOWLY_VERSION
window.appVersion = SLOWLY_VERSION

export function checkVersion() {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `./version.json?t=${Date.now()}`,
    }).then(response => {
      resolve(response.data && response.data.versionCode > localVersion.versionCode)
    }).catch((error) => {
      resolve(false)
    })
  })
}

function buildUrlWithStamp() {
  let url = window.location.href
  let appendChar = url.indexOf('?') >= 0 ? '&' : '?'
  let arr = url.split('#')
  arr.splice(1, 0, `${appendChar}t=${Date.now()}#`)
  return arr.join('')
}

export function updateVersion() {
  window.location.href = buildUrlWithStamp()
}