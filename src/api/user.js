import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'admin/login',
    method: 'post',
    data:data
  })
}

export function logout() {
  return request({
    url: 'backend/admin/logout',
    method: 'post'
  })
}
