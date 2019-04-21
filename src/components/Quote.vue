<template>
  <div @click="changeQuote"
       class="quote-section">
    <div class="content">{{quote.content}}</div>
    <div class="author">{{quoteAuthor}}</div>
  </div>
</template>
<style lang="stylus" scoped>
.quote-section
  max-width 70%
  margin 0 auto
  min-width 300px
  top 30%
  left 50%
  transform translateY(-50%) translateX(-50%)
  position absolute
  cursor pointer
.quote-section .content
  font-size 20px
  color #555
  line-height 30px
  white-space pre-wrap
.quote-section .author
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
      quoteRef: 1,
      timeoutId: null
    }
  },
  computed: {
    quote() {
      return this.quoteRef && quotes[parseInt(Math.random() * quotes.length)]
    },
    quoteAuthor() {
      let first = this.quote.ref_name || this.quote.au_name
      let second = this.quote.ref_name ? this.quote.au_name : ""
      return first ? `——${first}${second ? " · " : ""}${second}` : ""
    }
  },
  methods: {
    changeQuote() {
      this.diceTimes = 0
      clearTimeout(this.timeoutId)
      this.changeQuoteImpl()
    },
    changeQuoteImpl() {
      if (this.diceTimes++ > 8) {
        return
      }
      this.timeoutId = setTimeout(() => {
        this.quoteRef++
        this.changeQuoteImpl()
      }, 60)
    }
  }
}
</script>
