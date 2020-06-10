import Vue from "vue"
import Bugsnag from "@bugsnag/js"
import BugsnagPluginVue from "@bugsnag/plugin-vue"

if (process.env.NODE_ENV === "production") {
  Bugsnag.start({
    apiKey: "66edf57989161661871fd5c1d096ece7",
    plugins: [new BugsnagPluginVue()],
  })

  Bugsnag.getPlugin("vue").installVueErrorHandler(Vue)
}
