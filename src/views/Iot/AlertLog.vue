<template>
  <div class="alert-Log">
    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="告警名称" size="mini">
          <el-input
            v-model="searchFrom.alertName"
            placeholder="请输入告警名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="告警级别" size="mini">
          <el-select
            v-model="searchFrom.alertLevel.value"
            placeholder="请选择告警级别"
            style="width: 100px"
          >
            <el-option
              v-for="item in searchFrom.alertLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态" size="mini">
          <el-select
            v-model="searchFrom.status.value"
            placeholder="请选择处理状态"
            style="width: 100px"
          >
            <el-option
              v-for="item in searchFrom.status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        border
        stripe
        align="center"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="alertName"
          label="告警名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="alertLevel"
          label="告警级别"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="处理状态"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="productID"
          label="产品ID"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="productName"
          label="产品名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="deviceID"
          label="设备ID"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="15%"
        >
        </el-table-column>
        <el-table-column label="处理结果" align="center" min-width="15%">
        </el-table-column>
        <el-table-column label="操作" min-width="10%" v-slot="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="triggerUpdate(row)"
            icon="el-icon-edit"
            >修改</el-button
          >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
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
export default {
  name: "alert-Log",
  data() {
    return {
      //搜索
      searchFrom: {
        alertName: "",
        alertLevel: [
          {
            label: "提醒通知",
            value: "1",
          },
          { label: "轻微问题", value: "2" },
          {
            label: "严重警告",
            value: "3",
          },
        ],

        status: [
          {
            label: "不需要处理",
            value: "1",
          },
          { label: "未处理", value: "2" },
          {
            label: "已处理",
            value: "3",
          },
        ],
      },
      //表格
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  methods: {
    reset() {
      this.searchFrom.alertName=""
      this.searchFrom.alertLevel.value=""
       this.searchFrom.status.value=""
      this.init();
    },
    search() {
      let obj = {};
      obj.alertName = this.searchFrom.alertName;
      obj.alertLevel = this.searchFrom.alertLevel.value;
      obj.status = this.searchFrom.status.value;
      this.init(obj);
    },
    async init(obj = {}) {
      //获取数据
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerAlertLogSearch({
            pageNum,
            pageSize,
            ...obj,
          });
        if (+code == 200) {
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
    triggerUpdate() {},
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
  flex: 1;
  i {
    margin-right: 5px;
  }
}

.alert-log {
  margin-bottom: 100px;
  .table {
    box-sizing: border-box;
    width: 99%;
    margin-left: 10px;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;
    .el-table {
      width: 100%;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
</style>
