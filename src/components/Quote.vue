<template>
  <div class="no-scroll-bar">
    <div v-longpress="handlongPress"
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
import axios from "axios"
import { copyToClipboard, showSuccess } from "../util"

const quotesSourceMap = {
  en: {
    file: "quotes-en.json",
    version: 1
  },
  default: {
    file: "quotes.json",
    version: 1
  }
}

export default {
  data() {
    return {
      quotes: [],
      currentQuote: null,
      eventConsumed: false
    }
  },
  computed: {},
  methods: {
    getQuoteInfo(quote) {
      const first = quote.ref_name || quote.au_name
      const second = quote.ref_name ? quote.au_name : ""
      return first ? `——${first}${second ? " · " : ""}${second}` : ""
    },
    changeQuote() {
      if (this.quotes.length === 0) {
        return
      }
      const item = this.quotes[parseInt(Math.random() * this.quotes.length)]
      this.currentQuote = {
        content: item.content,
        quoteInfo: this.getQuoteInfo(item)
      }
    },
    handlongPress(isClick) {
      if (isClick) {
        this.changeQuote()
      } else {
        if (this.currentQuote) {
          const text = this.currentQuote.content + this.currentQuote.quoteInfo
          copyToClipboard(text)
          showSuccess(this, this.$t("tip_copy_quote"))
        }
      }
    },
    fetchQuotes() {
      const quoteItem =
        quotesSourceMap[this.$i18n.locale] || quotesSourceMap.default

      axios({
        method: "get",
        url: `./${quoteItem.file}?v=${quoteItem.version}`
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
    this.$watch("$i18n.locale", (newVal, oldVal) => {
      if (
        (newVal === "en" && oldVal !== "en") ||
        (oldVal === "en" && newVal !== "en")
      ) {
        this.fetchQuotes()
      }
    })
  }
}
</script>
