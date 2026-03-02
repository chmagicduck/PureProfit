import { storage } from '../../../utils/storage'
import type { SalaryConfig } from '../../../utils/engine'
import type { IAppOption } from '../../../app'

const app = getApp<IAppOption>()

type WorkDayMode = 'double' | 'alternate' | 'single'

const WORK_DAYS_MAP: Record<WorkDayMode, number> = {
  double: 22,
  alternate: 24,
  single: 26,
}

Page({
  data: {
    startTime: '09:00',
    endTime: '18:00',
    lunchBreakHours: 1,
    workDayMode: 'double' as WorkDayMode,
    payDay: 15,
    colorGold: '#FFB800',
    showStartPicker: false,
    showEndPicker: false,
  },

  pickStartTime() {
    wx.showActionSheet({
      itemList: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00'],
      success: (res) => {
        const times = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00']
        this.setData({ startTime: times[res.tapIndex] })
      },
    })
  },

  pickEndTime() {
    wx.showActionSheet({
      itemList: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '21:00'],
      success: (res) => {
        const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '21:00']
        this.setData({ endTime: times[res.tapIndex] })
      },
    })
  },

  onStartTimeChange(e: { detail: { value: string } }) {
    this.setData({ startTime: e.detail.value })
  },

  onEndTimeChange(e: { detail: { value: string } }) {
    this.setData({ endTime: e.detail.value })
  },

  onLunchChange(e: { detail: { value: number } }) {
    this.setData({ lunchBreakHours: e.detail.value })
  },

  setWorkDayMode(e: WechatMiniprogram.Event) {
    const mode = e.currentTarget.dataset.mode as WorkDayMode
    this.setData({ workDayMode: mode })
  },

  onPayDayInput(e: WechatMiniprogram.InputEvent) {
    let day = parseInt(e.detail.value, 10)
    if (isNaN(day)) day = 15
    day = Math.max(1, Math.min(31, day))
    this.setData({ payDay: day })
  },

  onNext() {
    const salary = wx.getStorageSync('_TEMP_SALARY') as number
    if (!salary) {
      wx.showToast({ title: '请先设置月薪', icon: 'none' })
      return
    }

    const { startTime, endTime, lunchBreakHours, workDayMode, payDay } = this.data
    const workDaysPerMonth = WORK_DAYS_MAP[workDayMode]

    // 计算日工时
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const totalWorkMinutes = (eh * 60 + em) - (sh * 60 + sm) - (lunchBreakHours * 60)
    const hoursPerDay = totalWorkMinutes / 60

    const config: SalaryConfig = {
      monthlySalary: salary,
      workDaysPerMonth,
      hoursPerDay,
      startTime,
      endTime,
      lunchBreakHours,
      workDayMode,
      payDay,
    }

    // 持久化配置
    storage.set(storage.KEYS.SALARY_CONFIG, config)
    storage.set(storage.KEYS.IS_ONBOARDED, true)

    // 初始化引擎
    app.initEngine(config)
    app.globalData.isOnboarded = true

    // 清理临时数据
    wx.removeStorageSync('_TEMP_SALARY')

    wx.navigateTo({ url: '/pages/onboarding/success/success' })
  },
})
