import { formateDate, offsetAndFormatDate } from './util'
export function sortFriends(friends) {
  friends = friends || []
  friends.sort(
    (first, second) =>
      -first.latest_comment.localeCompare(second.latest_comment)
  )
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
    [(letters || []).map(letter => getLetteText(letter)).join('\n\n\n\n')],
    { type: 'text/plain' }
  )
  const a = document.createElement('a')
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
  content += `\n发信人：${letter.name}`
  content += `\n字数：${letter.body.length}`
  content += `\n发送时间：${offsetAndFormatDate(letter.created_at)}`
  if (letter.read_at) {
    content += `\n阅读时间：${offsetAndFormatDate(letter.read_at)}`
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
    }
  }
  return new Factory()
}
