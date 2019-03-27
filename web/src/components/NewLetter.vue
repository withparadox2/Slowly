<template>
  <div class="editor-container"
       v-show="editorVisible">
    <div class="editor-wrapper"
         :class="{large:isShowLetter}">
      <div class="editor-header">
        <span>To {{checkedFriend && checkedFriend.name}}</span>
        <span class="word-count"
              v-show="inputData">{{inputData.length}}</span>
        <span class="sending-state"
              v-show="isSending">正在发送...</span>
        <span class="el-icon-close"
              title="关闭"
              @click="close()" />
        <span class="el-icon-tickets"
              title="历史信件"
              @click="toggleShowLetter()" />
        <span class="el-icon-message"
              title="发送"
              @click="send()" />
      </div>
      <el-row class="editor-content">
        <el-col :span="isShowLetter ? 12 : 24"
                class="editor-left-section">
          <textarea class="editor-body"
                    name="text"
                    placeholder="请写下文字"
                    spellcheck="false"
                    v-model="inputData"
                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>
          </textarea>
          <div class="form-section">
            <form id='formSumbit'
                  style="width:0;height:0;"
                  :action='formUploadUrl()'
                  method='post'
                  enctype='multipart/form-data'>
              <input type="file"
                     style="width:0;height:0;"
                     @change="onImageChange()"
                     id="input-image"
                     name="image"
                     multiple
                     accept="image/png, image/jpeg" />
            </form>
            <grid-view :numColumns="4"
                       :spaceX="20"
                       :spaceY="20">
              <div class="image-item"
                   :key="item.key"
                   v-for="item in rawImageList">
                <img :src="item.src" />
              </div>
              <div class="btn-add-image"
                   @click="addImage()">
                <i class="el-icon-plus"></i>
              </div>
            </grid-view>
          </div>
        </el-col>
        <el-col :span="12"
                v-if="isShowLetter && checkedFriend.letters"
                class="letter-list">
          <letter-item v-for="item in renderLetters"
                       :key="item.id"
                       :dialogMode="true"
                       :letter="item"></letter-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
.editor-container {
  z-index: 1000;
  position: fixed;
  background: #000000aa;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.editor-wrapper {
  position: absolute;
  top: 5%;
  width: 650px;
  background: #f4f6ff;
  margin-left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
}
.editor-wrapper.large {
  max-width: 80%;
  width: 960px;
}
.editor-content {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  max-height: calc(100vh - 124px);
  overflow-y: hidden;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}
