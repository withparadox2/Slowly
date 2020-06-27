import { offsetTimezoneDate, getDaysCount } from "./util"
import { getAccount } from "./persist/account"
import SVG from "svg.js"
import { formatDateYMD, dateTextToDate } from "./util"

const COLOR_BLUE = ["#C6E2FF", "#3296FC", "#036CD9"]
const COLOR_GREEN = ["#C9ECB4", "#86D666", "#11AE2B"]

function getColorIndex(num) {
  return num - 1 > 2 ? 2 : num - 1
}

export function drawSvg({
  id,
  isLatin,
  dataList,
  monthList,
  weekList,
  onHover,
  onClick,
}) {
  const startX = isLatin ? 35 : 26
  const startY = 48
  const cellSize = 16

  let cellList = getCellList(dataList)
  let svgWidth = 300

  if (cellList.length > 1) {
    let lastDate = cellList[0].date
    let firstDate = cellList[cellList.length - 1].date
    let totalDays = getDaysCount(lastDate, firstDate)
    svgWidth = (totalDays / 7 + 3) * cellSize + startX
  }

  const draw = SVG(id).size(svgWidth, 168)

  let nowDate = new Date()
  let nowDateIndex = calDateIndex(nowDate)

  let row = 6,
    col = 0
  let loopDate = new Date(cellList[0].date.valueOf())
  let cellIndex = 0
  let lastYear = -1
  let lastMonth = -1
  while (cellIndex < cellList.length) {
    let cell = cellList[cellIndex]
    let curDate = cell.date
    let curDateIndex = calDateIndex(curDate)
    let loopDateStr = formatDateYMD(loopDate)
    let loopDateIndex = calDateIndex(loopDate)
    let cp = loopDateIndex - curDateIndex
    let drawColor = ["#F7F7F7"]
    let hasData = false
    if (cp == 0) {
      if (cellIndex != 0 || cell.num > 0) {
        if (cell.fromNum > 0 && cell.toNum > 0) {
          drawColor = [
            COLOR_BLUE[getColorIndex(cell.fromNum)],
            COLOR_GREEN[getColorIndex(cell.toNum)],
          ]
        } else if (cell.fromNum > 0) {
          drawColor = [COLOR_BLUE[getColorIndex(cell.fromNum)]]
        } else {
          drawColor = [COLOR_GREEN[getColorIndex(cell.toNum)]]
        }
      }
      hasData = true
      cellIndex++
    } else if (cp < 0) {
      console.log("order is wrong")
      break
    }

    let cellX = startX + col * cellSize
    let cellY = startY + row * cellSize
    let group = draw.group().transform({ x: cellX, y: cellY })
    if (drawColor.length == 1) {
      let rect = draw
        .rect(cellSize - 2, cellSize - 2)
        .attr({
          fill: drawColor[0],
        })
        .radius(4)
      group.add(rect)
      if (nowDateIndex == loopDateIndex) {
        group.add(
          draw
            .rect(cellSize, cellSize)
            .attr({
              fill: "rgba(0,0,0,0)",
              stroke: "rgba(0,0,0,0.70)",
              x: -1,
              y: -1,
            })
            .radius(4)
        )
      }
    } else {
      let path1 = draw
        .path("M0 7 V4 Q0 0 4 0 H10 Q14 0 14 4 V7 Z")
        .attr({ fill: drawColor[0], "stroke-width": 0 })
      let path2 = draw
        .path("M0 7 V10 Q0 14 4 14 H10 Q14 14 14 10 V7 Z")
        .attr({ fill: drawColor[1], "stroke-width": 0 })
      let strokePath = draw
        .rect(cellSize - 2, cellSize - 2)
        .attr({
          fill: "rgba(0,0,0,0)",
        })
        .radius(4)
      group.add(path1)
      group.add(path2)
      group.add(strokePath)
      if (nowDateIndex == loopDateIndex) {
        group.add(
          draw
            .rect(cellSize, cellSize)
            .attr({
              fill: "rgba(0,0,0,0)",
              stroke: "rgba(0,0,0,0.70)",
              x: -1,
              y: -1,
            })
            .radius(4)
        )
      }
    }
    group.dateStr = loopDateStr
    group.fromNum = hasData ? cell.fromNum : 0
    group.toNum = hasData ? cell.toNum : 0
    group.mouseover(function() {
      onHover && onHover(this.dateStr, this.fromNum, this.toNum)
      this.stroke({
        color: "rgba(0,0,0,0.3)",
      })
    })
    group.mouseout(function() {
      onHover && onHover("")
      this.stroke({
        color: "rgba(0,0,0,0)",
      })
    })
    group.click(function() {
      onClick && onClick(this.dateStr, this.fromNum, this.toNum)
    })

    // draw year
    if (lastYear < 0 || lastYear != loopDate.getFullYear()) {
      draw
        .text(function(add) {
          add.tspan(`${loopDate.getFullYear()}`).dy(0)
        })
        .font({
          fill:
            nowDate.getFullYear() == loopDate.getFullYear()
              ? "rgba(0,0,0, 0.9)"
              : "#ccc",
          size: 15,
        })
        .attr("x", cellX)
        .attr("y", 10)
        .attr("dominant-baseline", "hanging")
    }
    lastYear = loopDate.getFullYear()

    // draw month
    if (
      (lastMonth < 0 || lastMonth != loopDate.getMonth()) &&
      loopDate.getFullYear() * 100 + loopDate.getMonth() <=
        nowDate.getFullYear() * 100 + nowDate.getMonth()
    ) {
      draw
        .text(function(add) {
          add.tspan(monthList[loopDate.getMonth()]).dy(0)
        })
        .font({
          fill:
            nowDate.getMonth() == loopDate.getMonth() &&
            nowDate.getFullYear() == loopDate.getFullYear()
              ? "rgba(0,0,0, 0.9)"
              : "#ccc",
          size: 11,
        })
        .attr("x", cellX)
        .attr("y", 31)
        .attr("dominant-baseline", "hanging")
    }
    lastMonth = loopDate.getMonth()

    loopDate.setDate(loopDate.getDate() - 1)
    row--
    if (row == -1) {
      row = 6
      col++
    }
  }

  weekList.forEach((day, index) => {
    draw
      .text(day)
      .font({ fill: "rgba(0,0,0,0.25)", size: 11 })
      .attr("x", 8)
      .attr("y", 43 + index * 32)
  })
  return function() {
    onHover = null
    onClick = null
    if (draw.node) {
      ;[...draw.node.children, draw.node].map((child) => {
        child.instance = null
        child.remove()
      })
    }
  }
}

function compareDate(d1, d2) {
  return calDateIndex(d1) - calDateIndex(d2)
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
  let lastDate
  let lastCell
  for (let i = 0; i < letterList.length; i++) {
    let letter = letterList[i]
    if (!letter.deliver_at) {
      continue
    }
    let date = offsetTimezoneDate(dateTextToDate(letter.deliver_at))
    let isFrom = letter.user != accountInfo.id
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

  // This cell will be located at bottom-left corner of graph
  let firstDateToAdd = getNearestSaturdayAfterThisMonth()

  cellList.splice(0, 0, {
    date: firstDateToAdd,
    num: 0,
  })
  return cellList
}

function getNearestSaturdayAfterThisMonth() {
  let nowDate = new Date()
  let lastDayOfThisMonth = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth() + 1,
    0
  )
  let lastDayInWeek = lastDayOfThisMonth.getDay()
  let moreDays = 6 - lastDayInWeek
  return lastDayOfThisMonth.addDays(moreDays)
}
