import http from "./http";

//Template通用物模型信息
// const getTemplateList = (pageNum = 1, pageSize = 10) => {
//   return http.get("/prod-api/iot/template/list", {
//     params: {
//       pageNum,
//       pageSize,
//     },
//   });
// };
//获取模型详细信息
const queryTemplateInfo = (templateId) =>
  http.get(`/prod-api/iot/template/${templateId}`);
/*修改和新增和搜索请求 */
const updateTemplate = (data) => http.put("/prod-api/iot/template", data);
const insertTemplate = (data) => http.post("/prod-api/iot/template", data);
const handlerTemplateSearch = (params) =>
  http.get("/prod-api/iot/template/list", { params });

//category产品分类信息
// const getCategoryList = (pageNum = 1, pageSize = 10) => {
//   return http.get("/prod-api/iot/category/list", {
//     params: {
//       pageNum,
//       pageSize,
//     },
//   });
// };
//获取分类详细信息
const queryCategoryInfo = (categoryId) =>
  http.get(`/prod-api/iot/category/${categoryId}`);
/*修改和新增和搜索请求 */
const updateCategory = (data) => http.put("/prod-api/iot/category", data);
const insertCategory = (data) => http.post("/prod-api/iot/category", data);
const handlerCategorySearch = (params) =>
  http.get("/prod-api/iot/category/list", { params });
//获取product产品分类信息
const getProductList = (params) => {
  return http.get("/prod-api/iot/product/list", { params });
};

//产品发布
const changeProductStatus = (params) => {
  return http.put("/prod-api/iot/product/status/", params);
};

//firmware固件信息
// const getFirmwareList=(pageNum=1,pageSize=10)=>{
//   return http.get('/prod-api/iot/firmware/list',{
//       params: {
//           pageNum,
//           pageSize,
//       }
//   })}
//获取分类详细信息
const queryFirmwareInfo = (firmwareId) =>
  http.get(`/prod-api/iot/firmware/${firmwareId}`);
/*修改和新增和搜索请求 */
const updateFirmware = (data) => http.put("/prod-api/iot/firmware", data);
const insertFirmware = (data) => http.post("/prod-api/iot/firmware", data);
const handlerFirmwareSearch = (params) =>
  http.get("/prod-api/iot/firmware/list", { params });

//group分组信息
// const getGroupList=(pageNum=1,pageSize=10)=>{
//   return http.get('https://iot.wumei.live/prod-api/iot/group/list',{
//       params: {
//           pageNum,
//           pageSize,
//       }
//   })}
//获取分类详细信息
const queryGroupInfo = (groupId) => http.get(`/prod-api/iot/group/${groupId}`);
/*修改和新增和搜索请求 */
const updateGroup = (data) => http.put("/prod-api/iot/group", data);
const insertGroup = (data) => http.post("/prod-api/iot/group", data);
const handlerGroupSearch = (params) =>
  http.get("/prod-api/iot/group/list", { params });
//group
//获取分类详细信息
const queryDeviceInfo = (deviceId) =>
  http.get(`/prod-api/iot/device/${deviceId}`);
/*修改和新增和搜索请求 */
const updateDevice = (data) => http.put("/prod-api/iot/device", data);
const insertDevice = (data) => http.post("/prod-api/iot/device", data);
const handlerDeviceSearch = (params) =>
  http.get("/prod-api/iot/device/shortList", { params });

//group弹框表格信息
const handlerListByGroupSearch = (pageNum = 1, pageSize = 10, deviceName="",userId = 6) =>
  http.get("/prod-api/iot/device/listByGroup", {
    params: {
      pageNum,
      pageSize,
      deviceName,
      userId,
    },
  });
//我的分组添加设备
const updateDeviceGroups = (params) =>
  http.put("/prod-api/iot/group/updateDeviceGroups",  params );


//获取我的分组列表
const queryMyGroup = (params) =>
  http.get("/prod-api/iot/group/list", { params });



//alertLog告警
const handlerAlertLogSearch = (params) =>
  http.get("/prod-api/iot/alertLog/list", { params });

//ClientDetails信息
//获取分类详细信息
const queryclientDetailsInfo = (clientId) =>
  http.get(`https://iot.wumei.live/prod-api/iot/clientDetails/${clientId}`);
/*修改和新增和搜索请求 */
const updateClientDetails = (data) =>
  http.put("https://iot.wumei.live/prod-api/iot/clientDetails", data);
const insertClientDetails = (data) =>
  http.post("https://iot.wumei.live/prod-api/iot/clientDetails", data);
const handleClientDetailsSearch = (params) =>
  http.get("https://iot.wumei.live/prod-api/iot/clientDetails/list", {
    params,
  });
export default {
  // getTemplateList,
  queryTemplateInfo,
  updateTemplate,
  insertTemplate,
  handlerTemplateSearch,
  // getCategoryList,
  queryCategoryInfo,
  updateCategory,
  insertCategory,
  handlerCategorySearch,
  getProductList,
  changeProductStatus,
  // getFirmwareList,
  queryFirmwareInfo,
  updateFirmware,
  insertFirmware,
  handlerFirmwareSearch,
  // getGroupList
  queryGroupInfo,
  updateGroup,
  insertGroup,
  handlerGroupSearch,
  queryDeviceInfo,
  updateDevice,
  insertDevice,
  handlerDeviceSearch,
  queryMyGroup,
  handlerListByGroupSearch,
  updateDeviceGroups,
  handlerAlertLogSearch,
  queryclientDetailsInfo,
  updateClientDetails,
  insertClientDetails,
  handleClientDetailsSearch,
};
