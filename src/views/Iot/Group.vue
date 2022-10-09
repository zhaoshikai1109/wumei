<template>
  <div class="iot-group">
    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="分组名称" size="mini">
          <el-input
            v-model="searchFrom.groupName"
            placeholder="请输入分组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="我的分组" size="mini">
          <el-switch
            v-model="searchFrom.userId"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            style="width: 50px"
          >
          </el-switch>
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
          <el-button plain class="addMenu" @click="openDialog" size="mini"
            ><i class="el-icon-plus"></i>新增</el-button
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
          prop="groupName"
          label="分组名称"
          align="center"
          min-width="15%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="groupOrder"
          label="分组排序"
          min-width="10%"
          align="center"
        >
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
          prop="remark"
          label="备注"
          min-width="30%"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          min-width="30%"
          align="center"
          v-slot="{ row }"
        >
          <el-button
            type="warning"
            size="mini"
            @click="toDevice"
            icon="el-icon-view"
            >查看设备</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="triggerAdd(row)"
            icon="el-icon-circle-plus-outline"
            >添加设备</el-button
          >
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
    <!-- 分页区域 -->
    <el-pagination
      style="float: right"
      :total="pagination.totalCount"
      size="mini"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size.sync="pagination.pageSize"
      :current-page.sync="pagination.pageNum"
      @current-change="init"
      @size-change="init"
    ></el-pagination>
    <!-- 新增修改弹框 -->
    <el-dialog
      :title="dialogForm"
      :visible="dialogVisible"
      :before-close="closeDialog"
    >
      <el-form :model="ruleForm" center :rules="rules" ref="formIns">
        <el-form-item
          label="分组名称"
          prop="groupName"
          :label-width="labelWidth"
        >
          <el-input
            type="text"
            placeholder="请输入分组名称"
            v-model="ruleForm.groupName"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="分组排序"
          prop="groupOrder"
          :label-width="labelWidth"
        >
          <el-input
            type="number"
            v-model="ruleForm.groupOrder"
            placeholder="请输入分组排序"
            class="length"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="labelWidth">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请输入内容"
            class="length"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </template>
    </el-dialog>
    <!-- 查看设备弹框 -->
    <el-dialog
      title="提示"
      :visible="dialogTableVisible"
      width="60%"
      :before-close="closeDialogTable"
    >
      <div class="searchdialog">
        <el-form :inline="true" :model="deviceName" class="demo-form-inline">
          <el-form-item label="分类名称" size="mini">
            <el-input
              v-model="deviceName.value"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item size="mini" class="buttonBox">
            <el-button type="primary" @click="searchtable"
              ><i class="el-icon-plus"></i>查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="gridData"
        border
        stripe
        align="center"
        v-loading="tableLoadings"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serialNumber"
          label="设备编号"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center">
        </el-table-column>
        <el-table-column
          prop="isOwner"
          label="设备类型"
          v-slot="{ row }"
          align="center"
        >
          <el-tag type="primary" size="mini">{{
            row.isOwner ? "拥有" : ""
          }}</el-tag>
        </el-table-column>
        <el-table-column
          prop="status"
          label="设备状态"
          v-slot="{ row }"
          align="center"
        >
          <el-tag :type="row.status == 1 ? 'warning' : 'info'" size="mini">{{
            row.status == 1 ? "未激活" : "离线"
          }}</el-tag>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right"
        :total="paginationdialog.totalCount"
        size="mini"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size.sync="paginationdialog.pageSize"
        :current-page.sync="paginationdialog.pageNum"
        @current-change="searchtable"
        @size-change="searchtable"
      ></el-pagination>
      <template #footer>
        <el-button @click="closeDialogTable">取 消</el-button>
        <el-button type="primary" @click="dialogsubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "iot-group",
  data() {
    return {
      //搜索
      searchFrom: {
        groupName: "",
        userId: false,
      },

      //表格数据
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
      dialogVisible: false,
      //dialog标题
      dialogForm: "",
      //表单
      ruleForm: {
        createTime: "",
        groupId: 0,
        groupName: "",
        groupOrder: null,
        remark: "",
        updateTime: "",
        userId: 6,
        userName: "wumei",
      },
      labelWidth: "100px",
      // 表单校验
      rules: {
        groupName: [
          {
            required: true,
            message: "分组名称不能为空",
            trigger: "blur",
          },
        ],
        groupOrder: [
          {
            required: true,
            message: "分组排序不能为空",
            trigger: "blur",
          },
        ],
      },
      dialogTableVisible: false,
      //--------
      gridData: [],
      tableLoadings: false,
      deviceName: {
        value: "",
      },
      paginationdialog: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //多选框
      deviceIds: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    //重置
    reset() {
      this.searchFrom.groupName = "";
      this.searchFrom.userId = false;
      this.init();
    },
    //搜索
    search() {
      let obj = {};
      obj.groupName = this.searchFrom.groupName;
      obj.userId = this.searchFrom.userId ? "6" : "";
      this.init(obj);
    },

    async init(obj = {}) {
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } = await this.$api.template.handlerGroupSearch(
          {
            pageNum,
            pageSize,
            ...obj,
          }
        );
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
    //格式化时间
    formatterTime(row) {
      let createTime = row.createTime;
      return _.formatTime(createTime, "{0}-{1}-{2}");
    },
    toDevice() {
      this.$router.push("/iot/device");
    },
    //添加设备
    triggerAdd(row) {
      this.ruleForm=row
      this.dialogTableVisible = true;
      this.initDialogTable();
    },
    searchtable() {
      let deviceName = this.deviceName.value;
      this.initDialogTable(deviceName);
    },
    //表格相关 打开添加分类弹窗
    async initDialogTable(deviceName) {
      this.tableLoadings = true;
      let { pageNum, pageSize } = this.paginationdialog;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerListByGroupSearch(
            pageNum,
            pageSize,
            deviceName
          );
        if (+code == 200) {
          this.gridData = rows;
          this.paginationdialog.totalCount = total;
          this.tableLoadings = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //打开表单弹框
    openDialog() {
      this.dialogForm = "添加设备分组";
      this.dialogVisible = true;
      (this.ruleForm.groupName = ""),
        (this.ruleForm.groupOrder = ""),
        (this.ruleForm.remark = "");
    },
    //修改  表单
    async triggerUpdate(row) {
      this.dialogForm = "修改设备分组";
      this.dialogVisible = true;
      try {
        let { groupId } = row;
        let { data, code } = await this.$api.template.queryGroupInfo(groupId);
        if (+code == 200) {
          this.dialogFormVisible = true;
          this.ruleForm = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //关闭表弹框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.formIns.resetFields();
      this.ruleForm.groupId = 0;
    },
    //提交 新增/修改
    async submit() {
      try {
        await this.$refs.formIns.validate();
        let {
          createTime,
          groupId,
          groupName,
          groupOrder,
          remark,
          updateTime,
          userId,
          userName,
        } = this.ruleForm;
        let handler = this.$api.template.insertGroup,
          data = {
            createTime,
            groupId,
            groupName,
            groupOrder,
            remark,
            updateTime,
            userId,
            userName,
          };
        if (!groupId == 0) {
          handler = this.$api.template.updateGroup;
          data.groupId = groupId;
        }
        let { code } = await handler(data);
        if (+code === 200) {
          this.$message.success("当前操作成功~");
          if (!groupId == 0) {
            this.search();
          } else {
            this.reset();
          }
          this.closeDialog();
          return;
        }
        this.$message.error("当前操作失败，请稍后再试~");
      } catch (error) {
        console.log(error);
      }
    },
    closeDialogTable() {
      this.dialogTableVisible = false;
    },
    //复选框变化时触发
    selectionChange(val) {
      //val数组 存储选中行的数据
      this.deviceIds = val.map((item) => {
        return item.deviceId;
      });
    },
    async dialogsubmit() {
      try {
        let {
          createTime,
          groupId,
          groupName,
          groupOrder,
          remark,
          updateTime,
          userId,
          userName,
        } = this.ruleForm;
        let data = {
          createTime,
          deviceIds:this.deviceIds,
          groupId,
          groupName,
          groupOrder,
          remark,
          updateTime,
          userId,
          userName,
        };
        let{code}=await this.$api.template.updateDeviceGroups(data)
        if(+code===200){
          this.$message.success("更新设备下的分组成功")
          this.dialogTableVisible = false;
          return
        }
        this.$message.error("网络错误请稍后再试")
        return
      } catch (error) {
        console.log(error);
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

.iot-group {
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
      .el-button {
        font-size: 14px;
        padding: 5px;
        width: 30%;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
/deep/ .el-dialog {
  width: 40%;
}
.length {
  width: 385px;
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
.searchdialog {
  width: 97%;
}
/deep/.el-dialog__footer {
  padding: 40px 20px 20px;
}
</style>
