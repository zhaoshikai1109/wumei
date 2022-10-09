<template>
  <div class="clientDetails">
    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="客户端ID" size="mini">
          <el-input
            v-model="searchFrom.clientId"
            placeholder="请输入客户端ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="授权平台" size="mini">
          <el-select v-model="searchFrom.type.value" placeholder="请选择平台">
            <el-option
              v-for="item in searchFrom.type"
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
          prop="clientId"
          label="客户端ID"
          align="center"
          min-width="8%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="resourceIds"
          label="资源"
          align="center"
          min-width="8%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="scope"
          label="权限范围"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="授权平台"
          align="center"
          min-width="10%"
          show-overflow-tooltip
          v-slot="{ row }"
        >
          <el-tag
            :type="
              row.type == '小度平台'
                ? ''
                : row.type == '天猫精灵'
                ? 'danger'
                : row.type == '小米小爱'
                ? 'success'
                : 'warning'
            "
            >{{ row.type }}</el-tag
          >
        </el-table-column>
        <el-table-column
          prop="autoapprove"
          label="自动授权"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="authorizedGrantTypes"
          label="授权模式"
          align="center"
          min-width="10%"
          show-overflow-tooltip
          v-slot="{ row }"
        >
          <el-tag type="info" v-for="item in row.authorizedGrantTypes" :key="item">{{
            item
          }}</el-tag>
        </el-table-column>
        <el-table-column
          prop="webServerRedirectUri"
          label="回调地址"
          align="center"
          min-width="15%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="authorities"
          label="权限"
          align="center"
          min-width="8%"
        >
        </el-table-column>
        <el-table-column
          prop="accessTokenValidity"
          label="Token有限期"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="refreshTokenValidity"
          label="Token刷新时间"
          align="center"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column label="操作" min-width="10%" v-slot="{ row }">
          <el-link
            type="primary"
            @click="triggerUpdate(row)"
            icon="el-icon-edit"
            >修改</el-link
          >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分区 -->
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
    <!-- 弹框 -->
    <el-dialog
      title="添加云云对接"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
    >
      <el-form :model="ruleForm" ref="formIns">
        <el-form-item label="授权平台" label-width="140px" prop="type">
          <el-select v-model="ruleForm.type" placeholder="小度平台">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in selections"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端ID" label-width="140px" prop="clientId">
          <el-input
            type="text"
            placeholder="请输入客户端ID"
            v-model="ruleForm.clientId"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源集合" label-width="140px" prop="resourceIds">
          <el-input
            v-model="ruleForm.resourceIds"
            placeholder="请输入资源"
            class="length"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="授权模式"
          prop="authorizedGrantTypes"
          label-width="140px"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.authorizedGrantTypes"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item label="密钥" label-width="140px" prop="clientSecret">
          <el-input
            v-model="ruleForm.clientSecret"
            placeholder="请输入密钥"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="回调地址"
          label-width="140px"
          prop="webServerRedirectUri"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.webServerRedirectUri"
            placeholder="请输入回调地址"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="authorities" label-width="140px">
          <el-input v-model="ruleForm.authorities" class="length"></el-input>
        </el-form-item>
        <el-form-item
          label="Token有效期"
          label-width="140px"
          prop="accessTokenValidity"
        >
          <el-input
            v-model="ruleForm.accessTokenValidity"
            placeholder="请输入Token有效时间"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Token刷新时间"
          label-width="140px"
          prop="refreshTokenValidity"
        >
          <el-input
            v-model="ruleForm.refreshTokenValidity"
            placeholder="请输入Token刷新时间"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item label="预留信息" label-width="140px" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请输入预留信息"
            class="length"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" disabled>确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ClientDetails",
  data() {
    return {
      //搜索
      searchFrom: {
        clientId: "",
        type: [
          {
            label: "小度平台",
            value: "1",
          },
          { label: "天猫精灵", value: "2" },
          {
            label: "小米小爱",
            value: "3",
          },
          {
            label: "其他平台",
            value: "4",
          },
        ],
      },
      //表格
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
        accessTokenValidity: "",
        authorities: "",
        authorizedGrantTypes: "",
        autoapprove: "",
        clientId: "",
        clientSecret: "",
        params: {},
        refreshTokenValidity: "",
        remark: null,
        resourceIds: "",
        scope: "",
        type: null,
        webServerRedirectUri: "",
      },
      selections: [
        {
          label: "小度平台",
          value: "1",
          type: "xiaodu",
        },
        {
          label: "天猫精灵",
          value: "2",
          type: "decimal",
        },
        {
          label: "小米小爱",
          value: "3",
          type: "bool",
        },
        {
          label: "其他平台",
          value: "4",
          type: "enum",
        },
      ],
      dialogVisible: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //重置
    reset() {
      this.searchFrom.clientId=""
      this.searchFrom.type.value=""
      this.init();
    },
    //搜索
    search() {
      let obj = {};
      obj.clientId = this.searchFrom.clientId;
      obj.type = this.searchFrom.type.value;
      this.init(obj);
    },

    async init(obj = {}) {
      //获取数据
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handleClientDetailsSearch({
            pageNum,
            pageSize,
            ...obj,
          });
        if (+code == 200) {
          rows = rows.map((item) => {
            item.autoapprove =
              item.autoapprove == "false" ? "用户验证" : "自动授权";
            item.type =
              this.selections.find((ev) => {
                return ev.value == item.type;
              })?.label || "";
            item.authorizedGrantTypes = item.authorizedGrantTypes.split(",");
            item.authorizedGrantTypes = item.authorizedGrantTypes.map(
              (item) => {
                if (item == "client_credentials") {
                  return "客户端模式";
                }
                if (item == "password") {
                  return "密码模式";
                }
                if (item == "authorization_code") {
                  return "授权码模式";
                }
                if (item == "implicit") {
                  return "简化模式";
                }
                if (item == "refresh_token") {
                  return "刷新Token";
                }
              }
            );
            return item;
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
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.formIns.resetFields();
      this.ruleForm.clientId = 0;
    },
    //修改
    async triggerUpdate(row) {
      try {
        this.dialogVisible = true;
        let { clientId } = row;
        let { data, code } = await this.$api.template.queryclientDetailsInfo(
          clientId
        );
        if (+code == 200) {
          this.ruleForm = data;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
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
/deep/ .el-form-item__label {
  font-weight: 700;
}
.clientDetails {
  margin-bottom: 100px;
  .table {
    box-sizing: border-box;
    width: 99%;
    margin-left: 10px;
    margin-top: 15px;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;

    .el-table {
      width: 100%;
      .el-table-column {
        white-space: wrap;
      }
      .el-tag {
        display: block;
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
  width: 408px;
}
</style>
