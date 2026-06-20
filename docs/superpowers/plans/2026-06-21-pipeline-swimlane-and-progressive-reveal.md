# 首页 Pipeline 换泳道图 + 删 Logo + 渐进式滚动 · 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: 用 superpowers:subagent-driven-development(推荐)或 superpowers:executing-plans 逐任务实现本计划。步骤用 `- [ ]` 复选框跟踪。

**Goal:** 把首页/产品页 Hero 的竖排节点图换成全宽横向泳道有向图,删掉 Logo 图标只留文字字标,并把加载改成随滚动流畅展开的渐进式动效。

**Architecture:** 重写共享组件 `Pipeline.astro` 为数据驱动的内联 SVG 泳道图(节点默认可见,自绘动画仅在 JS 加 `.is-draw` 且允许动效时叠加);在 `index.astro`/`product.astro` 把它从半宽列改放为全宽 Figure;`Logo.astro` 删 SVG 图标;`BaseLayout.astro` 增强滚动揭示(子项错开)、加流水线自绘触发与顶部进度线。

**Tech Stack:** Astro 5(静态)、Tailwind 4(多为 inline class)、原生 SVG + IntersectionObserver。无测试框架——每任务以 `npm run build` 构建通过 + 对 `dist/` 产物 grep 断言 + dev server 截图核对为「测试环」。

## Global Constraints

逐条来自设计文档(`docs/superpowers/specs/2026-06-21-pipeline-swimlane-and-progressive-reveal-design.md`),每个任务都隐含遵守:

- 工作分支:`redesign/pipeline-swimlane`(已建,spec 已在该分支)。不直接提交 `main`。
- **节点默认可见(硬约束):** 无 JS / SSR 静态产物 / `prefers-reduced-motion` 三种情况下,泳道图(节点 + 连线 + 文字)完整可见,不依赖任何动画类。动画只做渐进增强,任何失败路径回落「全部可见」。
- 文案事实源 `src/lib/site.ts` **不改**(数据字段不增不删)。
- **不改**:配色 / 字体 token、「我们是谁 / 六能力卡 / Case 闭环 / demo / 工程化数据 / CTA」各节版式与卡片、导航/页脚结构。本计划只动:Pipeline、Logo、index/product 的流水线区块、BaseLayout 动画层、global.css 进度线样式。
- 配色 token(暗场 on-ink 用):`--color-paper` `--color-ink` `--color-pine` `--color-sun` `--color-stone-2` `--color-mist` `--font-display` `--font-sans` `--font-mono` `--ease-out-expo`(均已在 `global.css` 定义)。
- 连线是「阶段间数据流」的**示意**装置(site.ts 不编码依赖边),非字面依赖图。关键路径 = 每阶段首节点 + 其间「首→首」连线,琥珀高亮。
- 每次 `git commit` 信息结尾加两行(本会话规范):
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` 与 `Claude-Session: https://claude.ai/code/session_01J8SeftMyC3vNjjhpKStFZZ`。
- 验证命令:`npm run build`(可靠门禁);`npm run dev` 起 dev server 后用 Playwright 截图核对(`browser_navigate` + `browser_take_screenshot`),或手动浏览器查看。`npm run check`(astro check)为可选——仓库未装 `@astrojs/check`,缺则跳过,以 build 为准。

## 文件结构

| 文件 | 职责 | 改动 |
|---|---|---|
| `src/components/Logo.astro` | 品牌字标 | 删 SVG 图标,仅留文字「树影 / SHUYING」 |
| `src/components/Pipeline.astro` | 流水线可视化 | 重写为数据驱动横向泳道 DAG(SVG) |
| `src/pages/index.astro` | 首页 | Hero 去右盒、文字收上方、Pipeline 全宽 Figure、BUILT ON 下移 |
| `src/pages/product.astro` | 产品页 | 流水线 section 改全宽 Figure 版式 |
| `src/layouts/BaseLayout.astro` | 全站布局 + 脚本 | 滚动揭示子项错开、流水线自绘触发、顶部进度线 |
| `src/styles/global.css` | 全局样式 | 加 `#scroll-progress` 样式 |

