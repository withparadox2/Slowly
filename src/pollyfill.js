String.prototype.format = () => {
  let str = this
  for (k in arguments) {
    str = str.replace("{" + k + "}", arguments[k])
  }
  return str
}
