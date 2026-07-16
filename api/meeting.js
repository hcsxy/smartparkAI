import request from '@/utils/request'

/** 会议室列表 */
export function listRooms(params = {}) {
  return request({ url: '/meeting/rooms', method: 'GET', data: params })
}

/** 某会议室某日预约(时段占用) */
export function dayBookings(roomId, date) {
  return request({ url: `/meeting/room/${roomId}/day`, method: 'GET', data: { date } })
}

/** 预约会议室 */
export function book(data) {
  return request({ url: '/meeting/book', method: 'POST', data })
}

/** 取消预约 */
export function cancelBooking(id) {
  return request({ url: `/meeting/booking/${id}/cancel`, method: 'PUT' })
}

/** 签到 */
export function checkinBooking(id) {
  return request({ url: `/meeting/booking/${id}/checkin`, method: 'PUT' })
}

/** 我的预约 */
export function myBookings() {
  return request({ url: '/meeting/booking/mine', method: 'GET' })
}
