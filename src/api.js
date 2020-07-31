import { get, post, buildUrl } from "./http"
import * as account from "./persist/account"
import getOtp from "./otp"

export function sendEmailPasscode(email, checkpass = true) {
  return post({
    path: "/auth/email/passcode",
    noAuth: true,
    content: {
      email,
      device: "web",
      checkpass,
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

export function verifyPassword(email, password) {
  return post({
    path: "/auth/email/password",
    noAuth: true,
    content: {
      email,
      device: "web",
      password,
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
    params: {},
  })
}

export function sendLetter({ id, letter, isHost, attachments, stamp }) {
  return post({
    path: `/posts/${id}/reply`,
    content: {
      body: letter,
      attachments,
      style: {},
      stamp: stamp || "free",
      host: isHost,
    },
  })
}

export function updateLocation(lat, lng) {
  return getCountryCode(lat, lng).then((countryCode) => {
    return getMeOtp({
      content: {
        language: null,
        location: `${lat},${lng}`,
        location_code: countryCode,
        device: "web",
        ver: 30200,
        includes: null,
      },
    })
  })
}

export function getCountryCode(lat, lng) {
  return post({
    path: "/geocode",
    content: {
      lat,
      lng,
    },
  }).then((response) => {
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
    path: "/letter/read",
    content: {
      ids,
    },
  })
}

export function getTime() {
  // return get({
  //   path: "/timestamp",
  //   noAuth: true,
  // })
  return Promise.resolve({
    data: {
      now: parseInt(Date.now() / 1000 + 60),
    },
  })
}

export function getMeOtp({ params, content }) {
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
      params,
    })
  })
}

export function getCoin() {
  return getTime().then((response) => {
    const curTime = response.data.now
    const accountInfo = account.getAccount()
    const otp = getOtp(curTime, accountInfo && accountInfo.id)

    return post({
      path: "/users/me/admob/watched",
      content: {
        reward: 1,
        otp,
      },
    })
  })
}

export function getIncomingLetters() {
  return get({
    path: "/letter/incoming",
  })
}

export function getDraft(friendId) {
  return post({
    path: "/web/drafts/get",
    content: {
      post: friendId,
    },
  })
}

export function saveDraft({ friendId, body, stamp, attachments }) {
  return post({
    path: "/web/drafts/save",
    content: {
      post: friendId,
      user_id: null,
      body,
      stamp,
      attachments,
      channel: "web",
      audio: null,
    },
  })
}
