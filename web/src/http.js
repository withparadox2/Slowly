import axios from 'axios'
import { getToken } from './persist/account'

const BASE_URL = "https://api.getslowly.com"

function addParams(url, params) {
  if (!params || Object.keys(params).length == 0) {
    return url
  }
  let appendStr = ''
  for (let key in params) {
    if (appendStr.length != 0) {
      appendStr += '&'
    }
    appendStr += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  }
  return `${url}${url.indexOf('?') >= 0 ? '&' : '?'}${appendStr}`
}

function addToken(params, requireAuth) {
  if (!params) {
    params = {}
  }
  if (requireAuth) {
    params.token = getToken()
  }
  return params
}

function post({
  path,
  params,
  content,
  noAuth = false,
  headers
}) {
  return axios({
    method: 'post',
    url: buildUrl({ path, params, noAuth }),
    data: content,
    headers
  }).catch((error) => {
    return Promise.reject({
      error,
      message: parseError(error)
    })
  });
}

function get({
  path,
  params,
  noAuth = false
}) {
  return axios.get(buildUrl({ path, params, noAuth }))
    .catch((error) => {
      return Promise.reject({
        error,
        message: parseError(error)
      })
    })
}

function buildUrl({
  path,
  params,
  noAuth = false
}) {
  params = addToken(params, !noAuth)
  return addParams(BASE_URL + path, params)
}

function parseError(err) {
  if (err.response && err.response.data) {
    if (err.response.data.error) {
      return err.response.data.error
    } else {
      return JSON.stringify(err.response.data)
    }
  } else if (err.message) {
    return err.message
  }
  return 'unknown error'
}

export {
  post,
  get,
  buildUrl
}
