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
              <span class="letter-deliver-time">{{letter.deliver_at}}</span>
            </div>
            <div class="letter-body">
              {{letter.body.substring(0, 100)}}
            </div>
          </div>
        </div>
      </div>
      <div class="friend-info">
        <span class="name">
          {{checkedFriend.name}}
          <i class="el-icon-location"></i>
          <i class="el-icon-date"></i>
        </span>
        <div v-show="letterState">{{letterState}}</div>
      </div>
    </el-col>
    <el-col :span="12"
            v-show="selectedLetter"
            class="right-section">
      <div v-if="selectedLetter"
           class="letter-detail">
        <img src="../../images/pen.png"
             alt="">
        <div>{{selectedLetter.body}}</div>
      </div>
    </el-col>
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
  height: 50p;
  padding: 20px;
}
.friend-info .name {
  font-size: 20px;
  font-weight: bold;
}
.el-icon-location,
.el-icon-date {
  cursor: pointer;
  margin-left: 5px;
}
.el-icon-date {
  margin-left: 10px;
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
  font-size: 14px;
}
.right-section {
  padding: 40px 20px 40px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  background: rgb(245, 245, 245);
}
.letter-detail {
  white-space: pre-wrap;
  white-space: pre-line;
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 40px 20px;
  line-height: 26px;
  font-size: 14px;
  box-sizing: border-box;
  margin: 0 auto;
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
</style>
<script>
import { mapState, mapMutations } from "vuex"
import { getDataManager } from "../persist/letter-store"
import * as api from "../api"
import { showError, showSuccess } from "../util"
export default {
  computed: {
    ...mapState(["checkedFriend"])
  },
  watch: {
    checkedFriend(newFriend) {
      this.loadLetters(newFriend)
    }
  },
  data() {
    return {
      letters: [],
      editorVisible: false,
      mapVisible: false,
      map: null,
      accountInfo: null,
      letterState: "",
      inputLetter: "",
      selectedLetter: null
    }
  },
  methods: {
    loadLetters(friend) {
      getDataManager(friend.id)
        .setCallback((mgr, { isRefresh, isSync, dataList, isSuccess }) => {
          if (mgr.userId == this.checkedFriend.id) {
            if (isSync) {
              this.letterState = `正在同步${mgr.syncPage}页`
            } else if (isRefresh) {
              this.letterState = `正在刷新`
            } else {
              this.letterState = isSuccess ? "" : "同步失败"
            }
            this.letters = dataList
          }
        })
        .requestData()
    },
    newLetter() {
      this.editorVisible = !this.editorVisible
    },
    sendLetter() {
      if (!this.inputLetter) {
        showError(this, "请输入内容")
        return
      }
      api
        .sendLetter(this.checkedFriend.id, this.inputLetter)
        .then(response => {
          this.inputLetter = ""
          this.editorVisible = false
          showSuccess(this, "success")
        })
        .catch(this.$errorHandler())
    },
    selectLetter(letter) {
      this.selectedLetter = letter
      // scroll detail view to top
      this.$nextTick(() => {
        let dom = this.$el.querySelector(".right-section")
        if (dom) {
          dom.scrollTop = 0
        }
      })
    }
  }
}
</script>
