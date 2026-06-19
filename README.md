# GitBeam — 像刷小红书一样刷 GitHub

**Browse GitHub trending projects like scrolling TikTok — with AI translation, smart categories, and a desktop widget.**

桌面右上角悬浮窗，卡片流刷 GitHub 热门项目。中文自动翻译、智能分类、一键复制部署命令。

![License](https://img.shields.io/badge/license-MIT-purple)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Electron](https://img.shields.io/badge/Electron-33%2B-9cf)

---

## 功能 Features

| 功能 | 说明 |
|------|------|
| **卡片流浏览** | 像刷短视频一样左右滑 GitHub 项目 |
| **12 语言翻译** | Google Translate 免费翻译描述（中日韩英法德西葡俄阿印） |
| **AI 智能摘要** | DeepSeek 自动总结 README（可选，需填 API Key） |
| **6 大分类** | 全部 / AI·Skill / 软件工具 / 框架库 / 知识文档 / 开发运维 |
| **5 种榜单** | 日榜 / 周榜 / 月榜 / 总星标 / 上升最快 |
| **部署命令** | 自动识别 npm/pip/docker/git clone 等安装方式，点击复制 |
| **收藏夹** | 右滑收藏，集中查看 |
| **主题定制** | 8 色主题 + 深色/浅色模式 + 标准/紧凑窗口 |
| **迷你模式** | 折叠为 180px 小导航条，一键展开 |
| **开机自启** | 自动加入 Windows 启动文件夹 |
| **完全免费** | 翻译用 Google 免费 API，无任何付费依赖 |

---

## 安装 Installation

### 方式一：下载 EXE（推荐）
从 [Releases](../../releases) 下载 `GitBeam 1.0.0.exe`，双击运行。

### 方式二：从源码运行
```bash
git clone https://github.com/Dao-i/gitbeam.git
cd gitbeam
npm install
npm start
```

### 方式三：自行打包
```bash
npm install
npm run build
# EXE 输出在 dist/ 目录
```

---

## 使用 Usage

| 操作 | 快捷键/方式 |
|------|------------|
| 跳过当前项目 | ← 方向键 / 点 × 按钮 |
| 收藏当前项目 | → 方向键 / 点  按钮 |
| 查看详情 | Enter / 点  按钮 / 点卡片 |
| 关闭详情 | Esc |
| 折叠/展开窗口 | 标题栏 `-` / `+` |
| 最小化 | 标题栏 `_` |
| 收托盘 | 标题栏 `×` |

**Settings 设置页：**
- 填入 DeepSeek API Key → 启用 README 智能摘要
- 选择目标语言 → 翻译 + UI 文字同步切换
- 主题色 / 深浅模式 / 窗口大小

---

## 配置 AI 摘要（可选）

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com)
2. 注册并获取 API Key（新用户有免费额度）
3. 在 GitBeam **设置** 页填入 Key
4. 之后点开项目详情会看到 AI 生成的 README 摘要

**不留 Key 也能用：** 翻译走 Google 免费 API，不填 Key 也能完整浏览。

---

## 项目结构 Structure

```
gitbeam/
├── main.js          # Electron 主进程（窗口、托盘、代理、迷你模式）
├── preload.js       # IPC 桥接
├── renderer.html    # UI 结构
├── renderer.js      # 核心逻辑（数据抓取、翻译、分类、详情）
├── style.css        # 样式（深色/浅色/紧凑三套主题）
├── icon.png         # 应用图标
├── package.json     # 依赖配置
└── github-release/  # 开源发布文件夹（本目录）
```

---

## 技术栈 Tech Stack

- **桌面框架:** Electron 33
- **数据源:** GitHub Search API
- **翻译:** Google Translate (免费) + MyMemory (兜底)
- **AI 摘要:** DeepSeek Chat API (可选)
- **动画:** GSAP 3
- **分类:** 本地关键词匹配（无需网络）

---

## 常见问题 FAQ

**Q: 为什么分类里没内容？**
A: 分类是本地关键词匹配，热门项目刷新后自动分类。可以先看「全部」。

**Q: 翻译不准？**
A: 用的是 Google Translate，技术名词偶尔不准确。AI 摘要更准确但需配 Key。

**Q: 窗口关不了？**
A: × 按钮是最小化到托盘，在系统托盘右键点「退出」彻底关闭。

**Q: 代理怎么配？**
A: 代码已内置 `127.0.0.1:7897` 代理，改成你自己的地址重新打包即可。

---

## License

MIT — 自由使用、修改、分发。
