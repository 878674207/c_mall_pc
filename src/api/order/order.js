import request from "@/utils/request";

// 查询订单列表
export function listOrder(query) {
  return request({
    url: `/pc/intention-order/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: "post",
    data: query,
  });
}

// 查询订单详细
export function getorder(id) {
  return request({
    url: "/pc/intention-order/" + id,
    method: "get",
  });
}

// 导出
export function Evaluationexport(data) {
  return request({
    url: "/pc/evaluation/export",
    method: "post",
    data: data,
  });
}

// 删除订单
export function delOrder(id) {
  return request({
    url: "/pc/intention-order/" + id,
    method: "delete",
  });
}
export function refOrder(data) {
  return request({
    url: "/custom/intention-order/update",
    method: "post",
    data: data,
  });
}
export function appOrder(data) {
  return request({
    url: "/pc/intention-order/refund/approve",
    method: "post",
    data: data,
  });
}
// 商城订单 订单列表查询接口
export function orderUpdate(data) {
  return request({
    url: "/b/order/page-list",
    method: "post",
    data: data,
  });
}
// 商城订单 订单列表查询接口
export function listfterSsales(data) {
  return request({
    url: "/b/after-sales/page-list",
    method: "post",
    data: data,
  });
}
// 删除订单
export function afterSsalesdetail(id) {
  return request({
    url: "/b/after-sales/detail/" + id,
    method: "get",
  });
}
// 商城订单 售后添加备注
export function addremark(data) {
  return request({
    url: "/b/after-sales/add/remark",
    method: "post",
    data: data,
  });
}
// 详情页面接口
export function orderDetail(id) {
  return request({
    url: "/b/order/detail/" + id,
    method: "get",
  });
}
// 确认发货接口
export function confirmDelivery(data) {
  return request({
    url: '/b/order/confirm-delivery/' + data,
    method: 'put',
    data: data
  })
}
// 订单列表添加备注接口
export function addOrderRemark(data) {
  return request({
    url: "/b/order/add/remark",
    method: "post",
    data: data,
  });
}
// 订单列表添加备注接口
export function afterdeal(data) {
  return request({
    url: "/b/after-sales/deal",
    method: "post",
    data: data,
  });
}
