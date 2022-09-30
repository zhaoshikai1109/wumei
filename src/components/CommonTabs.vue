<template>
  <div class="tabs-box">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="deletTab"
    >
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      editableTabsValue: "",
    };
  },
  watch: {
    //this.editableTabsValue=change.path;
    $route: {
      handler(change) {
        this.editableTabsValue = change.path;
      },
      immediate: true,
    },
    editableTabsValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$router.push({ path: newValue });
      }
    },
  },
  computed: {
    ...mapState(["editableTabs"]),

  },
  methods: {
    ...mapMutations(["removeTab"]),
    deletTab(targetName) {
      console.log(targetName);
      //targetName 删除项的path
      let tabs = this.editableTabs; //所有的tabs
      let activeName = this.editableTabsValue; //当前选中tab的path
      // console.log(targetName,activeName);
      if (targetName === tabs[0].path) return;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.path;
              this.$router.push({ path: nextTab.path });
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.removeTab(targetName);
    },
  },
};
</script>

<style lang="less" scoped>

</style>
