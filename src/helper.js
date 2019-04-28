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