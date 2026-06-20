/**
 * 站点唯一内容事实源：导航、公司叙事、产品能力、流水线节点、数据、demo、联系方式。
 * 改文案只动这里。组件只负责呈现。
 */

export const site = {
  nameCN: "树影",
  nameEN: "Shuying",
  product: "Cutagent",
  domain: "shuying.ai",
  // 用于 <title> / OG / RSS；正式部署后改成真实域名即可
  url: "https://nanzhi84.github.io",
  tagline: "Case-first 数字人短视频内容生产系统",
  description:
    "树影 Cutagent —— 以 Case 为长期学习边界，把脚本生成、数字人成片、多平台发布、数据回流与自进化打通成一条可审计的工业流水线。为 B 端品牌确定性地量产数字人短视频。",
  email: "hello@shuying.ai",
  bizEmail: "bd@shuying.ai",
  location: "中国 · 北京",
  year: 2026,
};

export type NavItem = { label: string; href: string; external?: boolean };

export const nav: NavItem[] = [
  { label: "产品", href: "/product" },
  { label: "博客", href: "/blog" },
  { label: "关于", href: "/about" },
  { label: "联系", href: "/contact" },
];

/** Hero */
export const hero = {
  eyebrow: "CASE-FIRST CONTENT FACTORY",
  // 两行 thesis：把内容生产说成精密制造
  titleLines: ["让内容生产，", "像精密制造一样可信。"],
  lead:
    "树影 Cutagent 以 Case 为长期学习边界，把「脚本 → 数字人成片 → 多平台发布 → 数据回流 → 自进化」全链路，落到 16 个可校验的流水线节点上。为 B 端品牌，确定性地量产数字人短视频。",
  primaryCta: { label: "查看产品能力", href: "/product" },
  secondaryCta: { label: "读技术博客", href: "/blog" },
};

/** 公司叙事「我们是谁」 */
export const manifesto = {
  eyebrow: "WHO WE ARE",
  title: "我们把 AI 内容生产，重写成一门工程。",
  paragraphs: [
    "过去三年，生成式 AI 让「做一条视频」变得廉价，却没让「稳定地、成规模地、对品牌负责地做一万条视频」变得可行。Demo 很惊艳，量产很崩溃 —— 风格漂移、质量随机、无法追溯、无法复用。",
    "树影的答案是把内容生产当成制造业来做：每一条能力都落到强契约接口上，每一次生成都留下带类型的 artifact 与运行报告，每一次降级都分级显式上报，绝不静默。我们要的不是更炫的 demo，而是一条可信、可审计、可规模化的内容流水线。",
  ],
  signature: "—— 这就是 Cutagent。",
};

export type Capability = {
  id: string;
  index: string;
  name: string;
  tag: string;
  summary: string;
  points: string[];
};

/** 产品能力（源自真实系统能力矩阵，蒸馏为 6 个能力域） */
export const capabilities: Capability[] = [
  {
    id: "case",
    index: "01",
    name: "Case 工作台 & 自进化闭环",
    tag: "case.evolve",
    summary:
      "Case 是账号 / 品牌所有脚本、成片、记忆、素材与指标的长期学习边界。内容越产越懂你。",
    points: [
      "生成时写入盲预测，采用 / 成片 / 发布 / 指标回填写入奖励信号",
      "复盘用评分卡校准，升版人工确认，红线由人维护",
      "Case Agent 生成 ScriptDraft 并采用为版本化脚本",
    ],
  },
  {
    id: "pipeline",
    index: "02",
    name: "16 节点生产流水线",
    tag: "workflow.run",
    summary:
      "一个 Job 触发一次 WorkflowRun，按固定节点序执行，产出带类型 artifacts、运行报告与分级降级。",
    points: [
      "节点只做一件事，输入哈希可复用、可 resume、可 retry",
      "Temporal 编排，独立 worker 消费生产队列",
      "不静默降级 —— 每一次兜底都分级显式上报",
    ],
  },
  {
    id: "media",
    index: "03",
    name: "媒体内核",
    tag: "media.core",
    summary:
      "从语音到成片的全媒体管线，由 ffmpeg / ffprobe 驱动，强制对齐、帧级精确。",
    points: [
      "TTS 字幕 → 强制对齐 → ASR，strict 模式无估算回退",
      "jieba 关键词 / 语义匹配 B-roll，BGM 智能混音",
      "帧级精确渲染，消灭切镜闪帧",
    ],
  },
  {
    id: "lipsync",
    index: "04",
    name: "数字人口型同步",
    tag: "lipsync.video",
    summary:
      "口型同步是一种可插拔的 provider 能力，可灰度、可切换、可透传跳过。",
    points: [
      "默认 RunningHub HeyGem，备选 DashScope VideoReTalk",
      "立绘轨构建 + LipSync + 渲染分离为独立节点",
      "禁用时节点透传，链路不中断",
    ],
  },
  {
    id: "publish",
    index: "05",
    name: "多平台发布中心",
    tag: "publish.batch",
    summary:
      "构建发布包 → 组装多平台批次 → 提交 → 单条重试 → 追踪 attempts，自动生成文案与封面。",
    points: [
      "发布是隔离边界，失败不污染生产",
      "成片列表 / 预览 / 签名 URL 下载，剪映草稿包交接",
      "多平台目标，单条可重试、可追溯",
    ],
  },
  {
    id: "gateway",
    index: "06",
    name: "Provider 网关 & 运营中台",
    tag: "gateway.ops",
    summary:
      "所有外部 AI / 媒体调用按能力分发、计费治理、secret 隔离；运营全程可观测。",
    points: [
      "llm / vlm / tts / asr / lipsync / image 六大能力统一网关",
      "价格目录受治理审批，用量 / 余额 / 对账闭环",
      "Ops 看板、成品率漏斗、预算告警、Prometheus 指标",
    ],
  },
];

