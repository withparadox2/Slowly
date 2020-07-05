<template>
  <el-row v-if="checkedFriend"
          class="component-wrapper">
    <el-col :span="checkedLetter ? 12 : 24"
            class="left-section">
      <div class="letter-list soft-scrollable">
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
                      v-if="isLetterArrive(letter)">
                  <span>{{formatReadableTime(letter.created_at)}}</span>
                  <span v-if="!letter.read_at"
                        class="letter-read-state" />
                </span>
                <img class="letter-in-out"
                     v-else
                     :src="isLetterOut(letter) ? icLetterInOut[1] : icLetterInOut[0]" />
              </span>
            </div>
            <div class="letter-body">
              <span class="letter-content"
                    v-if="!searchValue">{{letter.body.substring(0, 150) || getLeftTime(letter)}}</span>
              <span class="letter-content"
                    v-else
                    v-html="letter.searchHtml"></span>
              <img class="letter-attacments"
                   v-show="letter.attachments && isLetterArrive(letter)"
                   src="../images/ic_attachments.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="friend-info">
        <div v-show="!searchValue"
             class="friendinfo-header">
          <div class="left-container">
            <div class="content">
              <span :title="checkedFriendInfo"
                    @click="showFriendInfo"
                    class="name">{{checkedFriend.name}}<span title="信件数量">({{searchValue ? renderLetters.length : letters.length}})</span></span>
              <i class="el-icon-location"
                 v-show="checkedFriend.user_location"
                 :title="$t('view_location')"
                 @click="$emit('showMap', checkedFriend)"></i>
              <i class="el-icon-date"
                 @click="showStat = true"
                 :title="$t('view_stat')"></i>
              <i class="el-icon-plus"
                 :title="$t('new_letter')"
                 @click="newLetter"></i>
              <i class="el-icon-download"
                 :title="$t('export_letters')"
                 @click="doExport"></i>
            </div>
          </div>
          <div class="right-container">
            <i v-show="showSyncIcon"
               class="el-icon-loading"></i>
            <span v-show="letterState"
                  class="sync-state">{{letterState}}</span>
            <i class="el-icon-close btn-close-letter"
               @click="closeLetters" />
          </div>
        </div>
        <span v-show="searchValue">
          <span class="name">{{$t('search_placeholder_prefix')}}"{{searchValue}}"({{renderLetters.length}})</span>
        </span>
      </div>
    </el-col>
    <el-col :span="12"
            v-if="checkedLetter"
            class="right-section">
      <div class="search-nav"
           v-if="false">
        <span class="result"></span>
        <span class="nav-item el-icon-arrow-up"></span>
        <span class="nav-item el-icon-arrow-down"></span>
      </div>
      <div class="scroll-container-wrapper">
        <div class="scroll-container soft-scrollable">
          <letter-item ref="letterItem"
                       :letter="checkedLetter"></letter-item>
        </div>

        <div class="letter-nav">
          <span class="last-letter"
                :style="{opacity: this.checkedLetterIndex > 0 ? 1 : 0}"
                @click="lastLetter">{{$t('last_letter')}}</span>
          <span class="next-letter"
                :style="{opacity: this.checkedLetterIndex < this.renderLetters.length - 1 ? 1 : 0}"
                @click="nextLetter">{{$t('next_letter')}}</span>
          <i class="el-icon-close btn-close-letter"
             @click="checkedLetter = null" />
        </div>
      </div>
    </el-col>
    <new-letter ref="newLetter"
                v-on:sendSuccess="loadLetters(checkedFriend)" />
    <stat ref="stat"
          v-if="showStat"
          :friend="checkedFriend"
          v-on:close="showStat = false"
          v-on:scrollToDate="scrollToDate($event)"></stat>
  </el-row>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
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
.friendinfo-header
  display flex
  .left-container
    flex 1
    overflow-x auto
    overflow-y hidden
    margin-right 5px
    .content
      white-space nowrap
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
    font-size $font-letter
    color #666
  .letter-attacments
    margin-left 4px
    height 16px
    vertical-align middle
