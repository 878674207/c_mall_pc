import request from "@/utils/request";

// 查询组织列表
export function queryOrganization(data) {
  return request({
    url: "pc/organization/list",
    method: "post",
    data: data,
  });
}

// // 查询组织列表（排除节点）
// export function listDeptExcludeChild(deptId) {
//   return request({
//     url: "/system/dept/list/exclude/" + deptId,
//     method: "get",
//   });
// }

// // 查询组织详细
// export function getDept(deptId) {
//   return request({
//     url: "/system/dept/" + deptId,
//     method: "get",
//   });
// }

// 新增组织
export function addOrganization(data) {
  return request({
    url: "pc/organization/add",
    method: "post",
    data: data,
  });
}

// 修改组织
export function updateOrganization(data) {
  return request({
    url: "pc/organization/update",
    method: "post",
    data: data,
  });
}

// 删除组织
export function delOrganization(deptId) {
  return request({
    url: "pc/organization/delete/" + deptId,
    method: "delete",
  });
}
