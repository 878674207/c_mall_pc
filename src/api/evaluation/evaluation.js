import request from '@/utils/request'

// 查询评价列表
export function listEvaluation(query) {
  return request({
    url: `/pc/evaluation/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: 'post',
    data: query
  })
}

// 查看评价对象下拉
export function evaluationObjectList() {
  return request({
    url: '/pc/evaluation/evaluationObjectList',
    method: 'get'
  })
}
// 查询评价详细
export function getEvaluation(id) {
  return request({
    url: '/pc/evaluation/' + id,
    method: 'get'
  })
}

// 导出
export function Evaluationexport(data) {
  return request({
    url: '/pc/evaluation/export',
    method: 'post',
    data: data
  })
}

// 删除评价
export function delEvaluation(id) {
  return request({
    url: '/pc/evaluation/' + id,
    method: 'delete'
  })
}

// 审核评价
export function auditEvaluation(data) {
  return request({
    url: '/pc/evaluation',
    method: 'put',
    data: data
  })
}
// 查看所属品牌下拉
export function queryBrandList() {
  return request({
    url: '/pc/evaluation/queryBrandList',
    method: 'get'
  })
}
