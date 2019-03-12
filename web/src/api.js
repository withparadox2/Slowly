import { get, post } from './http'

export function sendEmailPasscode(email) {
  return post({
    path: '/auth/email/passcode',
    noAuth: true,
    content: {
      email,
      device: 'web'
    }
  })
}

export function verifyPasscode(email, passcode) {
  return post({
    path: '/auth/email',
    noAuth: true,
    content: {
      email,
      device: 'web',
      passcode
    }
  })
}

export function getFriends() {
  return get({
    path: '/users/me/friends/v2',
    requests: 1
  })
}

export function getLetters(id, page) {
  return get({
    path: `/posts/${id}`,
    ver: 2,
    page
  })
}

export function getMe() {
  return get({
    path: '/users/me'
  })
}
