/**
 * 薪资计算引擎
 * 所有数值计算封装于此，禁止在页面逻辑中散写计算公式
 */

export interface SalaryConfig {
  monthlySalary: number       // 月薪 (元)
  workDaysPerMonth: number    // 月工作日
  hoursPerDay: number         // 日工时
  startTime: string           // 上班时间 "HH:mm"
  endTime: string             // 下班时间 "HH:mm"
  lunchBreakHours: number     // 午休时长 (小时)
  workDayMode: 'double' | 'alternate' | 'single'  // 双休/大小周/单休
  payDay: number              // 发薪日 (1-31)
}

export interface DerivedRates {
  hourlyRate: number
  minuteRate: number
  secondRate: number
}

export interface TodayEarnings {
  date: string                // "YYYY-MM-DD"
  totalEarnings: number       // 今日总额
  workEarnings: number        // 搬砖所得
  slackEarnings: number       // 白嫖收益
  workDuration: number        // 搬砖时长 (秒)
  slackDuration: number       // 白嫖时长 (秒)
  chargeDuration: number      // 充电时长 (秒)
  sleepDuration: number       // 修仙时长 (秒)
}

const SLACK_MULTIPLIER = 1.2  // 白嫖模式收益倍率

export class Engine {
  private config: SalaryConfig
  private rates: DerivedRates

  constructor(config: SalaryConfig) {
    this.config = config
    this.rates = this.computeRates(config)
  }

  /** 根据配置计算派生费率 */
  private computeRates(config: SalaryConfig): DerivedRates {
    const hourlyRate = config.monthlySalary / (config.workDaysPerMonth * config.hoursPerDay)
    const minuteRate = hourlyRate / 60
    const secondRate = minuteRate / 60
    return { hourlyRate, minuteRate, secondRate }
  }

  /** 更新薪资配置并重算费率 */
  updateConfig(config: SalaryConfig): DerivedRates {
    this.config = config
    this.rates = this.computeRates(config)
    return this.rates
  }

  /** 获取当前费率 */
  getRates(): DerivedRates {
    return { ...this.rates }
  }

  /** 获取当前配置 */
  getConfig(): SalaryConfig {
    return { ...this.config }
  }

  /** 计算 100ms 增量 (搬砖模式) */
  getWorkIncrement(): number {
    return this.rates.secondRate * 0.1
  }

  /** 计算 100ms 增量 (白嫖模式) */
  getSlackIncrement(): number {
    return this.rates.secondRate * 0.1 * SLACK_MULTIPLIER
  }

  /** 解析时间字符串为当天的分钟数 */
  parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  /** 获取当前时间的分钟数 */
  getCurrentMinutes(): number {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  /** 判断当前是否在工作时间内 */
  isWorkingHours(): boolean {
    const now = this.getCurrentMinutes()
    const start = this.parseTimeToMinutes(this.config.startTime)
    const end = this.parseTimeToMinutes(this.config.endTime)
    return now >= start && now < end
  }

  /** 判断当前是否在修仙时间 (00:00-05:00) */
  isSleepingHours(): boolean {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 0 && hour < 5
  }

  /** 计算离下班还有多少秒 */
  getSecondsUntilOffWork(): number {
    const now = new Date()
    const [endH, endM] = this.config.endTime.split(':').map(Number)
    const endDate = new Date(now)
    endDate.setHours(endH, endM, 0, 0)
    const diff = endDate.getTime() - now.getTime()
    return Math.max(0, Math.floor(diff / 1000))
  }

  /** 计算工作日进度百分比 (0-100) */
  getWorkdayProgress(): number {
    const now = this.getCurrentMinutes()
    const start = this.parseTimeToMinutes(this.config.startTime)
    const end = this.parseTimeToMinutes(this.config.endTime)
    if (now >= end) return 100
    if (now <= start) return 0
    return Math.min(100, Math.round(((now - start) / (end - start)) * 100))
  }

  /** 计算发薪倒计天数 */
  getDaysUntilPayday(): number {
    const now = new Date()
    const today = now.getDate()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const payDay = this.config.payDay

    if (today < payDay) {
      return payDay - today
    }
    // 跨月: 计算到下个月发薪日的天数
    const nextPayDate = new Date(currentYear, currentMonth + 1, payDay)
    const diffMs = nextPayDate.getTime() - now.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  /** 计算本月进度百分比 */
  getMonthProgress(monthEarnings: number, targetSalary: number): number {
    if (targetSalary <= 0) return 0
    return Math.round((monthEarnings / targetSalary) * 1000) / 10
  }

  /** 格式化秒数为 HH:MM:SS */
  static formatCountdown(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  /** 格式化金额显示 */
  static formatMoney(amount: number, decimals: number = 4): string {
    return amount.toFixed(decimals)
  }

  /** 获取今日日期字符串 "YYYY-MM-DD" */
  static getTodayString(): string {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  /** 创建空白的今日收益对象 */
  static createEmptyEarnings(): TodayEarnings {
    return {
      date: Engine.getTodayString(),
      totalEarnings: 0,
      workEarnings: 0,
      slackEarnings: 0,
      workDuration: 0,
      slackDuration: 0,
      chargeDuration: 0,
      sleepDuration: 0,
    }
  }

  /** 获取默认薪资配置 */
  static getDefaultConfig(): SalaryConfig {
    return {
      monthlySalary: 10000,
      workDaysPerMonth: 22,
      hoursPerDay: 8,
      startTime: '09:00',
      endTime: '18:00',
      lunchBreakHours: 1,
      workDayMode: 'double',
      payDay: 15,
    }
  }
}
