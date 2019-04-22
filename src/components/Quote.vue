<template>
  <div class="no-scroll-bar">
    <div @click="changeQuote"
         class="quote-section"
         :class="{'no-smooth' : disableSmooth}"
         @wheel.prevent="nothing"
         :style="quoteSectionStyle">
      <div v-for="quote in quoteList"
           class="quote-item"
           :style="quoteSectionStyle"
           :key="quote.content">
        <div class="content">{{quote.content}}</div>
        <div class="author">{{quote.quoteInfo}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.no-scroll-bar
  width 600px
  margin 0 auto
  top 20%
  left 50%
  transform translateX(-50%)
  position absolute
  overflow hidden
.quote-section
  cursor pointer
  overflow auto
  padding-right 20px
  scroll-behavior smooth
  width 100%
  &.no-smooth
    scroll-behavior auto
  .quote-item
    padding 10px 10px
    user-select none
    .content
      font-size 20px
      color #555
      line-height 30px
      white-space pre-wrap
    .author
      margin-top 10px
      font-size 14px
      text-align right
      color #777
</style>
<script>
import { quotes } from "../quote"
import { onScrollEnd } from "../helper"
import { setTimeout } from "timers"
export default {
  data() {
    return {
      quoteList: [],
      quoteSectionStyle: {},
      disableSmooth: false
    }
  },
  methods: {
    nothing() {},
    fillQuotes() {
      let tempList = []
      let i = 0
      while (i++ < 3) {
        let newItem = quotes[parseInt(Math.random() * quotes.length)]
        newItem.quoteInfo = this.getQuoteInfo(newItem)
        tempList.push(newItem)
      }
      let lastQuote =
        this.quoteList.length > 0 && this.quoteList[this.quoteList.length - 1]
      if (lastQuote) {
        tempList.splice(0, 1, lastQuote)
      }
      this.quoteList = tempList
      this.setQuoteListStyle()
    },
    getQuoteInfo(quote) {
      let first = quote.ref_name || quote.au_name
      let second = quote.ref_name ? quote.au_name : ""
      return first ? `——${first}${second ? " · " : ""}${second}` : ""
    },
    changeQuote() {
      let el = this.$el.querySelector(".quote-section")

      let scrollTop = 0
      for (let i = 0; i < el.children.length - 1; i++) {
        scrollTop += el.children[i].offsetHeight
      }
      el.scrollTop = scrollTop

      onScrollEnd(el, () => {
        this.fillQuotes()
      })
    },
    setQuoteListStyle() {
      // Reset style to get intrinsic height of quote item
      this.quoteSectionStyle = {}

      this.$nextTick(() => {
        let el = this.$el.querySelector(".quote-section")
        if (el) {
          let maxHeight = 0
          for (let i = 0; i < el.children.length; i++) {
            let h = el.children[i].offsetHeight
            if (h > maxHeight) {
              maxHeight = h
            }
          }
          if (maxHeight > 0) {
            this.quoteSectionStyle = {
              height: maxHeight + "px"
            }
          }
        }
        this.disableSmooth = true
        setTimeout(() => {
          el.scrollTop = 0
          this.disableSmooth = false
        }, 200)
      })
    }
  },
  mounted() {
    this.fillQuotes()
  }
}
</script>
