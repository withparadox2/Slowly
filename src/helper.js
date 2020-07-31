import { offsetAndFormatDate } from "./util"
import axios from "axios"

export function sortFriends(friends) {
  friends = friends || []
  friends.sort((first, second) => {
    if (!first.latest_comment) {
      return 1
    } else if (!second.latest_comment) {
      return -1
    } else {
      return -first.latest_comment.localeCompare(second.latest_comment)
    }
  })
  return friends
}

export function scrollToTop(vue, selector) {
  vue.$nextTick(() => {
    let dom = vue.$el.querySelector(selector)
    if (dom) {
      dom.scrollTop = 0
    }
  })
}

export function onScrollEnd(el, endCallback) {
  let lastScrollTop = -1
  let intervalId = setInterval(() => {
    if (lastScrollTop >= el.scrollTop) {
      endCallback && endCallback()
      clearInterval(intervalId)
    } else {
      lastScrollTop = el.scrollTop
    }
  }, 20)
}

export function exportLetters(frinend, letters) {
  let file = new Blob(
    [(letters || []).map((letter) => getLetteText(letter)).join("\n\n\n\n")],
    { type: "text/plain" }
  )
  const a = document.createElement("a")
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = `${frinend.name}.txt`
  document.body.appendChild(a)
  a.click()
  setTimeout(function() {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

function getLetteText(letter) {
  let content = letter.body
  content += `\n${$rootVue.$t("sender_name")}: ${letter.name}`
  content += `\n${$rootVue.$t("word_count")}: ${letter.body.length}`
  content += `\n${$rootVue.$t("send_time")}: ${offsetAndFormatDate(
    letter.created_at
  )}`
  if (letter.read_at) {
    content += `\n${$rootVue.$t("read_time")}: ${offsetAndFormatDate(
      letter.read_at
    )}`
  }
  return content
}

/**
 * Delay rendering of a whole large list to next round of update by
 * showing a preloaded count of the list first.
 *
 * The caller should keep dataList updated.
 */
export function createListRender({ preloadCount = 5, dataList = [] }) {
  function Factory() {
    this.fastRender = false
    this.dataList = dataList
    this.preloadCount = preloadCount
  }
  Factory.prototype = {
    optimise() {
      this.fastRender = true
      setTimeout(() => {
        this.fastRender = false
      }, 0)
    },
    renderedList() {
      return this.fastRender
        ? this.dataList.slice(0, this.preloadCount)
        : this.dataList
    },
  }
  return new Factory()
}

export function configTheme(isNightMode) {
  const body = document.querySelector("body")
  if (isNightMode) {
    if (body.className) {
      if (body.className.indexOf("night-mode") < 0) {
        body.className = body.className + " night-mode"
      }
    } else {
      body.className = "night-mode"
    }
  } else {
    if (body.className) {
      body.className = body.className.replace(/\s?night-mode/, "")
    }
  }
}

let countries = null
export function getCountry(code) {
  if (countries) {
    return countries[code]
  } else {
    axios({
      method: "get",
      url: `https://cdn.getslowly.com/i18n/countries/en.json`,
    })
      .then((result) => {
        countries = result.data
      })
      .catch((_) => {
        countries = {}
      })
  }
}
