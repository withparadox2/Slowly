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
  let timeOutAction = () => {
    if (lastScrollTop >= el.scrollTop) {
      endCallback && endCallback()
    } else {
      lastScrollTop = el.scrollTop
      setTimeout(timeOutAction, 20)
    }
  }
  setTimeout(timeOutAction, 20)
}