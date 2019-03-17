import { VERSION, upgradeVersion } from './versions'
import { getAccount } from './account'

const DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

let database = null

function isSupported() {
  return !!DB
}

function getDbName() {
  let account = getAccount()
  return account ? `${account.id}-slowly` : 'slowly'
}

function open() {
  return new Promise((resolve, reject) => {
    close()
    const request = DB.open(getDbName(), VERSION)
    request.onupgradeneeded = upgradeVersion
    request.onerror = e => {
      database = null
      reject(e.target.error)
    }
    request.onsuccess = e => {
      database = e.target.result;
      resolve(database)
    }
  })
}

function close() {
  if (database) {
    database.close()
    database = null
  }
}

/**
 * @param {*} store The name of object store
 * @param {*} key Clue used to find target, or null if rquest all data
 */
function get(store, key = null) {
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readonly')
      const objectStore = transaction.objectStore(store)
      const request = key ? objectStore.get(key) : objectStore.getAll()
      request.onsuccess = e => {
        resolve(e.target.result)
      }
      request.onerror = e => {
        reject(e.target.error)
      }
    } catch (err) {
      reject(err)
    }
  })
}

function getAll(store, indexName, indexValue) {
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readonly')
      const objectStore = transaction.objectStore(store)
      const index = objectStore.index(indexName)
      const request = index.getAll(indexValue)
      request.onsuccess = e => {
        resolve(e.target.result)
      }
      request.onerror = e => {
        reject(e.target.error)
      }
    } catch (err) {
      reject(err)
    }
  })
}

function makeSureList(input) {
  if (!Array.isArray(input)) {
    return [input]
  }
  return input
}

function insert(store, dataList = []) {
  dataList = makeSureList(dataList)
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readwrite')
      const objectStore = transaction.objectStore(store)
      dataList.forEach(item => {
        objectStore.add(item)
      })
      transaction.oncomplete = e => {
        resolve(e.target.result)
      }
      transaction.onerror = e => {
        reject(e.target.error)
      }
    } catch (err) {
      reject(err)
    }
  })
}

function update(store, dataList) {
  dataList = makeSureList(dataList)
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readwrite')
      const objectStore = transaction.objectStore(store)
      transaction.oncomplete = e => {
        resolve(e.target.result)
      }
      transaction.onerror = e => {
        reject(e.target.error)
      }
      dataList.forEach(item => {
        objectStore.put(item)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function insertOrUpdate(store, obj, key) {
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      debugger
      const transaction = database.transaction([store], 'readwrite')
      const objectStore = transaction.objectStore(store)

      transaction.oncomplete = e => {
        resolve(e.target.result)
      }
      transaction.onerror = e => {
        reject(e.target.error)
      }

      let req = objectStore.openCursor(key);
      req.onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
          cursor.update(obj);
        } else {
          objectStore.add(obj)
        }
      }
    } catch (err) {
      reject(err)
    }
  })
}

function remove(store, dataList, key = null) {
  dataList = makeSureList(dataList)
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readwrite')
      const objectStore = transaction.objectStore(store)
      transaction.oncomplete = e => {
        resolve(e.target.result)
      }
      transaction.onerror = e => {
        reject(e.target.error)
      }
      dataList.forEach(item => {
        objectStore.delete(key ? item[key] : item)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function clear(store) {
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readwrite')
      const objectStore = transaction.objectStore(store)
      const request = objectStore.clear()
      request.onsuccess = e => {
        resolve(e.target.readyState)
      }
      request.onerror = e => {
        reject(e.target.error)
      }

    } catch (err) {
      reject(err)
    }
  })
}

export {
  open,
  close,
  insert,
  get,
  getAll,
  update,
  remove,
  clear,
  insertOrUpdate
}