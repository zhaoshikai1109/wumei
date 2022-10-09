import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "@/assets/reset.min.css";
import "element-ui/lib/theme-chalk/index.css";
import "./directive"

import store from "./store/index";
import api from "./api";
import * as echarts from "echarts";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;


new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
