<template>
  <el-row v-if="checkedFriend"
          class="component-wrapper">
    <el-col :span="checkedLetter ? 12 : 24"
            class="left-section">
      <div class="letter-list">
        <div v-for="(letter, index) in renderLetters"
             :class="{'letter-checked': letter == checkedLetter, 'letter-highlight': highlightDate && letter.highlight}"
             class="letter-item"
             @click="checkLetter(letter, index)"
             :key="letter.id">
          <div class="letter-item-content">
            <div>
              {{letter.name}}
              <span class="letter-state">
                <span class="letter-deliver-time"
                      v-if="isLetterArrive(letter)">{{formatReadableTime(letter.created_at)}}</span>
                <img class="letter-in-out"
                     v-else
                     :src="isLetterOut(letter) ? icLetterInOut[1] : icLetterInOut[0]" />
              </span>
            </div>
            <div class="letter-body">
              <span class="letter-content">{{letter.body.substring(0, 150)}}</span>
              <img class="letter-attacments"
                   v-show="letter.attachments && isLetterArrive(letter)"
                   src="../../images/ic_attachments.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="friend-info">
        <span v-show="!searchValue">
          <span :title="checkedFriendInfo"
                class="name">{{checkedFriend.name}}<span title="信件数量">({{searchValue ? renderLetters.length : letters.length}})</span></span>
          <i class="el-icon-location"
             title="查看位置"
             @click="$emit('showMap', checkedFriend)"></i>
          <i class="el-icon-date"
             @click="showStat"
             title="统计"></i>
          <i class="el-icon-plus"
             title="新建"
             @click="newLetter"></i>
          <i class="el-icon-download"
             title="导出信件"
             @click="doExport"></i>
          <div class="right-container">
            <i v-show="showSyncIcon"
               class="el-icon-loading"></i>
            <span v-show="letterState"
                  class="sync-state">{{letterState}}</span>
            <i class="el-icon-close btn-close-letter"
               @click="closeLetters" />
          </div>
        </span>
        <span v-show="searchValue">
          <span class="name">搜索"{{searchValue}}"({{renderLetters.length}})</span>
        </span>
      </div>
    </el-col>
    <el-col :span="12"
            v-if="checkedLetter"
            class="right-section">
      <letter-item :letter="checkedLetter"></letter-item>
      <div class="letter-nav">
        <span class="last-letter"
              v-show="this.checkedLetterIndex > 0"
              @click="lastLetter">上一封</span>
        <span class="next-letter"
              v-show="this.checkedLetterIndex < this.renderLetters.length - 1"
              @click="nextLetter">下一封</span>
      </div>
    </el-col>
    <new-letter ref="newLetter"
                v-on:sendSuccess="loadLetters(checkedFriend)" />
    <stat ref="stat"
          v-on:scrollToDate="scrollToDate($event)"></stat>
  </el-row>
</template>
<style lang="stylus" scoped>
.component-wrapper
  height 100%
.left-section
  overflow hidden
  height 100%
  position relative
.friend-info
  position absolute
  background white
  left 0
  right 0
  top 0
  height 60px
  padding 20px 20px 10px 26px
  box-sizing border-box
  .name
    font-size 20px
    font-weight bold
.el-icon-location, .el-icon-date, .el-icon-plus, .el-icon-download
  font-size 16px
  cursor pointer
  margin-left 10px
.el-icon-date
  margin-left 10px
.right-container
  float right
  font-size 16px
  line-height 30px
  .sync-state
    font-size 14px
    color #34373d
    font-weight normal
    margin-right 10px
    line-height 20px
  .btn-close-letter
    cursor pointer
  .el-icon-loading
    margin-right 10px
.letter-list
  position absolute
  top 60px
  bottom 0
  left 0
  right 0
  overflow-y auto
  padding 20px 10px
  scroll-behavior smooth
.letter-item
  font-size 15px
  line-height 25px
  -webkit-box-shadow 0 17px 0 -16px #e5e5e5
  box-shadow 0 17px 0 -16px #e5e5e5
  cursor pointer
  padding 5px 16px
  box-sizing border-box
  transition background-color 400ms linear
.letter-checked
  background #f4f6ff
  -webkit-box-shadow 0 17px 0 -16px #f4f6ff
  box-shadow 0 17px 0 -16px #f4f6ff
.letter-highlight
  background #f4f6ff
.letter-body
  clear both
  display flex
  flex-direction row
  align-items center
  .letter-content
    flex 1
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    font-size 13px
    color #666
  .letter-attacments
    margin-left 4px
    height 16px
    vertical-align middle
.letter-deliver-time
  font-size 12px
.letter-state
  float right
.letter-state img, .letter-in-out
  height 16px
  vertical-align middle
.right-section
  padding 40px 20px 40px 20px
  overflow-y auto
  overflow-x hidden
  height 100%
  position relative
  background rgb(245, 245, 245)
.letter-nav
  max-width 500px
  margin 10px auto
.last-letter, .next-letter
  cursor pointer
  color #666
  padding 10px
  font-size 12px
.last-letter
  float left
.next-letter
  float right
</style>
<script>
import { mapState, mapMutations } from "vuex"
import { getDataManager } from "../persist/letter-store"
import * as api from "../api"
import {
  showError,
  showSuccess,
  showWarning,
  offsetTimezoneDate,
  formateDate,
  formatDateReadable,
  formatDateYMD,
  offsetAndFormatDate
} from "../util"
import { scrollToTop, onScrollEnd, exportLetters } from "../helper"
import { getAccount } from "../persist/account"

import NewLetter from "./NewLetter.vue"
import Stat from "./Stat.vue"
import LetterItem from "./LetterItem.vue"

import iconLetterOut from "../../images/ic_mail_out.png"
import iconLetterIn from "../../images/ic_mail_in.png"

