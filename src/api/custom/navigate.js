import request from '@/utils/request'


// 状态修改
export function changeNavigateStatus(id, status) {
    const data = {
        id,
        status
    }
    return request({
        url: '/custom/navigate',
        method: 'put',
        data: data
    })
}

// 查询页面导航管理列表
export function listNavigate(query) {
    return request({
        url: '/custom/navigate/list',
        method: 'get',
        params: query
    })
}

// 查询页面导航管理详细
export function getNavigate(id) {
    return request({
        url: '/custom/navigate/' + id,
        method: 'get'
    })
}

// 新增页面导航管理
export function addNavigate(data) {
    return request({
        url: '/custom/navigate',
        method: 'post',
        data: data
    })
}

// 修改页面导航管理
export function updateNavigate(data) {
    return request({
        url: '/custom/navigate',
        method: 'put',
        data: data
    })
}

// 删除页面导航管理
export function delNavigate(id) {
    return request({
        url: '/custom/navigate/' + id,
        method: 'delete'
    })
}
