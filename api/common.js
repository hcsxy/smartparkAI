import request from '@/utils/request'

/** 园区公告列表 */
export function noticeList(current = 1, size = 10, category) {
  return request({ url: '/system/notice/published', method: 'GET', data: { current, size, category } })
}

/** 公告详情 */
export function noticeDetail(id) {
  return request({ url: '/system/notice/view/' + id, method: 'GET' })
}

/** 楼层企业索引（已发布） */
export function enterpriseList(buildingId, keyword) {
  return request({ url: '/network/enterprise/published', method: 'GET', data: { buildingId, keyword } })
}

/** 我的通行记录 */
export function accessRecords(userId, current = 1, size = 10) {
  return request({ url: '/access/record/page', method: 'GET', data: { userId, current, size } })
}

/** 能耗账单（按楼栋+月份） */
export function energyBill(buildingId, month) {
  return request({ url: '/energy/bill', method: 'GET', data: { buildingId, month } })
}
