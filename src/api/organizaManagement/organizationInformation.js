import request from "@/utils/request";

// 查询机构基本信息列表
export function listInstitution(data) {
  return request({
    url: `/pc/institution/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: "post",
    data: data,
  });
}

// 查询机构基本信息详细
export function getInstitution(id) {
  return request({
    url: "/pc/institution/" + id,
    method: "get",
  });
}

// 新增机构基本信息
export function addInstitution(data) {
  return request({
    url: "/pc/institution",
    method: "post",
    data: data,
  });
}

// 修改机构基本信息
export function updateInstitution(data) {
  return request({
    url: "/pc/institution",
    method: "put",
    data: data,
  });
}

// 删除机构基本信息
export function delInstitution(id) {
  return request({
    url: "/pc/institution/" + id,
    method: "delete",
  });
}
//查询省市区
export function getAddressList(data) {
  return request({
    url: "custom/location/query",
    method: "post",
    data: data,
  });
}
//查询经营信息
export function getBussinInfo(data) {
  return request({
    url: "system/dict/data/list",
    method: "post",
    data: data,
  });
}
//查询套餐列表
export function getPackageList(data) {
  return request({
    url: "pc/meal/my/list",
    method: "post",
    data: data,
  });
}
//查询意向金列表
export function getOfferList(data) {
  return request({
    url: "pc/money/my/list",
    method: "post",
    data: data,
  });
}
//提交按钮接口
export function saveList(data) {
  return request({
    url: "pc/institution/store/save",
    method: "post",
    data: data,
  });
}
//提交按钮接口
export function shopDetail(params) {
  return request({
    url: "pc/institution/store/" + params,
    method: "get",
  });
}
//审批接口
export function submitApprove(data) {
  return request({
    url: "pc/institution/approve",
    method: "post",
    data: data,
  });
}

//审批接口
export function statusupdate(data) {
  return request({
    url: "pc/institution/status/update",
    method: "post",
    data: data,
  });
}
