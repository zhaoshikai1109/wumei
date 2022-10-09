<template>
  <div class="product-edit">
    <div class="form">
      <el-tabs
        tab-position="left"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="基本信息" name="1">
          <el-form :model="ruleForm" center :rules="rules" ref="formIns" inline>
            <el-form-item
              label="产品名称："
              label-width="100px"
              prop="productName"
            >
              <el-input
                type="text"
                placeholder="请输入分组名称"
                v-model="ruleForm.productName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型：" label-width="100px" prop="status">
              <el-select v-model="value">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in selectStatus"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="产品分类："
              label-width="100px"
              prop="categoryName"
            >
              <el-select v-model="value" placeholder="请选择分类">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in selectCategory"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="认证方式："
              label-width="100px"
              prop="vertificateMethod"
            >
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in selectVertif"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="联网方式："
              label-width="100px"
              prop="networkMethod"
            >
              <el-select v-model="ruleForm.networkMethod" placeholder="">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in selectNet"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="产品编号："
              label-width="100px"
              prop="productId"
            >
              <el-input type="text" v-model="ruleForm.productId"></el-input>
            </el-form-item>
            <el-form-item
              label="设备授权："
              label-width="100px"
              prop="isAuthorize"
            >
              <el-switch
                v-model="ruleForm.isAuthorize"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="width: 400px"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="Mqtt账号："
              label-width="100px"
              prop="mqttAccount"
            >
              <el-input type="text" v-model="ruleForm.mqttAccount"> </el-input>
            </el-form-item>
            <el-form-item label="备注信息：" label-width="100px" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                style="width: 400px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="Mqtt密码："
              label-width="100px"
              prop="mqttPassword"
            >
              <el-input type="text" v-model="ruleForm.mqttPassword"> </el-input>
            </el-form-item>
            <el-form-item
              label="产品密钥："
              label-width="100px"
              prop="mqttSecret"
            >
              <el-input type="text" v-model="ruleForm.mqttSecret"> </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产品模型" name="2">
          <template>
            <el-button
              type="warning"
              icon="el-icon-refresh"
              autofocus
              size="mini"
              >刷新</el-button
            >
            <el-button
              type="info"
              icon="el-icon-view"
              @click="dialogVisible = true"
              size="mini"
              >查看物模型</el-button
            >
            <span style="color: red; font-size: 14px"
              >注意：标识符不能重复</span
            >
          </template>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            stripe
            align="center"
            v-loading="tableLoading"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="identifier"
              label="标识符"
              min-width="10%"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="isTop"
              label="首页显示"
              align="center"
              min-width="10%"
              v-slot="{ row }"
            >
              <div>{{ row.isTop === 1 ? "是" : "否" }}</div>
            </el-table-column>
            <el-table-column
              prop="isMonitor"
              label="实时监测"
              align="center"
              min-width="10%"
              v-slot="{ row }"
            >
              <div>{{ row.isMonitor === 1 ? "是" : "否" }}</div>
            </el-table-column>
            <el-table-column
              prop="type"
              label="物模型类别"
              align="center"
              min-width="10%"
              class-name="typeBox"
              v-slot="{ row }"
            >
              <div>
                <el-tag v-if="row.type === 1">{{
                  row.type === 1 ? "属性" : row.type === 2 ? "功能" : "事件"
                }}</el-tag>
                <el-tag type="success" v-if="row.type === 2">{{
                  row.type === 1 ? "属性" : row.type === 2 ? "功能" : "事件"
                }}</el-tag>
                <el-tag type="warning" v-if="row.type === 3">{{
                  row.type === 1 ? "属性" : row.type === 2 ? "功能" : "事件"
                }}</el-tag>
              </div>
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
              v-slot="{ row }"
            >
              <div v-html="row.specs"></div>
            </el-table-column>
            <el-table-column label="操作" min-width="10%"></el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="设备授权" name="4" disabled>设备授权</el-tab-pane>
        <el-tab-pane label="告警配置" disabled name="5">告警配置</el-tab-pane>
        <el-tab-pane label="控制界面" name="6" disabled>控制界面</el-tab-pane>
        <el-tab-pane label="" name="7"></el-tab-pane>
        <el-tab-pane label="" name="8"></el-tab-pane>
        <el-tab-pane label="" name="9"></el-tab-pane>

        <el-tab-pane label="发布产品" name="10">
          <span slot="label">
            <el-button type="danger" size="mini" @click="notice">
              取消发布
            </el-button>
          </span>
        </el-tab-pane>
        <el-tab-pane label="返回列表" name="11">
          <span slot="label">
            <el-button type="info" size="mini" @click="toProduct">
              返回列表
            </el-button>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
        <el-dialog
      title="物模型"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="template"></div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "product-edit",
  data() {
    return {
      activeName: "1",
      value: "",

      ruleForm: {
        categoryId: 0,
        categoryName: "",
        createTime: "",
        deviceType: "",
        isAuthorize: 0,
        isSys: 0,
        mqttAccount: "",
        mqttPassword: "",
        mqttSecret: "",
        networkMethod: 1,
        productId: 0,
        productName: "",
        remark: null,
        status: 1,
        tenantId: 2,
        tenantName: "wumei-t1",
        updateTime: "2022-10-01 12:00:00",
        vertificateMethod: 0,
      },
      rules: {},
      //设备类型
      selectStatus: [
        {
          label: "直连设备",
          value: "1",
        },
        {
          label: "网关设备",
          value: "2",
        },
      ],
      //产品分类
      selectCategory: [
        {
          label: "直连设备",
          value: "1",
        },
        {
          label: "网关设备",
          value: "2",
        },
      ],
      //认证方式
      selectVertif: [
        {
          label: "简单认证",
          value: "1",
        },
        {
          label: "加密认证",
          value: "2",
        },
        {
          label: "简单+加密",
          value: "3",
        },
      ],
      //联网方式
      selectNet: [
        {
          label: "WIFI",
          value: "1",
        },
        {
          label: "蜂窝",
          value: "2",
        },
        {
          label: "以太网",
          value: "3",
        },
        {
          label: "其他",
          value: "4",
        },
      ],
      //表格数据
      tableData: [],
      tableLoading: false,
      dialogVisible: false,
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    formatterRow() {},
    notice() {},
    toProduct() {
        this.$router.push("/iot/product");
    },
  },
};
</script>

<style lang="less" scoped>
.product-edit {
  padding-right: 10px;
  .form {
    box-sizing: border-box;
    width: 99%;
    height: 80vh;
    margin-left: 10px;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;
    .el-form-item {
      margin-left: 20px;
      .el-input,
      .el-select {
        width: 400px;
      }
    }
  }
}
  .template {
    border: 1px solid rgb(204, 204, 204);
    margin-top: -15px;
    height: 600px;
    overflow: scroll;
  }
</style>
