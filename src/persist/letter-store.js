import {
  insert,
  remove,
  getAll,
  insertOrUpdate,
  remove as removeLetter,
} from "./database"
import { STORE_LETTERS } from "./versions"
import { getLetters } from "../api"
import Vue from "vue"

const STATE_DEFAULT = 0
const STATE_START = 1
const STATE_SYNC = 2
const STATE_REFRESH = 3
const STATE_SUCCESS = 4
const STATE_FAIL = 5

export class DataManager {
  constructor(friend) {
    this.friend = friend
    this.userId = friend.id
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
    this.callback &&
      this.callback(this, {
        isRefresh: this.syncState == STATE_REFRESH,
        isSync: this.syncState == STATE_SYNC,
        isSuccess: this.syncState == STATE_SUCCESS,
        dataList: this.dataList.map((letter) => {
          letter.body = letter.body || ""
          return letter
        }),
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
    loadLocalLetters(this.userId)
      .then((data) => {
        if (!data || data.length == 0) {
          this.syncState = STATE_SYNC
          this.doCallback()
          this.loadServerLetters(this.syncPage)
        } else {
          this.dataList = this.sortList(data)

          let useCache =
            window.__CONFIG__.useCache ||
            (this.friend.lastRefreshTime &&
              Date.now() - this.friend.lastRefreshTime < 10 * 60 * 1000)

          if (useCache) {
            this.syncState = STATE_SUCCESS
            this.doCallback()
          } else {
            this.syncState = STATE_REFRESH
            this.doCallback()
            this.loadServerLetters(1)
          }
        }
      })
      .catch((e) => {
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
      if (data.user) {
        Vue.set(this.friend, "last_login", data.user.last_login)
      }
      if (data.post) {
        Vue.set(this.friend, "share_photos", data.post.user_photos)
      }
      let list = this.sortList([
        ...(data.incoming || []),
        ...(data.comments.data || []),
      ])
      let hasMore = !!data.comments.next_page_url

      if (this.syncState == STATE_REFRESH) {
        let overlapIndex = this.subListTo(list, this.dataList[0])
        if (overlapIndex < 0) {
          // We are far away from server, we should do a full sync
          this.syncState = STATE_SYNC
        } else {
          this.updateLetters(list)
          this.friend.lastRefreshTime = Date.now()
          this.syncState = STATE_SUCCESS

          loadLocalLetters(this.userId).then((data) => {
            this.dataList = this.sortList(data)
            this.doCallback()
          })
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
          removeLetter(STORE_LETTERS, this.syncDataList, "id")
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
    return remove(STORE_LETTERS, list, "letter_id")
  }

  insertLetters(list) {
    list.forEach((element) => {
      element.owner_id = this.userId
    })
    return insert(STORE_LETTERS, list)
  }
  updateLetters(list) {
    list.forEach((element) => {
      element.owner_id = this.userId
      insertOrUpdate(STORE_LETTERS, element, element.id)
    })
  }
}

let map = {}

export function getDataManager(friend) {
  if (!map[friend.id]) {
    map[friend.id] = new DataManager(friend)
  }
  return map[friend.id]
}

export function loadLocalLetters(userId) {
  return getAll(STORE_LETTERS, "owner_id", userId)
}