任务顺序:Logo → Pipeline 组件 → index → product → BaseLayout 动画 → 全站验收。每个任务交付物独立可测;Pipeline 组件先于页面改放,中间态会出现「宽图挤在旧半宽列」属正常,放置任务修正。

---

### Task 1: Logo —— 删图标,留文字字标

**Files:**
- Modify: `src/components/Logo.astro`(整文件替换)

**Interfaces:**
- Consumes: 无
- Produces: 组件 `<Logo tone?: "ink"|"paper" showWordmark?: boolean class?: string />` 渲染纯文字字标;对外入参签名不变(`Nav.astro`/`Footer.astro` 调用不动)。

- [ ] **Step 1: 红 —— 确认旧 SVG 图标当前存在**

Run: `grep -c 'M16 3.5' src/components/Logo.astro`
Expected: `1`(旧三角图标 path 还在)

- [ ] **Step 2: 整文件替换为纯文字字标**

把 `src/components/Logo.astro` 全文替换为:

```astro
---
/**
 * 树影字标:纯文字(图标已删)。tone 控墨色,showWordmark 控是否显示。
 */
interface Props {
  tone?: "ink" | "paper";
  showWordmark?: boolean;
  class?: string;
}
const { tone = "ink", showWordmark = true, class: cls = "" } = Astro.props;
const main = tone === "paper" ? "var(--color-paper)" : "var(--color-ink)";
---

<span class={`logo inline-flex items-center ${cls}`} aria-label="树影 Shuying">
  {showWordmark && (
    <span class="flex items-baseline gap-1.5 leading-none">
      <span
        style={`color:${main}`}
        class="font-[var(--font-display)] text-[1.18rem] font-semibold tracking-tight"
      >树影</span>
      <span class="eyebrow !text-[0.6rem] !tracking-[0.28em] opacity-70" style={`color:${main}`}>SHUYING</span>
    </span>
  )}
</span>
```

- [ ] **Step 3: 绿 —— 确认 SVG 图标已移除(源文件)**

Run: `grep -c '<svg' src/components/Logo.astro`
Expected: `0`

- [ ] **Step 4: 构建**

Run: `npm run build`
Expected: 构建成功(exit 0,末尾 `Complete!` 或同类)。

- [ ] **Step 5: 绿 —— 产物中三角图标已无、字标仍在**

Run: `grep -rc 'M16 3.5' dist/ ; grep -rc 'SHUYING' dist/index.html`
Expected: 第一条统计为 `0`(无旧图标 path);第二条 ≥ `1`(字标仍在导航)。

- [ ] **Step 6: 视觉核对**

Run: `npm run dev`,Playwright 打开首页(dev 输出的 URL,通常 `http://localhost:4321/`),`browser_take_screenshot` 看左上为纯文字「树影 / SHUYING」、无三角图标;点击可回首页。或手动浏览器查看。停 dev。

- [ ] **Step 7: 提交**

```bash
git add src/components/Logo.astro
git commit -m "feat(logo): 删 Logo 三角图标,仅保留文字字标「树影 / SHUYING」"
```

---

### Task 2: Pipeline 组件 —— 重写为横向泳道有向图

**Files:**
- Modify: `src/components/Pipeline.astro`(整文件替换)

**Interfaces:**
- Consumes: `src/lib/site.ts` 的 `pipeline: { phase: string; nodes: { n: string; label: string; en: string }[] }[]`(4 阶段 / 16 节点,不改)。
- Produces: `<Pipeline />`(无入参)渲染 `<figure class="pipeline" data-pipeline>`:内 `.pipeline__scroll`(横向滚动兜底)包一张内联 SVG 泳道图 + `<figcaption class="pipeline__cap">`。组件对 `.is-draw` 类响应自绘;`data-pipeline` 供 BaseLayout 选中。on-ink(暗场)配色。

