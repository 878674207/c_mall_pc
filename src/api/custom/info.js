import request from "@/utils/request";

// 查询资讯管理列表
export function listInfo(query) {
  return request({
    url: "/custom/info/list",
    method: "get",
    params: query,
  });
}

// 查询资讯管理详细
export function getInfo(id) {
  return request({
    url: "/custom/info/" + id,
    method: "get",
  });
}

// 新增资讯管理
export function addInfo(data) {
  return request({
    url: "/custom/info",
    method: "post",
    data: data,
  });
}

// 修改资讯管理
export function updateInfo(data) {
  return request({
    url: "/custom/info",
    method: "put",
    data: data,
  });
}

// 删除资讯管理
export function delInfo(id) {
  return request({
    url: "/custom/info/" + id,
    method: "delete",
  });
}
export function downLoadImg(params) {
  return request({
    url: "/file/download",
    params,
    method: "get",
    responseType: "arraybuffer",
  });
}
