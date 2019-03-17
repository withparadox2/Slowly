<template>
  <div class="stat-info"
       v-if="stat">
    <div class="stat-info-content">
      <div class="stat-header">
        <span>{{stat.name}}</span>
        <span class="el-icon-close"
              title="关闭"
              @click="close()"></span>
      </div>
      <div class="stat-content">
        <div>
          <span>{{stat.firstLetter.dateStr}}</span>
          这一天
          <span>{{stat.firstLetter.from}}</span>
          给
          <span>{{stat.firstLetter.to}}</span>
          写了第一封信
        </div>
        <div>
          距离现在有<span>{{stat.totalDays}}天了</span>
        </div>
        <div>
          你们一共写了{{stat.totalCount}}封信
        </div>
        <div>
          包含整整{{stat.totalWordCount}}个字
        </div>
        <div v-show="stat.perday.count > 2">
          特别的，在{{stat.perday.dateStr}}这天，你们往来了{{stat.perday.count}}封信
        </div>
        <div v-show="stat.sinLastDays > 1">你们有{{stat.sinLastDays}}天没有联系了</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.stat-info {
  z-index: 2000;
  background: #000000aa;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.stat-info-content {
  position: absolute;
  top: 5%;
  width: 650px;
  background: #f4f6ff;
  margin-left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
}
.stat-header {
  padding: 10px 0 10px 10px;
  font-size: 16px;
  background-color: #0078d7;
  color: white;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.stat-content {
  overflow-y: auto;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 10px 20px;
  max-height: calc(100vh - 124px);
  min-height: 142px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 25px;
}
.el-icon-close {
  float: right;
  padding: 0 10px;
  cursor: pointer;
  margin-top: 3px;
}
</style>
<script>
import { formateDate, offsetTimezoneDate, getDaysCount } from "../util"
import { getAccount } from "../persist/account"
export default {
  data() {
    return {
      cellDataList: [],
      stat: null,
      account: getAccount()
    }
  },
  methods: {
    close() {
      this.stat = null
    },
    showStat(friend, letterList) {
      let stat = {
        name: friend.name,
        firstLetter: {},
        lastLetter: {},
        totalDays: 0,
        perday: {
          count: 0,
          dateStr: ""
        },
        totalCount: 0,
        totalWordCount: 0
      }

      let perday = {}
      for (let i = 0; i < letterList.length; i++) {
        let letter = letterList[i]
        stat.totalCount++
        stat.totalWordCount += letter.body.length

        let date = offsetTimezoneDate(new Date(letter.deliver_at))
        let fullDateStr = formateDate(date)
        let dateStr = fullDateStr.substring(0, 10)
        if (i == letterList.length - 1) {
          stat.firstLetter.dateStr = dateStr
          stat.firstLetter.date = date
          if (letter.user == this.account.id) {
            stat.firstLetter.from = "你"
            stat.firstLetter.to = friend.name
          } else {
            stat.firstLetter.from = friend.name
            stat.firstLetter.to = "你"
          }
        } else if (i == 0) {
          stat.lastLetter.date = date
        }
        if (perday.dateStr == null) {
          perday.dateStr = dateStr
          perday.count = 1
        } else if (perday.dateStr == dateStr) {
          perday.count++
        } else {
          if (!stat.perday.dateStr || perday.count > stat.perday.count) {
            stat.perday.dateStr = perday.dateStr
            stat.perday.count = perday.count
          }
          perday.dateStr = dateStr
          perday.count = 1
        }
      }

      stat.totalDays = getDaysCount(new Date(), stat.firstLetter.date)
      stat.sinLastDays = getDaysCount(new Date(), stat.lastLetter.date)

      this.stat = stat
    }
  },
  mounted() {}
}
</script>
