import { formateDate, offsetTimezoneDate, getDaysCount } from "../util"
import { getAccount } from '../persist/account'
import SVG from 'svg.js'

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const COLOR_BLUE = ['#C6E2FF', '#3296FC', '#036CD9']
const COLOR_GREEN = ['#C9ECB4', '#86D666', '#11AE2B']
const COLOR_YELLOW = ['#FFE2D4', '#FFAB81', '#FC7536']

function getColorIndex(num) {
  return num - 1 > 2 ? 2 : num - 1
}

export function drawSvg(id, dataList) {
  debugger

  const startX = 22
  const startY = 48
  let cellList = getCellList(dataList)
  let svgWidth = 300

  if (cellList.length > 1) {
    let lastDate = cellList[0].date
    let firstDate = cellList[cellList.length - 1].date
    let totalDays = getDaysCount(lastDate, firstDate)
    svgWidth = (totalDays / 7 + 1) * 16 + startX
  }

  let draw = SVG(id).size(svgWidth, 168)

  let nowDate = new Date()
  let nowDateIndex = calDateIndex(nowDate)

  let row = 6, col = 0;
  let loopDate = new Date(cellList[0].date.valueOf())
  let cellIndex = 0
  let lastYear = -1
  let lastMonth = -1
  while (cellIndex < cellList.length) {
    let cell = cellList[cellIndex]
    let curDate = cell.date
    let curDateIndex = calDateIndex(curDate)
    let loopDateIndex = calDateIndex(loopDate)
    let cp = loopDateIndex - curDateIndex
    let drawColor = ['#F7F7F7']
    if (cp == 0) {
      if (cellIndex != 0 || cell.num > 0) {
        if (cell.fromNum > 0 && cell.toNum > 0) {
          drawColor = [COLOR_BLUE[getColorIndex(cell.fromNum)], COLOR_GREEN[getColorIndex(cell.toNum)]]
        } else if (cell.fromNum > 0) {
          drawColor = [COLOR_BLUE[getColorIndex(cell.fromNum)]]
        } else {
          drawColor = [COLOR_GREEN[getColorIndex(cell.toNum)]]
        }
      }
      cellIndex++
    } else if (cp < 0) {
      console.log('order is wrong')
      break
    }

    let cellX = startX + col * 16
    let cellY = startY + row * 16
    let group = draw.group().transform({ x: cellX, y: cellY })
    if (drawColor.length == 1) {
      let rect = draw.rect(14, 14).attr({ fill: drawColor[0] }).radius(4)
      group.add(rect)
      if (nowDateIndex == loopDateIndex) {
        group.add(draw.rect(16, 16).attr({ fill: "rgba(0,0,0,0)", stroke: "rgba(0,0,0,0.70)", x: -1, y: -1 }).radius(4))
      }
    } else {
      let path1 = draw.path('M0 7 V4 Q0 0 4 0 H10 Q14 0 14 4 V7 Z').attr({ fill: drawColor[0] })
      let path2 = draw.path('M0 7 V10 Q0 14 4 14 H10 Q14 14 14 10 V7 Z').attr({ fill: drawColor[1] })
      group.add(path1)
      group.add(path2)
      if (nowDateIndex == loopDateIndex) {
        group.add(draw.rect(16, 16).attr({ fill: "rgba(0,0,0,0)", stroke: "rgba(0,0,0,0.70)", x: -1, y: -1 }).radius(4))
      }
    }

    // draw year
    if (lastYear < 0 || lastYear != loopDate.getFullYear()) {
      draw.text(function (add) {
        add.tspan(`${loopDate.getFullYear()}年`).dy(0)
      })
        .font({
          fill: nowDate.getFullYear() == loopDate.getFullYear() ? 'rgba(0,0,0, 0.9)' : '#ccc',
          size: 15
        })
        .attr('x', cellX)
        .attr('y', 10)
        .attr('dominant-baseline', "hanging")
    }
    lastYear = loopDate.getFullYear()

    // draw month
    if (lastMonth < 0 || lastMonth != loopDate.getMonth()) {
      draw.text(function (add) {
        add.tspan(`${loopDate.getMonth() + 1}月`).dy(0)
      })
        .font({
          fill: nowDate.getMonth() == loopDate.getMonth() ? 'rgba(0,0,0, 0.9)' : '#ccc',
          size: 11
        })
        .attr('x', cellX)
        .attr('y', 31)
        .attr('dominant-baseline', "hanging")
    }
    lastMonth = loopDate.getMonth()

    loopDate.setDate(loopDate.getDate() - 1)
    row--
    if (row == -1) {
      row = 6
      col++
    }
  }

  //draw text
  draw.text('日').font({ fill: 'rgba(0,0,0,0.25)', size: 8 }).attr('x', 10).attr('y', 51)
  draw.text('二').font({ fill: 'rgba(0,0,0,0.25)', size: 8 }).attr('x', 10).attr('y', 83)
  draw.text('四').font({ fill: 'rgba(0,0,0,0.25)', size: 8 }).attr('x', 10).attr('y', 115)
  draw.text('六').font({ fill: 'rgba(0,0,0,0.25)', size: 8 }).attr('x', 10).attr('y', 147)
}

function compareDate(d1, d2) {
  let n1 = d1.getFullYear() * 10000 + d1.getMonth() * 100 + d1.getDate()
  let n2 = d2.getFullYear() * 10000 + d2.getMonth() * 100 + d2.getDate()
  return n1 - n2
}

function calDateIndex(date) {
  return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()
}

function getCellList(letterList) {
  let accountInfo = getAccount()
  letterList.sort((l1, l2) => {
    if (!l2.deliver_at) {
      return 1
    }
    return l2.deliver_at.localeCompare(l1.deliver_at)
  })
  let cellList = []
  let lastDate;
  let lastCell;
  for (let i = 0; i < letterList.length; i++) {
    let letter = letterList[i]
    if (!letter.deliver_at) {
      continue
    }
    let date = offsetTimezoneDate(new Date(letter.deliver_at))
    let isFrom = letter.user == accountInfo.id
    if (lastDate && compareDate(lastDate, date) == 0) {
      lastCell.num++
      if (isFrom) {
        lastCell.fromNum++
      } else {
        lastCell.toNum++
      }
    } else {
      lastCell = {
        date,
        num: 1,
        fromNum: isFrom ? 1 : 0,
        toNum: isFrom ? 0 : 1,
      }
      cellList.push(lastCell)
    }
    lastDate = date
  }

  let nowDate = new Date()
  let lastDayOfThisMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0)
  let lastDayInWeek = lastDayOfThisMonth.getDay()
  let moreDays = 6 - lastDayInWeek
  let firstDateToAdd = lastDayOfThisMonth.addDays(moreDays)

  cellList.splice(0, 0, {
    date: firstDateToAdd,
    num: 0
  })
  return cellList
}