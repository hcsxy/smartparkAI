<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 检查登录状态
    const token = uni.getStorageSync('token')
    if (!token) {
      // 未登录跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/*全局样式*/
page {
  background-color: #F5F5F5;
}

/* 通用按钮样式 */
.btn-primary {
  background-color: #1890FF;
  color: #FFFFFF;
  border-radius: 4px;
}

.btn-default {
  background-color: #FFFFFF;
  color: #333333;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
}

/* 卡片样式 */
.card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 间距工具类 */
.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }
.ml-10 { margin-left: 10rpx; }
.mr-10 { margin-right: 10rpx; }
.p-20 { padding: 20rpx; }
.p-30 { padding: 30rpx; }

/* 文本样式 */
.text-center { text-align: center; }
.text-gray { color: #999999; }
.text-primary { color: #1890FF; }
.text-danger { color: #FF4D4F; }
.text-success { color: #52C41A; }

/* Flex 布局 */
.flex { display: flex; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-center { display: flex; justify-content: center; align-items: center; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
</style>