.letter-deliver-time
  font-size 12px
.letter-state
  float right
.letter-read-state
  display inline-block
  background red
  width 4px
  height 4px
  border-radius 3px
  margin-left 3px
  vertical-align middle
.letter-state img, .letter-in-out
  height 16px
  vertical-align middle
.right-section
  height 100%
  position relative
  background rgb(245, 245, 245)
  .scroll-container-wrapper
    width 100%
    height 100%
    overflow-y hidden
    overflow-x hidden
  .scroll-container
    box-sizing border-box
    width 100%
    height 100%
    padding 40px 20px 40px 20px
    overflow-y auto
    overflow-x hidden
.letter-nav
  position absolute
  bottom 0
  left 0
  right 0
  background #f4f4f4
  border-top 1px solid #eaeaea
  text-align center
  height 30px
  line-height 30px
  .btn-close-letter
    cursor pointer
    color #666
    float left
    margin-left 10px
    margin-top 7px
.last-letter, .next-letter
  cursor pointer
  color #666
  padding 0 10px
  font-size 12px
.search-nav
  position absolute
  top 0
  left 0
  background white
  border-bottom-right-radius 6px
  border-right #ccc 1px solid
  border-bottom #ccc 1px solid
  .result
    font-size 12px
    line-height 20px
    display inline-block
    padding 0 5px 2px 5px
  .nav-item
    cursor pointer
    display inline-block
    padding 0 5px
.tablet-mode .right-section
  position absolute
  top 0
  left 0
  width 100%
  height 100%
</style>

<style lang="stylus">
.dialog-friend-info .el-message__content
  white-space pre
  line-height 20px
.tablet-mode.mobile-mode .right-section .scroll-container
  padding 0 0 40px 0
  .letter-detail
    border none
    border-radius 0px
</style>


<script>
import { mapState, mapMutations } from "vuex"
import { getDataManager, updateLetter } from "../persist/letter-store"
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
import {
  scrollToTop,
  onScrollEnd,
  exportLetters,
  createListRender
} from "../helper"
import { getAccount } from "../persist/account"
import matchAll from "string.prototype.matchall"
import { countries } from "country-data"

import NewLetter from "../pages/NewLetter.vue"
import Stat from "../pages/Stat.vue"
import LetterItem from "./LetterItem.vue"

