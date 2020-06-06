import { get, insertOrUpdate } from "./database"
import { STORE_DRAFT } from "./versions"

export function getDraft(friendId) {
  return get(STORE_DRAFT, friendId)
}

export function setDraft(draft) {
  if (draft.user_id == null) {
    return Promise.reject("draft must contains field user_id")
  } else {
    return insertOrUpdate(STORE_DRAFT, draft, draft.user_id)
  }
}
