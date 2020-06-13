<template>
  <div class="modal"
       v-if="stat">
    <div class="stat-info-content">
      <div class="stat-header">
        <span>{{stat.name}}</span>
        <span class="el-icon-close"
              :title="$t('close')"
              @click="close()"></span>
      </div>
      <div class="stat-content">
        <div class="stat-detail">
          <div>
            {{stat.firstLetter.dateStr}}这一天{{stat.firstLetter.from}}给{{stat.firstLetter.to}}写了第一封信
          </div>
          <div>
            距离现在已有<span>{{stat.totalDays}}天了</span>
          </div>
          <div>
            你们一共写了{{stat.totalCount}}封信，包含整整{{stat.totalWordCount}}个字
          </div>
          <div>
            你给“{{stat.name}}”写了{{stat.totalToCount}}封信，包含{{stat.totalToWordCount}}个字
          </div>
          <div>
            “{{stat.name}}”给你写了{{stat.totalFromCount}}封信，包含{{stat.totalFromWordCount}}个字
          </div>
          <div v-show="stat.perday.count > 2">
            特别的，在{{stat.perday.dateStr}}这天，你们往来了{{stat.perday.count}}封信
          </div>
          <div v-show="stat.sinLastDays > 1">你们有{{stat.sinLastDays}}天没有联系了</div>
        </div>

        <div class="date-map-section">
          <div class="svg-info">
            <span class="from">来</span>
            <span class="to">往</span>
          </div>
          <span class="hover-text"
                :class="{'hide': hideDateStr}">{{hoverDateStr}}</span>
          <div id="svg-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.stat-info-content
  position absolute
  top 5%
  max-width 650px
  width 80%
  background #f4f6ff
  margin-left 50%
  transform translateX(-50%)
  border-radius 6px
.stat-header
  padding 10px 0 10px 10px
  font-size 16px
  background-color #0078d7
  color white
  border-top-left-radius 6px
  border-top-right-radius 6px
.stat-content
  overflow-y auto
  border-bottom-left-radius 6px
  border-bottom-right-radius 6px
  padding 10px 0 0 0
  max-height calc(100vh - 124px)
  min-height 142px
  width 100%
  box-sizing border-box
  font-size 14px
  line-height 22px
.stat-detail
  padding 0 20px
  > div
    margin-bottom 8px
.date-map-section
  position relative
.hover-text
  position absolute
  width 100%
  text-align center
  top 0
  line-height 24px
  color #666
  font-size 12px
  transition all 0.3s
.hover-text.hide
  opacity 0
#svg-container
  background white
  padding 0 10px
  margin-top 10px
  overflow-x auto
.svg-info
  text-align right
  padding-right 10px
.svg-info span
  font-size 12px
  display inline-block
  border-radius 4px
  width 18px
  height 18px
  color white
  line-height 18px
  text-align center
.svg-info .from
  margin-right 5px
  background #3296fc
.svg-info .to
  background #86d666
.el-icon-close
  float right
  padding 0 10px
  cursor pointer
  margin-top 3px
</style>
<script>
import {
  formateDate,
  offsetTimezoneDate,
  getDaysCount,
  dateTextToDate,
  countWords
} from "../util"
import { getAccount } from "../persist/account"
import { drawSvg } from "../stat"
import { setTimeout, clearTimeout } from "timers"
export default {
  data() {
    return {
      cellDataList: [],
      stat: null,
      account: getAccount(),
      hoverDateStr: "",
      hideDateStr: false
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
        totalWordCount: 0,
        totalFromCount: 0,
        totalFromWordCount: 0,
        totalToCount: 0,
        totalToWordCount: 0
      }

      let perday = {}
      for (let i = 0; i < letterList.length; i++) {
        let letter = letterList[i]
        let isSendLetter = letter.user == this.account.id

        const wordCount = countWords(letter.body)
        stat.totalCount++
        stat.totalWordCount += wordCount

        if (isSendLetter) {
          stat.totalToCount++
          stat.totalToWordCount += wordCount
        } else {
          stat.totalFromCount++
          stat.totalFromWordCount += wordCount
        }

        let date = offsetTimezoneDate(dateTextToDate(letter.deliver_at))
        let fullDateStr = formateDate(date)
        let dateStr = fullDateStr.substring(0, 10)
        if (i == letterList.length - 1) {
          stat.firstLetter.dateStr = dateStr
          stat.firstLetter.date = date
          if (isSendLetter) {
            stat.firstLetter.from = "你"
            stat.firstLetter.to = `“${friend.name}”`
          } else {
            stat.firstLetter.from = `“${friend.name}”`
            stat.firstLetter.to = "你"
          }
        }
        if (i == 0) {
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
      this.$nextTick(() => {
        drawSvg("svg-container", letterList, {
          onHover: (date, fromNum, toNum) => {
            if (!date) {
              this.dateTimeoutId = setTimeout(() => {
                // start hide transition
                this.hideDateStr = true
                this.dateTimeoutId = setTimeout(() => {
                  this.hoverDateStr = ""
                }, 300)
              }, 500)
            } else {
              clearTimeout(this.dateTimeoutId)
              this.hideDateStr = false
              this.hoverDateStr = `${date} 来${fromNum || 0} 往${toNum || 0}`
            }
          },
          onClick: date => {
            this.close()
            this.$emit("scrollToDate", date)
          }
        })
      })
    }
  }
}
</script>