- [ ] **Step 1: 整文件替换 Pipeline.astro**

把 `src/components/Pipeline.astro` 全文替换为:

```astro
---
import { pipeline } from "../lib/site";

/**
 * 数字人流水线 · 横向泳道有向图(Swimlane DAG)。
 * 4 阶段从左到右成 4 列泳道,节点自上而下;列间发丝贝塞尔连线为「阶段间数据流」的
 * 示意装置(site.ts 不编码依赖边,故连线非字面依赖图)。每阶段首节点 + 其间「首→首」
 * 连线为琥珀「关键路径」。
 *
 * 无障碍:节点 / 连线 / 文字默认完整可见,不依赖任何动画类;自绘仅在父级被 JS 加上
 * .is-draw 且允许动效时叠加(见 BaseLayout)。
 */
const COL_W = 180;
const COL_GAP = 110;
const NODE_H = 42;
const ROW_PITCH = 56;
const TOP = 92;
const HEAD_Y = 44;
const PAD = 40;

const colX = (i: number) => PAD + i * (COL_W + COL_GAP);
const rowTop = (r: number) => TOP + r * ROW_PITCH;
const rowMid = (r: number) => rowTop(r) + NODE_H / 2;

const maxRows = Math.max(...pipeline.map((p) => p.nodes.length));
const VB_W = PAD * 2 + pipeline.length * COL_W + (pipeline.length - 1) * COL_GAP;
const VB_H = rowTop(maxRows - 1) + NODE_H + 24;

type Edge = { d: string; hot: boolean; col: number };
const edges: Edge[] = [];
for (let i = 0; i < pipeline.length - 1; i++) {
  const fromN = pipeline[i].nodes.length;
  const toN = pipeline[i + 1].nodes.length;
  const x1 = colX(i) + COL_W;
  const x2 = colX(i + 1);
  const cx = (x1 + x2) / 2;
  for (let r = 0; r < fromN; r++) {
    const targets = new Set<number>([Math.min(r, toN - 1)]);
    if (r === fromN - 1) for (let t = fromN - 1; t < toN; t++) targets.add(t);
    for (const t of targets) {
      edges.push({
        d: `M${x1} ${rowMid(r)} C${cx} ${rowMid(r)} ${cx} ${rowMid(t)} ${x2} ${rowMid(t)}`,
        hot: r === 0 && t === 0,
        col: i,
      });
    }
  }
}

let order = 0;
const cols = pipeline.map((p, ci) => ({
  phase: p.phase,
  idx: String(ci + 1).padStart(2, "0"),
  x: colX(ci),
  nodes: p.nodes.map((n, ri) => ({
    n: n.n,
    label: n.label,
    x: colX(ci),
    y: rowTop(ri),
    hot: ri === 0,
    order: order++,
  })),
}));
const total = order;
---

<figure class="pipeline" data-pipeline>
  <div class="pipeline__scroll">
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="数字人流水线:准入、合成、编排、渲染四阶段共 16 个节点的有向流程图"
    >
      <line class="head-rule" x1={PAD} y1="56" x2={VB_W - PAD} y2="56"></line>
      {cols.map((c) => (
        <g class="phead">
          <text class="pi" x={c.x} y={HEAD_Y}>{c.idx}</text>
          <text class="ph" x={c.x + 22} y={HEAD_Y}>{c.phase}</text>
        </g>
      ))}
      {edges.map((e) => (
        <path class:list={["edge", { hot: e.hot }]} style={`--c:${e.col}`} d={e.d} pathLength="1"></path>
      ))}
      {cols.map((c) =>
        c.nodes.map((n) => (
          <g class:list={["node", { hot: n.hot }]} style={`--o:${n.order}`}>
            <rect class="nrect" x={n.x} y={n.y} width={COL_W} height={NODE_H} rx="10"></rect>
            <text class="nn" x={n.x + 14} y={n.y + 26}>{n.n}</text>
            <text class="nl" x={n.x + 40} y={n.y + 26}>{n.label}</text>
          </g>
        ))
      )}
    </svg>
  </div>
  <figcaption class="pipeline__cap">
    一个 Job → 一次 WorkflowRun → {total} 节点 → 带类型 artifacts · 运行报告 · 分级降级
  </figcaption>
</figure>

<style>
  .pipeline { margin: 0; }
  .pipeline__scroll { overflow-x: auto; overflow-y: hidden; }
  .pipeline svg {
    display: block; width: 100%; height: auto; overflow: visible; min-width: 760px;
  }
  .head-rule { stroke: color-mix(in oklab, var(--color-paper) 10%, transparent); stroke-width: 1; }
  .pi { font-family: var(--font-mono); font-size: 12px; fill: var(--color-sun); }
  .ph { font-family: var(--font-display); font-weight: 600; font-size: 14px; fill: var(--color-paper); }
  .edge { stroke: color-mix(in oklab, var(--color-paper) 16%, transparent); stroke-width: 1; fill: none; }
  .edge.hot { stroke: var(--color-sun); stroke-width: 1.5; }
  .nrect {
    fill: color-mix(in oklab, var(--color-paper) 4%, transparent);
    stroke: color-mix(in oklab, var(--color-paper) 13%, transparent);
    stroke-width: 1;
  }
  .node.hot .nrect {
    stroke: color-mix(in oklab, var(--color-sun) 70%, transparent);
    fill: color-mix(in oklab, var(--color-sun) 8%, transparent);
  }
  .nn { font-family: var(--font-mono); font-size: 11px; fill: var(--color-stone-2); }
  .node.hot .nn { fill: var(--color-sun); }
  .nl { font-family: var(--font-sans); font-size: 13px; fill: var(--color-paper); }
  .pipeline__cap {
    margin-top: 16px; font-family: var(--font-mono); font-size: 0.72rem;
    letter-spacing: 0.03em; color: var(--color-mist); line-height: 1.7;
  }

  /* 自绘:仅在 JS 加 .is-draw 且允许动效时叠加;默认全部可见 */
  .pipeline.is-draw .edge {
    stroke-dasharray: 1; stroke-dashoffset: 1;
    animation: pl-dash 0.8s var(--ease-out-expo) forwards;
    animation-delay: calc(var(--c, 0) * 0.18s + 0.15s);
  }
  @keyframes pl-dash { to { stroke-dashoffset: 0; } }
  .pipeline.is-draw .node {
    opacity: 0; transform: translateY(6px); transform-box: fill-box;
    animation: pl-node 0.55s var(--ease-out-expo) forwards;
    animation-delay: calc(var(--o, 0) * 0.05s + 0.3s);
  }
  @keyframes pl-node { to { opacity: 1; transform: none; } }

  @media (prefers-reduced-motion: reduce) {
    .pipeline.is-draw .edge, .pipeline.is-draw .node {
      animation: none; opacity: 1; stroke-dashoffset: 0; transform: none;
    }
  }
</style>
```

