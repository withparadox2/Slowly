function validateEmail(email) {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

function showError(vue, message) {
  vue.$message({
    showClose: true,
    message: message,
    type: "error"
  })
}

function showSuccess(vue, message) {
  vue.$message({
    showClose: true,
    message: message,
    type: "success"
  })
}

export {
  validateEmail,
  showError
}