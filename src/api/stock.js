import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'goods/list',
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
export function goodsStatusUpdate(params) {
  return request({
    url: 'goods/status/update',
    method: 'get',
    params
  })
}




