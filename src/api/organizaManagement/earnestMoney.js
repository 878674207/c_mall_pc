import request from "@/utils/request";

// 查询【请填写功能名称】列表
export function listMoney(data) {
  return request({
    url: `/pc/money/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: "post",
    data: data,
  });
}

// 查询【请填写功能名称】详细
export function getMoney(id) {
  return request({
    url: "/pc/money/" + id,
    method: "get",
  });
}

// 新增【请填写功能名称】
export function addMoney(data) {
  return request({
    url: "/pc/money",
    method: "post",
    data: data,
  });
}

// 修改【请填写功能名称】
export function updateMoney(data) {
  return request({
    url: "/pc/money",
    method: "put",
    data: data,
  });
}

// 删除【请填写功能名称】
export function delMoney(id) {
  return request({
    url: "/pc/money/" + id,
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
