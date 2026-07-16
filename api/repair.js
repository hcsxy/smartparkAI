import request from '@/utils/request'

/** 提交报修 */
export function submitRepair(data) {
  return request({ url: '/workorder/repair', method: 'POST', data })
}

/** 我的报修 */
export function myRepairs() {
  return request({ url: '/workorder/my-repairs', method: 'GET' })
}
