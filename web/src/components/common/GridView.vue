<style scoped>
.grid-view {
  width: 100%;
  overflow: hidden;
}
.grid-view > .child {
  float: left;
}
.grid-view > .child:last-child:after {
  content: "";
  display: table;
  clear: both;
}
</style>
<script>
export default {
  data() {
    return {
      width: 0
    }
  },
  methods: {
    getPadding() {
      if (!this.$el || !this.$el.nodeType) {
        return 0
      }
      let style = window.getComputedStyle(this.$el, null)

      function parsePadding(which) {
        let re = style
          ? parseInt(style.getPropertyValue("padding-" + which))
          : 0
        return re >= 0 ? re : 0
      }

      return parsePadding("left") + parsePadding("right")
    }
  },
  render(createElement) {
    debugger
    if (this.$el && this.$el.offsetWidth > 0) {
      this.width = this.$el.offsetWidth
    }
    // 当前没有宽度，渲染空的div
    if (this.width == 0) {
        return createElement("div", { class: "grid-view" }, [])
    }

    let parentWidth = this.width - this.getPadding() - 1
    let childWidth =
      Math.floor((parentWidth + this.spaceX) / this.numColumns) - this.spaceX

    let children =
      (this.$slots.default &&
        this.$slots.default.filter(item => item.tag != null)) ||
      []
    let childrenNum = children.length

    for (let i = 0; i < childrenNum; i++) {
      let s = children[i]

      let marginLeft = `${i % this.numColumns == 0 ? 0 : this.spaceX}px`
      let marginTop = `${
        parseInt(i / this.numColumns) == 0 ? 0 : this.spaceY
      }px`
      let width = `${childWidth}px`
      if (
        !s.data ||
        !s.data.style ||
        s.data.style["margin-left"] != marginLeft ||
        s.data.style.width != width
      ) {
        s.data = Object.create(s.data || {})
        let style = (s.data.staticStyle = Object.create(
          s.data.staticStyle || {}
        ))
        style.width = width
        let styleHeight = this.getChildHeight(childWidth)
        if (typeof styleHeight == "string") {
          style.height = styleHeight
        } else {
          style.height = styleHeight + "px"
        }
        style["margin-left"] = marginLeft
        style["margin-top"] = marginTop

        if (!s.data["class"]) {
          s.data.class = "child"
        } else if (s.data["class"].indexOf("child") < 0) {
          s.data["class"] += " child"
        }
      }
    }

    return createElement("div", { class: "grid-view" }, children)
  },
  mounted() {
    this.width = this.$el.offsetWidth || 0

    //虽然width可能不变，但还是要强行update，因为padding可能变了。需要先更新computed，
    //然后render
    this.$nextTick(() => {
      this._watchers && this._watchers.forEach(item => item.update())
    })
  },
  created() {
    if (this.numColumns == 0) {
      this.numColumns = 3
    }
  },
  props: {
    numColumns: {
      type: Number,
      default: 0
    },
    spaceX: {
      type: Number,
      default: 0
    },
    spaceY: {
      type: Number,
      default: 0
    },
    getChildHeight: {
      type: Function,
      default: function(childWidth) {
        return childWidth
      }
    }
  }
}
</script>
