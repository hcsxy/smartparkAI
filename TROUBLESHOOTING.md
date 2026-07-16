# uniapp 登录和验证码问题排查指南

## 🔍 问题诊断步骤

### 1. 检查后端是否正常运行

打开浏览器访问：`http://localhost:8080/api/doc.html`

如果无法访问，说明后端未启动或端口被占用。

### 2. 检查网络请求是否发出

在微信开发者工具中：
1. 打开 **Network（网络）** 标签
2. 点击"发送验证码"按钮
3. 查看是否有请求发出

**可能的情况：**

#### 情况 A：没有看到任何请求
**原因：** 前端代码执行异常
**解决方案：** 检查 Console 控制台是否有错误

#### 情况 B：请求状态是 404
**原因：** 接口路径不正确
**解决方案：** 检查 BASE_URL 和接口路径

#### 情况 C：请求被取消或超时
**原因：** 网络连接问题或 CORS 跨域问题
**解决方案：** 
- 检查是否勾选"不校验合法域名"
- 确认后端允许跨域请求

#### 情况 D：请求返回 500 错误
**原因：** 后端服务异常
**解决方案：** 查看后端控制台日志

### 3. 使用浏览器直接测试接口

打开浏览器控制台，执行：

```javascript
// 测试发送验证码
fetch('http://localhost:8080/api/auth/captcha/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    target: '13800000201',
    channel: 'sms',
    scene: 'login'
  })
})
.then(res => res.json())
.then(data => console.log('响应:', data))
.catch(err => console.error('错误:', err))
```

**预期响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

同时后端控制台应该输出：
```
短信发送【模拟】：手机号=13800000201, 验证码=123456
```

## 🛠️ 常见问题及解决方案

### 问题 1：点击"发送验证码"无反应

**可能原因：**
1. 手机号格式验证失败
2. 倒计时未结束
3. JavaScript 代码异常

**解决方法：**
```javascript
// 在登录页面的 onSendCode 方法中添加调试日志
onSendCode() {
  console.log('点击发送验证码，手机号:', this.mobile)
  console.log('倒计时:', this.countdown)
  
  if (this.countdown > 0) {
    console.log('倒计时未结束')
    return
  }
  
  if (!/^1\d{10}$/.test(this.mobile)) {
    console.log('手机号格式错误')
    return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  }
  
  console.log('准备发送验证码请求')
  sendCaptcha(this.mobile).then(() => {
    console.log('验证码发送成功')
    uni.showToast({ title: '验证码已发送', icon: 'none' })
    this.startCountdown()
  }).catch(err => {
    console.error('验证码发送失败:', err)
  })
}
```

### 问题 2：请求返回"网络异常"

**原因：** `uni.request` 的 `fail` 回调被触发

**检查清单：**
- [ ] 后端服务是否启动（访问 http://localhost:8080/api/doc.html 测试）
- [ ] 微信开发者工具是否勾选"不校验合法域名"
  - 详情 → 本地设置 → 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
- [ ] BASE_URL 是否正确（应为 `http://localhost:8080/api`）
- [ ] 防火墙是否阻止了连接

### 问题 3：请求返回 401 Unauthorized

**原因：** Token 失效或权限不足

**解决方法：**
```javascript
// 清除本地存储的 token
uni.removeStorageSync('accessToken')
uni.removeStorageSync('refreshToken')

// 重新登录
```

### 问题 4：请求返回 500 Internal Server Error

**原因：** 后端服务异常

**排查步骤：**
1. 查看后端控制台日志
2. 检查数据库连接是否正常
3. 检查 Redis 是否启动
4. 查看后端配置文件

常见后端错误：
```
# Redis 连接失败
Unable to connect to Redis

# 数据库连接失败  
Failed to configure a DataSource

# 依赖注入失败
No qualifying bean of type
```

### 问题 5：验证码发送成功，但登录时提示"验证码错误"

**原因：** 
1. 验证码已过期（默认 5 分钟）
2. 验证码不正确
3. Redis 中的验证码未找到

**解决方法：**
1. 查看后端控制台输出的验证码：
   ```
   短信发送【模拟】：手机号=13800000201, 验证码=654321
   ```
2. 在小程序中输入完全相同的验证码（包括前导0）
3. 5分钟内完成登录
4. 确认 Redis 正常运行

### 问题 6：真机调试时无法连接

**原因：** localhost 只能在本机访问

**解决方法：**

1. 获取电脑局域网 IP：
   ```cmd
   # Windows 命令提示符
   ipconfig
   
   # 找到 IPv4 地址，例如：192.168.1.100
   ```