- [ ] **Step 2: 构建**

Run: `npm run build`
Expected: 构建成功(exit 0)。

- [ ] **Step 3: 绿 —— 产物含泳道图、无旧竖排脊柱**

Run: `grep -c '数字人流水线:准入' dist/index.html ; grep -c '校验请求' dist/index.html ; grep -c 'pipeline__spine' dist/index.html`
Expected: 前两条 ≥ `1`(泳道图 aria-label 与节点标签在);第三条 `0`(旧竖排 `pipeline__spine` 已无)。

- [ ] **Step 4: 视觉核对(中间态可挤,只看「画对没」)**

`npm run dev`,Playwright 截图首页:右侧旧盒里出现横向泳道图(4 列阶段、16 节点、连线、首列琥珀关键路径)。**此时挤是正常的**——Task 3 改放为全宽即解决;本步只确认图本身渲染正确、节点文字默认可见。停 dev。

- [ ] **Step 5: 提交**

```bash
git add src/components/Pipeline.astro
git commit -m "feat(pipeline): 重写为数据驱动横向泳道有向图(节点默认可见+自绘增强)"
```

---

### Task 3: 首页 Hero —— 文字收上方 + 全宽泳道 Figure

**Files:**
- Modify: `src/pages/index.astro`(替换首个 `<section class="canopy-light ...">` Hero 区块,约 14–47 行)

