import axios from "axios"
import { getRequestParam } from "./util"

const localVersion = SLOWLY_VERSION
window.appVersion = SLOWLY_VERSION

const KEY_TIMESTAMP = "key_url_timestamp"
const PARAM_TIMESTAMP = "t"

function formatChangeLog(changeLog) {
  if (changeLog && changeLog.length > 0) {
    changeLog.forEach((item) => {
      item.contentItems =
        typeof item.content === "string"
          ? item.content.split("\n")
          : item.content
    })
  }
  return changeLog
}

export function checkVersion() {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: `./change-log.json?t=${Date.now()}`,
    })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          formatChangeLog(response.data)

          let remoteVersion = response.data[0]
          resolve({
            newVersion:
              remoteVersion &&
              remoteVersion.versionCode > localVersion.versionCode
                ? {
                    content: remoteVersion.contentItems,
                  }
                : null,
            changeLog: response.data,
          })
        } else {
          resolve(false)
        }
      })
      .catch((error) => {
        console.error(error)
        resolve(false)
      })
  })
}

function buildUrlWithTimestamp(stamp) {
  const location = window.location

  let search = `${PARAM_TIMESTAMP}=${stamp}`
  if (location.search) {
    const result = location.search.match(
      new RegExp(`[&?](${PARAM_TIMESTAMP}=[^&?]*)`)
    )
    if (result) {
      search = location.search.replace(result[1], search)
    } else {
      search = location.search + "&" + search
    }
  } else {
    search = "?" + search
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
  if (lastTimestamp == "null") {
    localStorage.removeItem(KEY_TIMESTAMP)
    lastTimestamp = null
  }
  let curTimestamp = getRequestParam(PARAM_TIMESTAMP)
  if (lastTimestamp) {
    if (!curTimestamp || curTimestamp < lastTimestamp) {
      redirectWithTimestamp(lastTimestamp)
      return true
    }
  } else if (curTimestamp) {
    localStorage.setItem(KEY_TIMESTAMP, curTimestamp)
  }
  return false
}
