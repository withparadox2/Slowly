import { get, post, buildUrl } from './http'

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
    params: {
      requests: 1,
    }
  })
}

export function getLetters(id, page) {
  return get({
    path: `/posts/${id}`,
    params: {
      ver: 2,
      page
    }
  })
}

export function getMe() {
  return get({
    path: '/users/me'
  })
}

export function sendLetter(id, letter, isHost) {
  return post({
    path: `/posts/${id}/reply`,
    content: {
      body: letter,
      attachments: "",
      style: {},
      stamp: "free",
      host: isHost
    }
  })
}

export function updateLocation(lat, lng) {
  return post({
    path: '/users/me',
    content: {
      language: null, location: `${lat},${lng}`,
      location_code: "CN",
      device: 'web',
      ver: 30200,
      includes: null
    }
  })
}

export function buildAttachmentUrl(name) {
  return buildUrl({
    path: `/attachments/${name}`
  })
}