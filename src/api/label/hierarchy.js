import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/label/hierarchy/page',
    method: 'get',
    params
  })
}

export function get(params) {
  return request({
    url: `/label/hierarchy/get/${params}`,
    method: 'get'
  })
}
export function tree(params) {
  return request({
    url: `/label/hierarchy/tree/${params}`,
    method: 'get'
  })
}
