<template>
  <div class="modal"
       v-if="editorVisible">
    <div class="editor-wrapper"
         :class="{large:isShowLetter}">
      <div class="editor-header">
        <span>To {{checkedFriend && checkedFriend.name}}</span>
        <span class="word-count"
              v-show="wordCount">{{wordCount}}</span>
        <span class="sending-state"
              v-show="letterState">{{letterState}}</span>
        <div class="right-btn-group">
          <span class="el-icon-message"
                :title="$t('send')"
                @click="send()" />
          <span class="el-icon-tickets"
                :title="$t('history_letter')"
                @click="toggleShowLetter()" />
          <span class="el-icon-close"
                :title="$t('close')"
                @click="close()" />
        </div>

      </div>
      <el-row class="editor-content">
        <el-col :span="isShowLetter ? 12 : 24"
                class="editor-left-section">
          <div class="editor-body-wrapper">
            <img :src="stamp | stampUrl"
                 @click="showStampCollection = true"
                 class="stamp" />
            <span v-show="!inputData.length"
                  @click="$refs.editor.$el.focus()"
                  class="placeholder">{{$t("write_words")}}</span>

            <contenteditable tag="div"
                             ref="editor"
                             class="editor-body"
                             :contenteditable="true"
                             v-model="inputData" />
          </div>

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
            <div class="tip-add-image"
                 @click="isShowAddMedia = !isShowAddMedia">{{$t('add_photos')}}<span v-show="rawImageList.length">({{rawImageList.length}})</span></div>
            <div class="image-container"
                 v-if="!mobileMode || isShowAddMedia">
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
                class="edit-letter-list soft-scrollable">
          <letter-item v-for="item in renderLetters"
                       :key="item.id"
                       :dialogMode="true"
                       :letter="item"></letter-item>
        </el-col>
      </el-row>
    </div>
    <stamps v-if="showStampCollection"
            v-on:select="onSelectStamp" />
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
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
.edit-letter-list
  overflow-y auto
  height calc(100vh - 124px)
  min-height 250px
  overflow-x hidden
  padding 10px
.edit-letter-list > div
  margin-bottom 50px
.editor-left-section
  display flex
  flex-direction column
  height calc(100vh - 124px)
.editor-body-wrapper
  width 100%
  overflow-x hidden
  flex 1
  .placeholder
    position absolute
    top 0
    left 0
    padding 20px
    font-size $font-letter
    color #aaa
    margin-top 3px
  .stamp
    float right
    width 100px
    display block
    margin-right -8px
    margin-top 3px
    cursor pointer
.editor-body
  padding 20px
  width 100%
  min-height 250px
  box-sizing border-box
  border none
  font-size $font-letter
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
  position relative
.word-count
  font-size 12px
  margin-left 10px
  color rgba(255, 255, 255, 0.7)
.sending-state
  font-size 12px
  margin-left 10px
  color rgba(255, 255, 255, 0.7)
.right-btn-group
  right 0
  top 10px
  background #0078d7
  position absolute
.el-icon-tickets, .el-icon-close, .el-icon-message
  padding 0 10px
  cursor pointer
  margin-top 3px
.tip-add-image
  font-size 13px
  color #666
  padding-bottom 10px
  cursor pointer
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
<style lang="stylus">
.tablet-mode
  .editor-wrapper, .editor-wrapper.large
    width 100%
    max-width 100%
    top 0
    bottom 0
    left 0
    right 0
    display flex
    flex-direction column
  .editor-left-section, .editor-content, .edit-letter-list
    height 100%
    max-height 100%
    flex 1
  .editor-wrapper, .editor-header
    border-radius 0
  .editor-body, .editor-body-wrapper .placeholder
    padding 10px
  .large .editor-body
    padding-right 0
  .letter-detail.dialog-mode
    padding-left 10px
    padding-right 10px
</style>
<script>
import { mapState, mapMutations } from "vuex"

