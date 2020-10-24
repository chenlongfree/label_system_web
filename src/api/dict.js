import request from '@/utils/request'

export function tree(params) {
  return request({
    url: `/sys/dict/tree/${params}`,
    method: 'get'
  })
}

export function map(params) {
  return request({
    url: `/sys/dict/map/${params}`,
    method: 'get'
  })
}
