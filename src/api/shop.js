import request from '@/utils/request'

export function orderList(params) {
  return request({
    url: 'order/list',
    method: 'get',
    params
  })
}

export function orderAdd(data) {
  return request({
    url: 'order/add',
    method: 'post',
    data
  })
}
export function orderDetail(params) {
  return request({
    url: 'order/detail',
    method: 'get',
    params
  })
}
export function orderInConfirml(params) {
  return request({
    url: 'order/in/confirm',
    method: 'get',
    params
  })
}
export function orderOutCancel(params) {
  return request({
    url: 'order/out/cancel',
    method: 'get',
    params
  })
}
export function orderOutConfirml(params) {
  return request({
    url: 'order/out/confirm',
    method: 'get',
    params
  })
}
export function orderOrganAll(params) {
  return request({
    url: 'organ/all',
    method: 'get',
    params
  })
}
export function orderUpdate(data) {
  return request({
    url: 'order/update',
    method: 'post',
    data
  })
}

