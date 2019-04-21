Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

function validateEmail(email) {
  let re = /\S+@\S+\.\S+/
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

function showWarning(vue, message) {
  vue.$message({
    showClose: true,
    message: message,
    type: "warning"
  })
}

function offsetAndFormatDate(time) {
  return formateDate(offsetTimezoneDate(time))
}

function offsetTimezoneDate(d) {
  if (!(d instanceof Date)) {
    d = new Date(d)
  }
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
}

function formateDate(date) {
  let aaaa = date.getFullYear()
  let gg = date.getDate()
  let mm = (date.getMonth() + 1)

  if (gg < 10)
    gg = "0" + gg

  if (mm < 10)
    mm = "0" + mm

  let cur_day = aaaa + "-" + mm + "-" + gg

  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  if (hours < 10)
    hours = "0" + hours

  if (minutes < 10)
    minutes = "0" + minutes

  if (seconds < 10)
    seconds = "0" + seconds

  return cur_day + " " + hours + ":" + minutes + ":" + seconds
}

function formatDateYMD(d) {
  return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()}`
}

function getDaysCount(firstDate, secondDate) {
  let oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)))
}

function formatDateReadable(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()

  let nowDate = new Date()
  if (y != new Date().getFullYear()) {
    return `${y % 100}年${m}月${d}日`
  }

  let monthDate
  if (m == nowDate.getMonth() + 1) {
    if (d == nowDate.getDate()) {
      monthDate = '今天'
    } else if (d == nowDate.getDate() - 1) {
      monthDate = '昨天'
    }
  }

  if (!monthDate) {
    monthDate = `${m}月${d}日`
  }

  let hourMinute = `${hour > 12 ? hour - 12 : hour}:${minute < 10 ? '0' + minute : minute}`
  return `${monthDate} ${hourMinute} ${getHourDesc(hour)}`
}

function getHourDesc(hour) {
  if (1 <= hour && hour <= 4) {
    return "凌晨"
  } else if (5 <= hour && hour <= 7) {
    return "清晨"
  } else if (8 <= hour && hour <= 10) {
    return "上午"
  } else if (11 <= hour && hour <= 13) {
    return "中午"
  } else if (14 <= hour && hour <= 16) {
    return "下午"
  } else if (17 <= hour && hour <= 18) {
    return "傍晚"
  } else if (19 <= hour && hour <= 21) {
    return "晚上"
  } else {
    return "深夜"
  }
}

function copyToClipboard(str) {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export {
  validateEmail,
  showError,
  showSuccess,
  formateDate,
  getDaysCount,
  offsetTimezoneDate,
  showWarning,
  formatDateReadable,
  formatDateYMD,
  offsetAndFormatDate,
  copyToClipboard
}