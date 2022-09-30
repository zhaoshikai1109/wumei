<template>
  <div class="header-box">
    <!-- 导航栏左侧 -->
    <div class="l-content">
      <div class="icon-box" @click="handleMenu">
        <i :class="this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>

      <div class="breadcrumb-box">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.meta.title !== '首页'">{{
            $route.meta.title
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 导航栏右侧 -->
    <div class="r-content">
      <div @click="show"><i class="el-icon-search"></i></div>
      <div v-show="display" class="inputSearch">
        <input type="search" placeholder="Search" />
      </div>
      <div class="layout"><i class="el-icon-rank"></i></div>
      <!-- 布局下拉 -->
      <el-dropdown trigger="click">
        <!-- hover显示文字 -->
        <el-tooltip
          class="item"
          effect="dark"
          content="布局大小"
          placement="bottom"
        >
          <div class="layout"><i class="el-icon-s-data"></i></div>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>Default</el-dropdown-item>
          <el-dropdown-item>Medium</el-dropdown-item>
          <el-dropdown-item>Mini</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 用户头像 -->
      <el-dropdown trigger="click" >
        <div class="head-portraits">
          <img
            src="https://iot.wumei.live/prod-api/profile/avatar/2022/09/16/be6e2b59-c630-4e04-b4d7-1fd55f4066b8.jpeg"
            alt=""
          />
          <i class="el-icon-caret-bottom"></i>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click="signout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import _ from "../assets/utils";
export default {
  name: "CommonHeader",
  data() {
    return {
      display: false,
    };
  },
  computed: {
    ...mapState(["isCollapse"]),
  },

  methods: {
    ...mapMutations(["setProfile"]),
    //点击展开侧边栏
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
    show() {
      this.display = !this.display;
    },
    //退出登录
    signout() {
      //清除Token&清除vuex存储的登录者信息
      _.storage.remove("token");
      this.setProfile(null);
      //跳转提示
      this.$message.success("您已安全退出");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.l-content {
  display: flex;
  .icon-box {
    height: 100%;
    text-align: center;
    width: 40px;
    line-height: 50px;
    font-size: 20px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.024);
    }
  }
  .breadcrumb-box {
    display: flex;
    align-items: center;
  }
}
.r-content {
  display: flex;
  div {
    margin: 0 5px;
    height: 100%;
    line-height: 50px;
    font-size: 24px;
  }
  .layout {
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
  .inputSearch {
    input {
      height: 20px;
      border-style: none;
      outline: none;
      border-bottom: 1px solid #d9d9d9;
      color: #d9d9d9;
    }
  }
}
.head-portraits {
  font-size: 14px;

  img {
    height: 40px;
    border-radius: 10px;
    vertical-align: baseline;
    margin-right: 5px;
  }
}
</style>
