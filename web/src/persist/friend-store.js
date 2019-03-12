import { insert, getAll } from './database'

export function getFriends() {
  return getAll('friends', 'owner_id', 1)
}

export function insertFriends(friends) {
  friends.forEach(element => {
    element.owner_id = 1
  })
  return insert('friends', friends)
}
