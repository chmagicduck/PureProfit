# 视觉风格锁定协议：灵动、轻巧、爽感 (Ethereal & Precise UI)

在实现代码时，所有的 border-radius 严禁写死数值，请统一使用我文档中的比例；所有的阴影必须使用多层复合阴影，不要用一行简单的 box-shadow: 5px 5px...。如果不确定字体，请优先调用系统自带的 PingFang SC。

## 1. 字体系统 (Typography Stack)
严禁使用系统默认衬线体。必须确保文字在不同平台下呈现一致的“纤细感”与“易读性”。

- **中文字体:**优先使用 `PingFang SC` (iOS/Mac), `Hiragino Sans GB`。Windows 环境强制使用 `Microsoft YaHei UI` (非普通雅黑)。
  - *CSS 参考:* `font-family: -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", sans-serif;`
- **数字/英文:** 必须使用 **DIN Alternate** 或 **SF Pro Display** (Bold)。严禁数字与中文等宽。
- **字重控制:** - 核心数据 (如132.2044): `700 (Bold)`。
  - 常规标签: `400 (Regular)`。
  - 辅助文字 (如 22:18): `500 (Medium)` 且字间距 `letter-spacing: -0.02em`。

## 2. 图标选型 (Iconography)
禁止使用任何填充色过重的图标（如实心块状）。

- **风格:** 采用 **线描 (Outline)** 风格，线条宽度统一为 `1.5pt` 或 `2pt`。
- **端点:** 必须使用 **圆角端点 (Round Join & Cap)**，增加灵动感。
- **库选型建议:** - 推荐使用 `Lucide Icons` 或 `Phosphor Icons` (Light/Regular 档位)。
  - 底部 TabBar 图标激活态：仅允许通过色彩变化或微阴影区分，严禁切换为大面积填充色图标。

## 3. 核心色彩与透明度 (Color & Alpha)
“爽感”来自于高频使用半透明和模糊效果。

- **品牌金 (Energy Gold):** `#FFB800` (用于核心数字)。
- **文本层级:** - 主文字: `rgba(26, 29, 46, 0.9)`
  - 次要标签: `rgba(26, 29, 46, 0.45)`
  - 极弱线索: `rgba(26, 29, 46, 0.1)`
- **渐变禁令:** 严禁使用饱和度过高的“彩虹色”渐变。仅允许同色相的 `Linear Gradient (180deg)`，且色差控制在 5% 以内。

## 4. 空间与投影 (Layout & Elevation)
拒绝卡通式的硬边框。

- **圆角规格:** - 外层大容器: `32px`。
  - 内部功能按钮/标签: `12px` 或 `Full Round (Capsule)`。
- **投影公式 (The "Airy" Shadow):**
  - 禁止使用单层阴影。
  - *标准投影:* `box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05), 0 2px 10px rgba(0,0,0,0.02);`
  - *深色卡片投影:* `box-shadow: 0 20px 40px rgba(0,0,0,0.2);`

## 5. 组件细节约束 (Component Logic)
- **卡片 (Cards):** 背景色必须带有一点“呼吸感”。浅色卡片建议设置 `backdrop-filter: blur(10px)`。
- **进度条 (Progress):** - 轨道色 (Track): `rgba(0, 0, 0, 0.05)`。
  - 填充色 (Fill): 必须带有一层非常细微的内部发光（Inner Glow）。
- **交互反馈:** 所有点击元素需具备 `0.2s ease-out` 的缩放反馈 (`scale(0.96)`)，营造“爽快”的点击感。

## 6. 禁止事项 (Strict Constraints)
- ❌ 禁止使用纯黑 (`#000`)。
- ❌ 禁止使用纯白边框，必须带透明度。
- ❌ 严禁出现组件边缘的锐利直角。
- ❌ 禁止在非核心数据区域使用装饰性渐变。