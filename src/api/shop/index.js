import request from '@/utils/request'

// 查询列表
export function categorypagelist(query) {
    return request({
        url: `/b/product/category/page-list`,
        method: 'post',
        data: query
    })
}
// 查询列表
export function categorylist(parentId) {
    return request({
        url: `/b/product/category/list/${parentId}`,
        method: 'get'
    })
}
// 修改
export function bcategorysave(data) {
    return request({
        url: `/b/product/category/save`,
        method: 'post',
        data: data
    })
}
// 删除
export function bcategorydelete(id) {
    return request({
        url: `/b/product/category/delete/${id}`,
        method: 'delete'
    })
}
// 查询列表
export function battributelist(query) {
    return request({
        url: `/b/product/attribute-category/page-list`,
        method: 'post',
        data: query
    })
}
// 修改
export function battributesave(data) {
    return request({
        url: `/b/product/attribute-category/save`,
        method: 'post',
        data: data
    })
}
// 删除
export function battributedelete(id) {
    return request({
        url: `/b/product/attribute-category/delete/${id}`,
        method: 'delete'
    })
}
// 查询列表
export function battribute2list(query) {
    return request({
        url: `/b/product/attribute/page-list`,
        method: 'post',
        data: query
    })
}
// 修改
export function battribute2save(data) {
    return request({
        url: `/b/product/attribute/save`,
        method: 'post',
        data: data
    })
}
// 删除
export function battribute2delete(id) {
    return request({
        url: `/b/product/attribute/delete/${id}`,
        method: 'delete'
    })
}
// 查询列表
export function pstorepage(query) {
    let params = ''
    for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
            const element = query[key];
            if (element !== null && element !== '') {
                params = params + `${key}=${element}&`
            }
        }
    }
    return request({
        url: `/p/store/page?${params}`,
        method: 'get',
        data: query
    })
}
// 修改
export function psaveStore(data) {
    return request({
        url: `/p/store/saveStore`,
        method: 'post',
        data: data
    })
}
// 查看详情
export function pselectById(id) {
    return request({
        url: `/p/store/selectById?id=${id}`,
        method: 'get'
    })
}
// 查看详情
export function storeforbid(query) {
    let params = ''
    for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
            const element = query[key];
            if (element !== null && element !== '') {
                params = params + `${key}=${element}&`
            }
        }
    }
    return request({
        url: `/p/store/forbid?${params}`,
        method: 'get'
    })
}
export function bcurrentStoreInfo(id) {
    return request({
        url: `/b/store/currentStoreInfo`,
        method: 'get'
    })
}
export function bupdateStore(data) {
    return request({
        url: `/b/store/updateStore`,
        method: 'post',
        data: data
    })
}



