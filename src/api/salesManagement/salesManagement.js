import request from "@/utils/request";

// 查询组织列表
export function queryOrganization(data) {
  return request({
    url: "pc/organization/list",
    method: "post",
    data: data,
  });
}
//添加销售人员
export function addSale(data) {
  return request({
    url: "pc/sale/user/add",
    method: "post",
    data: data,
  });
}
//修改销售人员信息
export function updateSale(data) {
  return request({
    url: "pc/sale/user/update",
    method: "post",
    data: data,
  });
}
//查询销售人员列表
export function querySale(data) {
  return request({
    url: `pc/sale/user/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: "post",
    data: data,
  });
}
//查询销售详情
export function querySaleDetail(id) {
  return request({
    url: `pc/sale/user/detail/${id}`,
    method: "get",
  });
}
//查询绩效数量
export function queryPerforNums(data) {
  return request({
    url: `pc/sale/user/achievement`,
    method: "post",
    data: data,
  });
}
//获取所在团队排名
export function getRank(id) {
  return request({
    url: `pc/sale/user/team-rank/${id}`,
    method: "get",
  });
}
//查询该销售的营销转换率
export function queryRate(data) {
  return request({
    url: `pc/sale/user/conversionRate`,
    method: "post",
    data: data,
  });
}
//
