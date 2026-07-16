import request from '@/utils/request'

/** 发起访客邀请 */
export function inviteVisitor(data) {
  return request({ url: '/visitor/invite', method: 'POST', data })
}

/** 我发起的邀请 */
export function myVisitors() {
  return request({ url: '/visitor/my', method: 'GET' })
}

/** 按二维码查询访客详情 */
export function getVisitorByQr(qr) {
  return request({ url: '/visitor/by-qr', method: 'GET', data: { qr } })
}
