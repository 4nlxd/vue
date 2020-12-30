import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'backend/lottery/withdraw/list',
    method: 'get',
    params
  })
}
export function recharge(params) {
  return request({
    url: 'backend/finance/charge/stat',
    method: 'get',
    params
  })
}
export function rechargequery(params) {
  return request({
    url: 'backend/finance/charge/detail/stat',
    method: 'get',
    params
  })
}
export function balance(params) {
  return request({
    url: 'backend/finance/balance/stat',
    method: 'get',
    params
  })
}
export function balancequery(params) {
  return request({
    url: 'backend/finance/balance/detail/stat',
    method: 'get',
    params
  })
}

export function withdraw(params) {
  return request({
    url: 'backend/lottery/withdraw/handler',
    method: 'get',
    params
  })
}



