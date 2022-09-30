import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import api from "../api";
Vue.use(Vuex);
const env = process.env.NODE_ENV,
  plugins = [];
if (env === "development") plugins.push(createLogger());

export default new Vuex.Store({
  state: {
    isCollapse: false, //左侧menu状态
    editableTabs: [{ title: "首页", path: "/home" }], //tab
    editableTabsValue: "0", //当前选中tab
    profile: null, //登录者信息
  },
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },
    setProfile(state, payload) {
      state.profile = payload;
    },
    addTabs(state, { title, path }) {
      console.log(title, path);
      const hasValue = state.editableTabs.find((item) => item.path === path);
      if (hasValue) return;
      state.editableTabs.push({
        title: title,
        path: path,
      });
    },
    removeTab(state, targetName) {
      state.editableTabs = state.editableTabs.filter(
        (tab) => tab.path !== targetName
      );
    },
  },

  actions: {
    //存储登陆者信息
    async setProfileAsync({ commit }) {
      let result;
      try {
        result = await api.getInfo();
        if (+result.code !== 200) result.user = null;
        commit("setProfile", result.user);
      } catch (error) {
        console.log(error);
      }
      return result?.user;
    },
  },
  plugins,
});
