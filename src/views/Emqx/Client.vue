<template>
  <div class="emqx-client">
    <div class="search">
      <el-form :inline="true" :model="clientid" class="demo-form-inline">
        <el-form-item label="客户端" size="mini">
          <el-input
            v-model="clientid.value"
            placeholder="请输入客户端ID"
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
          prop="clientid"
          label="客户端ID"
          align="center"
          v-slot="{ row }"
        >
          <el-link :underline="false" type="primary" @click="handleOpen(row)">{{
            row.clientid
          }}</el-link></el-table-column
        >
        <el-table-column
          prop="node"
          label="节点"
          align="center"
        ></el-table-column>
        <el-table-column prop="ip_address" label="IP地址" align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          align="center"
          v-slot="{ row }"
        >
          <el-tag type="danger" v-if="row.clientid.indexOf('server') == 0"
            >服务端</el-tag
          >
          <el-tag type="success" v-else-if="row.clientid.indexOf('web') == 0"
            >Web端</el-tag
          >
          <el-tag type="warning" v-else-if="row.clientid.indexOf('phone') == 0"
            >移动端</el-tag
          >
          <el-tag type="info" v-else-if="row.clientid.indexOf('test') == 0"
            >测试端</el-tag
          >
          <el-tag type="primary" v-else>设备端</el-tag>
        </el-table-column>
        <el-table-column
          label="连接状态"
          align="center"
          prop="connected"
          v-slot="{ row }"
        >
          <el-tag type="success" v-if="row.connected">已连接</el-tag>
          <el-tag type="info" v-else>已断开</el-tag>
        </el-table-column>
        <el-table-column
          prop="keepalive"
          label="心跳(秒)"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="expiry_interval"
          label="会话过期间隔"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="subscriptions_cnt"
          label="当前订阅数量"
          align="center"
        ></el-table-column>
        <el-table-column
          label="连接时间"
          align="center"
          prop="connected_at"
        ></el-table-column>
        <el-table-column
          label="会话创建时间"
          align="center"
          prop="created_at"
        ></el-table-column>
        <el-table-column label="操作" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <el-pagination
      style="float: right"
      :total="pagination.totalCount"
      size="mini"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size.sync="pagination._limit"
      :current-page.sync="pagination._page"
      @current-change="init"
      @size-change="init"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog
      title="详情"
      :visible="dialogVisible"
      width="800px"
      :before-close="closeDialog"
    >
      <el-tabs v-model="activeName" tab-position="top" style="padding: 10px">
        <el-tab-pane name="first">
          <span slot="label">基本信息</span>
          <el-descriptions class="margin-top" :column="2" border size="medium">
            <el-descriptions-item label="节点">{{
              form.node
            }}</el-descriptions-item>
            <el-descriptions-item label="客户端ID">{{
              form.clientid
            }}</el-descriptions-item>
            <el-descriptions-item label="清除Session">{{
              form.clean_start
            }}</el-descriptions-item>
            <el-descriptions-item label="会话过期间隔(秒)">{{
              form.expiry_interval
            }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{
              form.username
            }}</el-descriptions-item>
            <el-descriptions-item label="协议类型">{{
              form.proto_ver
            }}</el-descriptions-item>
            <el-descriptions-item label="会话创建时间">{{
              form.created_at
            }}</el-descriptions-item>
            <el-descriptions-item label="订阅数量"
              >{{ form.subscriptions_cnt }}/{{
                form.max_subscriptions
              }}</el-descriptions-item
            >
            <el-descriptions-item label="IP地址">{{
              form.ip_address
            }}</el-descriptions-item>
            <el-descriptions-item label="端口">{{
              form.port
            }}</el-descriptions-item>
            <el-descriptions-item label="最大订阅数量">{{
              form.max_subscriptions
            }}</el-descriptions-item>
            <el-descriptions-item label="飞行窗口"
              >{{ form.inflight }}/{{ form.max_inflight }}</el-descriptions-item
            >
            <el-descriptions-item label="心跳(秒)">{{
              form.keepalive
            }}</el-descriptions-item>
            <el-descriptions-item label="是否为桥接">{{
              form.is_bridge
            }}</el-descriptions-item>
            <el-descriptions-item label="最大飞行窗口">{{
              form.max_inflight
            }}</el-descriptions-item>
            <el-descriptions-item label="消息队列"
              >{{ form.mqueue_len }}/{{ form.max_mqueue }}</el-descriptions-item
            >
            <el-descriptions-item label="连接时间">{{
              form.connected_at
            }}</el-descriptions-item>
            <el-descriptions-item label="连接状态">
              <div v-if="form.connected == true" style="color: green">
                已连接
              </div>
              <div v-else-if="form.connected == false" style="color: red">
                已断开
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="最大消息队列">{{
              form.max_mqueue
            }}</el-descriptions-item>
            <el-descriptions-item label="未确认的PUBREC数据包计数">{{
              form.awaiting_rel
            }}</el-descriptions-item>
            <el-descriptions-item label="Zone">{{
              form.zone
            }}</el-descriptions-item>
            <el-descriptions-item label="最大未确认的PUBREC数据包计数">{{
              form.max_awaiting_rel
            }}</el-descriptions-item>
            <el-descriptions-item label="接收的TCP报文数量">{{
              form.recv_cnt
            }}</el-descriptions-item>
            <el-descriptions-item label="接收的PUBLISH报文数量">{{
              form.recv_msg
            }}</el-descriptions-item>
            <el-descriptions-item label="接收的字节数量">{{
              form.recv_oct
            }}</el-descriptions-item>
            <el-descriptions-item label="接收的MQTT报文数量">{{
              form.recv_pkt
            }}</el-descriptions-item>
            <el-descriptions-item label="发送的TCP报文数量">{{
              form.send_cnt
            }}</el-descriptions-item>
            <el-descriptions-item label="发送的PUBLISH报文数量">{{
              form.send_msg
            }}</el-descriptions-item>
            <el-descriptions-item label="发送的字节数量">{{
              form.send_oct
            }}</el-descriptions-item>
            <el-descriptions-item label="发送的MQTT报文数量">{{
              form.send_pkt
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">订阅列表</span>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-refresh"
                size="mini"
                @click="handleRefresh"
                >刷新</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="el-icon-plus"
                size="mini"
                :disabled="true"
                >添加订阅</el-button
              >
            </el-col>
          </el-row>
          <el-table v-loading="loadSubscribeing" :data="subscribeList" border>
            <el-table-column label="主题" align="center" prop="topic" />
            <el-table-column label="QoS" align="center" prop="qos" />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="150"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "emqx-client",
  data() {
    return {
      clientid: {
        value: "",
      },
      // 表格数据
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        _limit: 10,
        _page: 1,
      },
      dialogVisible: false,
      activeName: "first",
      //表单数据
      form: {},
      loadSubscribeing: false,
      subscribeList: [],
      clientId:""
    };
  },
  created() {
    this.init();
  },
  methods: {
    reset() {
      this.clientid.value = "";
      this.init();
    },
    search() {
      let obj = {};
      obj.clientid = this.clientid.value;
      obj.pageNum = 1;
      this.init(obj);
    },
    async init(obj = {}) {
      try {
        this.tableLoading = true;
        let { _limit, _page } = this.pagination;
        let { code, data, meta } = await this.$api.getClientsList({
          _limit,
          _page,
          ...obj,
        });
        if (+code == 0) {
          this.tableData = data;
          this.pagination.totalCount = meta.count;
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
    },
    //dialog基本信息
    async handleOpen(row) {
      let clientid = row.clientid;
      this.dialogVisible = true;
      //dialog 订阅请求
      this.getSubscribeList(clientid);
      try {
        let { code, data } = await this.$api.getClientsInfo(clientid);
        if (+code == 0) {
          this.form = data[0];
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //dialog订阅列表
    async getSubscribeList(clientid) {
      this.clientId=clientid
      this.loadSubscribeing = true;
      try {
        let { code, data } = await this.$api.getSubscriptionsInfo(clientid);
        if (+code == 0) {
          this.subscribeList = data;
          this.loadSubscribeing = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //订阅刷新
    handleRefresh() {
      this.getSubscribeList(this.clientId);
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
/deep/ .el-form-item__label {
  font-weight: 700;
}

.emqx-client {
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
</style>
