<template>
  <el-menu
    router
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    :collapse="isCollapse"
    active-text-color="#409EFF"
    background-color="#304156"
    text-color="#BFCBD9"
  >
    <div class="title-box">
      <img src="https://iot.wumei.live/static/img/logo.6f649f95.png" alt="" />
      <span v-show="!isCollapse">物美智能物联网平台</span>
    </div>
    <!-- <el-menu-item index="/home">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-submenu index="1" >
      <template slot="title">
        <i class="el-icon-eleme"></i>
        <span slot="title">物联网</span>
      </template>
      <el-menu-item index="/iot/template">通用物模型</el-menu-item>
      <el-menu-item index="/iot/category">产品分类</el-menu-item>
      <el-menu-item index="/iot/product">产品管理</el-menu-item>
      <el-menu-item index="/iot/firmware">产品固件</el-menu-item>
      <el-menu-item index="/iot/group">设备分组</el-menu-item>
      <el-menu-item index="/iot/device">设备管理</el-menu-item>
      <el-menu-item index="/iot/alertLog">设备告警</el-menu-item>
      <el-menu-item index="/iot/clientDetails">云云对接</el-menu-item>
    </el-submenu>

    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">EMQ管理</span>
      </template>
      <el-menu-item index="/emqx/client">客户端</el-menu-item>
    </el-submenu>

    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-s-tools"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="/system/user">用户管理</el-menu-item>
      <el-menu-item index="/system/role">角色管理</el-menu-item>
      <el-menu-item index="/system/menu">菜单管理</el-menu-item>
      <el-menu-item index="/system/dept">部门管理</el-menu-item>
      <el-menu-item index="/system/post">岗位管理</el-menu-item>
      <el-menu-item index="/system/dict">字典管理</el-menu-item>
    </el-submenu> -->
    <template v-for="item1 in navList">
      <el-submenu
        :key="item1.path"
        :index="`/${item1.path}`"
        v-if="item1.path !== '' && item1.children"
      >
        <template slot="title">
          <i :class="item1.meta.icon"></i>
          <span>{{ item1.meta.title }}</span>
        </template>

        <el-menu-item
          v-for="item2 in item1.children"
          :key="item2.path"
          :index="`/${item1.path}/${item2.path}`"
        >
          {{ item2.meta.title }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        v-else-if="item1.path !== ''"
        :index="`/${item1.path}`"
        :key="item1.path"
      >
        <i :class="item1.meta.icon"></i>
        <span>{{ item1.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonAside",
  data() {
    return {
      navList: [],
      defaultActive: "/iot/template",
    };
  },
  watch: {
    $route(val) {
      this.defaultActive = val.path;
    },
  },

  computed: {
    //是否展开侧边栏
    ...mapState(["isCollapse"]),
  },
  created() {
    console.log(this.$router.getRoutes());
    console.log(this.$route);
    console.log(this.navList);

    this.navList = this.$router.options.routes[0].children;
    this.defaultActive = this.$route.path;
  },
  methods: {
    ...mapMutations(["addTabs"]),

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(index) {
      console.log(this.navList);
      index = index.slice(1);
      function fildChildren(list, url) {
        if (!list || !list.length) {
          return;
        }
        for (let i = 0; i < list.length; i++) {
          if (url + list[i].path === index) {
            return list[i];
          }
          const hasValue = fildChildren(list[i].children, `${list[i].path}/`);
          if (hasValue) {
            return hasValue;
          }
        }
      }
      const result = fildChildren(this.navList, "");

      // this.navList.find((item) => {
      //   item.path === index;
      // });
      this.addTabs({ title: result.meta.title, path: `/${index}` });
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  height: 100vh;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

h3 {
  height: 50px;
  line-height: 50px;
}
.title-box {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 0 10px;
  img {
    width: 32px;
    height: 32px;
  }
  span {
    font-size: 14px;
    color: #fff;
    font-weight: 700;
  }
}
</style>
