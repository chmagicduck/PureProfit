import type { IAppOption } from '../../../app'

const app = getApp<IAppOption>()

interface ParticleData {
  left: number
  delay: number
  duration: number
}

Page({
  data: {
    particles: [] as ParticleData[],
    hourlyRate: '0.00',
    minuteRate: '0.0000',
    secondRate: '0.000000',
  },

  onLoad() {
    // 生成粒子数据
    const particles: ParticleData[] = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
    }))
    this.setData({ particles })

    // 显示费率
    const engine = app.globalData.engine
    if (engine) {
      const rates = engine.getRates()
      this.setData({
        hourlyRate: rates.hourlyRate.toFixed(2),
        minuteRate: rates.minuteRate.toFixed(4),
        secondRate: rates.secondRate.toFixed(6),
      })
    }
  },

  onStart() {
    // 跳转到首页 (switchTab 跳转到 tabBar 页)
    wx.switchTab({ url: '/pages/home/home' })
  },
})
