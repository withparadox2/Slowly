<template>
  <div v-if="letter"
       class="letter-detail-wrapper">
    <div class="letter-detail"
         :class="{'dialog-mode': dialogMode}">
      <img src="../../images/pen.png"
           alt="">
      <div v-html="highlightBody(letter)"></div>
      <div class="attachments"
           v-if="attachments">
        <grid-view :numColumns="attachments.length > 2 ? 3 : 2"
                   :spaceX="10"
                   :spaceY="10">
          <a :key="url"
             :href="url"
             target="_blank"
             v-lazy:background-image="url"
             v-for="url in attachments"></a>
        </grid-view>
      </div>
    </div>
    <div class="letter-info-wrapper">
      <div class="letter-info">
        <div class="key">
          <span v-for="text in letterInfos[0]"
                :key="text">
            {{text}}
          </span>
        </div>
        <div class="value">
          <span v-for="text in letterInfos[1]"
                :key="text">
            {{text}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus">
.letter-detail
  .highlight
    color red
    font-weight bold
</style>

<style lang="stylus" scoped>
@require ('../styles/var.styl')
.letter-detail-wrapper
  width 100%
  max-width 500px
  margin 0 auto
  overflow hidden
.letter-detail
  white-space pre-line
  width 100%
  background white
  padding 40px 20px 20px 20px
  line-height 26px
  font-size $font-letter
  box-sizing border-box
  border-radius 6px
  border 1px solid #eaeaea
  img
    width 100px
    float right
  > div
    clear both
    padding-top 10px
  .attachments a
    background-size cover
    background-repeat no-repeat
.letter-info-wrapper
  overflow-y hidden
  overflow-x auto
  max-width 100%
.letter-info
  font-size $font-tiny
  margin-top 10px
  color #666
  padding-right 10px
  display flex
  .key
    flex 1
    text-align right
    margin-right 10px
  span
    display block
    white-space nowrap
    line-height 18px
</style>
<script>
import { mapState, mapMutations } from "vuex"
import * as util from "../util"
import * as api from "../api"
import GridView from "./common/GridView.vue"
export default {
  components: {
    GridView
  },
  props: {
    letter: {
      type: Object,
      required: true
    },
    dialogMode: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  computed: {
    ...mapState(["checkedFriend", "searchValue"]),
    attachments() {
      let l = this.letter
      return l
        ? l.attachments
          ? l.attachments.split(",").map(name => api.buildAttachmentUrl(name))
          : null
        : null
    },
    letterInfos() {
      const map = Object.create(null)
      map[this.$t("word_count")] = util.countWords(this.letter.body)
      map[this.$t("sender_name")] = this.letter.name
      map[this.$t("send_time")] = this.formatTime(this.letter.created_at)
      map[this.$t("arrive_time")] = this.formatTime(this.letter.deliver_at)
      if (this.letter.read_at) {
        map[this.$t("read_time")] = this.formatTime(this.letter.read_at)
      }
      return [Object.keys(map), Object.values(map)]
    }
  },
  methods: {
    formatTime(time) {
      return util.offsetAndFormatDate(time)
    },
    highlightBody(letter) {
      let body = (letter.body && letter.body.trim()) || ""
      return this.searchValue
        ? body
            .split(this.searchValue)
            .join('<span class="highlight">' + this.searchValue + "</span>")
        : body
    }
  }
}
</script>