**Interfaces:**
- Consumes: Task 2 的 `<Pipeline />`;`hero` `stack`(已 import)。
- Produces: 暗场 Hero = 上方左对齐文字块 + 全宽流水线 Figure(发丝上下边框)+ BUILT ON 行。

- [ ] **Step 1: 替换 Hero 区块**

把 `index.astro` 里的 Hero `<section class="canopy-light text-[var(--color-paper)]"> … </section>`(从 `<!-- HERO` 注释到该 section 结束,原右侧 panel + Pipeline 都在内)整体替换为:

```astro
  <!-- HERO：影（暗场）+ 全宽流水线 Figure -->
  <section class="canopy-light text-[var(--color-paper)]">
    <div class="u-container py-20 md:py-24">
      <div class="max-w-3xl">
        <p class="eyebrow eyebrow--onink reveal">{hero.eyebrow}</p>
        <h1 class="reveal reveal-2 mt-6 text-display-lg font-bold leading-[1.04] text-[var(--color-paper)]">
          {hero.titleLines[0]}<br />{hero.titleLines[1]}
        </h1>
        <p class="reveal reveal-3 mt-7 max-w-xl text-[1.08rem] leading-relaxed text-[var(--color-mist)]">
          {hero.lead}
        </p>
        <div class="reveal reveal-3 mt-9 flex flex-wrap gap-3">
          <a href={url(hero.primaryCta.href)} class="btn btn-sun">{hero.primaryCta.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href={url(hero.secondaryCta.href)} class="btn btn-ghost--onink btn-ghost">{hero.secondaryCta.label}</a>
        </div>
      </div>

      <!-- 全宽流水线 Figure -->
      <div class="reveal reveal-4 mt-16 md:mt-20">
        <div class="mb-4 flex items-baseline justify-between">
          <span class="eyebrow eyebrow--onink">DIGITAL-HUMAN PIPELINE</span>
          <span class="font-[var(--font-mono)] text-[0.7rem] text-[var(--color-mist)]">workflow.run()</span>
        </div>
        <div class="border-y border-[color-mix(in_oklab,var(--color-paper)_14%,transparent)] py-7">
          <Pipeline />
        </div>
      </div>

      <!-- BUILT ON -->
      <div class="reveal reveal-4 mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color-mix(in_oklab,var(--color-paper)_12%,transparent)] pt-6">
        <span class="eyebrow !text-[0.62rem] !tracking-[0.18em] text-[var(--color-stone-2)]">BUILT ON</span>
        {stack.map((s) => (
          <span class="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-mist)]">{s}</span>
        ))}
      </div>
    </div>
  </section>
```

- [ ] **Step 2: 构建**

Run: `npm run build`
Expected: 构建成功(exit 0)。

- [ ] **Step 3: 绿 —— 旧右盒已无、Figure 头在**

Run: `grep -c 'lg:grid-cols-\[1.04fr_0.96fr\]' dist/index.html ; grep -c 'DIGITAL-HUMAN PIPELINE' dist/index.html`
Expected: 第一条 `0`(旧两栏 Hero grid 已无);第二条 ≥ `1`(Figure 头在)。

- [ ] **Step 4: 视觉核对**

