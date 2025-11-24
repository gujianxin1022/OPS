export default class HandleToken {
  constructor(token) {
    this.TokenKey = 'Admin-Token'
    this.storage = window.localStorage
  }

  getToken() {
    return this.storage.getItem(this.TokenKey)
  }

  setToken(token) {
    return this.storage.setItem(this.TokenKey, token)
  }

  removeToken() {
    return this.storage.clear()
  }
}
