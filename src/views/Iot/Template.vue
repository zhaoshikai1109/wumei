<template>
  <div class="tem-plate">
    <div class="table">
      <el-table
        :data="tableData"
        border
        stripe
        align="center"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="templateName"
          label="名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="identifier"
          label="标识符"
          min-width="10%"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isTop"
          label="首页显示"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isTop === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isMonitor"
          label="监测值"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isMonitor === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isSys"
          label="系统定义"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isSys === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="物模型类别"
          align="center"
          min-width="10%"
          class-name="typeBox"
        >
          <template slot-scope="scope">
            <div>
              <el-tag type="success" v-if="scope.row.type === 2">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
              <el-tag type="warning" v-if="scope.row.type === 3">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
              <el-tag v-if="scope.row.type === 1">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="datatype"
          label="数据类型"
          align="center"
          min-width="10%"
          :formatter="formatterRow"
        >
        </el-table-column>
        <el-table-column
          prop="specs"
          label="数据定义"
          min-width="15%"
          align="left"
          header-align="center"
          class-name="specsColor"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.specs"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="15%"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column label="操作" min-width="10%" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="triggerUpdate(scope.row)"
              icon="el-icon-edit"
              >修改</el-button
            >
          </template>
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
      :page-size="pagination.pageSize"
      :current-page="pagination.pageNum"
      @current-change="changePagination"
    ></el-pagination>
    <!-- 弹框 -->
    
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "tem-plate",
  data() {
    return {
      //表格数据
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        totalPage: 0,
        pageNum: 1,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      //获取数据
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } = await this.$api.template.getTemplateList(
          pageNum,
          pageSize
        );
        if (+code == 200) {
          rows.map((e) => {
            const specs = JSON.parse(e.specs);
            if (specs.type === "integer" || specs.type === "decimal") {
              e.specs = `最大值：<span>${specs.max}</span> 最小值:<span>${specs.min}</span> 步长:<span>${specs.step}</span> 单位:<span>${specs.unit}</span>`;
            }
            if (specs.type === "array") {
              e.specs = `数组类型:<span>${specs.arrayType}</span>`;
            }
            if (specs.type === "bool") {
              e.specs = `0:<span>${specs.trueText}</span> 1:<span>${specs.falseText}</span>`;
            }
            if (specs.type === "enum" && specs.enumList.length) {
              let str = ``;
              specs.enumList.map((item) => {
                str += `${item.value}:<span>${item.text}</span>`;
              });
              e.specs = str;
            }
            if (specs.type === "string") {
              e.specs = `最大长度:<span>${specs.maxLength}</span>`;
            }
          });
          this.tableData = rows;
          this.pagination.totalCount = total;
          this.tableLoading = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (_) {
        if (!Array.isArray(this.tableData)) this.tableData = [];
        this.tableLoading = false;
      }
    },
    //格式化日期
    formatterTime(row) {
      let createTime = row.createTime;
      return _.formatTime(createTime, "{0}-{1}-{2}");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .specsColor span {
  color: red;
  margin-right: 5px;
}
</style>