export type PipelinePhase = {
  phase: string;
  nodes: { n: string; label: string; en: string }[];
};

/** 16 节点流水线 —— 签名元素的数据 */
export const pipeline: PipelinePhase[] = [
  {
    phase: "准入",
    nodes: [
      { n: "01", label: "校验请求", en: "Validate" },
      { n: "02", label: "载入 Case", en: "LoadCaseContext" },
      { n: "03", label: "解析创意", en: "ResolveCreativeIntent" },
    ],
  },
  {
    phase: "合成",
    nodes: [
      { n: "04", label: "语音合成", en: "TTS" },
      { n: "05", label: "素材规划", en: "MaterialPackPlanning" },
      { n: "06", label: "旁白对齐", en: "NarrationAlign" },
    ],
  },
  {
    phase: "编排",
    nodes: [
      { n: "07", label: "立绘规划", en: "PortraitPlanning" },
      { n: "08", label: "B-roll 规划", en: "BrollPlanning" },
      { n: "09", label: "风格规划", en: "StylePlanning" },
      { n: "10", label: "时间线规划", en: "TimelinePlanning" },
      { n: "11", label: "立绘轨构建", en: "PortraitTrack" },
    ],
  },
  {
    phase: "渲染",
    nodes: [
      { n: "12", label: "口型同步", en: "LipSync" },
      { n: "13", label: "渲染", en: "Render" },
      { n: "14", label: "字幕 + BGM", en: "SubtitleBGMMix" },
      { n: "15", label: "导出", en: "Export" },
      { n: "16", label: "收尾报告", en: "FinalizeReport" },
    ],
  },
];

/** Case 自进化闭环 */
export const loop = {
  eyebrow: "THE CASE LOOP",
  title: "一条会自我进化的内容飞轮。",
  lead:
    "Case 把每一次生成与每一份数据回流都沉淀为学习信号。内容不是一次性产出，而是一个随时间收敛、越来越懂品牌的系统。",
  steps: [
    { n: "①", title: "脚本生成", desc: "Case Agent 基于品牌边界与记忆生成脚本草稿，写入盲预测。" },
    { n: "②", title: "数字人成片", desc: "16 节点流水线把脚本锻造成带类型 artifact 的成片。" },
    { n: "③", title: "多平台发布", desc: "组装批次投放到多平台，沉淀真实曝光与互动。" },
    { n: "④", title: "数据回流", desc: "巨量引擎等渠道指标离线归一化，喂回表现闭环。" },
    { n: "⑤", title: "复盘自进化", desc: "评分卡校准奖励信号，升版人工确认，下一轮更准。" },
  ],
};

export type Stat = { value: string; label: string; sub: string };

/** 工程化数据（真实约束，不是虚荣指标） */
export const stats: Stat[] = [
  { value: "16", label: "流水线节点", sub: "固定节点序 · 可复用 · 可 resume" },
  { value: "6", label: "Provider 能力域", sub: "统一网关 · 计费治理 · secret 隔离" },
  { value: "0", label: "静默降级", sub: "所有兜底分级显式上报" },
  { value: "100%", label: "契约校验", sub: "contract-first · OpenAPI 唯一事实源" },
];

export type Demo = { title: string; meta: string; desc: string; ratio: "9:16" | "16:9" };

/** 首页 demo 视频占位 */
export const demos: Demo[] = [
  {
    title: "口播成片 · 端到端",
    meta: "CASE → VIDEO",
    desc: "从 Case 上下文到带字幕、配乐、口型同步的成片，一次 WorkflowRun 跑通。",
    ratio: "9:16",
  },
  {
    title: "多账号矩阵 · 批量",
    meta: "BATCH JOBS",
    desc: "批量建 Job，确定性素材选择按 ledger 近期降权，规模化而不雷同。",
    ratio: "9:16",
  },
  {
    title: "发布中心 · 多平台",
    meta: "PUBLISH BATCH",
    desc: "一次组装多平台批次，自动文案封面，单条可重试、可追溯。",
    ratio: "9:16",
  },
];

/** 关于页 —— 价值主张 */
export const values = [
  {
    title: "工程，而非魔法",
    desc: "我们不迷信「一个大模型解决一切」。可信的量产来自强契约、确定性与可观测，而不是运气。",
  },
  {
    title: "Case 是第一性原理",
    desc: "内容生产的单位不是一条视频，而是一个长期学习的边界。系统为品牌积累记忆，越用越懂。",
  },
  {
    title: "不静默降级",
    desc: "宁可显式报错，也不偷偷给次品。每一次兜底都分级上报，质量永远可被追问。",
  },
  {
    title: "为 B 端而生",
    desc: "面向需要规模化、合规、可审计内容的品牌与机构。我们卖的是产能与确定性。",
  },
];

/** 社交 / 外链占位（上线前替换为真实链接） */
export const socials: NavItem[] = [
  { label: "GitHub", href: "https://github.com/nanzhi84", external: true },
  { label: "Email", href: "mailto:hello@shuying.ai", external: true },
];
