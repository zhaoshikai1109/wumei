import http from "./http";

//获取部门列表
const queryDeparList = () => {
  return http.get("/prod-api/system/dept/treeselect");
};

// 部门员工列表请求
const queryUserList = (params) => {
  return http.get("/prod-api/system/user/list", { params });
};

// System下角色管理请求
const queryRoleList = ( params)=>{


    return http.get("/prod-api/system/role/list",{params})
}

// 菜单管理数据请求
const queryMenuList =  (menuName,status)=> {
    return http.get("/prod-api/system/menu/list",{
        params:{
            menuName,
            status
        }
    });
}
export default {
  queryUserList,
  queryDeparList,
  queryRoleList,
  queryMenuList
};
