<template>
  <el-row v-if="checkedFriend"
          class="component-wrapper">
    <el-col :span="selectedLetter ? 12 : 24"
            class="left-section">
      <div class="letter-list">
        <div v-for="letter in letters"
             :class="{'letter-checked': letter == selectedLetter}"
             class="letter-item"
             @click="selectLetter(letter)"
             :key="letter.id">
          <div class="letter-item-content">
            <div>
              {{letter.name}}
              <span class="letter-deliver-time">{{formatTime(letter.deliver_at)}}</span>
            </div>
            <div class="letter-body">
              {{letter.body.substring(0, 100)}}
            </div>
          </div>
        </div>
      </div>
      <div class="friend-info">
        <span class="name">
          {{checkedFriend.name}}<span title="信件数量">({{letters.length}})</span>
          <i class="el-icon-location"
             title="查看位置"
             @click="$emit('showMap', checkedFriend)"></i>
          <i class="el-icon-date"
             title="统计"></i>
          <i class="el-icon-plus"
             title="新建"
             @click="newLetter"></i>
          <i v-show="showSyncIcon"
             class="el-icon-loading"></i>
          <span v-show="letterState"
                class="sync-state">{{letterState}}</span>
        </span>

      </div>
    </el-col>
    <el-col :span="12"
            v-show="selectedLetter"
            class="right-section">
      <div v-if="selectedLetter"
           class="letter-detail-wrapper">
        <div class="letter-detail">
          <img src="../../images/pen.png"
               alt="">
          <div>{{selectedLetter.body && selectedLetter.body.trim()}}</div>
        </div>
        <div class="letter-info"
             v-if="selectedLetter">
          <div><span class="title-label">字数</span>{{selectedLetter.body.length}}</div>
          <div><span class="title-label">发信人</span>{{selectedLetter.name}}</div>
          <div><span class="title-label">送达时间</span>{{formatTime(selectedLetter.deliver_at)}}</div>
          <div v-show="selectedLetter.read_at"><span class="title-label">阅读时间</span>{{formatTime(selectedLetter.read_at)}}</div>
        </div>
      </div>

    </el-col>
    <new-letter ref="newLetter"
                v-on:sendSuccess="loadLetters(checkedFriend)" />
  </el-row>
</template>
<style scoped>
.component-wrapper {
  height: 100%;
}
.left-section {
  overflow: hidden;
  height: 100%;
  position: relative;
}
.friend-info {
  position: absolute;
  background: white;
  left: 0;
  right: 0;
  top: 0;
  height: 60px;
  padding: 20px 20px 10px 26px;
  box-sizing: border-box;
}
.friend-info .name {
  font-size: 20px;
  font-weight: bold;
}
.el-icon-location,
.el-icon-date,
.el-icon-plus {
  cursor: pointer;
  margin-left: 10px;
}
.el-icon-date {
  margin-left: 10px;
}
.sync-state {
  font-size: 14px;
  color: #34373d;
  font-weight: normal;
  margin-left: 10px;
  line-height: 20px;
  float: right;
}
.el-icon-loading {
  float: right;
}
.letter-list {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 20px 10px;
}
.letter-item {
  font-size: 15px;
  line-height: 25px;
  -webkit-box-shadow: 0 17px 0 -16px #e5e5e5;
  box-shadow: 0 17px 0 -16px #e5e5e5;
  cursor: pointer;
  padding: 5px 16px;
  box-sizing: border-box;
}
.letter-checked {
  background: #f4f6ff;
  -webkit-box-shadow: 0 17px 0 -16px #f4f6ff;
  box-shadow: 0 17px 0 -16px #f4f6ff;
}
.letter-body {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 13px;
  color: #666;
}
.letter-deliver-time {
  float: right;
  font-size: 12px;
}
.right-section {
  padding: 40px 20px 40px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  background: rgb(245, 245, 245);
}
.letter-detail-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
.letter-detail {
  white-space: pre-wrap;
  white-space: pre-line;
  width: 100%;
  background: white;
  padding: 40px 20px;
  line-height: 26px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #eaeaea;
}
.letter-detail img {
  width: 100px;
  float: right;
}
.letter-detail div {
  clear: both;
  padding-top: 10px;
}
.letter-info {
  font-size: 12px;
  margin-top: 10px;
  color: #666;
  padding-right: 10px;
  float: right;
}
.letter-info .title-label {
  display: inline-block;
  width: 60px;
}
</style>
<script>
import { mapState, mapMutations } from "vuex"
import { getDataManager } from "../persist/letter-store"
import * as api from "../api"
import { showError, showSuccess, formateDate } from "../util"
import { scrollToTop } from "../helper"
import NewLetter from "./NewLetter.vue"

export default {
  components: {
    NewLetter
  },
  computed: {
    ...mapState(["checkedFriend"])
  },
  watch: {
    checkedFriend(newFriend) {
      this.letters = []
      this.loadLetters(newFriend)
      this.selectedLetter = null
      scrollToTop(this, ".letter-list")
    }
  },
  data() {
    return {
      letters: [],
      mapVisible: false,
      map: null,
      accountInfo: null,
      letterState: "",
      showSyncIcon: false,
      selectedLetter: null
    }
  },
  methods: {
    loadLetters(friend) {
      getDataManager(friend.id)
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
            this.letters = dataList
          }
        })
        .requestData()
    },
    newLetter() {
      this.$refs.newLetter.showEditor()
    },
    selectLetter(letter) {
      this.selectedLetter = letter
      scrollToTop(this, ".right-section")
    },
    formatTime(time) {
      debugger
      let d = new Date(time)
      return formateDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000))
    }
  }
}
</script>
