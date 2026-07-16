// 统一请求封装（微信小程序 / Uniapp）
// 开发环境：本地后端地址
// 生产环境：修改为实际的域名
const BASE_URL = 'http://localhost:8080/api'

// 是否启用调试日志（开发时设为 true，生产环境改为 false）
const DEBUG = true

function request(options) {
  const token = uni.getStorageSync('accessToken')
  const url = BASE_URL + options.url
  
  if (DEBUG) {
    console.log('========== API 请求 ==========')
    console.log('URL:', url)
    console.log('Method:', options.method || 'GET')
    console.log('Data:', JSON.stringify(options.data))
    console.log('Token:', token ? '已存在' : '未登录')
    console.log('============================')
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      success: (res) => {
        if (DEBUG) {
          console.log('========== API 响应 ==========')
          console.log('Status:', res.statusCode)
          console.log('Response:', JSON.stringify(res.data))
          console.log('============================')
        }
        
        const body = res.data
        
        // 处理非 JSON 响应
        if (typeof body !== 'object' || body === null) {
          console.error('响应格式错误:', body)
          uni.showToast({ title: '服务器响应格式错误', icon: 'none' })
          reject(new Error('Invalid response format'))
          return
        }
        
        if (body.code === 200) {
          resolve(body.data)
        } else if (body.code === 401 || body.code === 1005 || body.code === 1006) {
          if (DEBUG) console.log('Token 失效，跳转登录页')
          uni.removeStorageSync('accessToken')
          uni.reLaunch({ url: '/pages/login/login' })
          reject(body)
        } else {
          const errMsg = body.message || '请求失败'
          if (DEBUG) console.error('业务错误:', errMsg, body)
          uni.showToast({ title: errMsg, icon: 'none', duration: 2000 })
          reject(body)
        }
      },
      fail: (err) => {
        if (DEBUG) {
          console.log('========== API 失败 ==========')
          console.error('Error:', err)
          console.error('Error Type:', err.errMsg || 'Unknown')
          console.log('============================')
        }
        
        let errMsg = '网络异常'
        if (err.errMsg) {
          if (err.errMsg.includes('timeout')) {
            errMsg = '请求超时，请检查网络'
          } else if (err.errMsg.includes('fail')) {
            errMsg = '连接失败，请确认后端服务已启动'
          }
        }
        
        uni.showToast({ title: errMsg, icon: 'none', duration: 2000 })
        reject(err)
      }
    })
  })
}

export default request
