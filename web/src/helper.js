export function sortFriends(friends) {
  friends = friends || []
  friends.sort(
    (first, second) =>
      -first.latest_comment.localeCompare(second.latest_comment)
  )
  return friends
}