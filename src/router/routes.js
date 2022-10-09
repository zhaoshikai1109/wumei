import Vue from "vue";
import Main from "../components/Main.vue";
import Router from "vue-router";

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const includPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return includPush.call(this, location).catch((err) => err);
};
Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    children: [
      {
        path: "",
        redirect: "home",
      },
      {
        path: "home",
        name: "home",
        meta: {
          title: "首页",
          icon: "el-icon-menu",
        },
        component: () => import("../views/HomePage.vue"),
      },
      {
        path: "profile",
        name: "profile",
        meta: {
          title: "个人中心",
          hidden: true,
        },
        component: () => import("../views/Profile/Profile.vue"),
      },
      {
        path: "iot",
        name: "iot",
        meta: {
          title: "物联网",
          icon: "el-icon-eleme",
          role:"iot:news:add"
        },
        component: () => import("../views/Iot/Iot.vue"),
        children: [
          {
            path: "template",
            name: "template",
            meta: {
              title: "通用物模型",
              role:"iot:template:list"
            },
            component: () => import("../views/Iot/Template.vue"),
          },
          {
            path: "category",
            name: "category",
            meta: {
              title: "产品分类",
              role:"iot:category:list"
            },
            component: () => import("../views/Iot/Category.vue"),
          },
          {
            path: "product",
            name: "product",
            meta: {
              title: "产品管理",
              role:"iot:product:list"
            },
            component: () => import("../views/Iot/Product.vue"),
          },
          {
            path: "product-edit",
            
            meta: {
              title: "编辑产品",
              hidden: true,
              role:""
            },
            component: () => import("../views/Iot/ProductEdit.vue"),
          },
          {
            path: "firmware",
            name: "firmware",
            meta: {
              title: "产品固件",
              role:"iot:firmware:list"
            },
            component: () => import("../views/Iot/Firmware.vue"),
          },
          {
            path: "group",
            name: "group",
            meta: {
              title: "设备分组",
              role:"iot:group:list"
            },
            component: () => import("../views/Iot/Group.vue"),
          },
          {
            path: "device",
            name: "device",
            meta: {
              title: "设备管理",
              role:"iot:device:list"
              
            },
            component: () => import("../views/Iot/Device.vue"),
          },
          {
            path: "alertLog",
            name: "alertLog",
            meta: {
              title: "设备告警",
              role:"iot:alert:list"
            },
            component: () => import("../views/Iot/AlertLog.vue"),
          },
          {
            path: "clientDetails",
            name: "clientDetails",
            meta: {
              title: "云云对接",
              role:"iot:clientDetails:list"
            },
            component: () => import("../views/Iot/ClientDetails.vue"),
          },
        ],
      },
      {
        path: "emqx",
        name: "emqx",
        meta: {
          title: "EMQ管理",
          icon: "el-icon-location",
          role:"iot:emqx:query"
        },
        component: () => import("../views/Emqx/Emqx.vue"),
        children: [
          {
            path: "client",
            name: "client",
            meta: {
              title: "客户端",
              role:"iot:emqx:client"
            },
            component: () => import("../views/Emqx/Client.vue"),
          },
        ],
      },
      {
        path: "system",
        name: "system",
        meta: {
          title: "系统管理",
          icon: "el-icon-s-tools",
          role:"system:post:list"
        },
        component: () => import("../views/System/System.vue"),
        children: [
          {
            path: "user",
            name: "user",
            meta: {
              title: "用户管理",
              role:"system:user:list"
            },
            component: () => import("../views/System/User.vue"),
          },
          {
            path: "role",
            name: "role",
            meta: {
              title: "角色管理",
              role:"system:role:list"
            },
            component: () => import("../views/System/Role.vue"),
          },
          {
            path: "menu",
            name: "menu",
            meta: {
              title: "菜单管理",
              role:"system:menu:list"
            },
            component: () => import("../views/System/Menu.vue"),
          },
          // {
          //   path: "dept",
          //   name: "dept",
          //   meta: {
          //     title: "部门管理",
          //   },
          //   component: () => import("../views/System/Dept.vue"),
          // },
          // {
          //   path: "post",
          //   name: "post",
          //   meta: {
          //     title: "岗位管理",
          //   },
          //   component: () => import("../views/System/Post.vue"),
          // },
          // {
          //   path: "dict",
          //   name: "dict",
          //   meta: {
          //     title: "字典管理",
          //   },
          //   component: () => import("../views/System/Dict.vue"),
          // },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "*",
    meta: {
      title: "404",
    },
    component: () => import("../views/Error.vue"),
  },
];

export default routes;
