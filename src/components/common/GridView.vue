<style lang="stylus" scoped>
.grid-view
  width 100%
  display flex
  flex-wrap wrap
  justify-content space-between
.grid-view .grid-child-box
  position relative
.grid-view .grid-child
  position absolute
  display block
  top 0
  left 0
  right 0
  bottom 0
</style>
<script>
export default {
  render(createElement) {
    let children = (
      (this.$slots.default &&
        this.$slots.default.filter(item => item.tag != null)) ||
      []
    ).map((child, childIndex) => {
      if (!child.data.class) {
        child.data.class = ""
      }
      child.data.class += " grid-child"

      return createElement(
        "div",
        {
          style: {
            width: `calc(${100 / this.numColumns}% - ${(this.spaceX *
              (this.numColumns - 1)) /
              this.numColumns}px`,
            marginTop: childIndex < this.numColumns ? 0 : `${this.spaceY}px`
          }
        },
        [
          createElement(
            "div",
            {
              class: "grid-child-box",
              style: {
                paddingTop: this.getChildHeight()
              }
            },
            [child]
          )
        ]
      )
    })
    return createElement("div", { class: "grid-view" }, children)
  },
  props: {
    numColumns: {
      type: Number,
      default: 3
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
      default: function() {
        return "100%"
      }
    }
  }
}
</script>
