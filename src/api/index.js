import http from "./http";
import template from "./template";

//登录
const login = (code, password, username, uuid) => {
  return http.post("/prod-api/login", {
    code,
    password,
    username,
    uuid,
  });
};
//获取验证码
const captchaImage = () => {
  return http.get("/prod-api/captchaImage");
};

//注册
const register = (code, username, phone, password, confirmPassword, uuid) => {
  return http.post("/prod-api/iot/tool/register", {
    bindId: "",
    code,
    confirmPassword,
    password,
    phonenumber: phone,
    username,
    uuid,
  });
};

//获取登陆者信息
const getInfo = () => {
  return http.get("/prod-api/getInfo");
};

//获取地图数据

//设备统计
const getDeviceStatisticList = () => {
  return http.get("/prod-api/iot/device/statistic");
};

//首页信息栏
const getNoticeList = (pageNum = 1, pageSize = 6) => {
  return http.get("/prod-api/system/notice/list", {
    params: {
      pageNum,
      pageSize,
    },
  });
};
//首页mqtt统计数据请求
const getMetriceList = () => {
  return http.get("/api/v4/metrics");
};
//mqtt状态数据
const getstatsList = () => {
  return http.get("/api/v4/stats");
};

//首页descriptions数据请求
const getMonitorServer = () => {
  return http.get("/prod-api/monitor/server");
};
//首页饼图设备请求
const getDeviceAll = () => {
  return http.get("/prod-api/iot/device/all");
};
export default {
  login,
  captchaImage,
  register,
  getInfo,
  getDeviceStatisticList,
  getNoticeList,
  getMetriceList,
  getstatsList,
  getMonitorServer,
  getDeviceAll,
  template,
};
