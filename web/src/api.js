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
