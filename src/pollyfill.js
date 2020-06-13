String.prototype.format = function() {
  let str = this
  for (let k in arguments) {
    str = str.replace("{" + k + "}", arguments[k])
  }
  return str
}
