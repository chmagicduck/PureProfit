Page({
  data: {
    salaryStr: '',
    secondRate: 0,
    secondRateDisplay: '0.0000',
    canNext: false,
  },

  onSalaryInput(e: WechatMiniprogram.InputEvent) {
    const value = e.detail.value
    const salary = parseFloat(value)

    if (isNaN(salary) || salary <= 0) {
      this.setData({
        salaryStr: value,
        secondRate: 0,
        secondRateDisplay: '0.0000',
        canNext: false,
      })
      return
    }

    // 默认 22 工作日, 8 小时/天
    const hourly = salary / (22 * 8)
    const secondRate = hourly / 3600
    this.setData({
      salaryStr: value,
      secondRate,
      secondRateDisplay: secondRate.toFixed(4),
      canNext: true,
    })
  },

  onNext() {
    if (!this.data.canNext) return
    const salary = parseFloat(this.data.salaryStr)

    // 暂存月薪，后续在 workconfig 页面组合完整配置
    wx.setStorageSync('_TEMP_SALARY', salary)

    wx.navigateTo({ url: '/pages/onboarding/workconfig/workconfig' })
  },
})
