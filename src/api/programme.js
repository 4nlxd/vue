import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/backend/lottery/scheme/pkg/list',
    method: 'get',
    params
  })
}
export function sumitHandler(data) {
  return request({
    url: 'backend/lottery/scheme/handler',
    method: 'post',
    data
  })
}
export function sumitPackageHandler(data) {
  return request({
    url: '/backend/lottery/scheme/package/handler',
    method: 'post',
    data
  })
}
export function schemeDisable(params) {
  return request({
    url: '/backend/lottery/scheme/disable',
    method:'get',
    params
  })
}
export function schemeDetail(params) {
  return request({
    url: '/backend/lottery/scheme/package/detail',
    method:'get',
    params
  })
}