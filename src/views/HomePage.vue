<template>
  <div class="homepage">
    <el-row class="homepageTop">
      <el-col :span="13">
        <div class="map" ref="map"></div>
      </el-col>
      <el-col :span="11">
        <div class="homepageTopR">
          <div class="facility">
            <el-row class="rightRow">
              <h3 class="el-icon-s-data">设备统计</h3>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgblue">
                    <i class="el-icon-menu blue"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">设备数量</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.deviceCount"
                      :duration="3000"
                    ></countTo>
                    <!-- <span class="num">{{
                      deviceStatistic.deviceCount | format
                    }}</span> -->
                  </div>
                </div>
              </el-col>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgred">
                    <i class="el-icon-s-platform red"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">检测数据</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.monitorCount"
                      :duration="3000"
                    ></countTo>

                    <!-- <span class="num">{{
                      deviceStatistic.monitorCount | format
                    }}</span> -->
                  </div>
                </div>
              </el-col>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgblue">
                    <i class="el-icon-s-order blue"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">产品数量</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.productCount"
                      :duration="3000"
                    ></countTo>

                    <!-- <span class="num">{{
                      deviceStatistic.productCount | format
                    }}</span> -->
                  </div>
                </div>
              </el-col>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgred">
                    <i class="el-icon-warning red"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">告警数量</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.alertCount"
                      :duration="3000"
                    ></countTo>

                    <!-- <span class="num">{{
                      deviceStatistic.alertCount | format
                    }}</span> -->
                  </div>
                </div>
              </el-col>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgblue">
                    <i class="el-icon-s-cooperation blue"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">操作记录</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.functionCount"
                      :duration="3000"
                    ></countTo>
                    <!-- <span class="num">
                      {{ deviceStatistic.functionCount | format }}</span
                    > -->
                  </div>
                </div>
              </el-col>
              <el-col class="collist" :span="12">
                <div class="facilityList">
                  <div class="facilityListL bgred">
                    <i class="el-icon-s-claim red"></i>
                  </div>
                  <div class="facilityListR">
                    <div class="text">上报事件</div>
                    <countTo
                      :startVal="0"
                      :endVal="deviceStatistic.eventCount"
                      :duration="3000"
                    ></countTo>
                    <!-- <span class="num">{{
                      deviceStatistic.eventCount | format
                    }}</span> -->
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="infoBar">
            <el-row class="rightRow">
              <h3 class="el-icon-s-order">信息栏</h3>
              <el-col
                class="collistT"
                v-for="item in NoticeList"
                :key="item.noticeId"
              >
                <div class="infoList" @click="openDialog(item)">
                  <el-tag
                    size="mini"
                    :color="item.noticeType == 2 ? '#ffba00' : '#409EFF'"
                    >{{ item.noticeType == 2 ? "公告" : "信息" }}</el-tag
                  >
                  <span>{{ item.noticeTitle }}</span>
                </div>
                <span class="el-icon-time">{{ item.createTime }}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="homepageBottom" v-permission="'monitor:druid:list'">
      <el-col :span="7" class="homepageBottomLeft">
        <div class="facility">
          <el-row class="rightRow">
            <h3>Mqtt 统计指标</h3>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bgyellow">
                  <i class="el-icon-position yellow"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">发送字节</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['bytes.sent']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["bytes.sent"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bggreen">
                  <i class="el-icon-document-add green"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">接收字节</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['bytes.received']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["bytes.received"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bgyellow">
                  <i class="el-icon-s-check yellow"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">认证次数</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['client.authenticate']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["client.authenticate"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bggreen">
                  <i class="el-icon-connection green"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">连接次数</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['client.auth.success']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["client.auth.success"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bgyellow">
                  <i class="el-icon-collection yellow"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">订阅次数</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['client.subscribe']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["client.subscribe"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="facilityList">
                <div class="facilityListL bggreen">
                  <i class="el-icon-chat-dot-square green"></i>
                </div>
                <div class="facilityListR">
                  <div class="text">接收消息</div>
                  <countTo
                    :startVal="0"
                    :endVal="MetriceList['messages.received']"
                    :duration="3000"
                  ></countTo>
                  <!-- <span class="num">{{
                    MetriceList["messages.received"] | format
                  }}</span> -->
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10" class="homepageBottomCenter">
        <el-row class="Mqttbox">
          <div ref="MqttMain" class="MqttMain"></div>
        </el-row>
        <el-row>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item>
              <template slot="label"> 服务器名 </template>
              {{ ServerList.sys.computerName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Java名称 </template>
              {{ ServerList.jvm.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 服务器IP </template>
              {{ ServerList.sys.computerIp }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 启动时间 </template>
              {{ ServerList.jvm.startTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 操作系统 </template>
              {{ ServerList.sys.osName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Java版本 </template>
              {{ ServerList.jvm.version }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 系统架构 </template>
              {{ ServerList.sys.osArch }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 运行时长 </template>
              {{ ServerList.jvm.runTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> CPU核心 </template>
              {{ ServerList.cpu.cpuNum }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 占用内存 </template>
              {{ ServerList.jvm.used }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 内存大小 </template>
              {{ ServerList.mem.total }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> JVM总内存 </template>
              {{ ServerList.jvm.total }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
      </el-col>
      <el-col :span="7" class="homepageBottomRight">
        <div class="piebox" ref="piebox1"></div>
        <div class="piebox" ref="piebox2"></div>
        <div class="piebox" ref="piebox3"></div>
      </el-col>
    </el-row>
    <el-dialog
      :title="DialogTitle.noticeTitle"
      :visible="visible"
      width="50%"
      :before-close="closeDialog"
      :destroy-on-close="true"
    >
      <el-tag
        size="mini"
        :color="DialogTitle.noticeType == 2 ? '#ffba00' : '#409EFF'"
        >{{ DialogTitle.noticeType == 2 ? "公告" : "信息" }}</el-tag
      >
      <span>{{ DialogTitle.noticeTitle }}</span>
      <div class="dialogmain" v-html="DialogTitle.noticeContent"></div>
      <span slot="footer" class="dialogbottom">
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import countTo from "vue-count-to";
import * as echarts from "echarts";
import { loadBMap } from "../assets/map";
//ECharts的百度地图扩展，可以在百度地图上展现点图，线图，热力图等可视化
require("echarts/extension/bmap/bmap");
import _ from "../assets/utils";
export default {
  name: "HomePage",
  components: {
    countTo,
  },
  data() {
    return {
      //设备统计
      deviceStatistic: {},
      //信息栏
      NoticeList: [],
      //Mqtt统计
      MetriceList: {},
      //Mqtt状态
      StatsList: {},
      //表格数据
      ServerList: {
        jvm: {
          name: "",
          version: "",
          startTime: "",
          runTime: "",
          used: "",
          total: 100,
        },
        sys: {
          computerName: "",
          osName: "",
          computerIp: "",
          osArch: "",
        },
        cpu: {
          cpuNum: 1,
        },
        mem: {
          total: 2,
        },
      },
      sysFiles: {},
      //饼图
      deviceList: [],
      deviceCount: 0,
      //弹出层
      DialogTitle: {},
      visible: false,
    };
  },
  mounted() {
    // this.MqttInit();
    this.loadMap();
  },
  created() {
    this.getInfo();
    this.StatisticsInit();
    this.NoticeInit();
    this.MetriceInit();
    this.DescriptionsInit();
    this.ServerInit();
    this.DeviceInit();
  },
  computed: {
    ...mapState(["avatarUrl"]),
  },
  methods: {
    ...mapMutations(["setAvatarUrl"]),
    async getInfo() {
      let { code, user } = await this.$api.getInfo();
      if (+code !== 200) {
        this.$message.error("网络错误，请稍后重试");
        return;
      }
      let { avatar } = user;
      this.setAvatarUrl(avatar);
    },
    //加载地图
    loadMap() {
      this.$nextTick(() => {
        loadBMap().then(() => {
          this.getmap();
        });
      });
    },
    //地图
    getmap() {
      var myChart = echarts.init(this.$refs.map);
      var option;

      // 单击事件
      // myChart.on('click', (params) => {
      //     if (params.data.deviceId) {
      //         this.$router.push({
      //             path: '/iot/device-edit',
      //             query: {
      //                 t: Date.now(),
      //                 deviceId: params.data.deviceId,
      //             }
      //         });
      //     }
      // });

      // 格式化数据
      let convertData = function (data, status) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = [data[i].longitude, data[i].latitude];
          if (geoCoord && data[i].status == status) {
            res.push({
              name: data[i].deviceName,
              value: geoCoord,
              serialNumber: data[i].serialNumber,
              status: data[i].status,
              isShadow: data[i].isShadow,
              firmwareVersion: data[i].firmwareVersion,
              networkAddress: data[i].networkAddress,
              productName: data[i].productName,
              activeTime: data[i].activeTime == null ? "" : data[i].activeTime,
              deviceId: data[i].deviceId,
              serialNumber: data[i].serialNumber,
              locationWay: data[i].locationWay,
            });
          }
        }
        return res;
      };
      option = {
        title: {
          text:
            "设备分布（在线数 " +
            this.deviceList.filter((x) => x.status == 3).length +
            "）",
          subtext: "wumei-smart open source living iot platform",
          sublink: "https://iot.wumei.live",
          target: "_blank",
          textStyle: {
            color: "#333",
            textBorderColor: "#fff",
            textBorderWidth: 10,
          },
          top: 10,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            var htmlStr = '<div style="padding:5px;line-height:28px;">';
            htmlStr +=
              "设备名称： <span style='color:#409EFF'>" +
              params.data.name +
              "</span><br />";
            htmlStr += "设备编号： " + params.data.serialNumber + "<br />";
            htmlStr += "设备状态： ";
            if (params.data.status == 1) {
              htmlStr += "<span style='color:#E6A23C'>未激活</span>" + "<br />";
            } else if (params.data.status == 2) {
              htmlStr += "<span style='color:#F56C6C'>禁用</span>" + "<br />";
            } else if (params.data.status == 3) {
              htmlStr += "<span style='color:#67C23A'>在线</span>" + "<br />";
            } else if (params.data.status == 4) {
              htmlStr += "<span style='color:#909399'>离线</span>" + "<br />";
            }
            if (params.data.isShadow == 1) {
              htmlStr +=
                "设备影子： " +
                "<span style='color:#67C23A'>启用</span>" +
                "<br />";
            } else {
              htmlStr +=
                "设备影子： " +
                "<span style='color:#909399'>未启用</span>" +
                "<br />";
            }
            htmlStr += "产品名称： " + params.data.productName + "<br />";
            htmlStr +=
              "固件版本： Version " + params.data.firmwareVersion + "<br />";
            htmlStr += "激活时间： " + params.data.activeTime + "<br />";
            htmlStr += "定位方式： ";
            if (params.data.locationWay == 1) {
              htmlStr += "自动定位" + "<br />";
            } else if (params.data.locationWay == 2) {
              htmlStr += "设备定位" + "<br />";
            } else if (params.data.locationWay == 3) {
              htmlStr += "自定义位置" + "<br />";
            } else {
              htmlStr += "未知" + "<br />";
            }
            htmlStr += "所在地址： " + params.data.networkAddress + "<br />";
            htmlStr += "</div>";
            return htmlStr;
          },
        },
        bmap: {
          center: [133, 38],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: "water",
                elementType: "all",
                stylers: {
                  color: "#a0cfff",
                },
              },
              {
                featureType: "land",
                elementType: "all",
                stylers: {
                  color: "#fafafa", // #fffff8 淡黄色
                },
              },
              {
                featureType: "railway",
                elementType: "all",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "highway",
                elementType: "all",
                stylers: {
                  color: "#fdfdfd",
                },
              },
              {
                featureType: "highway",
                elementType: "labels",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "arterial",
                elementType: "geometry",
                stylers: {
                  color: "#fefefe",
                },
              },
              {
                featureType: "arterial",
                elementType: "geometry.fill",
                stylers: {
                  color: "#fefefe",
                },
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "green",
                elementType: "all",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "subway",
                elementType: "all",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "manmade",
                elementType: "all",
                stylers: {
                  color: "#d1d1d1",
                },
              },
              {
                featureType: "local",
                elementType: "all",
                stylers: {
                  color: "#d1d1d1",
                },
              },
              {
                featureType: "arterial",
                elementType: "labels",
                stylers: {
                  visibility: "off",
                },
              },
              {
                featureType: "boundary",
                elementType: "all",
                stylers: {
                  color: "#999999",
                },
              },
              {
                featureType: "building",
                elementType: "all",
                stylers: {
                  color: "#d1d1d1",
                },
              },
              {
                featureType: "label",
                elementType: "labels.text.fill",
                stylers: {
                  color: "#999999",
                },
              },
            ],
          },
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "bmap",
            data: convertData(this.deviceList, 1),
            symbolSize: 15,
            itemStyle: {
              color: "#E6A23C",
            },
          },
          {
            type: "scatter",
            coordinateSystem: "bmap",
            data: convertData(this.deviceList, 2),
            symbolSize: 15,
            itemStyle: {
              color: "#F56C6C",
            },
          },
          {
            type: "scatter",
            coordinateSystem: "bmap",
            data: convertData(this.deviceList, 4),
            symbolSize: 15,
            itemStyle: {
              color: "#909399",
            },
          },
          {
            type: "effectScatter",
            coordinateSystem: "bmap",
            data: convertData(this.deviceList, 3),
            symbolSize: 15,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              scale: 5,
            },
            label: {
              formatter: "{b}",
              position: "right",
              show: false,
            },
            itemStyle: {
              color: "#67C23A",
              shadowBlur: 100,
              shadowColor: "#333",
            },
            zlevel: 1,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //设备统计
    async StatisticsInit() {
      try {
        let { code, data } = await this.$api.getDeviceStatisticList();
        if (+code !== 200) {
          this.$message.error("网络错误,请稍后再试");
          return;
        }
        this.deviceStatistic = data;
      } catch (error) {
        console.log(error);
      }
    },
    //信息栏数据
    async NoticeInit() {
      try {
        let { code, rows } = await this.$api.getNoticeList();
        if (+code !== 200) {
          this.$message.error("网络错误，请稍后再试~");
          return;
        }
        this.NoticeList = rows;
        this.NoticeList.map((item) => {
          return (item.createTime = _.formatTime(
            item.createTime,
            "{0}-{1}-{2}"
          ));
        });
      } catch (error) {
        console.log(error);
      }
    },
    //Mqtt统计指标数据
    async MetriceInit() {
      try {
        let { code, data } = await this.$api.getMetriceList();
        if (+code !== 0) {
          this.$message.error("网络错误，请稍后再试~");
          return;
        }
        this.MetriceList = data[0].metrics;
      } catch (error) {
        console.log(error);
      }
    },
    //Mqtt状态数据
    async DescriptionsInit() {
      try {
        let { code, data } = await this.$api.getstatsList();
        if (+code !== 0) {
          this.$message.error("网络错误，请稍后再试~");
          return;
        }
        this.StatsList = data[0].stats;
      } catch (error) {
        console.log(error);
      }
    },
    //mqtt条形图
    MqttInit() {
      var myChart = echarts.init(this.$refs.MqttMain);
      var option;
      option = {
        title: {
          text: "Mqtt 状态数据",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: [
            "连接数量",
            "会话数量",
            "主体数量",
            "订阅数量",
            "路由数量",
            "保留消息",
          ],
        },
        series: [
          {
            name: "当前数量",
            type: "bar",
            data: [
              this.StatsList["connections.count"],
              this.StatsList["channels.count"],
              this.StatsList["topics.count"],
              this.StatsList["subscriptions.count"],
              this.StatsList["routes.count"],
              this.StatsList["retained.count"],
            ],
          },
          {
            name: "历史最大数",
            type: "bar",
            data: [
              this.StatsList["connections.max"],
              this.StatsList["channels.max"],
              this.StatsList["topics.max"],
              this.StatsList["subscriptions.max"],
              this.StatsList["routes.max"],
              this.StatsList["retained.max"],
            ],
          },
        ],
      };
      option && myChart.setOption(option);
    },
    //表格数据 饼图1
    async ServerInit() {
      try {
        let { code, data } = await this.$api.getMonitorServer();
        if (+code !== 200) {
          this.$message.error("网络错误，请稍后再试");
          return;
        }
        this.ServerList = data;
        this.sysFiles = data.sysFiles[0];
      } catch (error) {
        console.log(error);
      }
      this.MqttInit();
      this.CpuInit();
      this.MemoryInit();
      this.SystemInit();
    },
    //饼图数据
    async DeviceInit() {
      let { code, rows, total } = await this.$api.getDeviceAll();
      if (+code !== 200) {
        this.$message.error("网络不好，请稍后再试~");
        return;
      }
      this.deviceList = rows;
      this.deviceCount = total;
      this.loadMap();
    },
    //cpu饼图
    CpuInit() {
      var myChart = echarts.init(this.$refs.piebox1);
      var option;
      option = {
        title: {
          text: "CPU 使用率",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            name: "CPU使用率 %",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: this.ServerList.cpu.used,
                name: "用户",
                itemStyle: {
                  color: "rgba(245,108,108)",
                },
              },
              {
                value: this.ServerList.cpu.sys,
                name: "系统",
                itemStyle: {
                  color: "rgba(230,162,60)",
                },
              },
              {
                value: this.ServerList.cpu.free,
                name: "空闲",
                itemStyle: {
                  color: "rgba(221,221,221)",
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //内存饼图
    MemoryInit() {
      var myChart = echarts.init(this.$refs.piebox2);
      var option;

      option = {
        title: {
          text: "内存使用率",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            name: "内存使用率 G",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: this.ServerList.mem.used,
                name: "已用",
                itemStyle: {
                  color: "rgba(245,108,108)",
                },
              },
              {
                value: this.ServerList.mem.free,
                name: "剩余",
                itemStyle: {
                  color: "rgba(221,221,221)",
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //系统盘饼图
    SystemInit() {
      var myChart = echarts.init(this.$refs.piebox3);
      var option;

      option = {
        title: {
          text: "系统盘使用率",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            name: "磁盘状态 G",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: parseFloat(this.sysFiles.used),
                name: "已用",
                itemStyle: {
                  color: "rgba(245,108,108)",
                },
              },
              {
                value: parseFloat(this.sysFiles.free),
                name: "可用",
                itemStyle: {
                  color: "rgba(221,221,221)",
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    openDialog(row) {
      this.DialogTitle = row;
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
      this.DialogTitle = {};
    },
  },

  //过滤器  数字千位分隔符
  filters: {
    // format(value) {
    //   let str = value.toString();
    //   let leg = str.length;
    //   let arr = str.split("");
    //   if (leg <= 3) return str;
    //   for (let i = leg - 3; i > 0; i -= 3) {
    //     arr.splice(i, 0, ",");
    //   }
    //   return arr.join("");
    // },
    format(value) {
      //value必须为数字
      if (typeof value !== "number") return;
      return value.toLocaleString();
    },
    // format(value) {
    //   let reg = /\d{1,3}(?=(\d{3})+$)/g;
    //   let text = String(value);
    //   return text.replace(reg, "$&,");
    // },
  },
};
</script>

<style lang="less" scoped>
.homepage {
  padding: 10px 20px;
  background-color: rgb(248, 248, 248);
}

.map {
  width: 100%;
  height: 650px;
  // background-color: pink;
}

.homepageTopR {
  padding: 0 10px;
  h3 {
    margin: 10px;
    width: 100%;
    font-weight: bold;
    font-size: 18px;
    color: #303133;
  }
  .rightRow {
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    .collist {
      padding: 0 20px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
  }
}

//右上
.facilityList {
  width: 100%;
  height: 68px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  .blue {
    color: rgba(54, 163, 247, 1);
  }
  .red {
    color: rgba(245, 108, 108, 1);
  }
  .yellow {
    color: #e6a23c;
  }
  .green {
    color: #34bfa3;
  }
  &:hover {
    .blue,
    .red,
    .green,
    .yellow {
      color: rgb(255, 255, 255);
    }
    .bgblue {
      background-color: #409eff;
    }
    .bgred {
      background-color: #f56c6c;
    }
    .bgyellow {
      background-color: #e6a23c;
    }
    .bggreen {
      background-color: #34bfa3;
    }
  }

  .facilityListL {
    box-sizing: border-box;
    padding: 10px;
    margin: 10px;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    transition: all 0.38s ease-out;
    i {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }
  }
  .facilityListR {
    height: 47px;
    margin: 15px 15px 15px 0;
    box-sizing: border-box;
    overflow: visible;
    .text {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin: 0 0 5px;
      text-align: center;
      font-weight: 700;
    }
    .num {
      font-size: 18px;
      color: #666666;
      font-weight: 700;
      text-align: center;
    }
  }
}
//右下
.infoBar {
  margin-top: 30px;
}

.collistT {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 36px;
  padding: 0 10px;
  margin: 0;
  box-sizing: border-box;
  .el-icon-time {
    font-size: 14px;
  }
  .el-tag {
    color: #fff;
    margin-right: 5px;
  }
}
.infoList {
  cursor: pointer;
  font-size: 16px;
}

//主页下
.homepageBottom {
  margin-top: 40px;
  background-color: #fff;
  overflow: hidden;
}
.homepageBottomLeft {
  padding: 15px 40px 0 40px;
  .rightRow {
    h3 {
      margin: 10px;
      width: 100%;
      font-weight: bold;
      font-size: 18px;
      color: #303133;
    }
  }
  .el-col {
    margin-bottom: 10px;
  }
}
.homepageBottomCenter {
  padding: 0 40px;
  margin-top: 25px;
  overflow: hidden;
}
.Mqttbox {
  width: 100%;
}
.MqttMain {
  width: 555px;
  height: 275px;
}
.el-descriptions {
  width: 450px;
  margin-top: 10px;
}
.homepageBottomRight {
  padding: 0 40px;
  margin-top: 25px;
  overflow: hidden;
}
.piebox {
  width: 100%;
  height: 170px;
}
.el-dialog {
  .el-tag {
    color: #fff;
    margin-right: 10px;
  }
}
.dialogmain {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
}

.facilityListR {
  span {
    font-size: 18px;
  }
}
</style>