`npm run dev`,Playwright 截图首页:文字(眉标/巨标题/lead/CTA)在上方左对齐;其下「DIGITAL-HUMAN PIPELINE / workflow.run()」头 + 发丝上下边框框住的**全宽**泳道图(标签不缩写、不挤);再其下 BUILT ON 行。停 dev。

- [ ] **Step 5: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat(home): Hero 文字收上方,流水线改为全宽 Figure,BUILT ON 下移"
```

---

### Task 4: 产品页 —— 流水线 section 改全宽 Figure

**Files:**
- Modify: `src/pages/product.astro`(替换 `<!-- 完整流水线 -->` section,约 39–58 行)

**Interfaces:**
- Consumes: Task 2 的 `<Pipeline />`。
- Produces: 产品页流水线 section = 上方文字说明(max-width)+ 全宽泳道 Figure(同首页语言)。

- [ ] **Step 1: 替换该 section**

把 `product.astro` 的 `<!-- 完整流水线 -->` 整段 `<section class="u-container py-16"> … </section>` 替换为:

```astro
  <!-- 完整流水线 -->
  <section class="u-container py-16">
    <div class="canopy-light rounded-3xl border border-[color-mix(in_oklab,var(--color-ink)_30%,transparent)] px-6 py-12 text-[var(--color-paper)] md:px-12">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow--onink mb-4">THE 16 NODES</p>
        <h2 class="text-display-sm font-semibold text-[var(--color-paper)]">每个节点，只做一件事。</h2>
        <p class="mt-5 max-w-md text-[1.02rem] leading-relaxed text-[var(--color-mist)]">
          一个 <code class="font-[var(--font-mono)] text-[var(--color-sun)]">DigitalHumanVideo</code> Job 触发一次 <code class="font-[var(--font-mono)] text-[var(--color-sun)]">WorkflowRun</code>，按固定节点序执行。每个节点输入哈希可复用、可 resume、可 retry，产出带类型 artifacts 与运行报告。
        </p>
        <ul class="mt-7 space-y-3 text-[0.92rem] text-[var(--color-mist)]">
          <li class="flex gap-3"><span class="font-[var(--font-mono)] text-[var(--color-sun)]">→</span>Temporal 编排，独立 worker 消费 <span class="font-[var(--font-mono)]">cutagent-production</span> 队列</li>
          <li class="flex gap-3"><span class="font-[var(--font-mono)] text-[var(--color-sun)]">→</span>canonical input hash 驱动复用，避免重复算力</li>
          <li class="flex gap-3"><span class="font-[var(--font-mono)] text-[var(--color-sun)]">→</span>WebSocket <span class="font-[var(--font-mono)]">/ws/runs/&#123;id&#125;</span> 实时进度</li>
        </ul>
      </div>
      <div class="mt-12 border-y border-[color-mix(in_oklab,var(--color-paper)_14%,transparent)] py-7">
        <Pipeline />
      </div>
    </div>
  </section>
```

- [ ] **Step 2: 构建**

Run: `npm run build`
Expected: 构建成功(exit 0)。

- [ ] **Step 3: 绿 —— 旧两栏 grid 已无、泳道图在产品页**

Run: `grep -c 'lg:grid-cols-\[0.9fr_1.1fr\]' dist/product/index.html ; grep -c '数字人流水线:准入' dist/product/index.html`
Expected: 第一条 `0`(旧两栏 grid 已无);第二条 ≥ `1`(泳道图在)。

- [ ] **Step 4: 视觉核对**

`npm run dev`,Playwright 截图 `/product`:文字说明在上、全宽泳道图在下,不挤、可读。停 dev。

- [ ] **Step 5: 提交**

```bash
git add src/pages/product.astro
git commit -m "feat(product): 流水线 section 改为上文字+全宽泳道 Figure,与首页一致"
```

---

### Task 5: BaseLayout —— 渐进式滚动(子项错开 + 流水线自绘 + 进度线)

**Files:**
- Modify: `src/layouts/BaseLayout.astro`(body 加进度线节点;脚本增强)
- Modify: `src/styles/global.css`(加 `#scroll-progress` 样式)

