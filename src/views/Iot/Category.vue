<template>
  <div class="cate-gory">
    <div class="search">
      <el-form :inline="true" :model="categoryName" class="demo-form-inline">
        <el-form-item label="分类名称" size="mini">
          <el-input
            v-model="categoryName.value"
            placeholder="请输入"
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
        <el-form-item class="addButton" size="mini">
          <el-button
            plain
            class="addMenu"
            @click="dialogVisible = true"
            size="mini"
            ><i class="el-icon-plus"></i>新增</el-button
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
          prop="categoryName"
          label="产品分类名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="10%"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isSys"
          label="系统定义"
          align="center"
          min-width="10%"
          v-slot="{ row }"
        >
          <template>
            <div>{{ row.isSys === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="显示顺序"
          align="center"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="15%"
          :formatter="formatterTime"
        >
        </el-table-column>
        <el-table-column label="操作" min-width="10%" v-slot="{ row }">
          <template>
            <el-button
              type="primary"
              size="mini"
              @click="triggerUpdate(row)"
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
      :page-size.sync="pagination.pageSize"
      :current-page.sync="pagination.pageNum"
      @current-change="search"
      @size-change="search"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog
      title="添加产品分类"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
    >
      <el-form :model="ruleForm" center :rules="rules" ref="formIns">
        <el-form-item
          label="分类名称"
          :label-width="labelWidth"
          prop="categoryName"
        >
          <el-input
            type="text"
            placeholder="请输入分类名称"
            v-model="ruleForm.categoryName"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示顺序"
          :label-width="labelWidth"
          prop="orderNum"
        >
          <el-input
            type="number"
            v-model="ruleForm.orderNum"
            placeholder="请输入显示顺序"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="labelWidth" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.remark"
            class="length"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "cate-gory",
  data() {
    return {
      categoryName: {
        value: "",
      },
      //表格数据
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        totalPage: 0,
        pageNum: 1,
      },
      //表单
      ruleForm: {
        categoryId: 0,
        categoryName: "",
        createTime: "",
        isSys: 0,
        orderNum: null,
        params: {},
        remark: "",
        tenantId: 6,
        tenantName: "wumei",
        updateTime: "2022-10-04 05:10:30",
      },
      dialogVisible: false,
      labelWidth: "100px",
      // 表单校验
      rules: {
        categoryName: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: "blur",
          },
        ],
        remark: [
          {
            min: 3,
            max: 15,
            message: "长度在 3 到15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    reset() {
      this.categoryName.value=""
      this.init();
    },
    search() {
      let obj ={}
      obj.categoryName = this.categoryName.value;
      this.init(obj);
    },
    async init(obj={}) {
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerCategorySearch({
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
    // 格式化TABLE表格日期
    formatterTime(row) {
      let createTime = row.createTime;
      return _.formatTime(createTime, "{0}-{1}-{2}");
    },
    //修改
    async triggerUpdate(row) {
      let { categoryId } = row;
      let { data } = await this.$api.template.queryCategoryInfo(categoryId);
      this.ruleForm.categoryName = data.categoryName;
      this.ruleForm.orderNum = data.orderNum;
      this.ruleForm.remark = data.remark;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 提交信息「新增/修改」
    async submit() {
      try {
        await this.$refs.formIns.validate();
        let {
          categoryName,
          createTime,
          isSys,
          orderNum,
          params,
          remark,
          tenantId,
          tenantName,
          categoryId,
          updateTime,
        } = this.ruleForm;
        let handler = this.$api.template.insertCategory,
          data = {
            categoryName,
            createTime,
            isSys: isSys ? 1 : 0,
            orderNum,
            params,
            remark,
            tenantId,
            tenantName,
            updateTime,
          };
        if (categoryId !== 0) {
          handler = this.$api.template.updateCategory;
          data.categoryId = categoryId;
        }
        let { code } = await handler(data);
        if (+code === 200) {
          this.$message.success("当前操作成功~");
          if (categoryId !== 0) {
            this.search();
          } else {
            this.reset();
          }
          this.closeDialog();
          return;
        }
        this.$message.error("当前操作失败，请稍后再试~");
      } catch (_) {
        console.log(_);
      }
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
  flex: 1;
  i {
    margin-right: 5px;
  }
}
.addMenu {
  margin-right: 100px;
}
.cate-gory {
  margin-bottom: 100px;
  .table {
    box-sizing: border-box;
    margin-top: 10px;
    width: 99%;
    margin-left: 10px;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;
    .el-table {
      width: 100%;
      .el-table-column {
        font-size: 18px;
        text-align: center;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
/deep/ .el-dialog {
  width: 35%;
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
.length {
  width: 385px;
}
</style>
