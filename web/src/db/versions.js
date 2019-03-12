const VERSION = 1

//TODO take care of login user id
function upgradeVersion(event) {
  let db = event.target.result
  if (event.oldVersion < 1) {
    createStore(db, 'friends', 'user_id', {
      owner_id: false
    })
    createStore(db, 'letters', 'letter_id', {
      owner_id: false
    })
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