**Interfaces:**
- Consumes: 页面里的 `[data-reveal]`(各节已有)、Task 2 的 `[data-pipeline]`。
- Produces: 顶部 2px 琥珀进度线随滚动伸长;同组 `[data-reveal]` 子项按 DOM 序错开浮现;`[data-pipeline]` 滚入视口时加 `.is-draw` 自绘。全部尊重 `prefers-reduced-motion` 与无 JS。

- [ ] **Step 1: global.css 加进度线样式**

在 `src/styles/global.css` 的 `@layer base { … }` 内(`body { … }` 之后)加:

```css
  /* 顶部滚动进度细线(随滚动伸长) */
  #scroll-progress {
    position: fixed;
    inset: 0 auto auto 0;
    height: 2px;
    width: 0;
    background: var(--color-sun);
    z-index: 60;
    will-change: width;
  }
```

- [ ] **Step 2: BaseLayout 加进度线节点**

在 `src/layouts/BaseLayout.astro` 的 `<body>` 开标签后、跳转链接 `<a href="#main" …>` 之前,插入一行:

```astro
    <div id="scroll-progress" aria-hidden="true"></div>
```

- [ ] **Step 3: 替换 BaseLayout 的 `<script>` 块**

把 `BaseLayout.astro` 末尾整个 `<script> … </script>`(滚动进入动画那段)替换为:

```astro
    <script>
      // 渐进式:滚动揭示(子项错开)+ 流水线自绘 + 顶部进度线。
      // 全部渐进增强:无 JS / reduced-motion 时,内容与图默认完整可见。
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1) 顶部滚动进度线(reduced-motion 也保留:仅反映滚动位置,非自发动效)
      const bar = document.getElementById("scroll-progress");
      if (bar) {
        const updateBar = () => {
          const h = document.documentElement;
          const max = h.scrollHeight - h.clientHeight;
          bar.style.width = max > 0 ? (h.scrollTop / max) * 100 + "%" : "0%";
        };
        document.addEventListener("scroll", updateBar, { passive: true });
        window.addEventListener("resize", updateBar, { passive: true });
        updateBar();
      }

      // 2) 滚动揭示;同一父级下的多个 [data-reveal] 若无显式 delay,按 DOM 序自动错开
      const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
      if (items.length && !reduce && "IntersectionObserver" in window) {
        const delayFor = (el: HTMLElement) => {
          if (el.dataset.revealDelay != null) return Number(el.dataset.revealDelay);
          const parent = el.parentElement;
          if (!parent) return 0;
          const sibs = Array.from(parent.children).filter(
            (c) => c instanceof HTMLElement && c.hasAttribute("data-reveal")
          );
          const i = sibs.indexOf(el);
          return i > 0 ? i * 70 : 0;
        };
        items.forEach((el) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition =
            "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)";
        });
        const show = (el: HTMLElement, delay = 0) => {
          window.setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "none";
          }, delay);
        };
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                const el = e.target as HTMLElement;
                show(el, delayFor(el));
                io.unobserve(el);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
        items.forEach((el) => io.observe(el));
        // 安全网:IO 不触发 / 打印 / 无头时 2s 后强制全部可见
        window.setTimeout(() => items.forEach((el) => show(el)), 2000);
      }

      // 3) 流水线自绘(滚入视口逐段画出);reduced-motion / 无 JS 时默认全部可见
      const pls = document.querySelectorAll<HTMLElement>("[data-pipeline]");
      if (pls.length && !reduce && "IntersectionObserver" in window) {
        const pio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-draw");
                pio.unobserve(e.target);
              }
            });
          },
          { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
        );
        pls.forEach((el) => pio.observe(el));
      }
    </script>
```

- [ ] **Step 4: 构建**

Run: `npm run build`
Expected: 构建成功(exit 0)。

