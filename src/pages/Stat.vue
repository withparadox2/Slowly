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
          <div v-for="statLine in statList"
               :key="statLine">
            {{statLine}}
          </div>
        </div>
        <div class="date-map-section">
          <div class="svg-info"
               :class="{latin: $i18n.locale === 'en'}">
            <span class="from">{{$t("stat_from")}}</span>
            <span class="to">{{$t("stat_to")}}</span>
          </div>
          <span class="hover-text"
                @click="scrollToLetter(lastSelectedDate)"
                :class="{'hide': hideDateStr, 'link': isMobile}">{{hoverDateStr}}</span>
          <div id="svg-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.night-mode
  .stat-header
    background-color $main-color-night
    color $color-white-night
  .stat-info-content
    background rgb(22, 21, 19)
  #svg-container
    background rgb(12, 11, 9)
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
  background-color $main-color
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
  &.hide
    opacity 0
  &.link
    text-decoration underline
    color #3296fc
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
.svg-info.latin span
  width 40px
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
import { mapState } from "vuex"
import {
  formateDate,
  offsetTimezoneDate,
  getDaysCount,
  dateTextToDate,
  countWords,
  isMobile
} from "../util"
import { getAccount } from "../persist/account"
import { drawSvg } from "../stat"
import { setTimeout, clearTimeout } from "timers"
export default {
  props: {
    friend: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cellDataList: [],
      stat: null,
      account: getAccount(),
      hoverDateStr: "",
      hideDateStr: false,
      // Click calendar cell to select in mobile
      lastSelectedDate: null,
      isMobile: isMobile()
    }
  },
  computed: {
    ...mapState(["nightMode"]),
    statList() {
      const list = [
        this.$t("stat_line1", {
          date: this.stat.firstLetter.dateStr,
          fromUser: this.stat.firstLetter.from,
          toUser: this.stat.firstLetter.to
        }),
        this.$t("stat_line2", {
          dayCount: this.stat.totalDays
        }),
        this.$t("stat_line3", {
          letterCount: this.stat.totalCount,
          wordCount: this.stat.totalWordCount
        }),
        this.$t("stat_line4", {
          friend: this.stat.name,
          letterCount: this.stat.totalToCount,
          wordCount: this.stat.totalToWordCount
        }),
        this.$t("stat_line5", {
          friend: this.stat.name,
          letterCount: this.stat.totalFromCount,
          wordCount: this.stat.totalFromWordCount
        })
      ]
      if (this.stat.perday.count > 2) {
        list.push(
          this.$t("stat_line6", {
            date: this.stat.perday.dateStr,
            letterCount: this.stat.perday.count
          })
        )
      }
      if (this.stat.sinLastDays > 1) {
        list.push(
          this.$t("stat_line7", {
            dayCount: this.stat.sinLastDays
          })
        )
      }
      return list
    }
  },
  methods: {
    close() {
      this.$emit("close")
    },
    showStat() {
      this.$nextTick(() => {
        this.destroySvg = drawSvg({
          id: "svg-container",
          nightMode: this.nightMode,
          isLatin: this.$i18n.locale === "en",
          monthList: this.$t("stat_month_list").split(","),
          weekList: this.$t("stat_week_list").split(","),
          dataList: this.friend.letters,
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
              this.showSelectedDate(date, fromNum, toNum)
            }
          },
          onClick: (date, fromNum, toNum) => {
            if (this.isMobile) {
              this.lastSelectedDate = date
              this.showSelectedDate(date, fromNum, toNum)
            } else {
              this.scrollToLetter(date)
            }
          }
        })
      })
    },
    showSelectedDate(date, fromNum, toNum) {
      this.hideDateStr = false
      this.hoverDateStr = this.$t("stat_hover_date_str", {
        date,
        fromCount: fromNum || 0,
        toCount: toNum || 0
      })
    },
    scrollToLetter(date) {
      if (date) {
        this.close()
        this.$emit("scrollToDate", date)
      }
    },
    calculateStat(friend) {
      const letterList = friend.letters || []

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

      const perday = {}
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
            stat.firstLetter.from = this.$t("you")
            stat.firstLetter.to = friend.name
          } else {
            stat.firstLetter.from = friend.name
            stat.firstLetter.to = this.$t("you")
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

      return stat
    }
  },
  beforeDestroy() {
    this.destroySvg && this.destroySvg()
  },
  mounted() {
    this.stat = this.calculateStat(this.friend)
    this.showStat()
  }
}
</script>
