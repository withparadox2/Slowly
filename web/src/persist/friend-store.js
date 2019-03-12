import { insert, clear } from './database'
import { STORE_FRIENDS } from './versions'

export function getFriends() {
  return get(STORE_FRIENDS)
}

export function insertFriends(friends) {
  return clear(STORE_FRIENDS).then(() => {
    return insert(STORE_FRIENDS, friends)
  })
}
