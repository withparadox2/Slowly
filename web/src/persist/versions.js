const VERSION = 2

export const STORE_FRIENDS = "friends"
export const STORE_LETTERS = "letters"
export const STORE_DRAFT = "draft"

//TODO take care of login user id
function upgradeVersion(event) {
  let db = event.target.result
  if (event.oldVersion < 1) {
    createStore(db, STORE_FRIENDS, 'user_id')
    createStore(db, STORE_LETTERS, 'id', {
      owner_id: false
    })
    createStore(db, STORE_DRAFT, 'user_id')
  } else if (event.oldVersion < 2) {
    createStore(db, STORE_DRAFT, 'user_id')
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
