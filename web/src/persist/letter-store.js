
import { insert, remove, getAll } from './database'
import { STORE_LETTERS } from './versions'
import { getLetters } from '../api'

const STATE_DEFAULT = 0
const STATE_START = 1
const STATE_SYNC = 2
const STATE_REFRESH = 3
const STATE_SUCCESS = 4
const STATE_FAIL = 5

export class DataManager {
  constructor(userId) {
    this.userId = userId
    this.syncPage = 1
    this.syncState = STATE_DEFAULT
    this.dataList = []
    this.syncDataList = []
  }

  setCallback(callback) {
    this.callback = callback
    return this
  }

  doCallback() {
    this.callback && this.callback(this, {
      isRefresh: this.syncState == STATE_REFRESH,
      isSync: this.syncState == STATE_SYNC,
      isSuccess: this.syncState == STATE_SUCCESS,
      dataList: this.dataList
    })
  }

  requestData() {
    if (this.syncState > STATE_DEFAULT && this.syncState < STATE_SUCCESS) {
      this.doCallback()
      return
    }
    this.syncState = STATE_START
    this.syncPage = 1
    this.dataList = []
    this.syncDataList = []
    loadLocalLetters(this.userId).then(data => {
      debugger
      if (!data || data.length == 0) {
        this.syncState = STATE_SYNC
        this.doCallback()
        this.loadServerLetters(this.syncPage)
      } else {
        this.dataList = this.sortList(data)
        if (window.__CONFIG__.useCache) {
          this.syncState = STATE_SUCCESS
          this.doCallback()
        } else {
          this.syncState = STATE_REFRESH
          this.doCallback()
          this.loadServerLetters(1)
        }
      }
    }).catch(e => {
      console.error(e)
    })
  }

  bindThis(fun) {
    return fun.bind(this)
  }

  loadServerLetters(page) {
    getLetters(this.userId, page)
      .then(this.getResultHandler(page))
      .catch((e) => {
        console.error(e)
        this.syncState = STATE_FAIL
        this.doCallback()
      })
  }

  getResultHandler(page) {
    function handleResult({ data }) {
      let list = this.sortList(data.comments.data || [])
      let hasMore = !!data.comments.next_page_url

      if (this.syncState == STATE_REFRESH) {
        let overlapIndex = this.subListTo(list, this.dataList[0])
        if (overlapIndex < 0) {
          // We are far away from server, we should do a full sync
          this.syncState = STATE_SYNC
        } else {
          if (overlapIndex > 0) {
            let subList = list.slice(0, overlapIndex)
            this.insertLetters(subList)
            this.dataList = subList.concat(this.dataList)
          }
          this.syncState = STATE_SUCCESS
          this.doCallback()
        }
      }

      if (this.syncState == STATE_SYNC) {
        this.syncDataList.push(...list)
        if (hasMore) {
          this.syncPage = page + 1
          this.loadServerLetters(this.syncPage)
          this.doCallback()
        } else {
          this.syncState = STATE_SUCCESS
          this.dataList = this.sortList(this.syncDataList)
          this.insertLetters(this.dataList)
          this.doCallback()
        }
      }
    }
    return handleResult.bind(this)
  }

  subListTo(list, target) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == target.id) {
        return i
      }
    }
    return -1
  }

  sortList(list) {
    list.sort((first, second) => second.id - first.id)
    return list
  }

  clearLetters(list) {
    return remove(STORE_LETTERS, list, 'letter_id')
  }

  insertLetters(list) {
    list.forEach(element => {
      element.owner_id = this.userId
    })
    return insert(STORE_LETTERS, list)
  }
}

let map = {}

export function getDataManager(userId) {
  if (!map[userId]) {
    map[userId] = new DataManager(userId)
  }
  return map[userId]
}

export function loadLocalLetters(userId) {
  return getAll(STORE_LETTERS, 'owner_id', userId)
}
