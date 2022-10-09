<template>
  <div class="iot-device">
    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="设备名称" size="mini">
          <el-input
            v-model="searchFrom.deviceName"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称" size="mini">
          <el-input
            v-model="searchFrom.productName"
            placeholder="请输入产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备状态" size="mini">
          <el-select
            v-model="searchFrom.status.value"
            placeholder="请选择设备状态"
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
        <el-form-item label="我的分组" size="mini">
          <el-select
            v-model="searchFrom.groupId.value"
            placeholder="请选择我的分组"
            style="width: 100px"
          >
            <el-option
              v-for="item in searchFrom.groupId"
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

    <div class="card">
      <el-row v-loading="tableLoading" :gutter="30">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="8"
          :xl="6"
          v-for="item in cardList"
          :key="item.deviceId"
        >
          <el-card :body-style="{ padding: '10px' }">
            <div class="header">
              <el-link icon="el-icon-menu"
                ><b>{{ item.deviceName }}</b>
                <el-tag type="info">Version{{ item.firmwareVersion }}</el-tag>
              </el-link>
              <div style="font-size: 28px; color: rgb(204, 204, 204)">
                <img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F00%2F73%2F91%2F58b79f28d0d95_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1667468306&t=7a75e98549921fe421fe4c25ff008383"
                  alt=""
                  style="width: 20px; height: 20px"
                />
              </div>
            </div>
            <div class="maintop">
              <el-tag
                :type="
                  item.rssi == '在线'
                    ? 'success'
                    : item.rssi == '离线'
                    ? 'info'
                    : 'warning'
                "
                >{{ item.rssi }}</el-tag
              >
              <el-tag :type="item.isShadow" style="margin: 0 10px">影子</el-tag>
              <el-tag
                :type="
                  item.locationWay == '自动定位'
                    ? 'success'
                    : item.locationWay == '设备定位'
                    ? 'warning'
                    : ''
                "
                >{{ item.locationWay }}</el-tag
              >
            </div>
            <div class="maincenter">
              <div class="mainc-left">
                <p>
                  编号：<span style="color: #1890ff">{{
                    item.serialNumber
                  }}</span>
                </p>
                <p>产品：<span></span>{{ item.productName }}</p>
                <p>
                  激活时间：<span>{{ item.activeTime }}</span>
                </p>
              </div>
              <div class="mainc-img">
                <img
                  src="https://iot.wumei.live/static/img/product.8957f07e.jpg"
                  alt=""
                />
              </div>
            </div>
            <el-descriptions class="mainbottom" :column="2" size="mini" border>
              <el-descriptions-item v-if="item.readOnlyList[0]">
                <template slot="label">
                  {{ item.readOnlyList[0]?.name }}
                </template>
                <span>{{ item.readOnlyList[0].value || 0 }}℃</span>
              </el-descriptions-item>
              <el-descriptions-item v-if="item.readOnlyList[1]">
                <template slot="label">
                  {{ item.readOnlyList[1]?.name }}
                </template>
                <span>{{ item.readOnlyList[1].value || 0 }}℃</span>
              </el-descriptions-item>
              <el-descriptions-item v-if="item.boolList[0]">
                <template slot="label"> {{ item.boolList[0].name }} </template>
                <el-switch v-model="item.value"></el-switch>
              </el-descriptions-item>
              <el-descriptions-item v-if="item.enumList[0]">
                <template slot="label">{{ item.enumList[0].name }} </template>
                <el-select v-model="item.switch" placeholder="请选择">
                  <el-option
                    v-for="item in selections"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item v-if="item.stringList[0]" >
                <template slot="label" > {{ item.stringList[0].name }} </template>
                <el-input disabled :placeholder="item.stringList[0].value">
                </el-input>
               
              </el-descriptions-item>
            </el-descriptions>
            <div class="footer">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-info"
                @click="toDeviceEdit(item.deviceId)"
                >详情</el-button
              >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-view"
                :disabled="item.rssi == '在线' ? false : true"
                @click="dialogVisible = true"
                >实时监测</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-if="cardList.length == 0" :image-size="200"></el-empty>
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
  </div>
</template>

<script>
export default {
  name: "iot-device",
  data() {
    return {
      //搜索
      searchFrom: {
        deviceName: "",
        productName: "",
        status: [
          {
            label: "未激活",
            value: "1",
          },
          {
            label: "禁用",
            value: "2",
          },
          {
            label: "在线",
            value: "3",
          },
          {
            label: "离线",
            value: "4",
          },
        ],
        groupId: [],
      },
      //卡片
      cardList: [],
      //分页
      pagination: {
        totalCount: 0,
        pageSize: 12,
        pageNum: 1,
      },
      selections: [
        {
          label: "低速档位",
          value: "0",
          text: "低速档位",
        },
        {
          label: "中速档位",
          value: "1",
          text: "中速档位",
        },
        {
          label: "中高速档位",
          value: "2",
          text: "中高速档位",
        },
        {
          label: "高速档位",
          value: "3",
          text: "高速档位",
        },
      ],
      dialogVisible: false,
      tableLoading: false,
    };
  },
  created() {
    this.queryMyGroup();
    this.init();
  },
  methods: {
    reset() {
      this.searchFrom.deviceName = "";
      this.searchFrom.groupId.value = "";
      this.searchFrom.productName = "";
      this.searchFrom.status.value = "";
      this.init();
    },
    search() {
      let obj = {};
      obj.deviceName = this.searchFrom.deviceName;
      obj.groupId = this.searchFrom.groupId.value;
      obj.productName = this.searchFrom.productName;
      obj.status = this.searchFrom.status.value
        ? this.searchFrom.status.value
        : "";

      this.init(obj);
    },
    //获取我的分组信息
    async queryMyGroup() {
      let { pageNum, pageSize } = this.pagination;
      let userId = 6;
      try {
        let { code, rows } = await this.$api.template.queryMyGroup({
          pageSize,
          pageNum,
          userId,
        });
        if (+code == 200) {
          let data = [];
          rows.map((item) => {
            let obj = {};
            obj.label = item.groupName;
            obj.value = item.groupId;
            return data.push(obj);
          });
          this.searchFrom.groupId = data;
          return;
        }
        return;
      } catch (error) {
        console.log(error);
      }
    },
    async init(obj = {}) {
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerDeviceSearch({
            pageNum,
            pageSize,
            ...obj,
          });
        if (+code == 200) {
          rows.map((item) => {
            item.isShadow = item.isShadow == 1 ? "success" : "info";
            item.locationWay =
              item.locationWay == 1
                ? "自动定位"
                : item.networkMethod == 2
                ? "设备定位"
                : "自定义位置";
            item.rssi =
              item.rssi == 0 ? "未激活" : item.rssi > 0 ? "在线" : "离线";
          });
          // console.log(rows);

          this.cardList = rows;
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
    toDeviceEdit() {},
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
  }
}
.el-card {
  width: 400px;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .maincenter {
    display: flex;
    width: 100%;
    .mainc-left {
      font-size: 14px;
      width: 60%;
      p {
        margin: 5px 0;
      }
    }
    .mainc-img {
      width: 40%;
      img {
        width: 80%;
      }
    }
  }
  .mainbottom {
    height: 103px;
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    .el-button {
      white-space: initial;
      padding: 5px;
      width: 90px;
      height: 30px;
      font-size: 14px;
    }
  }
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
.el-card {
  width: 380px;
  height: 310px;
}

</style>
