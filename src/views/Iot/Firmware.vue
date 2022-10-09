<template>
  <div class="firm-ware">
    <!-- 搜索区 -->
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="固件名称" size="mini">
          <el-input
            v-model="searchFrom.firmwareName"
            placeholder="请输入固件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称" size="mini" v-slot="{row}">
          <el-input
            v-model="searchFrom.productName"
             @click="toProductEdit(row.productId)"
            placeholder="请输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item size="mini" class="buttonBox">
          <el-button type="primary" @click="search"
            ><i class="el-icon-plus"></i>查询</el-button
          >
          <el-button type="primary" @click="reset"
            ><i class="el-icon-plus"></i>重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <el-table
        :data="tableData"
        border
        stripe
        align="center"
        v-loading="tableLoading"
      >
        <el-table-column
          label="固件名称"
          prop="firmwareName"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="version"
          label="固件版本"
          min-width="10%"
          align="center"
          :formatter="formatterVersion"
        >
        </el-table-column>
        <el-table-column
          prop="isSys"
          label="状态"
          align="center"
          min-width="10%"
          v-slot="{ row }"
        >
          <el-tag :type="row.isSys == '默认' ? 'info' : 'success'">{{
            row.isSys
          }}</el-tag>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="15%"
          :formatter="formatterTime"
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          align="center"
          min-width="15%"
          v-slot="{ row }"
        >
          <el-link
            type="primary"
            :underline="false"
            @click="toProductEdit(row.productId)"
            >{{ row.productName }}</el-link
          >
        </el-table-column>
        <el-table-column
          prop="filePath"
          label="下载地址"
          align="center"
          min-width="20%"
          v-slot="{ row }"
        >
          <el-link type="success" :underline="false" :href="row.filePath">{{
            row.filePath
          }}</el-link>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="固件描述"
          min-width="20%"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 分页区 -->
    <el-pagination
      style="float: right"
      :total="pagination.totalCount"
      size="mini"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size.sync="pagination.pageSize"
      :current-page.sync="pagination.pageNum"
      @current-change="search"
      @size-change="search"
    ></el-pagination>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "firm-ware",
  data() {
    return {
      //搜索
      searchFrom: {
        firmwareName: "",
        productName: "",
      },
      //表格数据
      tableData: [],
      tableLoading: false,
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
    reset() {
      this.searchFrom.firmwareName=""
      this.searchFrom.productName=""
      this.init();
    },
    //搜索
    search() {
      let obj = {};
      obj.firmwareName = this.searchFrom.firmwareName;
      obj.productName = this.searchFrom.productName;
      this.init(obj);
    },

    async init(obj = {}) {
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerFirmwareSearch({
            pageNum,
            pageSize,
            ...obj,
          });
        if (+code == 200) {
          rows.forEach((item) => {
            item.filePath = `https://iot.wumei.live/prod-api/${item.filePath}`;
            item.isSys = item.isSys == 0 ? "默认" : "最新";
          });
          this.tableData = rows;
          this.pagination.totalCount = total;
          this.tableLoading = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //格式化日期
    formatterTime(row) {
      let createTime = row.createTime;
      return _.formatTime(createTime, "{0}-{1}-{2}");
    },
    //格式化固件版本
    formatterVersion(row) {
      let version = `Version${row.version}`;
      return version;
    },
    //名称跳转
     toProductEdit(productId) {
      this.$router.push({
        path: `/iot/product-edit`,
        query: {
          productId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  width: 99%;
  padding: 0 10px;
}
.demo-form-inline {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #e6ebf5;
  background-color: #fff;
  margin: 5px 0;
  .el-form-item {
    margin-bottom: 5px;
  }
}
.buttonBox {
  i {
    margin-right: 5px;
  }
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
</style>