export default {
  components: {
    NewLetter,
    Stat,
    LetterItem
  },
  computed: {
    ...mapState(["checkedFriend", "searchValue"]),
    attachments() {
      let l = this.checkedLetter
      return l
        ? l.attachments
          ? l.attachments.split(",").map(name => api.buildAttachmentUrl(name))
          : null
        : null
    },
    icLetterInOut() {
      return [iconLetterIn, iconLetterOut]
    },
    renderLetters() {
      let tempList = this.fastRender ? this.letters.slice(0, 25) : this.letters
      let resultList = this.searchValue
        ? tempList.filter(letter => {
            return letter.body.indexOf(this.searchValue) >= 0
          })
        : tempList

      let lastSearchText = this.searchValue
      if (this.checkedLetter) {
        let checkedIndex = -1
        for (let i = 0; i < resultList.length; i++) {
          if (resultList[i].id == this.checkedLetter.id) {
            checkedIndex = i
            break
          }
        }

        if (checkedIndex < 0) {
          this.checkedLetter = null
        } else if (lastSearchText != this.lastSearchText) {
          this.$nextTick(() => {
            this.scorllToIndex(checkedIndex)
          })
        }
      }
      this.lastSearchText = lastSearchText
      return resultList
    },
    checkedFriendInfo() {
      if (this.checkedFriend) {
        return (
          `姓名：${this.checkedFriend.name}\n` +
          `生日：${this.checkedFriend.dob}\n` +
          `回复时间：${offsetAndFormatDate(
            this.checkedFriend.latest_comment
          )}\n` +
          // last_login is set in letter-store.js
          (this.checkedFriend.last_login
            ? `登录时间：${offsetAndFormatDate(
                this.checkedFriend.last_login
              )}\n`
            : "")
        )
      } else {
        return ""
      }
    }
  },
  watch: {
    checkedFriend(newVal, oldVal) {
      if (newVal && oldVal && newVal.id == oldVal.id) {
        return
      }
      this.letters = []
      this.loadLetters(newVal)
      this.checkedLetter = null
      scrollToTop(this, ".letter-list")
    }
  },
  data() {
    return {
      letters: [],
      mapVisible: false,
      map: null,
      letterState: "",
      showSyncIcon: false,
      checkedLetter: null,
      checkedLetterIndex: -1,
      account: getAccount(),
      fastRender: false,
      highlightDate: null
    }
  },
  methods: {
    ...mapMutations(["checkFriend"]),
    loadLetters(friend) {
      getDataManager(friend)
        .setCallback((mgr, { isRefresh, isSync, dataList, isSuccess }) => {
          if (mgr.userId == this.checkedFriend.id) {
            if (isSync) {
              this.showSyncIcon = false
              this.letterState = `正在同步第${mgr.syncPage}页`
            } else if (isRefresh) {
              this.letterState = null
              this.showSyncIcon = true
            } else {
              this.showSyncIcon = false
              this.letterState = null
              if (!isSuccess) {
                showError(this, "同步失败")
              }
            }
            if (this.letters.length == 0) {
              this.optimiseRender()
            }
            this.letters = dataList
            this.checkedFriend.letters = dataList

            if (this.checkedLetter) {
              this.checkedLetter = dataList.find()
              for (let i = 0; i < dataList.length; i++) {
                if (dataList[i].id == this.checkedLetter.id) {
                  this.checkLetter(dataList[i], i, true)
                  break
                }
              }
            }
          }
        })
        .requestData()
    },
    newLetter() {
      this.$refs.newLetter.showEditor()
    },
    checkLetter(letter, index, stickPosition) {
      this.checkedLetter = letter
      this.checkedLetterIndex = index
      if (!stickPosition) {
        scrollToTop(this, ".right-section")
      }
    },
    formatReadableTime(time) {
      return formatDateReadable(offsetTimezoneDate(time))
    },
    showStat() {
      if (this.letters.length == 0) {
        showWarning(this, "没有信件")
      } else {
        this.$refs.stat.showStat(this.checkedFriend, this.letters)
      }
    },
    isLetterArrive(letter) {
      return offsetTimezoneDate(letter.deliver_at) < Date.now()
    },
    isLetterOut(letter) {
      return letter.user == this.account.id
    },
    optimiseRender() {
      if (this.checkedFriend) {
        this.fastRender = true
        setTimeout(() => {
          this.fastRender = false
        }, 0)
      }
    },
    lastLetter() {
      this.checkLetter(
        this.renderLetters[this.checkedLetterIndex - 1],
        this.checkedLetterIndex - 1
      )
    },
    nextLetter() {
      this.checkLetter(
        this.renderLetters[this.checkedLetterIndex + 1],
        this.checkedLetterIndex + 1
      )
    },
    scrollToDate(date) {
      let index = -1
      let find = false
      this.renderLetters.forEach(letter => {
        let str = formatDateYMD(offsetTimezoneDate(letter.deliver_at))
        if (!find) {
          if (str == date) {
            find = true
          }
          index++
        }
        letter.highlight = str == date
      })
      this.highlightDate = date
      let elList = this.$el.querySelector(".letter-list")

      if (find) {
        this.scorllToIndex(index)
      }
      onScrollEnd(elList, () => {
        setTimeout(() => {
          this.highlightDate = null
        }, 2000)
      })
    },
    scorllToIndex(index, elList) {
      if (!elList) {
        elList = this.$el.querySelector(".letter-list")
      }
      if (elList && elList.children && elList.children.length > index) {
        elList.scrollTop = elList.children[index].offsetTop
      }
    },
    closeLetters() {
      this.checkFriend(null)
    },
    doExport() {
      exportLetters(this.checkedFriend, this.letters)
    }
  }
}
</script>
