<template>
  <div class="system-menu">
    <el-form
      :model="searchList"
      status-icon
      ref="ruleForm"
      label-width="100px"
      size="medium"
      inline
      v-show="flag"
    >
      <el-form-item v-model="searchList" label="菜单名称">
        <el-input
          type="text"
          placeholder="请输入菜单名称"
          v-model="searchList.name"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchList.state" placeholder="请选择">
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="flex">
      <div class="left">
        <el-button
          @click="expand"
          icon="el-icon-sort"
          type="info"
          plain
          size="mini"
          >折叠/展开</el-button
        >
      </div>
      <div class="right">
        <el-button
          size="mini"
          icon="el-icon-search"
          @click="iconsearch"
          circle
        ></el-button>
        <el-button
          size="mini"
          icon="el-icon-refresh"
          @click="iconreset"
          circle
        ></el-button>
      </div>
    </div>
    <el-table
      :border="true"
      size="medium "
      :data="tableData"
      row-key="id"
      style="width: 100%"
      v-loading="tableLoading"
      :tree-props="{ children: 'children' }"
      :default-expand-all="tableLazy"
      ref="dataTreeList"
    >
      <el-table-column prop="menuName" label="菜单名称" align="center">
      </el-table-column>
      <el-table-column label="图标" align="center"> </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center">
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" align="center">
      </el-table-column>
      <el-table-column prop="component" label="组件路径" align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        v-slot="{ row }"
        align="center"
      >
        <el-tag :type="row.status == 0 ? '' : 'danger'">{{
          row.status == 0 ? "正常" : "停用"
        }}</el-tag>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "system-menu",
  data() {
    return {
      searchList: {
        name: "",
        state: "",
      },
      flag: true,
      tableData: [],
      //分页
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //
      tableLazy: false,
      tableLoading: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //重置
    reset() {},
    //搜索
    async search() {
      this.tableLoading = true;
      let { name, state } = this.searchList;
      let { code, data, total } = await this.$api.system.queryMenuList(
        name,
        state
      );

      if (+code !== 200) {
        this.$message.error("网络错误，请稍后再试~");
        this.tableLoading = false;
        return;
      }

      if (!name && !state) {
        this.init();
        return;
      }
      if (state == 0) {
        this.init();
        return;
      }
      this.tableData = data;
      // this.tableData.forEach((item) => {
      //   return (item.status = !!item.status);
      // });
      this.totals = total;
      this.tableLoading = false;
    },
    //隐藏搜索
    iconsearch() {
      this.flag = !this.flag;
    },
    async init() {
      try {
        this.tableLoading = true;
        let { code, data } = await this.$api.system.queryMenuList();
        if (+code == 200) {
          data.forEach((item, index) => {
            item.id = index + 1;
          });
          let listdata = data.slice(0, 6);
          let xitongguanlidata = data.slice(6, 18);
          let xitongjiankongdata = data.slice(18, 23);
          let xitonggongjudata = data.slice(23, 26);
          let wulianwangdata = data.slice(41, 50);
          let Emqguanlidata = data.slice(82, 91);
          
          xitongguanlidata.forEach((item, index) => {
            if (item.menuName === "日志管理") {
              item.children.push(data[35]);
              item.children.push(data[36]);
              return;
            }
            if (item.menuName === "新闻分类" || item.menuName === "新闻资讯") {
              return;
            }
            if (item.menuName !== "三方登录") {
              item.children.push(data[index + 26]);
            }
          });
          // xitongjiankongdata[0].children.push(data[36]);
          xitongjiankongdata[1].children.push(data[37]);
          xitonggongjudata[1].children.push(data[38]);
          listdata[0].children = wulianwangdata;
          listdata[1].children = Emqguanlidata;
          listdata[2].children = xitongguanlidata;
          listdata[3].children = xitongjiankongdata;
          listdata[4].children = xitonggongjudata;
          console.log(listdata);
          console.log(xitongguanlidata);

          this.tableData = listdata;
          console.log(data);

          this.tableLoading = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //刷新
    iconreset() {},
    // 点击事件：表格是否全部展开
    expand() {
      this.tableLazy = !this.tableLazy;
      this.toggleRowExpansionAll(this.tableData, this.isExpansion);
    },
    // 表格展开的方法
    toggleRowExpansionAll(data, isExpansion) {
      data.forEach((item) => {
        this.$refs.dataTreeList.toggleRowExpansion(item, isExpansion);
        if (item.children !== undefined && item.children !== null) {
          this.toggleRowExpansionAll(item.children, isExpansion);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.system-menu {
  padding: 10px 15px;
}
.flex {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}
</style>