import iconLetterOut from "../images/ic_mail_out.png"
import iconLetterIn from "../images/ic_mail_in.png"

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
      let tempList = this.listRender.renderedList()
      const regExp = new RegExp(this.searchValue, "g")
      let resultList = this.searchValue
        ? tempList.filter(letter => {
            const matchResult = [...matchAll(letter.body, regExp)]
            if (matchResult.length == 0) {
              return false
            }

            let resultStr = ""
            let preIndex = -1

            // Only show first five match result
            const matchResultSize = Math.min(matchResult.length, 5)
            for (let index = 0; index < matchResultSize; index++) {
              const sideWordLength = 6
              let val = matchResult[index]
              let startIndex = preIndex + 1
              if (val.index - startIndex > sideWordLength) {
                resultStr += "..."
                startIndex = val.index - sideWordLength
              }
              resultStr +=
                letter.body.substr(startIndex, val.index - startIndex) +
                this.searchValue

              let endIndex =
                val.index + this.searchValue.length + sideWordLength
              if (matchResultSize - 1 > index) {
                let nextMatchVal = matchResult[index + 1]
                endIndex = Math.min(nextMatchVal.index - 1, endIndex)
              }

              resultStr += letter.body.substring(
                val.index + this.searchValue.length,
                endIndex + 1
              )

              preIndex = endIndex

              if (matchResultSize - 1 == index) {
                if (resultStr.length < 150) {
                  resultStr += letter.body.substr(
                    preIndex,
                    150 - resultStr.length
                  )
                }
              }
            }

            letter.searchHtml = resultStr
              .split(this.searchValue)
              .join('<span style="color: red">' + this.searchValue + "</span>")

            return true
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
        const infoList = []
        infoList.push([this.$t("name"), this.checkedFriend.name])
        {
          const locationCode = this.checkedFriend.location_code
          const country = countries[locationCode]
          infoList.push([
            this.$t("location"),
            (country && country.name) || locationCode
          ])
        }
        if (this.checkedFriend.latest_comment) {
          infoList.push([
            this.$t("reply_time"),
            offsetAndFormatDate(this.checkedFriend.latest_comment)
          ])
        }
        if (this.checkedFriend.last_login) {
          infoList.push([
            this.$t("login_time"),
            offsetAndFormatDate(this.checkedFriend.last_login)
          ])
        }
        return infoList.map(item => item.join("：")).join("\n")
      }
      return ""
    },
    searchNav() {
      if (!this.checkedFriend || !this.searchValue || !this.refs.letterItem) {
        return {
          show: false
        }
      }
      return {
        show: true
      }
    }
  },
  watch: {
    checkedFriend(newVal, oldVal) {
      if (!newVal || (newVal && oldVal && newVal.id == oldVal.id)) {
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
      highlightDate: null,
      listRender: createListRender({
        preloadCount: 25
      }),
      showStat: false
    }
  },
  methods: {
    ...mapMutations(["checkFriend"]),
    showFriendInfo() {
      const h = this.$createElement
      this.$message({
        dangerouslyUseHTMLString: true,
        message: this.checkedFriendInfo,
        duration: 10000,
        showClose: true,
        customClass: "dialog-friend-info"
      })
    },
    loadLetters(friend) {
      getDataManager(friend)
        .setCallback((mgr, { isRefresh, isSync, dataList, isSuccess }) => {
          if (mgr.userId == this.checkedFriend.id) {
            if (isSync) {
              this.showSyncIcon = false
              this.letterState = this.$t("tip_sync_page", {
                pageIndex: mgr.syncPage
              })
            } else if (isRefresh) {
              this.letterState = null
              this.showSyncIcon = true
            } else {
              this.showSyncIcon = false
              this.letterState = null
              if (!isSuccess) {
                showError(this, this.$t("err_sync_fail"))
              }
            }
            if (this.letters.length == 0) {
              this.listRender.optimise()
            }
            this.letters = dataList
            this.listRender.dataList = this.letters
            this.checkedFriend.letters = dataList

            if (this.checkedLetter) {
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
      if (index < 0 || index >= this.renderLetters.length) {
        return
      }
      this.checkedLetter = letter
      this.checkedLetterIndex = index
      if (!stickPosition) {
        scrollToTop(this, ".right-section .scroll-container")
      }
      if (
        !letter.read_at &&
        !this.isLetterOut(letter) &&
        this.isLetterArrive(letter)
      ) {
        api
          .readLetter(letter.id)
          .then(response => {
            if (response && response.data.success) {
              const time = formateDate(offsetTimezoneDate(new Date(), true))
              this.$set(letter, "read_at", time)
              updateLetter(this.checkedFriend, letter)
            }
          })
          .catch(e => {
            console.error(e)
          })
      }
    },
    formatReadableTime(time) {
      return formatDateReadable(offsetTimezoneDate(time))
    },
    isLetterArrive(letter) {
      return offsetTimezoneDate(letter.deliver_at) < Date.now()
    },
    getLeftTime(letter) {
      const timeLeft = offsetTimezoneDate(letter.deliver_at) - Date.now()
      if (timeLeft > 0) {
        const minutes = timeLeft / (60 * 1000)
        if (minutes < 30) {
          return this.$tc("arrive_in_minutes", parseInt(minutes))
        } else {
          const hours = minutes / 60
          return this.$tc("arrive_in_hours", parseInt(hours) + 1)
        }
      }
      return ""
    },
    isLetterOut(letter) {
      return letter.user == this.account.id
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
