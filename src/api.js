import { get, post, buildUrl } from "./http"
import * as account from "./persist/account"
import getOtp from "./otp"

export function sendEmailPasscode(email) {
  return post({
    path: "/auth/email/passcode",
    noAuth: true,
    content: {
      email,
      device: "web",
    },
  })
}

export function verifyPasscode(email, passcode) {
  return post({
    path: "/auth/email",
    noAuth: true,
    content: {
      email,
      device: "web",
      passcode,
    },
  })
}

export function getFriends() {
  return get({
    path: "/users/me/friends/v2",
    params: {
      requests: 1,
    },
  })
}

export function getLetters(id, page) {
  return get({
    path: `/friend/${id}/all`,
    params: {
      ver: 2,
      page,
    },
  })
}

export function getMe(otp) {
  return getMeOtp({
    params: {}
  })
}

export function sendLetter(id, letter, isHost, attachments) {
  return post({
    path: `/posts/${id}/reply`,
    content: {
      body: letter,
      attachments,
      style: {},
      stamp: "free",
      host: isHost,
    },
  })
}

export function updateLocation(lat, lng) {
  return getCountryCode(lat, lng)
  .then(countryCode => {
    return getMeOtp({
      content: {
        language: null,
        location: `${lat},${lng}`,
        location_code: countryCode,
        device: "web",
        ver: 30200,
        includes: null
      }
    })
  })
  
}

export function getCountryCode(lat, lng) {
  return post({
    path: "/geocode",
    content: {
      lat, lng
    },
  }).then(response => {
    return response.data[0].properties.countryCode
  })
}

export function buildAttachmentUrl(name) {
  return buildUrl({
    path: `/attachments/${name}`,
  })
}

export function buildUploadUrl(post) {
  return buildUrl({
    path: "/attachments",
    params: {
      post,
    },
  })
}

export function uploadImages(postId, files) {
  return Promise.all(files.map((file) => uploadImage(postId, file)))
}

export function uploadImage(postId, file) {
  let data = new FormData()
  data.append(`image`, file)
  return post({
    path: "/attachments",
    params: {
      post: postId,
    },
    content: data,
  })
}

export function readLetter(ids) {
  return post({
    path: "/comments/read",
    params: {
      ids,
    },
  })
}

export function getTime() {
  return get({
    path: "/timestamp",
  })
}

export function getMeOtp({params, content}) {
  return getTime().then((response) => {
    const curTime = response.data.now
    const accountInfo = account.getAccount()
    const otp = getOtp(curTime, accountInfo && accountInfo.id)

    if (params) {
      params.otp = otp
    } else if (content) {
      content.otp = otp
    }

    return post({
      path: "/users/me/v2",
      content,
      params
    })
  })
}
