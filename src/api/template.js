import http from "./http";

//Template通用物模型信息
const getTemplateList = (pageNum = 1, pageSize = 10) => {
  return http.get("/prod-api/iot/template/list", {
    params: {
      pageNum,
      pageSize,
    },
  });
};

export default {
  getTemplateList,
};
