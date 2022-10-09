
import axios from "axios";
import { Message } from "element-ui";
import _ from "../assets/utils";

const http = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push({
    //     name: "Login",
    //   });
    //   return config;
    // } else {
    //   config.headers["Authorization"] = token;
    // }
    let token = _.storage.get("token");
    if (token && config.url !== "/adminUser/login") {
      config.headers["Authorization"] = token;
    }
    if(config.url.includes("/api/v4")){
      config.headers["Authorization"] = "Basic YWRtaW46cHVibGlj";
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // console.log(response);
    // if (+response.data.code === 401) {
    //   Message.error({
    //     onClose: () => {
    //       router.push({
    //         name: "Login",
    //       });
    //     },
    //     message: "您未登录，即将前往登陆页面",
    //   });
    // }
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    Message.error('小主，当前网络繁忙，请您稍后再试~');
    return Promise.reject(error);
  }
);
export default http;
