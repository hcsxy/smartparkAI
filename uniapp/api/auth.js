import request from '@/utils/request'

/** 微信小程序登录：code 换取会话 */
export function loginByWechat(code) {
  return request({
    url: '/auth/login/wechat',
    method: 'POST',
    data: { code, type: 'wechat_mp', clientType: 'miniapp' }
  })
}

/** 短信验证码登录 */
export function loginBySms(mobile, code) {
  return request({
    url: '/auth/login/sms',
    method: 'POST',
    data: { mobile, code, clientType: 'miniapp' }
  })
}

/** 发送验证码 */
export function sendCaptcha(target) {
  return request({
    url: '/auth/captcha/send',
    method: 'POST',
    data: { target, channel: 'sms', scene: 'login' }
  })
}

/** MFA 二次验证 */
export function verifyMfa(mfaToken, code) {
  return request({
    url: '/auth/mfa/verify',
    method: 'POST',
    data: { mfaToken, code }
  })
}
