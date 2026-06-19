# AGENTS.md — GitBeam 项目指引（给 AI 编码助手看）

## 这是什么

GitBeam 是一个 Electron 桌面应用，在桌面右上角以卡片流形式展示 GitHub 热门项目。支持多语言翻译、智能分类、排行榜、收藏夹、主题切换。

## 如果你要安装运行

```bash
npm install
npm start
```

首次启动需要网络（抓取 GitHub API）。如果在中国大陆，确保 Electron 进程能走代理（`main.js` 已内置 `127.0.0.1:7897` 代理配置，按需修改）。

## 如果你要打包 EXE

```bash
npm run build
# 输出: dist/GitBeam 1.0.0.exe (约 70MB 便携版)
```

打包需要：
- 网络能访问 GitHub（下载 electron 二进制）
- 如果走代理：`export HTTP_PROXY=http://127.0.0.1:7897`

## 文件说明

| 文件 | 作用 | 修改注意 |
|------|------|---------|
| `main.js` | Electron 主进程：窗口(420×620)、无边框透明、置顶、迷你模式、系统托盘、代理配置 | 改窗口尺寸/代理地址改这里 |
| `preload.js` | IPC 桥接：minimize / toggleMini / onMiniChanged | 不要加 nodeIntegration |
| `renderer.html` | UI 结构：4 个标签页、卡片、详情、分类、榜单、设置 | 所有文本有 `data-i18n` 属性 |
| `renderer.js` | **核心逻辑（最长文件）**：GitHub API 抓取、Google Translate 翻译、关键词分类、DeepSeek 摘要、GSAP 动画、设置持久化 | 核心文件，结构见下方 |
| `style.css` | CSS 变量主题系统：深色/浅色/紧凑模式 | `:root` 变量控制全局配色 |

## renderer.js 架构

```
全局变量与配置
├── I18N 多语言字典（zh-CN/en/ja）
├── CAT_RULES 分类关键词（ai/tool/lib/docs/devops）
├── classifyRepo() 本地关键词分类
├── 数据状态管理（projects/rankings/favorites/settings）
│
DOM 初始化（DOMContentLoaded）
├── applySettings() — 从 localStorage 恢复设置
├── applyI18n() — 切换界面语言
├── 事件绑定（标签页/分类/榜单/详情/设置）
│
数据层
├── fetchTrending(period) — GitHub Search API
├── translateBatch() — Google Translate → MyMemory 兜底
├── fetchReadmeSummary() — DeepSeek AI 摘要 / 原文降级
├── detectDeployBatch() — 从 README 识别部署命令
│
UI 层
├── renderCard() — GSAP 卡片动画
├── renderRankings() — 榜单列表
├── openDetail() / closeDetail() — 详情页
│
设置层
├── 主题色（8 色 CSS 变量）
├── 深浅模式（CSS class toggle）
├── 紧凑模式（CSS class toggle）
├── 翻译语言（重新翻译缓存）
├── API Key（DeepSeek 摘要）
```

## 分类系统

分类不是用 GitHub API 过滤的（会导致空结果），而是：
1. 从 GitHub API 抓取全部热门项目（30 个）
2. 本地 `classifyRepo()` 根据项目名/描述/话题/语言做关键词匹配
3. 匹配规则见 `CAT_RULES` 对象

如果要调整分类关键词，改 `CAT_RULES`。

## 翻译系统

- 描述翻译：Google Translate 免费 API（`translate.googleapis.com`）
- 兜底：MyMemory API
- README 摘要：DeepSeek Chat API（需用户在设置页填 Key）
- 没有填 Key 时，README 摘要降级为原文前 200 字符

## i18n 多语言

语言切换逻辑：
- 设置页选择"翻译目标语言" → 同步切换 UI 文字 + 项目描述翻译
- 如果所选语言有完整 UI 字典（目前 zh-CN/en/ja），UI 完全切换
- 否则 UI 降级为英文
- 要添加新语言：在 `I18N` 对象加一个语言条目即可

## 注意事项

- Electron 窗口 frameless + transparent，CSS 负责所有圆角和阴影
- `-webkit-app-region: drag` 让标题栏可拖拽，交互区用 `no-drag` 排除
- 关闭按钮不是 quit，是 hide 到托盘
- 代理配置在 main.js 的 setupProxy()，默认 127.0.0.1:7897
- localStorage 的缓存 key 前缀是 `gitbeam_v3`，30 分钟过期
- 设置持久化 key: `gitbeam_settings`
- 收藏持久化 key: `gitbeam_favs_v3`

## GitHub API 编码注意

**重要：** GitHub Search API 的 `q` 参数不能用 `encodeURIComponent` 全量编码，因为：
- `+` 在 URL 中表示空格，但 `encodeURIComponent` 会把它变成 `%2B`
- `(` 和 `)` 用于分组语法，编码后 GitHub API 不识别

正确做法（已在代码中）：
```js
const query = parts.join(" ");                    // 用空格拼接
const encoded = encodeURIComponent(query)           // 编码特殊字符
  .replace(/%20/g, "+");                           // 空格还原为 +
```
