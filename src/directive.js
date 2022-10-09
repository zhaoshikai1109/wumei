// 全局自定义指令

import Vue from "vue"
import store from "./store"

Vue.directive("permission",{
    inserted(el,{value}){
        let permission = store.state.permission;
        if(!permission) permission=[]
        if(!value) return
        if(!permission.includes(value)){
            //不具备权限
            el.parentNode.removeChild(el)
        }

    }
})