.letter-list {
  overflow-y: auto;
  max-height: calc(100vh - 124px);
  min-height: 250px;
  overflow-x: hidden;
  padding: 10px;
}
.letter-list > div {
  margin-bottom: 50px;
}
.editor-left-section {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 124px);
}
.editor-body {
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  flex: 1;
  min-height: 250px;
  box-sizing: border-box;
  border: none;
  font-size: 14px;
  line-height: 24px;
  resize: none;
  outline: 0;
  font-family: inherit;
  background: transparent;
}
.form-section {
  padding: 20px;
}
.image-item img {
  width: 100%;
  height: 100%;
}
.btn-add-image {
  font-size: 80px;
  color: #ddd;
  background: #eee;
  position: relative;
}
.btn-add-image > i {
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  position: absolute;
}
.editor-header {
  padding: 10px 0 10px 10px;
  font-size: 16px;
  background-color: #0078d7;
  color: white;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.word-count {
  font-size: 12px;
  margin-left: 10px;
  color: #ffffffaa;
}
.sending-state {
  font-size: 12px;
  margin-left: 10px;
  color: #ffffffaa;
}
.el-icon-tickets,
.el-icon-close,
.el-icon-message {
  float: right;
  padding: 0 10px;
  cursor: pointer;
  margin-top: 3px;
}
</style>
<script>
import { mapState, mapMutations } from "vuex"
// import $ from 'jQuery'

import * as api from "../api"
import { showError, showSuccess } from "../util"
import * as draft from "../persist/draft"
import * as account from "../persist/account"
import { scrollToTop } from "../helper"
import { setTimeout } from "timers"

import LetterItem from "./LetterItem.vue"
import GridView from "./common/GridView.vue"

export default {
  data() {
    return {
      editorVisible: false,
      inputData: "",
      isSending: false,
      isShowLetter: false,
      fastRender: true,
      rawImageList: []
    }
  },
  components: {
    LetterItem,
    GridView
  },
  computed: {
    ...mapState(["checkedFriend"]),
    renderLetters() {
      return this.fastRender
        ? this.checkedFriend.letters.slice(0, 5)
        : this.checkedFriend.letters
    }
  },
  watch: {
    editorVisible(visible) {
      this.optimiseRender()
      this.scrollLetterListToTop()
    }
  },
  methods: {
    formUploadUrl() {
      return api.buildUploadUrl(this.checkedFriend.id)
    },
    showEditor() {
      this.editorVisible = true
      this.inputData = ""
      this.isSending = false
      draft
        .getDraft(this.checkedFriend.id)
        .then(draftItem => {
          if (draftItem) {
            this.inputData = draftItem.content
          }
        })
        .catch(e => showError(this, "加载草稿失败：" + e))
    },
    saveDraft(content) {
      return draft
        .setDraft({
          user_id: this.checkedFriend.id,
          content: content
        })
        .catch(e => showError(this, "保存草稿失败：" + e))
    },
    close() {
      if (!this.inputData) {
        this.editorVisible = false
        return
      }
      this.$confirm("关闭后将会保存为草稿，是否关闭？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.saveDraft(this.inputData).then(() => {
            this.editorVisible = false
          })
        })
        .catch(() => {})
    },
    send() {
      if (!this.inputData) {
        showError(this, "请输入内容")
        return
      }
      this.$confirm(`是否发送给${this.checkedFriend.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          if (this.rawImageList.length > 0) {
            this.uploadImages()
          } else {
            this.sendImpl()
          }
        })
        .catch(() => {})
    },
    sendImpl() {
      this.isSending = true
      let accountInfo = account.getAccount()
      api
        .sendLetter(
          this.checkedFriend.id,
          this.inputData,
          this.checkedFriend.joined != accountInfo.id
        )
        .then(response => {
          this.editorVisible = false
          this.isSending = false
          this.checkedFriend.lastRefreshTime = 0
          this.$emit("sendSuccess")
          this.saveDraft("")
          showSuccess(this, "success")
        })
        .catch(({ message }) => {
          this.isSending = false
          showError(this, message)
        })
    },
    toggleShowLetter() {
      this.isShowLetter = !this.isShowLetter
      this.optimiseRender()
      this.scrollLetterListToTop()
    },
    scrollLetterListToTop() {
      if (this.isShowLetter) {
        scrollToTop(this, ".letter-list")
      }
    },
    optimiseRender() {
      if (this.isShowLetter) {
        this.fastRender = true
        setTimeout(() => {
          this.fastRender = false
        }, 0)
      }
    },
    addImage() {
      this.$el.querySelector("#input-image").click()
    },
    onImageChange() {
      let images = this.$el.querySelector("#input-image").files || []
      for (let i = 0; i < images.length; i++) {
        this.loadImage(images[i])
      }
    },
    loadImage(file) {
      let reader = new FileReader()
      reader.onload = e => {
        this.rawImageList.push({
          src: e.target.result,
          file,
          key: this.generateImageKey()
        })
      }
      reader.readAsDataURL(file)
    },
    generateImageKey() {
      if (this.imageKey == null) {
        this.imageKey = 0
      }
      return this.imageKey++
    },
    uploadImages() {
      api
        .uploadImages(
          this.checkedFriend.id,
          this.rawImageList.map(item => item.file)
        )
        .then(result => {
          showSuccess(result.data)
          debugger
        })
        .catch(({ message }) => {
          showError(this, message)
        })
    }
  }
}
</script>
