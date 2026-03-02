import { Engine, type SalaryConfig, type TodayEarnings } from './utils/engine'
import { StateMachine } from './utils/state-machine'
import { Timer } from './utils/timer'
import { storage } from './utils/storage'
import { eventBus } from './utils/event-bus'

export interface IAppOption {
  globalData: {
    engine: Engine | null
    stateMachine: StateMachine | null
    timer: Timer | null
    todayEarnings: TodayEarnings
    isOnboarded: boolean
  }
  initEngine(config: SalaryConfig): void
  saveEarnings(): void
}

App<IAppOption>({
  globalData: {
    engine: null,
    stateMachine: null,
    timer: null,
    todayEarnings: Engine.createEmptyEarnings(),
    isOnboarded: false,
  },

  onLaunch() {
    const isOnboarded = storage.get<boolean>(storage.KEYS.IS_ONBOARDED)
    this.globalData.isOnboarded = isOnboarded === true

    if (this.globalData.isOnboarded) {
      const savedConfig = storage.get<SalaryConfig>(storage.KEYS.SALARY_CONFIG)
      if (savedConfig) {
        this.initEngine(savedConfig)
      }
    }
  },

  /** 初始化计算引擎、状态机、定时器 */
  initEngine(config: SalaryConfig) {
    const engine = new Engine(config)
    const stateMachine = new StateMachine(engine)

    // 恢复今日收益
    const savedEarnings = storage.get<TodayEarnings>(storage.KEYS.TODAY_EARNINGS)
    const today = Engine.getTodayString()
    if (savedEarnings && savedEarnings.date === today) {
      this.globalData.todayEarnings = savedEarnings
    } else {
      this.globalData.todayEarnings = Engine.createEmptyEarnings()
    }

    // 定时器: 每 100ms 累加收益
    const timer = new Timer(() => {
      const state = stateMachine.getState()
      const earnings = this.globalData.todayEarnings

      if (state === 'working') {
        const increment = engine.getWorkIncrement()
        earnings.totalEarnings += increment
        earnings.workEarnings += increment
        earnings.workDuration += 0.1
      } else if (state === 'slacking') {
        const increment = engine.getSlackIncrement()
        earnings.totalEarnings += increment
        earnings.slackEarnings += increment
        earnings.slackDuration += 0.1
      } else if (state === 'charging') {
        earnings.chargeDuration += 0.1
      } else if (state === 'sleeping') {
        earnings.sleepDuration += 0.1
      }

      eventBus.emit('tick', {
        earnings: { ...earnings },
        state,
        rates: engine.getRates(),
      })
    })

    // 每秒自动检测状态
    eventBus.on('timer:second', () => {
      stateMachine.autoCheck()
    })

    // 每分钟持久化
    eventBus.on('timer:minute', () => {
      this.saveEarnings()
    })

    // 薪资变更事件
    eventBus.on('salary:updated', (newConfig: unknown) => {
      engine.updateConfig(newConfig as SalaryConfig)
      storage.set(storage.KEYS.SALARY_CONFIG, newConfig)
    })

    // 清空数据事件
    eventBus.on('data:cleared', () => {
      timer.stop()
      storage.clearAll()
      this.globalData.engine = null
      this.globalData.stateMachine = null
      this.globalData.timer = null
      this.globalData.todayEarnings = Engine.createEmptyEarnings()
      this.globalData.isOnboarded = false
    })

    this.globalData.engine = engine
    this.globalData.stateMachine = stateMachine
    this.globalData.timer = timer

    timer.start()
  },

  /** 持久化当前收益数据 */
  saveEarnings() {
    if (this.globalData.todayEarnings) {
      storage.set(storage.KEYS.TODAY_EARNINGS, this.globalData.todayEarnings)
    }
  },

  onHide() {
    this.saveEarnings()
  },
})
