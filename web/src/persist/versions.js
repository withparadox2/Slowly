const VERSION = 1

export const STORE_FRIENDS = "friends"
export const STORE_LETTERS = "letters"

//TODO take care of login user id
function upgradeVersion(event) {
  let db = event.target.result
  if (event.oldVersion < 1) {
    createStore(db, STORE_FRIENDS, 'user_id')
    createStore(db, STORE_LETTERS, 'letter_id')
  }
}

function createStore(db, name, key, indexes) {
  if (db.objectStoreNames.contains(name)) {
    return false
  }

  let objectStore = key
    ? db.createObjectStore(name, { keyPath: key })
    : db.createObjectStore(name, { autoIncrement: true })
  if (indexes && typeof indexes == 'object') {
    for (let key in indexes) {
      if (indexes.hasOwnProperty(key)) {
        objectStore.createIndex(key, key, { unique: !!indexes[key] })
      }
    }
  }
}

export {
  VERSION,
  upgradeVersion
}