2. 修改 `utils/request.js`：
   ```javascript
   // 将 localhost 改为电脑的局域网 IP
   const BASE_URL = 'http://192.168.1.100:8080/api'
   ```

3. 确保手机和电脑在同一 WiFi 网络

4. 检查电脑防火墙设置：
   - Windows 防火墙 → 高级设置 → 入站规则
   - 添加 8080 端口的允许规则

## 🔧 调试增强版 request.js

创建一个增强版的请求工具，添加详细日志：

```javascript
// utils/request.js
const BASE_URL = 'http://localhost:8080/api'

function request(options) {
  const token = uni.getStorageSync('accessToken')
  const url = BASE_URL + options.url
  
  console.log('========== 请求开始 ==========')
  console.log('URL:', url)
  console.log('Method:', options.method || 'GET')
  console.log('Data:', options.data)
  console.log('Token:', token ? '存在' : '不存在')
  
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
        console.log('========== 请求成功 ==========')
        console.log('Status:', res.statusCode)
        console.log('Response:', res.data)
        
        const body = res.data
        if (body.code === 200) {
          console.log('业务成功')
          resolve(body.data)
        } else if (body.code === 401 || body.code === 1005 || body.code === 1006) {
          console.log('认证失败，跳转登录')
          uni.removeStorageSync('accessToken')
          uni.reLaunch({ url: '/pages/login/login' })
          reject(body)
        } else {
          console.log('业务失败:', body.message)
          uni.showToast({ title: body.message || '请求失败', icon: 'none' })
          reject(body)
        }
      },
      fail: (err) => {
        console.log('========== 请求失败 ==========')
        console.error('Error:', err)
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default request
```

## 📋 完整测试流程

### 步骤 1：确认环境
```bash
# 1. 检查 Java 后端是否运行
访问：http://localhost:8080/api/doc.html

# 2. 检查 Redis 是否运行
redis-cli ping
# 应返回：PONG

# 3. 检查数据库连接
# 查看后端启动日志，确认无数据库错误
```

### 步骤 2：测试验证码接口

使用 Postman 或浏览器测试：
```
POST http://localhost:8080/api/auth/captcha/send
Content-Type: application/json

{
  "target": "13800000201",
  "channel": "sms",
  "scene": "login"
}
```

预期响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

后端控制台输出：
```
短信发送【模拟】：手机号=13800000201, 验证码=123456
```

### 步骤 3：测试登录接口

```
POST http://localhost:8080/api/auth/login/sms
Content-Type: application/json

{
  "mobile": "13800000201",
  "code": "123456",
  "clientType": "miniapp"
}
```

预期响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "userId": 1,
    "username": "user001",
    "nickname": "测试用户"
  }
}
```

### 步骤 4：在小程序中测试

1. 打开微信开发者工具
2. 确认勾选"不校验合法域名"
3. 打开 Console 和 Network 标签
4. 输入手机号：13800000201
5. 点击"获取验证码"
6. 查看后端控制台获取验证码
7. 输入验证码
8. 点击"登录"
9. 观察 Network 标签的请求和响应

## 🎯 快速修复建议

如果以上所有检查都没问题，尝试这些快速修复：

### 修复 1：重启所有服务
```bash
# 1. 重启后端 Spring Boot 应用
# 2. 重启 Redis
# 3. 重启微信开发者工具
# 4. 清除小程序缓存：详情 → 清除缓存 → 清除全部缓存
```

### 修复 2：使用临时调试版本

在登录页面添加测试按钮：

```vue
<button @click="testApi">测试接口</button>

<script>
methods: {
  testApi() {
    console.log('开始测试接口...')
    
    // 测试发送验证码
    uni.request({
      url: 'http://localhost:8080/api/auth/captcha/send',
      method: 'POST',
      data: {
        target: '13800000201',
        channel: 'sms',
        scene: 'login'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('验证码接口响应:', res)
        if (res.data.code === 200) {
          uni.showToast({ title: '接口正常', icon: 'success' })
        }
      },
      fail: (err) => {
        console.error('验证码接口失败:', err)
        uni.showToast({ title: '接口异常：' + JSON.stringify(err), icon: 'none', duration: 3000 })
      }
    })
  }
}
</script>
```

### 修复 3：检查微信开发者工具设置

详情 → 本地设置：
- ✅ 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书
- ✅ 启用开发者工具网络调试
- ❌ 不要开启代理

## 📞 获取帮助

如果以上步骤都无法解决问题，请提供以下信息：

1. **Network 标签截图**（显示请求和响应）
2. **Console 标签截图**（显示错误信息）
3. **后端控制台日志**（最后 50 行）
4. **微信开发者工具版本**
5. **操作系统版本**

将这些信息发给技术支持团队进行深入排查。
