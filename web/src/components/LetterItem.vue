<template>
  <div v-if="letter"
       class="letter-detail-wrapper">
    <div class="letter-detail">
      <img src="../../images/pen.png"
           alt="">
      <div>{{letter.body && letter.body.trim()}}</div>
      <div class="attachments"
           v-if="attachments">
        <grid-view :numColumns="attachments.length > 2 ? 3 : 2"
                   :spaceX="10"
                   :spaceY="10">
          <a :key="url"
             :href="url"
             target="_blank"
             :style="{ backgroundImage: 'url(' + url + ')' }"
             v-for="url in attachments"></a>
        </grid-view>
      </div>
    </div>
    <div class="letter-info"
         v-if="letter">
      <div><span class="title-label">字数</span>{{letter.body.length}}</div>
      <div><span class="title-label">发信人</span>{{letter.name}}</div>
      <div><span class="title-label">送达时间</span>{{formatTime(letter.deliver_at)}}</div>
      <div v-show="letter.read_at"><span class="title-label">阅读时间</span>{{formatTime(letter.read_at)}}</div>
    </div>
  </div>
</template>
<style scoped>
.letter-detail-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
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
.attachments a {
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
<script>
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
    }
  },
  computed: {
    attachments() {
      let l = this.letter
      return l
        ? l.attachments
          ? l.attachments.split(",").map(name => api.buildAttachmentUrl(name))
          : null
        : null
    }
  },
  methods: {
    formatTime(time) {
      return util.formateDate(util.offsetTimezoneDate(time))
    }
  }
}
</script>

