import http from "./http";
import template from "./template";
import system from "./system";
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

//个人中心获取账号信息
const getProfileInfo = () => {
  return http.get("/prod-api/system/user/profile");
};

//修改个人中心用户信息
const updateUserProfile = (data) => {
  return http.put("/prod-api/system/user/profile", data);
};
//修改个人中心密码
const updatePassword = (oldPassword, newPassword) => {
  return http.put("/prod-api/system/user/profile/updatePwd", {
    oldPassword,
    newPassword,
  });
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

//EMQ客户端数据
const getClientsList = (params) => {
  return http.get("/api/v4/clients", { params });
};
//EMQ客户端详细信息
const getClientsInfo = (clientid) => {
  return http.get(`/api/v4/clients/${clientid}`);
};

//EMQ客户端订阅列表详细信息
const getSubscriptionsInfo = (clientid) => {
  return http.get(`/api/v4/subscriptions/${clientid}`);
};
export default {
  login,
  captchaImage,
  register,
  getInfo,
  getProfileInfo,
  updateUserProfile,
  updatePassword,
  getDeviceStatisticList,
  getNoticeList,
  getMetriceList,
  getstatsList,
  getSubscriptionsInfo,
  getMonitorServer,
  getDeviceAll,
  getClientsList,
  getClientsInfo,
  template,
  system,
};
