import request from '@/utils/request'

export function ticketsOrder(params) {
  return request({
    url: 'backend/lottery/lps/order/stat',
    method: 'get',
    params
  })
}
export function ticketsOrderDetail(params) {
  return request({
    url: 'backend/lottery/lps/order/detail/stat',
    method: 'get',
    params
  })
}
export function accounting(params) {
  return request({
    url: 'backend/finance/accounting/stat',
    method: 'get',
    params
  })
}

export function queryAccountingDetail(params) {
  return request({
    url: 'backend/finance/accounting/detail/stat',
    method: 'get',
    params
  })
}