import request from '@/utils/request'

/** 按车牌查询停车费用 */
export function queryFee(plateNo) {
  return request({ url: '/parking/fee', method: 'GET', data: { plateNo } })
}

/** 缴费 */
export function payParking(recordId, channel) {
  return request({ url: '/parking/pay', method: 'POST', data: { recordId, channel: channel || 'wechat' } })
}

/** 查询月卡 */
export function queryMonthly(plateNo) {
  return request({ url: '/parking/mini/monthly', method: 'GET', data: { plateNo } })
}

/** 月卡续费 */
export function renewMonthly(plateNo, ownerName, months, channel) {
  return request({
    url: '/parking/mini/monthly/renew',
    method: 'POST',
    data: { plateNo, ownerName: ownerName || '', months: months || 1, channel: channel || 'wechat' }
  })
}

/** 反向寻车 */
export function findVehicle(plateNo) {
  return request({ url: '/parking/mini/find', method: 'GET', data: { plateNo } })
}
