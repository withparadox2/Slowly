import { VERSION, upgradeVersion } from './versions'

const DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

let DB_NAME = "slowly"

let database = null

function isSupported() {
  return !!DB
}

function setDBName(userId) {
  DB_NAME = `${userId}-slowly`
}

function open() {
  return new Promise((resolve, reject) => {
    close()
    const request = DB.open(DB_NAME, VERSION)
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

function get(store, key) {
  return new Promise(async (resolve, reject) => {
    try {
      await open()
      const transaction = database.transaction([store], 'readonly')
      const objectStore = transaction.objectStore(store)
      const request = objectStore.get(key)
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

function remove(store, key, dataList) {
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
        objectStore.delete(item[key])
      })
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
  remove
}