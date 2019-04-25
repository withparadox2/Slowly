import axios from 'axios'
import { getRequestParam } from './util'

const localVersion = SLOWLY_VERSION
window.appVersion = SLOWLY_VERSION

const KEY_TIMESTAMP = "key_url_timestamp"
const PARAM_TIMESTAMP = "timestamp"

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

function buildUrlWithTimestamp(stamp) {
  const location = window.location

  let search = `${PARAM_TIMESTAMP}=${stamp}`
  if (location.search) {
    const result = location.search.match(new RegExp(`[&?](${PARAM_TIMESTAMP}=[^&?]*)`))
    if (result) {
      search = location.search.replace(result[1], search)
    } else {
      search = location.search + '&' + search
    }
  } else {
    search = '?' + search
  }

  return location.origin + location.pathname + search + location.hash
}

function redirectWithTimestamp(stamp) {
  localStorage.setItem(KEY_TIMESTAMP, stamp)
  window.location.href = buildUrlWithTimestamp(stamp)
}

export function updateVersion() {
  redirectWithTimestamp(Date.now())
}

export function redirectUrl() {
  let lastTimestamp = localStorage.getItem(KEY_TIMESTAMP)
  if (lastTimestamp) {
    let curTimestamp = getRequestParam(PARAM_TIMESTAMP)
    if (!curTimestamp || curTimestamp < lastTimestamp) {
      redirectWithTimestamp(lastTimestamp)
      return true
    }
  }
  return false
}