import request from '@/utils/request'

/** 我的消息分页 */
export function myNotify(current = 1, size = 10, notifyType) {
  return request({ url: '/notify/mine', method: 'GET', data: { current, size, notifyType } })
}

/** 未读数 */
export function unreadCount() {
  return request({ url: '/notify/unread', method: 'GET' })
}

/** 标记已读 */
export function markRead(id) {
  return request({ url: `/notify/${id}/read`, method: 'PUT' })
}

/** 全部已读 */
export function markAllRead() {
  return request({ url: '/notify/read-all', method: 'PUT' })
}
