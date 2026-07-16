<template>
  <view class="page">
    <view class="head-bar" v-if="list.length">
      <text class="unread">未读 {{ unread }}</text>
      <text class="link" @click="readAll">全部已读</text>
    </view>
    <view v-if="list.length === 0" class="empty">暂无消息</view>
    <view class="msg-card" :class="{ unread: n.readFlag !== 1 }" v-for="n in list" :key="n.id" @click="open(n)">
      <view class="msg-top">
        <text class="tag" :class="n.notifyType">{{ typeText(n.notifyType) }}</text>
        <text class="time">{{ n.createTime }}</text>
      </view>
      <view class="msg-title">{{ n.title }}</view>
      <view class="msg-content">{{ n.content }}</view>
    </view>
  </view>
</template>

<script>
import { myNotify, unreadCount, markRead, markAllRead } from '@/api/notify'

const TYPES = { notice: '公告', alarm: '告警', meeting: '会议室', workorder: '工单', visitor: '访客', parking: '停车', system: '系统' }

export default {
  data() {
    return { list: [], unread: 0 }
  },
  onShow() {
    this.load()
  },
  methods: {
    typeText(v) {
      return TYPES[v] || v
    },
    async load() {
      const res = await myNotify(1, 30)
      this.list = (res && res.records) || []
      this.unread = await unreadCount()
    },
    async open(n) {
      if (n.readFlag !== 1) {
        await markRead(n.id)
        n.readFlag = 1
        this.unread = Math.max(0, this.unread - 1)
      }
      uni.showModal({ title: n.title, content: n.content, showCancel: false })
    },
    async readAll() {
      await markAllRead()
      this.list.forEach(n => (n.readFlag = 1))
      this.unread = 0
      uni.showToast({ title: '已全部标记' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.head-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.unread { font-size: 26rpx; color: #f56c6c; }
.link { font-size: 26rpx; color: #1b4b91; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
.msg-card { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.msg-card.unread { border-left: 6rpx solid #f56c6c; }
.msg-top { display: flex; justify-content: space-between; align-items: center; }
.tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: #ecf5ff; color: #409eff; }
.tag.alarm { background: #fef0f0; color: #f56c6c; }
.tag.meeting { background: #e8f5e9; color: #43a047; }
.tag.workorder { background: #fdf6ec; color: #e6a23c; }
.time { font-size: 22rpx; color: #c0c4cc; }
.msg-title { font-size: 30rpx; font-weight: bold; color: #303133; margin-top: 14rpx; }
.msg-content { font-size: 26rpx; color: #606266; margin-top: 10rpx; line-height: 1.5; }
</style>
