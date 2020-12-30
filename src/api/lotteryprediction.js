import request from '@/utils/request'

export function schemePkgList(params) {
  return request({
    url: '/backend/lottery/scheme/pkg/list',
    method: 'get',
    params
  })
}
export function schemeAdd(data) {
  return request({
    url: '/backend/lottery/scheme/package/add',
    method: 'post',
    data
  })
}
export function schemeDetail(params) {
  return request({
    url: '/backend/lottery/scheme/package/detail',
    method: 'get',
    params
  })
}

export function schemeUpdate(params) {
  return request({
    url: '/backend/lottery/scheme/package/update',
    method: 'get',
    params
  })
}

export function schemeList(params) {
  return request({
    url: '/backend/lottery/scheme/list',
    method: 'get',
    params
  })
}

export function matchList(params) {
  return request({
    url: 'backend/lottery/match/list',
    method: 'get',
    params
  })
}
export function schemeHandler(data) {
  return request({
    url: '/backend/lottery/scheme/add',
    method: 'post',
    data
  })
}
export function schemeHandlerUpdata(data) {
  return request({
    url: '/backend/lottery/scheme/update',
    method: 'post',
    data
  })
}
export function schemeDel(params) {
  return request({
    url: '/backend/lottery/scheme/del',
    method: 'get',
    params
  })
}
export function schemePackageIssue(params) {
  return request({
    url: '/backend/lottery/scheme/package/issue',
    method: 'get',
    params
  })
}
export function schemePackageperiod(params) {
  return request({
    url: '/backend/lottery/scheme/package/period',
    method: 'get',
    params
  })
}
export function schemePackagesalestate(params) {
  return request({
    url: '/backend/lottery/scheme/package/sale_state',
    method: 'get',
    params
  })
}
export function schemePackageRefund(params) {
  return request({
    url: '/backend/lottery/scheme/package/refund',
    method: 'get',
    params
  })
}
export function schemePackageMaxOdds(params) {
  return request({
    url: '/backend/lottery/scheme/package/maxOdds',
    method: 'get',
    params
  })
}