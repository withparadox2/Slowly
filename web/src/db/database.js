import { VERSION, upgradeVersion } from './versions'

const DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const DB_NAME = "slowly"

let database = null

function isSupported() {
  return !!DB
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
      database = request.result
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
  
}