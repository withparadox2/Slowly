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