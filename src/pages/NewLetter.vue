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

          <div class="form-section"
               v-if="checkedFriend.share_photos">
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
.night-mode
  .editor-wrapper
    background rgb(22, 21, 19)
    .placeholder
      color rgb(123, 105, 89)
  .editor-header
    background-color $main-color-night
    color $color-white-night
  .word-count, .sending-state
    color $color-white-night
  .btn-add-image
    background #292621
    color rgb(161, 137, 113)
  .tip-add-image
    color rgb(117, 101, 87)
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
  background-color $main-color
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
  .letter-detail.dialog-mode
    padding-left 10px
    padding-right 10px
</style>
<script>
import { mapState, mapMutations } from "vuex"

import * as api from "../api"
import { showError, showSuccess, countWords } from "../util"
import * as account from "../persist/account"
import { scrollToTop, createListRender } from "../helper"
import { setTimeout, setInterval, clearInterval } from "timers"

import LetterItem from "../components/LetterItem.vue"
import GridView from "../components/common/GridView.vue"
import Stamps from "./Stamps.vue"
import { MessageBox } from "element-ui"

const TYPE_IMAGE_LOCAL = "local"
const TYPE_IMAGE_SERVER = "server"

export default {
  data() {
    return {
      editorVisible: false,
      inputData: "",
      isSending: false,
      isUploading: false,
      isLoadingDraft: false,
      isShowLetter: false,
      rawImageList: [],
      isAutoSaving: false,
      listRender: createListRender({
        preloadCount: 5,
      }),
      // active in mobile mode
      isShowAddMedia: false,
      stamp: "free",
      showStampCollection: false,
      draft: null,
    }
  },
  components: {
    LetterItem,
    GridView,
    Stamps,
  },
  computed: {
    ...mapState(["checkedFriend", "mobileMode"]),
    renderLetters() {
      return this.listRender.renderedList()
    },
    letterState() {
      if (
        this.isSending ||
        this.isUploading ||
        this.isAutoSaving ||
        this.isLoadingDraft
      ) {
        return this.isLoadingDraft
          ? this.$t("loading_draft")
          : this.isUploading
          ? this.$t("uploading_photo")
          : this.isSending
          ? this.$t("sending")
          : this.$t("saving_draft")
      }
      return ""
    },
    wordCount() {
      return countWords(this.inputData)
    },
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
    },
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
      this.isLoadingDraft = false
      this.rawImageList = []
      this.draft = null

      this.loadDraft()

      this.intervalId = setInterval(() => {
        if (!this.contentHasChanged || !this.draft) {
          return
        }

        this.saveDraft()
        this.contentHasChanged = false
      }, 60000)
    },
    loadDraft() {
      this.isLoadingDraft = true
      api
        .getDraft(this.checkedFriend.id)
        .then(({ data: { draft } }) => {
          this.draft = draft
          if (!draft) {
            return
          }
          if (draft.body) {
            this.inputData = draft.body
          }
          this.stamp = draft.stamp
          if (draft.attachments) {
            draft.attachments
              .split(",")
              .map((name) => ({
                type: TYPE_IMAGE_SERVER,
                src: api.buildAttachmentUrl(name),
                imageName: name,
              }))
              .forEach((item) => this.rawImageList.push(item))
          }
        })
        .catch((e) => {
          console.error(e)
          this.$confirm(this.$t("warn_fail_to_load_draft"), this.$t("tip"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
          })
            .then(() => {
              this.loadDraft()
            })
            .catch(() => {})
        })
        .then(() => {
          this.isLoadingDraft = false
        })
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
      this.$confirm(this.$t("warn_close_new_letter"), this.$t("tip"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        this.uploadImages()
          .then((attachments) => this.saveDraft(attachments))
          .then(() => (this.editorVisible = false))
          .catch((e) => {
            showError(this, e)
          })
      })
    },
    saveDraft(attachments) {
      this.isAutoSaving = true

      return api
        .saveDraft({
          friendId: this.checkedFriend.id,
          body: this.inputData,
          stamp: this.stamp,
          attachments:
            attachments == null
              ? this.draft && this.draft.attachments
              : attachments,
        })
        .then((result) => {
          this.isAutoSaving = false
        })
        .catch((e) => {
          console.error(e)
          this.isAutoSaving = false
          return Promise.reject("Failed to save draft")
        })
    },
    clearDraft() {
      this.isAutoSaving = true
      return api
        .saveDraft({
          friendId: this.checkedFriend.id,
          body: "",
          stamp: this.stamp,
          attachments: "",
        })
        .then((result) => {
          this.isAutoSaving = false
        })
        .catch((e) => {
          console.error(e)
          this.isAutoSaving = false
        })
    },
    send() {
      if (!this.inputData) {
        showError(this, this.$t("input_content"))
        return
      }
      this.$confirm(
        this.$t("warn_is_sending_to", {
          friend: this.checkedFriend.name,
        }),
        this.$t("tip"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
        }
      )
        .then(() => {
          this.uploadImages()
            .then((attachments) => this.sendImpl(attachments))
            .catch((e) => {
              showError(this, e)
            })
        })
        .catch(() => {})
    },
    formatContent(content) {
      if (!content) {
        return content
      }
      return content.replace(/\n\n\n/g, "\n\n")
    },
    sendImpl(attachments = "") {
      this.isSending = true
      let accountInfo = account.getAccount()
      api
        .sendLetter({
          id: this.checkedFriend.id,
          letter: this.formatContent(this.inputData),
          isHost: this.checkedFriend.joined != accountInfo.id,
          attachments,
          stamp: this.stamp,
        })
        .then((response) => {
          this.checkedFriend.lastRefreshTime = 0
          this.$emit("sendSuccess")
          return this.clearDraft()
        })
        .then(() => {
          this.isSending = false
          this.editorVisible = false
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
      reader.onload = (e) => {
        this.rawImageList.push({
          src: e.target.result,
          file,
          key: this.generateImageKey(),
          type: TYPE_IMAGE_LOCAL,
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
      const localImageList = this.rawImageList.filter(
        (item) => item.type === TYPE_IMAGE_LOCAL
      )
      const remoteImageList = this.rawImageList.filter(
        (item) => item.type === TYPE_IMAGE_SERVER
      )
      if (localImageList.length === 0) {
        return Promise.resolve(
          remoteImageList.map((item) => item.imageName).join(",")
        )
      }

      this.isUploading = true
      return api
        .uploadImages(
          this.checkedFriend.id,
          localImageList.map((item) => item.file)
        )
        .then((result) => {
          this.isUploading = false
          const finalAttachmentList = remoteImageList
            .map((item) => item.imageName)
            .concat(result.map((item) => item.data))
          return finalAttachmentList.join(",")
        })
        .catch((result) => {
          this.isUploading = false
          console.error(result)
          return Promise.reject("Failed to upload images")
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
    },
  },
}
</script>
