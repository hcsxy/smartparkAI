<template>
  <view class="page">
    <view class="list" v-if="list.length">
      <view class="item" v-for="h in list" :key="h.id" @click="openDetail(h)">
        <view class="item-head">
          <text class="title">{{ h.title }}</text>
          <text class="status" :class="'st-' + h.status">{{ statusText(h.status) }}</text>
        </view>
        <view class="tags">
          <text class="tag">{{ catText(h.category) }}</text>
          <text class="tag" :class="{ major: h.level === 'major' }">{{ h.level === 'major' ? '重大' : '一般' }}</text>
          <text class="loc" v-if="h.location">{{ h.location }}</text>
        </view>
        <!-- 整改进度 -->
        <view class="steps">
          <view class="step" v-for="(s, i) in steps" :key="i" :class="{ done: stepIndex(h.status) >= i, active: stepIndex(h.status) === i }">
            <view class="dot"></view>
            <text class="step-t">{{ s }}</text>
          </view>
        </view>
        <view class="foot">
          <text class="no">{{ h.hazardNo }}</text>
          <text class="time">{{ short(h.createTime) }}</text>
        </view>
      </view>
    </view>
    <view class="empty" v-else>暂无上报记录</view>
    <button class="btn-new" @click="goReport">+ 上报隐患</button>
  </view>
</template>

<script>
import { myHazards } from '@/api/safety'

export default {
  data() {
    return {
      list: [],
      steps: ['上报', '整改中', '待复核', '已销号']
    }
  },
  onShow() {
    this.load()
  },
  methods: {
    async load() {
      try {
        this.list = await myHazards()
      } catch (e) {}
    },
    stepIndex(s) {
      return { reported: 0, overdue: 1, rectifying: 1, verifying: 2, closed: 3 }[s] ?? 0
    },
    statusText(s) {
      return { reported: '待整改', rectifying: '整改中', verifying: '待复核', closed: '已销号', overdue: '已逾期' }[s] || s
    },
    catText(c) {
      return { fire: '消防', electric: '用电', structure: '建筑', facility: '设施', security: '治安', environment: '环境', other: '其他' }[c] || c
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(0, 16) : ''
    },
    openDetail(h) {
      uni.showModal({
        title: h.title,
        content: '状态：' + this.statusText(h.status)
          + (h.assignee ? '\n责任人：' + h.assignee : '')
          + (h.deadline ? '\n整改期限：' + h.deadline : '')
          + (h.rectifyResult ? '\n整改结果：' + h.rectifyResult : '')
          + (h.verifyNote ? '\n复核意见：' + h.verifyNote : ''),
        showCancel: false
      })
    },
    goReport() {
      uni.navigateTo({ url: '/pages/safety/report' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.item { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14rpx; }
.title { font-size: 30rpx; font-weight: bold; color: #1f2d3d; flex: 1; }
.status { font-size: 24rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: #eef0f3; color: #606266; }
.st-reported { background: #e8f0fe; color: #1b4b91; }
.st-rectifying { background: #fff4e5; color: #e67e22; }
.st-verifying { background: #e8f0fe; color: #2f7cd6; }
.st-closed { background: #e7f4ea; color: #2e7d32; }
.st-overdue { background: #fdecea; color: #e53935; }
.tags { display: flex; align-items: center; gap: 12rpx; margin-bottom: 18rpx; }
.tag { font-size: 22rpx; padding: 2rpx 14rpx; border-radius: 16rpx; background: #f0f2f5; color: #606266; }
.tag.major { background: #fdecea; color: #e53935; }
.loc { font-size: 22rpx; color: #909399; }
.steps { display: flex; justify-content: space-between; margin: 10rpx 0 18rpx; }
.step { flex: 1; text-align: center; position: relative; }
.step .dot { width: 20rpx; height: 20rpx; border-radius: 50%; background: #dcdfe6; margin: 0 auto 8rpx; }
.step.done .dot { background: #2f7cd6; }
.step.active .dot { background: #1b4b91; box-shadow: 0 0 0 6rpx rgba(47,124,214,.2); }
.step-t { font-size: 22rpx; color: #909399; }
.step.done .step-t { color: #2f7cd6; }
.foot { display: flex; justify-content: space-between; font-size: 22rpx; color: #909399; }
.empty { text-align: center; color: #c0c4cc; padding: 120rpx 0; font-size: 28rpx; }
.btn-new { position: fixed; bottom: 40rpx; left: 24rpx; right: 24rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 30rpx; }
</style>
