import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'goods/list',
    method: 'get',
    params
  })
}
export function storeroomAll(params) {
  return request({
    url: 'storeroom/all',
    method: 'get',
    params
  })
}
export function goodsAdd(data) {
  return request({
    url: 'goods/add',
    method: 'post',
    data
  })
}
export function goodsUpdate(data) {
  return request({
    url: 'goods/update',
    method: 'post',
    data
  })
}
export function goodsStockUpdate(data) {
  return request({
    url: 'goods/stock/update',
    method: 'post',
    data
  })
}
export function goodsStatusUpdate(data) {
  return request({
    url: 'goods/status/update',
    method: 'post',
    data
  })
}
export function goodsDetail(params) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params
  })
}
export function goodsStockhistoryList(params) {
  return request({
    url: 'goods/stockhistory/list',
    method: 'get',
    params
  })
}
export function goodsAllList(params) {
  return request({
    url: 'goods/all',
    method: 'get',
    params
  })
}



