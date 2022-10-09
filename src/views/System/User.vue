<template>
  <div class="system-user">
    <el-row>
      <el-col :span="4">
        <el-input placeholder="请输入部门名称" v-model="department"> </el-input>
        <el-tree
          class="filter-tree"
          :data="DepartmentList"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="tree"
          @node-click="init"
        >
        </el-tree>
      </el-col>
      <el-col :span="20">
        <!-- 搜索 -->
        <el-form
          :model="searchList"
          status-icon
          ref="ruleForm"
          label-width="100px"
          size="medium"
          inline
          class="searchruleForm"
          v-show="searchflag"
        >
          <el-form-item label="用户名称">
            <el-input type="text" v-model="searchList.name"> </el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input type="text" v-model="searchList.phonenumber"></el-input>
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
          <el-button
            size="mini"
            icon="el-icon-menu"
            @click="icondialog"
            circle
          ></el-button>
        </div>
        <!-- 表格 -->
        <el-table
          :border="true"
          size="medium "
          :data="tableData"
          style="width: 100%"
          v-loading="tableLoading"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column
            prop="userId"
            v-if="data[0].flag"
            :label="data[0].label"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            align="center"
            v-if="data[1].flag"
            :label="data[1].label"
          >
          </el-table-column>
          <el-table-column
            prop="nickName"
            align="center"
            v-if="data[2].flag"
            :label="data[2].label"
          >
          </el-table-column>
          <el-table-column
            prop="dept.deptName"
            align="center"
            v-if="data[3].flag"
            :label="data[3].label"
          >
          </el-table-column>
          <el-table-column
            prop="phonenumber"
            align="center"
            v-if="data[4].flag"
            :label="data[4].label"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            v-slot="{ row }"
            align="center"
            v-if="data[5].flag"
            :label="data[5].label"
          >
            <el-switch
              v-model="row.status"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="switchChange(row)"
            />
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            min-width="120"
            v-if="data[6].flag"
            :label="data[6].label"
          >
          </el-table-column>
          <el-table-column
            align="center"
            v-if="data[7].flag"
            :label="data[7].label"
          >
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="float: right"
          @size-change="search"
          @current-change="search"
          size="mini"
          :total="pagination.totalCount"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size.sync="pagination.pageSize"
          :current-page.sync="pagination.pageNum"
        >
        </el-pagination>
        <el-dialog title="显示/隐藏" :visible.sync="dialogVisible" width="50%">
          <el-transfer
            v-model="value"
            :data="data"
            :titles="['显示', '隐藏']"
            @change="transferChange"
          ></el-transfer>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "system-user",
  data() {
    const generateData = () => {
      let cities = [
        "用户编号",
        "用户名称",
        "用户昵称",
        "部门",
        "手机号码",
        "状态",
        "创建时间",
        "操作",
      ];
      let data = [];
      cities.forEach((item, index) => {
        data.push({
          label: item,
          key: index,
          flag: true,
        });
      });
      return data;
    };
    return {
      department: "",
      DepartmentList: [],
      //搜索
      searchList: {
        name: "",
        phonenumber: "",
        status: "",
        time: "",
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      searchflag: true,
      dialogVisible: false,
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //弹框
      data: generateData(),
      value: [],
    };
  },
  created() {
    this.init();
    this.deparInit();
  },
  watch: {
    department(value) {
      this.$refs.tree.filter(value);
    },
  },
  methods: {
    reset() {
      this.searchList.name = "";
      this.searchList.phonenumber = "";
      this.searchList.status = "";
      this.searchList.time = "";
      this.init();
    },
    async search() {
      let times = { beginTime: "", endTime: "" };
      let obj = {};
      let { name, phonenumber, status, time } = this.searchList;
      if (time) {
        time.map((item) => {
          return item.toLocaleString("zh-CN", { hour12: false });
        });
        times.beginTime = _.formatTime(time[0], "{0}-{1}-{2}");
        times.endTime = _.formatTime(time[1], "{0}-{1}-{2}");
      }
      obj.pageNum = this.pagination.pageNum;
      obj.pageSize = this.pagination.pageSize;
      obj.userName = name;
      obj.phonenumber = phonenumber;
      obj.status = status;
      obj["params.beginTime"] = times.beginTime;
      obj["params.endTime"] = times.endTime;

      this.tableLoading = true;
      try {
        let { code, rows, total } = await this.$api.system.queryUserList({
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
    // 树结构筛选时
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //部门数据
    async deparInit() {
      try {
        let { code, data } = await this.$api.system.queryDeparList();
        if (+code !== 200) {
          this.$message.error("当前网络状态异常~");
        }
        this.DepartmentList = data;
      } catch (error) {
        console.log(error);
      }
    },
    // 搜索是否显示
    iconsearch() {
      this.searchflag = !this.searchflag;
    },
    // 表格刷新
    iconreset() {
      this.init();
    },
    // 表格筛选框是否显示
    icondialog() {
      this.dialogVisible = true;
    },
    //获取表格数据
    async init(data) {
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      let deptId = data ? data.id : undefined;
      try {
        let { code, rows, total } = await this.$api.system.queryUserList({
          pageNum,
          pageSize,
          deptId,
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
    //状态修改
    switchChange(row) {
      this.$confirm(
        `确认要${row.state == true ? "启用" : "停用"}${row.createBy}用户吗`,
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

    //弹框元素变化时
    transferChange(value, direction, key) {
      console.log(value, direction, key);
      if (direction == "right") {
        value.forEach((item) => {
          this.data[item].flag = false;
        });
      } else {
        key.forEach((item) => {
          this.data[item].flag = true;
        });
      }
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.system-user {
  padding: 10px 15px;
}
.el-row {
  margin-bottom: 20px;
  &.right {
    text-align: right;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.el-input__inner {
  width: 220px;
}
::v-deep .el-table th {
  background-color: #f8f8f9;
  font-weight: 500;
  color: #515a6e;
}
::v-deep .el-table th,
::v-deep .el-table td {
  text-align: center;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right {
  float: right;
  margin-bottom: 10px;
}
</style>
