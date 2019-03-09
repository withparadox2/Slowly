import { post } from './http'

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
