<template>
  <div class="main">
    <div class="left">
      <common-aside></common-aside>
    </div>
    <div class="right">
      <common-header></common-header>
      <common-tabs></common-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import CommonHeader from "./CommonHeader.vue";
import CommonAside from "./CommonAside.vue";
import CommonTabs from "./CommonTabs.vue";

export default {
  name: "Main",
  components: {
    CommonAside,
    CommonHeader,
    CommonTabs,
  },
  created() {},
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
  height: 100vh;
  overflow: hidden;
 
  .left {
    width: auto;
    height: 100vh;
    overflow-y: auto;
  }
  .right {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
