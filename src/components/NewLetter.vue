<template>
  <div class="component-container"
       v-show="editorVisible">
    <div class="editor-wrapper"
         :class="{large:isShowLetter}">
      <div class="editor-header">
        <span>To {{checkedFriend && checkedFriend.name}}</span>
        <span class="word-count"
              v-show="inputData">{{inputData.length}}</span>
        <span class="sending-state"
              v-show="sendingState">{{sendingState}}</span>
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
            <div class="tip-add-image">添加图片<span v-show="rawImageList.length">({{rawImageList.length}})</span></div>
            <div class="image-container">
              <div class="btn-add-image"
                   @click="addImage()">
                <i class="el-icon-plus"></i>
              </div>
              <div class="image-item"
                   :key="item.key"
                   v-for="(item, index) in rawImageList">

                <img :src="item.src"
                     @click="viewImage(item.src)" />

                <i class="el-icon-remove"
                   @click="removeImage(index)"></i>
              </div>
            </div>
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
<style lang="stylus" scoped>
.component-container
  z-index 1000
  position fixed
  background rgba(0, 0, 0, 0.7)
  top 0
  left 0
  right 0
  bottom 0
.editor-wrapper
  position absolute
  top 5%
  width 650px
  background #f4f6ff
  margin-left 50%
  transform translateX(-50%)
  border-radius 6px
  &.large
    max-width 80%
    width 960px
.editor-content
  border-bottom-left-radius 6px
  border-bottom-right-radius 6px
  max-height calc(100vh - 124px)
  overflow-y hidden
  background transparent
  width 100%
  box-sizing border-box
.letter-list
  overflow-y auto
  height calc(100vh - 124px)
  min-height 250px
  overflow-x hidden
  padding 10px
.letter-list > div
  margin-bottom 50px
.editor-left-section
  display flex
  flex-direction column
  height calc(100vh - 124px)
.editor-body
  padding 20px
  width 100%
  overflow-y auto
  flex 1
  min-height 250px
  box-sizing border-box
  border none
  font-size 13px
  line-height 24px
  resize none
  outline 0
  font-family inherit
  background transparent
.form-section
  padding 10px 20px 0 20px
.editor-header
  padding 10px 0 10px 10px
  font-size 16px
  background-color #0078d7
  color white
  border-top-left-radius 6px
  border-top-right-radius 6px
.word-count
  font-size 12px
  margin-left 10px
  color rgba(255, 255, 255, 0.7)
.sending-state
  font-size 12px
  margin-left 10px
  color rgba(255, 255, 255, 0.7)
.el-icon-tickets, .el-icon-close, .el-icon-message
  float right
  padding 0 10px
  cursor pointer
  margin-top 3px
.tip-add-image
  font-size 13px
  color #666
.image-item
  position relative
.image-item img
  width 100%
  height 100%
  cursor pointer
.btn-add-image
  font-size 60px
  color #ddd
  background #eee
  position relative
  cursor pointer
.btn-add-image > i
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
  position absolute
.image-container
  overflow-x auto
  overflow-y hidden
  height 100px
  white-space nowrap
  padding-bottom 20px
  padding-top 10px
  > div
    display inline-block
    width 100px
    height 100px
    margin-right 20px
.el-icon-remove
  position absolute
  margin-left -10px
  margin-top -6px
  color red
  cursor pointer
</style>
<script>
import { mapState, mapMutations } from "vuex"

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
      isUploading: false,
      isShowLetter: false,
      fastRender: true,
      rawImageList: [],
      attachments: ""
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
    },
    sendingState() {
      if (this.isSending || this.isUploading) {
        return this.isUploading ? "正在上传图片..." : "正在发送..."
      }
      return ""
    }
  },
  watch: {
    editorVisible(visible) {
      if (visible) {
        this.optimiseRender()
        this.scrollLetterListToTop()
      }
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
      this.isUploading = false
      this.rawImageList = []
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
      this.$confirm(
        `关闭后将会保存为草稿，${
          this.rawImageList.length > 0 ? "但图片会丢失，" : ""
        }是否关闭？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
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
          this.checkedFriend.joined != accountInfo.id,
          this.attachments
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
    removeImage(index) {
      this.rawImageList.splice(index, 1)
    },
    uploadImages() {
      this.isUploading = true
      api
        .uploadImages(
          this.checkedFriend.id,
          this.rawImageList.map(item => item.file)
        )
        .then(result => {
          this.isUploading = false
          this.attachments = result.map(item => item.data).join(",")
          this.sendImpl()
          console.log(result)
        })
        .catch(result => {
          this.isUploading = false
          console.log(result)
          showError(this, result)
        })
    },
    viewImage(base64) {
      window
        .open()
        .document.write(
          '<iframe src="' +
            base64 +
            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        )
    }
  }
}
</script>
