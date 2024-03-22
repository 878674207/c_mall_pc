import request from '@/utils/request'

// 查询订单列表
export function listwechat(query) {
  return request({
    url: `/pc/wechat/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: 'post',
    data: query
  })
}

// 查询订单详细
export function getwechatid(id) {
  return request({
    url: '/pc/wechat/' + id,
    method: 'get'
  })
}

// 删除订单
export function delwechat(id) {
  return request({
    url: '/pc/wechat/' + id,
    method: 'delete'
  })
}

// 新增
export function wechatadd(data) {
  return request({
    url: `/pc/wechat-user/add`,
    method: 'post',
    data: data
  })
}
// 修改
export function wechatupdate(data) {
  return request({
    url: `/pc/wechat-user/update`,
    method: 'post',
    data: data
  })
}

// 查询列表
export function withoutlist(query) {
  return request({
    url: `/pc/wechat-user/without-sale/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: 'post',
    data: query
  })
}
// 修改
export function managerlist(data) {
  return request({
    url: `/pc/sale/user/manager-list`,
    method: 'post',
    data: data
  })
}
// 修改
export function managerassign(data) {
  return request({
    url: `/pc/wechat-user/assign`,
    method: 'post',
    data: data
  })
}

// 查询列表
export function withoutsalelist(query) {
  return request({
    url: `/pc/wechat-user/with-sale/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: 'post',
    data: query
  })
}

// 查询列表
export function userdetail(id) {
  return request({
    url: `/pc/wechat-user/detail/${id}`,
    method: 'get',
  })
}
// 查询列表
export function complaintlist(query) {
  return request({
    url: `/pc/complaint/page-list`,
    method: 'post',
    data: query
  })
}
// 查询列表
export function complaintdetail(id) {
  return request({
    url: `/pc/complaint/detail/${id}`,
    method: 'get',
  })
}
// 查询列表
export function complaintreply(query) {
  return request({
    url: `/pc/complaint/reply`,
    method: 'post',
    data: query
  })
}
