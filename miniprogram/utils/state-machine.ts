/**
 * 状态机管理
 * 4 种互斥状态，切换逻辑受时间闸门限制
 */

import { Engine } from './engine'
import { eventBus } from './event-bus'

export type WorkState = 'working' | 'slacking' | 'charging' | 'sleeping'

export interface StateLog {
  from: WorkState
  to: WorkState
  timestamp: number
}

interface TransitionResult {
  success: boolean
  message: string
}

export class StateMachine {
  private state: WorkState
  private engine: Engine
  private logs: StateLog[]

  constructor(engine: Engine) {
    this.engine = engine
    this.state = this.determineAutoState()
    this.logs = []
  }

  /** 根据当前时间自动判断应处状态 */
  private determineAutoState(): WorkState {
    if (this.engine.isSleepingHours()) {
      return 'sleeping'
    }
    if (this.engine.isWorkingHours()) {
      return 'working'
    }
    return 'charging'
  }

  /** 获取当前状态 */
  getState(): WorkState {
    return this.state
  }

  /** 获取状态日志 */
  getLogs(): StateLog[] {
    return [...this.logs]
  }

  /** 设置状态日志 (从 Storage 恢复) */
  setLogs(logs: StateLog[]): void {
    this.logs = [...logs]
  }

  /** 尝试手动切换状态 */
  transition(targetState: WorkState): TransitionResult {
    if (targetState === this.state) {
      return { success: false, message: '当前已处于该状态' }
    }

    // 修仙时间段强制锁定
    if (this.engine.isSleepingHours() && targetState !== 'sleeping') {
      return { success: false, message: '现在是修仙时间，请好好休息~' }
    }

    // 白嫖只能在搬砖中切换
    if (targetState === 'slacking') {
      if (this.state !== 'working') {
        return { success: false, message: '只有搬砖中才能开启白嫖模式哦~' }
      }
      if (!this.engine.isWorkingHours()) {
        return { success: false, message: '还没上班呢，白嫖什么呢~' }
      }
    }

    // 搬砖中只能在工作时间激活
    if (targetState === 'working') {
      if (!this.engine.isWorkingHours()) {
        return { success: false, message: '还没到上班时间，别急~' }
      }
    }

    // 充电中只能在非工作时间
    if (targetState === 'charging') {
      if (this.engine.isWorkingHours()) {
        return { success: false, message: '还没下班呢，现在切换属于早退行为哦~' }
      }
    }

    const from = this.state
    this.state = targetState
    const log: StateLog = { from, to: targetState, timestamp: Date.now() }
    this.logs.push(log)
    eventBus.emit('state:changed', { from, to: targetState })
    return { success: true, message: this.getStateLabel(targetState) + '已激活' }
  }

  /** 自动状态检测 (由定时器调用) */
  autoCheck(): void {
    const autoState = this.determineAutoState()

    // 如果当前是白嫖中且仍在工作时间，不强制切回
    if (this.state === 'slacking' && this.engine.isWorkingHours()) {
      return
    }

    // 自动状态与当前不一致时触发切换
    if (autoState !== this.state) {
      const from = this.state
      this.state = autoState
      const log: StateLog = { from, to: autoState, timestamp: Date.now() }
      this.logs.push(log)
      eventBus.emit('state:changed', { from, to: autoState })

      // 下班自动切换时触发震动反馈
      if (from === 'working' && autoState === 'charging') {
        wx.vibrateShort({})
      }
    }
  }

  /** 获取状态中文标签 */
  getStateLabel(state?: WorkState): string {
    const labels: Record<WorkState, string> = {
      working: '搬砖中',
      slacking: '白嫖中',
      charging: '充电中',
      sleeping: '修仙中',
    }
    return labels[state ?? this.state]
  }

  /** 获取状态对应的颜色 */
  getStateColor(state?: WorkState): string {
    const colors: Record<WorkState, string> = {
      working: '#1E293B',
      slacking: '#00C38B',
      charging: '#3B82F6',
      sleeping: '#F87171',
    }
    return colors[state ?? this.state]
  }

  /** 从白嫖切回搬砖 */
  backToWork(): TransitionResult {
    if (this.state !== 'slacking') {
      return { success: false, message: '当前不在白嫖状态' }
    }
    return this.transition('working')
  }
}
