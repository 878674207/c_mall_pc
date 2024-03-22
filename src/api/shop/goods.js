import request from "@/utils/request";

// 查询列表
export function categorypagelist(query) {
  return request({
    url: `/b/product/page-list`,
    method: "post",
    data: query,
  });
}
// 查询列表
export function categorylist() {
  return request({
    url: `/b/product/category/with-children`,
    method: "get",
  });
}
// 上下架删除
export function batchOperate(data) {
  return request({
    url: `b/product/batch-operate`,
    method: "post",
    data: data,
  });
}
// 保存商品信息
export function productList(data) {
  return request({
    url: `/b/product/save`,
    method: "post",
    data: data,
  });
}
// 生成货号
export function getGenerate() {
  return request({
    url: `/b/product/sn/generate`,
    method: "get",
  });
}

// 商品属性列表接口
export function commoditiList() {
  return request({
    url: `b/product/attribute-category/all-list`,
    method: "get",
  });
}
// 商品单体详情接口
export function getListDetails(id) {
  return request({
    url: `b/product/attribute/all-list/${id}`,
    method: "get",
  });
}
//商品管理详情接口
export function getDetails(id) {
  return request({
    url: `b/product/detail/${id}`,
    method: "get",
  });
}

// 商品审核
export function bapprove(data) {
  return request({
    url: `/b/product/approve`,
    method: "post",
    data: data,
  });
}
// 查询sku列表
export function querySkuList(pid, params) {
  return request({
    url: `/sku/${pid}`,
    method: "get",
    params: params,
  });
}
// 查询sku列表
export function updateSkuStockList(data) {
  return request({
    url: `/sku/update`,
    method: "post",
    data: data,
  });
}
