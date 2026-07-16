import request from '@/utils/request'

/** WiFi 服务入口 */
export function portalWifi() {
  return request({ url: '/network/portal/wifi', method: 'GET' })
}

/** 园区服务聚合入口 */
export function portalServices() {
  return request({ url: '/network/portal/services', method: 'GET' })
}
