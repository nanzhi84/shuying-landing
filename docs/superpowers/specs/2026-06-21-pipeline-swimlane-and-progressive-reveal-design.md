# 设计文档 · 首页 Pipeline 换泳道图 + 删 Logo + 渐进式滚动

- 日期:2026-06-21
- 状态:已通过设计评审(用户口头确认「就这样设计吧」),待 spec 复核
- 关联组件:`src/components/Pipeline.astro`、`src/pages/index.astro`、`src/pages/product.astro`、`src/components/Logo.astro`、`src/layouts/BaseLayout.astro`、`src/styles/global.css`

## 1. 背景与目标

现有官网首页(Astro 5 + Tailwind 4 静态站,主题「林墨 × 斑驳日光」)整体保留,只做三处针对性改动:

1. 把 Hero 里那张**竖排节点图**(`Pipeline.astro`:左脊 + 4 阶段 + 一堆小药丸方框)换成一张**横向泳道有向图(Swimlane DAG)**——从左到右、图节点编排、像论文架构图;
2. **删掉 Logo 图标**(那个分层针叶林三角 SVG),只保留纯文字字标「树影 / SHUYING」;
3. 把页面加载**换成随滚动流畅展开的渐进式**动效。

明确**不改**的部分(用户硬性要求「其它都不改」):暗场 Hero、整套配色与字体 token、「我们是谁 / 六能力卡 / Case 闭环 / demo / 工程化数据 / CTA」各节的版式与卡片设计、导航结构、页脚结构、文案事实源 `src/lib/site.ts` 的数据。

## 2. 改动一:Pipeline → 横向泳道有向图

### 2.1 数据(不动)

继续使用 `site.ts` 里的 `pipeline: PipelinePhase[]`(4 阶段 / 16 节点:准入 3 · 合成 3 · 编排 5 · 渲染 5)。**不新增、不改动数据字段。**

> 说明:`site.ts` 的数据只描述「阶段 → 节点」,并不编码节点间依赖边。因此泳道图里的**连线是表达「阶段间数据流」的视觉装置(示意性 fan 连线),不是字面依赖图**。这一点在组件注释里写明,避免后人误读。

### 2.2 形态(Swimlane DAG,定稿样张 = `hero-fullwidth.html`)

- 4 个阶段从左到右排成 4 列泳道;列头 = `mono 序号(琥珀) + 阶段名(纸白)` + 一条细分隔线。
- 每个节点是一枚**细线框 chip**(无实底或极淡实底、1px 发丝边),内含 `mono 节点号(琥珀)+ 中文标签(纸白)`。**不发光、不堆叠厚卡**,克制以免回到「方框堆」。
- 列与列之间用**发丝贝塞尔曲线**连接(示意数据流);用**一条琥珀「关键路径」**贯穿四阶段(实现取每个阶段的首节点 + 其间连线高亮,无需改数据)。
- 暗场配色(on-ink):边/框用 `paper` 的低百分比 mix,高亮用 `--color-sun`,标签 `--color-paper`,序号 `--color-stone-2`,题注 `--color-mist`。
- 图下方一行 `mono 题注`:`Figure 01. 准入 → 合成 → 编排 → 渲染:一个 Job 触发一次 WorkflowRun…不静默降级。`

### 2.3 实现方式

- 用**单个内联 SVG**(`viewBox` 固定,如 `0 0 1200 392`,坐标硬编码)绘制列头、节点 chip(`<rect>` + 两段 `<text>`)、连线(`<path>`)。CJK 文本直接用 `<text>`,字体走组件内 `--font-*` token。
- 关键路径高亮:给首节点 chip 与对应连线加 `.hot` 类(`--color-sun`)。
- 组件保留 `compact?` 入参的位置,但本次泳道版不再需要它;若 product 页复用见 §2.5。

### 2.4 放置(首页 `index.astro`,动一点版式)

- Hero 从「左文字 + 右盒子」**改为**:Hero 文字(eyebrow + 巨标题 + lead + CTA)收成**上方左对齐块**(`max-width` 约 62ch);
- **移除**原右侧 `rounded-3xl` 半透明盒子;
- 在 Hero 文字下方放一条**全宽 Figure**:上面是 `DIGITAL-HUMAN PIPELINE` 眉标 + `workflow.run()`,中间是发丝**上下边框**框住的全宽泳道 SVG,下面是 mono 题注;
- 原 `BUILT ON` 技术栈那行**移到 Figure 下方**;
- 整块仍在 `canopy-light` 暗场内,暗场配色不变。

### 2.5 放置(产品页 `product.astro`,保持一致)

`product.astro` 也用了 `<Pipeline />`(当前在 `lg:grid-cols-[0.9fr_1.1fr]` 的右半列里)。换成横向泳道后半宽列会挤,因此:

