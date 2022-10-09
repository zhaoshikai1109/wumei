<template>
  <div class="pro-duct">
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="产品名称" size="mini">
          <el-input
            v-model="searchFrom.productName"
            placeholder="请输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类名称" size="mini">
          <el-input
            v-model="searchFrom.categoryName"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" size="mini">
          <el-select
            v-model="searchFrom.status.value"
            placeholder="请选择状态"
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
        <el-form-item class="addButton" size="mini">
          <el-button
            plain
            class="addMenu"
            @click="toProductEdit"
            size="mini"
            ><i class="el-icon-plus"></i>新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 卡片 -->
    <div class="card">
      <el-row v-loading="rowLoading" :gutter="30">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="item in cardList" :key="item.productId">
          <el-card :body-style="{ padding: '20px' }">
            <div class="header">
              <el-link
                icon="el-icon-menu"
                @click="toProductEdit(item.productId)"
                ><b>{{ item.productName }}</b></el-link
              >
              <el-tooltip
                class="item"
                effect="dark"
                content="取消发布"
                placement="top-start"
                v-if="item.status == 2"
              >
                <el-button
                  type="success"
                  size="mini"
                  style="padding: 5px"
                  @click="changeProductStatus(item.productId, 1)"
                  >已发布</el-button
                >
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="现在发布"
                placement="top-start"
                v-if="item.status == 1"
              >
                <el-button
                  type="info"
                  size="mini"
                  style="padding: 5px"
                  @click="changeProductStatus(item.productId, 2)"
                  >未发布</el-button
                >
              </el-tooltip>
            </div>
            <div class="main">
              <div class="main-left">
                <p>
                  所属分类：<span style="color: #1890ff">{{
                    item.categoryName
                  }}</span>
                </p>
                <p>
                  产品类型：<span>{{
                    item.deviceType == 1 ? "直连设备" : "网关设备"
                  }}</span>
                </p>
                <p>
                  联网方式：<span>{{ item.networkMethod }}</span>
                </p>
                <p>
                  设备授权：<el-tag type="success">{{
                    (item.isAuthorize =
                      item.isAuthorize == 0 ? "未启用" : "已启用")
                  }}</el-tag>
                </p>
              </div>
              <div class="main-img">
                <img
                  src="https://iot.wumei.live/static/img/product.8957f07e.jpg"
                  alt=""
                />
              </div>
            </div>
            <div class="footer">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-info"
                @click="toProductEdit(item.productId)"
                >详情</el-button
              >
              <el-button
                type="success"
                v-show="item.status == 2"
                size="mini"
                :disabled="item.isAuthorize == '未启用'"
                @click="toProductEdit(item.productId)"
                >设备授权</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                v-show="item.status == 2"
                @click="open(item.productId)"
                >删除</el-button
              >
              <el-button
                type="warning"
                size="mini"
                @click="toDevice(item.productId)"
                >查看设备</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
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
      @current-change="init"
      @size-change="init"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "pro-duct",
  data() {
    return {
      //搜索
      searchFrom: {
        productName: "",
        categoryName: "",
        status: [
          {
            label: "未发布",
            value: "1",
          },
          {
            label: "已发布",
            value: "2",
          },
        ],
      },
      cardList: [],
      rowLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 12,
        // totalPage: 0,
        pageNum: 1,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    reset() {
      this.searchFrom.productName = "";
      this.searchFrom.categoryName = "";
      this.searchFrom.status.value = "";
      this.init();
    },
    search() {
      let obj = {};
      obj.productName = this.searchFrom.productName;
      obj.categoryName = this.searchFrom.categoryName;
      obj.status = this.searchFrom.status.value;
      this.init(obj);
    },
    async init(obj = {}) {
      this.rowLoading = true;
      let { pageNum, pageSize } = this.pagination;

      try {
        let { code, rows, total } = await this.$api.template.getProductList({
          pageNum,
          pageSize,
          ...obj,
        });
        if (+code === 200) {
          rows.map((item) => {
            item.networkMethod =
              item.networkMethod == 1
                ? "WIFI"
                : item.networkMethod == 2
                ? "蜂窝(2G/3G/4G/5G)"
                : item.networkMethod == 3
                ? "以太网"
                : "其他";
          });
          this.cardList = rows;
          this.pagination.totalCount = total;
          this.rowLoading = false;
        } else {
          this.$message.error("网络繁忙，请稍后再试");
        }
      } catch (error) {
        console.log(error);
      }
    },
    open(productId) {
      this.$confirm(`是否确认删除产品编号为${productId}的数据项？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$notify.error({
            title: "您没有权限进行此操作",
          });
        })
        .catch(() => {
          this.$notify.info({
            title: "操作已取消",
          });
        });
    },
    //查看设备
    toDevice(productId) {
      this.$router.push({
        name: "device",
        query: {
          productId: productId,
        },
      });
    },
    //详情
    toProductEdit(productId) {
      console.log(productId);
      this.$router.push({
        path: `/iot/product-edit`,
        query: {
          productId,
        },
      });
    },
    changeProductStatus(productId, status) {
      let message = "发生错误了";
      if (status == 2) {
        message = "产品发布后不能再更改产品内容和对应物模型 ！";
      } else if (status == 1) {
        message = "产品下不能有已经创建的设备，才能取消发布哦 ！";
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {};
          data.productId = productId;
          data.status = status;
          this.$api.template
            .changeProductStatus(data)
            .then((response) => {
              this.init();
              this.$message.warning(response.msg);
            })
            .catch(() => {});
        })
        .catch(() => {});
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
.el-row {
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .el-col {
    margin-bottom: 10px;
    box-sizing: border-box;
    white-space: initial;
  }
}
.el-card {
  width: 400px;
  border-radius: 15px;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .main {
    display: flex;
    width: 100%;
    .main-left {
      font-size: 14px;
      width: 60%;
      p {
        margin: 14px 0;
      }
    }
    .main-img {
      width: 40%;
      img {
        width: 100%;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    .el-button {
      white-space: initial;
      padding: 5px;
      height: 30px;
    }
  }
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
</style>
