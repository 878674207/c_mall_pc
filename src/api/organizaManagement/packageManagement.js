import request from "@/utils/request";

// 查询【请填写功能名称】列表
export function listMeal(data) {
  return request({
    url: `/pc/meal/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: "post",
    data: data,
  });
}

// 查询【请填写功能名称】详细
export function getMeal(id) {
  return request({
    url: "/pc/meal/" + id,
    method: "get",
  });
}

// 新增【请填写功能名称】
export function addMeal(data) {
  return request({
    url: "/pc/meal",
    method: "post",
    data: data,
  });
}
//查看套餐详情
export function infoMeal(id) {
  return request({
    url: "/pc/meal/" + id,
    method: "get",
  });
}

// 修改【请填写功能名称】
export function updateMeal(data) {
  return request({
    url: "/pc/meal",
    method: "put",
    data: data,
  });
}

// 删除【请填写功能名称】
export function delMeal(id) {
  return request({
    url: "/pc/meal/" + id,
    method: "delete",
  });
}
//品牌列表接口
export function getBrandList(params) {
  return request({
    url: "/pc/evaluation/queryBrandList",
    method: "get",
    params,
  });
}