- **决策(用户已确认):** 把 product 页该 section 的版式也改为「左/上文字说明 + 全宽泳道 Figure」,与首页一致(全站语言下沉)。
- **兜底:** 无论容器多宽,泳道 SVG 外层包 `overflow-x:auto` + SVG `min-width`(约 820px),窄容器内横向滚动而非压扁,保证任何放置点都可读。

## 3. 改动二:删 Logo 图标,留文字字标

- `Logo.astro`:**删除 `<svg>` 针叶林三角块**(含底部 `<rect>` 小树干),仅保留文字字标 `树影` + `SHUYING` 那段;`tone`(ink/paper)、`showWordmark`、`class` 入参与对外行为保持不变。
- `Nav.astro`、`Footer.astro`:**不改**(继续 `import Logo`,渲染出来自动变成纯文字)。导航左上仍可点回首页。
- 范围外、本次不动:`public/favicon.svg`、`public/brand/og.svg`(若它们也含旧图标,留待以后单独处理,spec 里记一笔)。

## 4. 改动三:随滚动的渐进式展开

在**不改各节版式**的前提下,只增强「动画层」,让滚动有「逐段流畅浮现」的连续感。集中在共享的 `BaseLayout.astro`(各页 `[data-reveal]` 已就位)与必要的 `global.css`:

- **滚动揭示(增强现有 IO):** 保留 `IntersectionObserver` 思路;统一更顺的缓动(`--ease-out-expo`)、合适时长;对成组元素(如六张能力卡、闭环五步、demo 三图)做**子项 stagger 级联**浮现,而非整块一次性淡入。
- **Pipeline 自绘:** 泳道图滚入视口时,连线按 `stroke-dashoffset` 逐段画出、节点按序淡入(`--order` stagger)。**渐进增强**:见 §6。
- **顶部滚动进度细线(可选,默认开):** 页面顶 2px 琥珀进度线随滚动伸长,强化「随滑动」的流动感。
- **首屏载入:** Hero 文字逐条上浮(沿用现有 `.reveal` 思路);Pipeline 因在首屏,载入即自绘。
- 全程**克制**,不做花哨特效;尊重 `prefers-reduced-motion`(见 §6)。

## 5. 受影响文件清单

| 文件 | 改动 |
|---|---|
| `src/components/Pipeline.astro` | 重写为横向泳道 DAG(SVG;节点默认可见 + 自绘增强 + scroll 兜底) |
| `src/pages/index.astro` | Hero 去右盒、文字收上方、Pipeline 作全宽 Figure、BUILT ON 下移 |
| `src/pages/product.astro` | 该 section 改为全宽 Figure 版式(与首页一致) |
| `src/components/Logo.astro` | 删 SVG 图标,仅留文字字标 |
| `src/layouts/BaseLayout.astro` | 增强滚动揭示(stagger)、Pipeline 自绘触发、顶部进度线 |
| `src/styles/global.css` | 视需要补/调 reveal、swimlane、进度线相关样式 |

> `src/lib/site.ts` 数据**不动**。

## 6. 可访问性与降级(硬约束,源自样张暴露的 bug)

样张曾因把节点淡入 gate 在 `.draw` 上、却没加触发,导致节点停在 `opacity:0`(只剩连线)。真实组件必须避免:

- **节点默认可见**:无 JS、SSR 静态产物、`prefers-reduced-motion` 三种情况下,泳道图(节点 + 连线 + 文字)**完整可见**,不依赖任何动画类。
- **动画只做渐进增强**:仅当有 JS 且允许动效时,才由 JS 加触发类、把元素从初始态动画到可见;任何失败路径都回落到「全部可见」。
- `prefers-reduced-motion: reduce`:关闭自绘 / stagger / 进度线动画,直接静态可见。
- SVG `role="img"` + `aria-label` 概述流水线;节点中文标签为真实 `<text>`,关键路径除颜色外还有位置/标签可辨(不只靠颜色)。

## 7. 验收标准

- `npm run check`(astro check)无类型错误;`npm run build` 成功产出静态站。
- 首页 Hero:文字在上、全宽泳道图在下;**禁用 JS 时节点/连线/文字仍完整可见**;启用 JS 且允许动效时,滚入触发自绘;`reduced-motion` 下静态可见。
- 窄屏(移动端):泳道图横向滚动可读,不被压扁。
- 导航与页脚左上为纯文字「树影 / SHUYING」,无三角图标,点击回首页正常。
- 滚动全页:各节随滚动顺滑逐段浮现(含能力卡等子项级联);顶部进度线随滚动伸长;`product.astro` 流水线 section 同为全宽泳道、可读不挤。
- 「我们是谁 / 能力卡 / 闭环 / demo / 数据 / CTA」各节版式与原版一致(仅动画层变化)。

## 8. 显式不做(YAGNI)

- 不改配色 / 字体 / 各节卡片版式 / 文案数据。
- 不把节点依赖关系做成真实可配置的图(连线为示意)。
- 不动 favicon / og 图(若含旧图标,另行处理)。
- 不做 §2.2 之外的额外炫技动效。
