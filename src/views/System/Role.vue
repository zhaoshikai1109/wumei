<template>
  <div class="system-role">
    <el-form
      :model="searchList"
      ref="ruleForm"
      label-width="70px"
      size="medium"
      inline
      v-show="flag"
    >
      <el-form-item label="角色名称">
        <el-input
          type="text"
          v-model="searchList.roleName"
          autocomplete="off"
          placeholder="请输入角色名称"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input
          type="text"
          v-model="searchList.roleKey"
          autocomplete="off"
          placeholder="请输入权限字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchList.status" placeholder="请选择">
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchList.time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
    <el-table
      :border="true"
      size="medium "
      :data="tableData"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column prop="roleId" label="角色编号" align="center">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center">
      </el-table-column>
      <el-table-column prop="roleKey" label="权限字符" align="center">
      </el-table-column>
      <el-table-column prop="roleSort" label="显示顺序" align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        v-slot="{ row }"
        align="center"
      >
        <el-switch
          v-model="row.status"
          active-color="#13ce66"
          inactive-color="#ccc"
          @change="switchChange(row)"
        />
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right"
      @size-change="init"
      @current-change="init"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount"
      :page-size.sync="pagination.pageSize"
      :current-page.sync="pagination.pageNum"
    >
    </el-pagination>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "system-role",
  data() {
    return {
      searchList: {
        roleName: "",
        roleKey: "",
        status: "",
        time: "",
      },
      flag: true,
      //表格
      tableData: [],
      tableLoading: false,
      //分页
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    //重置
    reset() {
      this.searchList.roleName=""
      this.searchList.roleKey=""
      this.searchList.status=""
      this.searchList.time=""
      this.init()
    },
    //搜索
    search() {
      let obj = {};
      obj.roleName = this.searchList.roleName;
      obj.roleKey = this.searchList.roleKey;
      obj.status = this.searchList.status;
      if (this.searchList.time) {
        this.searchList.time.map((item) => {
          return item.toLocaleString("zh-CN", { hour12: false });
        });
        obj["params.beginTime"] = _.formatTime(this.searchList.time[0], "{0}-{1}-{2}");
        obj["params.endTime"] = _.formatTime(this.searchList.time[1], "{0}-{1}-{2}");
      }
     this.init(obj)
    },
    // 搜索是否显示
    iconsearch() {
      this.flag = !this.flag;
    },
    // 表格刷新
    iconreset() {
      this.init();
    },

    async init(obj = {}) {
      try {
        this.tableLoading = true;
        let { pageNum, pageSize } = this.pagination;
        let { code, rows, total } = await this.$api.system.queryRoleList({
          pageNum,
          pageSize,
          ...obj,
        });
        if (+code == 200) {
          this.tableData = rows;
          this.pagination.totalCount = total;
          this.tableLoading = false;
          this.tableData.forEach((item) => {
            item.status = !!item.status;
          });
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //表格状态改变
    switchChange(row) {
      this.$confirm(
        `确认要${row.state == true ? "启用" : "停用"}${row.roleKey}用户吗`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.$notify.error({
            title: "您没有权限进行此操作",
          });
          row.status = true;
        })
        .catch(() => {
          this.$notify.info({
            title: "操作已取消",
          });
          row.status = true;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.system-role {
  padding: 10px 15px;
}

.el-input__inner {
  width: 220px;
}
/deep/ .el-table th {
  background-color: #f8f8f9;
  font-weight: 500;
  color: #515a6e;
}
.right {
  float: right;
  margin-bottom: 10px;
}
</style>
