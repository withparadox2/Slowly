<template>
  <div class="editor-container"
       v-show="editorVisible">
    <div class="editor-wrapper">
      <div class="editor-header">
        <span>To {{checkedFriend && checkedFriend.name}}</span>
        <span class="word-count"
              v-show="inputData">{{inputData.length}}</span>
        <span class="sending-state"
              v-show="isSending">正在发送...</span>
        <span class="el-icon-close"
              title="关闭"
              @click="close()"></span>
        <span class="el-icon-message"
              title="发送"
              @click="send()"></span>
      </div>
      <textarea class="editor-body"
                name="text"
                placeholder="请写下文字"
                spellcheck="false"
                v-model="inputData"
                oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>
      </textarea>
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
.editor-body {
  overflow-y: auto;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 10px 20px;
  max-height: calc(100vh - 124px);
  min-height: 142px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  border: none;
  font-size: 14px;
  line-height: 20px;
  resize: none;
  outline: 0;
  font-family: inherit;
  background: transparent;
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
import * as api from "../api"
import { showError, showSuccess } from "../util"
import * as draft from "../persist/draft"

export default {
  data() {
    return {
      editorVisible: false,
      inputData: "",
      isSending: false
    }
  },
  computed: {
    ...mapState(["checkedFriend"])
  },
  methods: {
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
          this.sendImpl()
        })
        .catch(() => {})
    },
    sendImpl() {
      this.isSending = true
      api
        .sendLetter(this.checkedFriend.id, this.inputData)
        .then(response => {
          this.editorVisible = false
          this.isSending = false
          this.$emit("sendSuccess")
          this.saveDraft("")
          showSuccess(this, "success")
        })
        .catch(({ message }) => {
          this.isSending = false
          showError(this, message)
        })
    }
  }
}
</script>
