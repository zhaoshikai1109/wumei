import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store"
import {Message,Loading} from "element-ui"

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  routes,
});

//全局前置守卫
let LoadingIns 
router.beforeEach(async (to,from,next)=>{
  //登录态校验
  let profile=store.state.profile
  if(!profile&&to.path!=="/login"&&to.path!=="/register"&to.meta.title!=="404"){
    LoadingIns=Loading.service({
      background:"rgba(0,0,0,0.7)",
      text:"奴家正在努力加载中···"
    })
    profile=await store.dispatch("setProfileAsync")
    if(!profile){
      //当前用户是没有登录的 跳转到登录页 并且传递目标地址
      Message.error("您还未登录,请您先登录")
      next(`/login?to=${to.path}`)
    }
  }


  next()
})

// 全局后置守卫
router.afterEach(to=>{


  //关闭loading
  if(LoadingIns)LoadingIns.close()
})































export default router;