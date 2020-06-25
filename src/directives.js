import Vue from "vue"

Vue.directive("longpress", {
  bind: function(el, binding, vNode) {
    if (typeof binding.value !== "function") {
      const compName = vNode.context.name
      let warn = `[longpress:] provided expression '${
        binding.expression
      }' is not a function, but has to be`
      if (compName) {
        warn += `Found in component '${compName}' `
      }

      console.warn(warn)
    }

    let pressTimer = null

    let start = (e) => {
      if (e.type === "click" && e.button !== 0) {
        return
      }

      handler('start')

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler()
        }, 500)
      }
    }

    let cancel = (e) => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    const handler = (e) => {
      binding.value(e)
    }

    el.addEventListener("mousedown", start)
    el.addEventListener("touchstart", start)
    el.addEventListener("click", cancel)
    el.addEventListener("mouseout", cancel)
    el.addEventListener("touchend", cancel)
    el.addEventListener("touchcancel", cancel)
  },
})
