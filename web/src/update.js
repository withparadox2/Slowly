import axios from 'axios'

const localVersion = SLOWLY_VERSION

export function checkVersion() {
  const p = new Promise()
  axios({
    method: 'get',
    url: './version.json'
  }).then(response => {
    p.resolve(response.data && response.data.versionCode > localVersion.versionCode)
  }).catch((error) => {
    p.resolve(false)
  })
  return p
}