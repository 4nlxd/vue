import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'backend/admin/login',
    method: 'get',
    params:data
  })
}

export function logout() {
  return request({
    url: 'backend/admin/logout',
    method: 'post'
  })
}
