<template>
  <div class="no-scroll-bar">
    <div @click="changeQuote"
         class="quote-section"
         :class="{'no-smooth' : disableSmooth}"
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
  max-width 70%
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
export default {
  data() {
    return {
      quoteList: [],
      quoteSectionStyle: {},
      disableSmooth: false
    }
  },
  methods: {
    fillQuotes() {
      let tempList = []
      let i = 0
      while (i++ < 10) {
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
      this.quoteSectionStyle = {}
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

      let lastScrollTop = -1
      let timeOutAction = () => {
        if (lastScrollTop >= el.scrollTop) {
          this.disableSmooth = true
          this.fillQuotes()
          this.$nextTick(() => {
            this.disableSmooth = false
          })
        } else {
          lastScrollTop = el.scrollTop
          setTimeout(timeOutAction, 20)
        }
      }
      setTimeout(timeOutAction, 20)
    },
    setQuoteListStyle() {
      this.$nextTick(() => {
        let el = this.$el.querySelector(".quote-section")
        el.scrollTop = 0
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
      })
    }
  },
  mounted() {
    this.fillQuotes()
  }
}
</script>