- [ ] **Step 5: 绿 —— 进度线节点与 data-pipeline 在产物中**

Run: `grep -c 'id="scroll-progress"' dist/index.html ; grep -c 'data-pipeline' dist/index.html`
Expected: 两条均 ≥ `1`。

- [ ] **Step 6: 视觉核对(关键)**

`npm run dev`,Playwright 打开首页:
1. 顶部出现琥珀细线,随滚动伸长;
2. 向下滚,能力卡/demo 等同组卡片**逐张错开**浮现(非整块同时);
3. 滚到流水线图时,连线逐段画出、节点逐个点亮(**自绘**);
4. 用 `browser_run_code_unsafe`(或 DevTools)模拟 `prefers-reduced-motion: reduce`,刷新:图与内容**静态完整可见**、无自绘;
5. 缩到窄屏(`browser_resize` ~390 宽):流水线图横向滚动可读、不被压扁。
截图留证。停 dev。

- [ ] **Step 7: 提交**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(motion): 渐进式滚动——子项错开揭示+流水线自绘+顶部进度线"
```

---

### Task 6: 全站验收

**Files:** 无改动(纯验证;如发现问题回到对应任务修)。

**Interfaces:** 对照 spec §7 验收标准逐条核。

- [ ] **Step 1: 构建全站**

Run: `npm run build`
Expected: 构建成功(exit 0);若装了 `@astrojs/check` 可加跑 `npm run check` 期望 0 错误。

- [ ] **Step 2: 无 JS 降级断言**

Run: `npm run dev`;Playwright `browser_navigate` 首页后,用 `browser_run_code_unsafe` 禁用/不执行脚本场景不易直接造;改以**静态产物**核对:`grep -c '校验请求' dist/index.html` ≥ 1 且 SVG 文本在 HTML 中(说明 SSR 即含节点文字,无 JS 也可见)。截图确认禁用动效路径(reduced-motion)下节点可见。

- [ ] **Step 3: 逐条核对 spec §7**

人工/截图核对清单(全绿才算完成):
- 首页 Hero:文字在上、全宽泳道图在下;reduced-motion 下节点/连线/文字完整可见;允许动效时滚入自绘。
- 窄屏:泳道图横向滚动可读、不压扁。
- 导航与页脚左上为纯文字「树影 / SHUYING」、无三角图标、点击回首页正常。
- 滚动全页:各节随滚动顺滑逐段浮现(含能力卡等子项错开);顶部进度线随滚动伸长。
- `/product` 流水线 section 为全宽泳道、可读不挤。
- 「我们是谁 / 能力卡 / 闭环 / demo / 数据 / CTA」各节版式与原版一致(仅动画层变化)。

- [ ] **Step 4: 收尾提交(若 Step 1–3 有微调)**

```bash
git add -A
git commit -m "chore: 全站验收微调(泳道图重设计收尾)"
```
（无改动则跳过本步。）

---

## Self-Review(对照 spec)

- **覆盖度:** spec §2 泳道图 → Task 2;§2.4 首页放置 → Task 3;§2.5 product 全宽 → Task 4;§3 删 Logo → Task 1;§4 渐进式(子项错开/自绘/进度线)→ Task 5;§6 无障碍默认可见 → Task 2 的 `.is-draw` 门控 + Task 5 的 IO 增强 + Task 6 断言;§7 验收 → Task 6。无遗漏。
- **占位符:** 无 TBD/TODO;每个改文件步骤均给完整代码;命令与期望明确。
- **类型一致:** 组件契约 `<Pipeline />`(无入参,渲染 `data-pipeline`)在 Task 2 定义,Task 3/4 据此放置,Task 5 据 `data-pipeline` 加 `.is-draw`、`#scroll-progress` 在 Task 5 Step 1/2 成对出现;命名一致。
- **不做(YAGNI):** 不改配色/字体/各节卡片版式/文案数据;连线为示意非真实依赖图;不动 favicon/og。
```
