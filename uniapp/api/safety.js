import request from '@/utils/request'

/** 上报隐患 */
export function reportHazard(data) {
  return request({ url: '/safety/mini/hazard', method: 'POST', data })
}

/** 我上报的隐患 */
export function myHazards() {
  return request({ url: '/safety/mini/hazard/my', method: 'GET' })
}

/** 隐患详情 */
export function hazardDetail(id) {
  return request({ url: '/safety/mini/hazard/' + id, method: 'GET' })
}
