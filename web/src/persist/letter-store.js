
export class DataManager {
  constructor(userId) {
    this.userId = userId
    this.hasMore = true
    this.page = 1
    this.isLoading = false
  }
  
}