import { eventBus } from '../../utils/event-bus'
import type { IAppOption } from '../../app'

const app = getApp<IAppOption>()

Page({
  data: {
    statusBarHeight: 44,
    isOnboarded: false,
    monthlySalary: '0',
    hourlyRate: '0.00',
    secondRate: '0.0000',
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight })
  },

  onShow() {
    this.setData({ isOnboarded: app.globalData.isOnboarded })
    this.refreshRates()
  },

  refreshRates() {
    const engine = app.globalData.engine
    if (!engine) return

    const config = engine.getConfig()
    const rates = engine.getRates()

    this.setData({
      monthlySalary: config.monthlySalary.toLocaleString(),
      hourlyRate: rates.hourlyRate.toFixed(2),
      secondRate: rates.secondRate.toFixed(4),
    })
  },

  goSalarySetting() {
    wx.showToast({ title: '薪资设置开发中', icon: 'none' })
  },

  goTheme() {
    wx.showToast({ title: '主题装扮开发中', icon: 'none' })
  },

  goReminder() {
    wx.showToast({ title: '提醒偏好开发中', icon: 'none' })
  },

  onClearData() {
    wx.showModal({
      title: '确认清空',
      content: '将清除所有数据并重新进入引导流程，此操作不可恢复',
      confirmText: '确认清空',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          eventBus.emit('data:cleared')
          wx.reLaunch({ url: '/pages/onboarding/welcome/welcome' })
        }
      },
    })
  },
})
