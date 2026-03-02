/**
 * Storage 封装 - 数据持久化
 */

const KEYS = {
  SALARY_CONFIG: 'SALARY_CONFIG',
  TODAY_EARNINGS: 'TODAY_EARNINGS',
  MONTH_EARNINGS: 'MONTH_EARNINGS',
  IS_ONBOARDED: 'IS_ONBOARDED',
  THEME: 'THEME',
  STATE_LOG: 'STATE_LOG',
} as const

export type StorageKey = typeof KEYS[keyof typeof KEYS]

function get<T>(key: StorageKey): T | null {
  try {
    const value = wx.getStorageSync(key)
    return value === '' ? null : value as T
  } catch {
    return null
  }
}

function set<T>(key: StorageKey, data: T): void {
  try {
    wx.setStorageSync(key, data)
  } catch (err) {
    console.error(`Storage set error [${key}]:`, err)
  }
}

function remove(key: StorageKey): void {
  try {
    wx.removeStorageSync(key)
  } catch (err) {
    console.error(`Storage remove error [${key}]:`, err)
  }
}

function clearAll(): void {
  try {
    wx.clearStorageSync()
  } catch (err) {
    console.error('Storage clearAll error:', err)
  }
}

export const storage = {
  KEYS,
  get,
  set,
  remove,
  clearAll,
}