import * as api from "../api"
import { showError, showSuccess, countWords } from "../util"
import * as draft from "../persist/draft"
import * as account from "../persist/account"
import { scrollToTop, createListRender } from "../helper"
import { setTimeout, setInterval, clearInterval } from "timers"

import LetterItem from "../components/LetterItem.vue"
import GridView from "../components/common/GridView.vue"
import Stamps from "./Stamps.vue"

export default {
  data() {
    return {
      editorVisible: false,
      inputData: "",
      isSending: false,
      isUploading: false,
      isShowLetter: false,
      rawImageList: [],
      attachments: "",
      isAutoSaving: false,
      listRender: createListRender({
        preloadCount: 5
      }),
      // active in mobile mode
      isShowAddMedia: false,
      stamp: "free",
      showStampCollection: false
    }
  },
  components: {
    LetterItem,
    GridView,
    Stamps
  },
  computed: {
    ...mapState(["checkedFriend", "mobileMode"]),
    renderLetters() {
      return this.listRender.renderedList()
    },
    letterState() {
      if (this.isSending || this.isUploading || this.isAutoSaving) {
        return this.isUploading
          ? this.$t("uploading_photo")
          : this.isSending
          ? this.$t("sending")
          : this.$t("saving_draft")
      }
      return ""
    },
    wordCount() {
      return countWords(this.inputData)
    }
  },
  watch: {
    editorVisible(visible) {
      if (visible) {
        this.listRender.optimise()
        this.scrollLetterListToTop()
      } else {
        if (this.intervalId) {
          clearInterval(this.intervalId)
          this.intervalId = null
        }
      }
    },
    checkedFriend(friend) {
      if (friend) {
        this.listRender.dataList = friend.letters || []
      }
    },
    inputData(val) {
      this.contentHasChanged = true
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
        .catch(e => showError(this, this.$t("err_load_draft_fail") + e))
      this.intervalId = setInterval(() => {
        if (!this.contentHasChanged) {
          return
        }
        this.saveDraft(this.inputData)
        this.contentHasChanged = false
        this.isAutoSaving = true
        setTimeout(() => {
          this.isAutoSaving = false
        }, 2000)
      }, 15000)
    },
    saveDraft(content) {
      return draft
        .setDraft({
          user_id: this.checkedFriend.id,
          content: this.formatContent(content)
        })
        .catch(e => showError(this, this.$t("err_save_draft_fail") + e))
    },
    onSelectStamp(stamp) {
      if (stamp) {
        this.stamp = stamp
      }
      this.showStampCollection = false
    },
    close() {
      if (!this.inputData) {
        this.editorVisible = false
        return
      }
      this.$confirm(
        this.$t("warn_close_new_letter", {
          photoWarn:
            (this.rawImageList.length && this.$t("warn_lose_of_photo")) || ""
        }),
        this.$t("tip"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel")
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
        showError(this, this.$t("input_content"))
        return
      }
      this.$confirm(
        this.$t("warn_is_sending_to", {
          friend: this.checkedFriend.name
        }),
        this.$t("tip"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel")
        }
      )
        .then(() => {
          if (this.rawImageList.length > 0) {
            this.uploadImages()
          } else {
            this.sendImpl()
          }
        })
        .catch(() => {})
    },
    formatContent(content) {
      if (!content) {
        return content
      }
      return content.replace(/\n\n\n/g, '\n\n')
    },
    sendImpl() {
      this.isSending = true
      let accountInfo = account.getAccount()
      api
        .sendLetter(
          this.checkedFriend.id,
          this.formatContent(this.inputData),
          this.checkedFriend.joined != accountInfo.id,
          this.attachments,
          this.stamp
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
      if (this.isShowLetter && this.checkedFriend) {
        // letters data may has changed for incremental update, reassign data again
        this.listRender.dataList = this.checkedFriend.letters || []
      }
      this.listRender.optimise()
      this.scrollLetterListToTop()
    },
    scrollLetterListToTop() {
      if (this.isShowLetter) {
        scrollToTop(this, ".edit-letter-list")
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
          console.error(result)
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
