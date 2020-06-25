<template>
  <div class="no-scroll-bar">
    <div @click="changeQuote"
         class="quote-section">
      <div class="quote-item"
           v-if="currentQuote">
        <div class="content">{{currentQuote.content}}</div>
        <div class="author">{{currentQuote.quoteInfo}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.no-scroll-bar
  max-width 600px
  width 90%
  margin 0 auto
  top 20%
  left 50%
  transform translateX(-50%)
  position absolute
  overflow hidden
.quote-section
  cursor pointer
  padding-right 20px
  width 100%
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
import axios from "axios"

export default {
  data() {
    return {
      quotes: [],
      currentQuote: null
    }
  },
  methods: {
    getQuoteInfo(quote) {
      let first = quote.ref_name || quote.au_name
      let second = quote.ref_name ? quote.au_name : ""
      return first ? `——${first}${second ? " · " : ""}${second}` : ""
    },
    changeQuote() {
      let item = this.quotes[parseInt(Math.random() * this.quotes.length)]
      this.currentQuote = {
        content: item.content,
        quoteInfo: this.getQuoteInfo(item)
      }
    },
    fetchQuotes() {
      axios({
        method: "get",
        url: "./quotes.json"
      })
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.quotes = response.data
            this.changeQuote()
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  mounted() {
    this.fetchQuotes()
  }
}
</script>
