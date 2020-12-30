import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'backend/lottery/battle/forecast/list',
    method: 'get',
    params
  })
}
export function forcecast(params) {
  return request({
    url: 'backend/lottery/battle/forcecast/stat',
    method: 'get',
    params
  })
}
export function forcecastAdd(data) {
  return request({
    url: 'backend/lottery/battle/forcecast/add',
    method: 'post',
    data
  })
}
export function forcecastPayback(params) {
  return request({
    url: 'backend/lottery/battle/forcecast/payback',
    method: 'post',
    params
  })
}
