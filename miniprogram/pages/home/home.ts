import { Engine } from '../../utils/engine'
import { eventBus } from '../../utils/event-bus'
import type { IAppOption } from '../../app'
import type { WorkState } from '../../utils/state-machine'
import type { TodayEarnings, DerivedRates } from '../../utils/engine'

const app = getApp<IAppOption>()

interface TickPayload {
  earnings: TodayEarnings
  state: WorkState
  rates: DerivedRates
}

Page({
  data: {
    isOnboarded: false,
    statusBarHeight: 44,

    // 问候语
    greeting: '早安',

    // 收益数据
    totalEarningsDisplay: '0.0000',
    workEarningsDisplay: '0.00',
    slackEarningsDisplay: '0.00',

    // 月度
    monthTotalDisplay: '0.000',
    monthProgress: '0',
    monthProgressWidth: 0,

    // 状态
    currentState: 'working' as WorkState,

    // 热力图
    heatWork: 40,
    heatSlack: 15,
    heatCharge: 15,
    heatSleep: 20,
    workHours: '0.0',
    slackHours: '0.0',
    chargeHours: '0.0',

    // 倒计时
    countdownDisplay: '00:00:00',
    workdayProgress: 0,
    isOffWork: false,
    payDays: 0,
    weekendHint: '加油搬砖中',
  },

  tickHandler: null as ((payload: unknown) => void) | null,
  stateHandler: null as ((payload: unknown) => void) | null,

  onLoad() {
    // 初始化计数器
    (this as any)._tickCount = 0

    // 获取状态栏高度
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight })

    this.updateGreeting()
  },

  onShow() {
    const isOnboarded = app.globalData.isOnboarded
    this.setData({ isOnboarded })

    if (!isOnboarded) {
      wx.reLaunch({ url: '/pages/onboarding/welcome/welcome' })
      return
    }

    this.bindEvents()
    this.updateStaticData()
    this.updateCountdown()
  },

  onHide() {
    this.unbindEvents()
    app.saveEarnings()
  },

  onUnload() {
    this.unbindEvents()
    app.saveEarnings()
  },

  /** 绑定事件监听 */
  bindEvents() {
    this.tickHandler = (payload: unknown) => {
      const data = payload as TickPayload
      this.onTick(data)
    }
    this.stateHandler = (payload: unknown) => {
      const { to } = payload as { from: WorkState; to: WorkState }
      this.setData({ currentState: to })
    }

    eventBus.on('tick', this.tickHandler)
    eventBus.on('state:changed', this.stateHandler)
  },

  /** 解绑事件 */
  unbindEvents() {
    if (this.tickHandler) {
      eventBus.off('tick', this.tickHandler)
      this.tickHandler = null
    }
    if (this.stateHandler) {
      eventBus.off('state:changed', this.stateHandler)
      this.stateHandler = null
    }
  },

  /** 100ms 刷新回调 (节流: 每 5 次更新一次 UI，即 500ms) */
  onTick(payload: TickPayload) {
    const self = this as any
    self._tickCount = (self._tickCount ?? 0) + 1
    if (self._tickCount % 5 !== 0) return

    const { earnings } = payload

    // 更新收益显示
    this.setData({
      totalEarningsDisplay: Engine.formatMoney(earnings.totalEarnings, 4),
      workEarningsDisplay: Engine.formatMoney(earnings.workEarnings, 2),
      slackEarningsDisplay: Engine.formatMoney(earnings.slackEarnings, 2),
      currentState: payload.state,
    })

    // 每 5 秒更新一次热力图和倒计时 (降低频率)
    if (self._tickCount % 50 === 0) {
      this.updateHeatmap(earnings)
      this.updateCountdown()
      this.updateMonthData(earnings)
    }
  },

  /** 更新静态数据 */
  updateStaticData() {
    const engine = app.globalData.engine
    const sm = app.globalData.stateMachine
    if (!engine || !sm) return

    this.setData({
      currentState: sm.getState(),
      payDays: engine.getDaysUntilPayday(),
    })

    this.updateWeekendHint()

    // 初始月度数据
    const earnings = app.globalData.todayEarnings
    this.updateMonthData(earnings)
    this.updateHeatmap(earnings)
  },

  /** 更新月度数据 */
  updateMonthData(earnings: TodayEarnings) {
    const engine = app.globalData.engine
    if (!engine) return

    const config = engine.getConfig()
    const monthProgress = engine.getMonthProgress(earnings.totalEarnings, config.monthlySalary)
    const progressWidth = Math.min(100, monthProgress)

    this.setData({
      monthTotalDisplay: earnings.totalEarnings.toLocaleString('zh-CN', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
      monthProgress: monthProgress.toFixed(1),
      monthProgressWidth: progressWidth,
    })
  },

  /** 更新热力图 */
  updateHeatmap(earnings: TodayEarnings) {
    const totalHours = 24 * 3600

    // 按实际时长占 24h 计算百分比
    const heatWork = Math.round((earnings.workDuration / totalHours) * 100) || 1
    const heatSlack = Math.round((earnings.slackDuration / totalHours) * 100) || 0
    const heatCharge = Math.round((earnings.chargeDuration / totalHours) * 100) || 1
    const heatSleep = Math.max(1, 100 - heatWork - heatSlack - heatCharge)

    this.setData({
      heatWork,
      heatSlack: Math.max(heatSlack, heatSlack > 0 ? 4 : 0),
      heatCharge,
      heatSleep,
      workHours: (earnings.workDuration / 3600).toFixed(1),
      slackHours: (earnings.slackDuration / 3600).toFixed(1),
      chargeHours: (earnings.chargeDuration / 3600).toFixed(1),
    })
  },

  /** 更新倒计时 */
  updateCountdown() {
    const engine = app.globalData.engine
    if (!engine) return

    const seconds = engine.getSecondsUntilOffWork()
    const progress = engine.getWorkdayProgress()
    const isOffWork = seconds === 0

    this.setData({
      countdownDisplay: isOffWork ? '00:00:00' : Engine.formatCountdown(seconds),
      workdayProgress: progress,
      isOffWork,
    })
  },

  /** 更新问候语 */
  updateGreeting() {
    const hour = new Date().getHours()
    let greeting = '早安'
    if (hour >= 12 && hour < 14) greeting = '午安'
    else if (hour >= 14 && hour < 18) greeting = '下午好'
    else if (hour >= 18 && hour < 22) greeting = '晚上好'
    else if (hour >= 22 || hour < 6) greeting = '夜深了'
    this.setData({ greeting })
  },

  /** 更新周末提示 */
  updateWeekendHint() {
    const day = new Date().getDay()
    if (day === 5) {
      this.setData({ weekendHint: '今日即解放' })
    } else if (day === 6 || day === 0) {
      this.setData({ weekendHint: '自由时光中' })
    } else {
      const daysLeft = 5 - day
      this.setData({ weekendHint: `还有${daysLeft}天` })
    }
  },

  /** 切换状态 */
  switchState(e: WechatMiniprogram.Event) {
    const targetState = e.currentTarget.dataset.state as WorkState
    const sm = app.globalData.stateMachine
    if (!sm) return

    const result = sm.transition(targetState)
    if (!result.success) {
      wx.showToast({ title: result.message, icon: 'none', duration: 2000 })
      return
    }

    wx.vibrateShort({})
    this.setData({ currentState: targetState })
  },

  /** 跳转个人中心 */
  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },
})
