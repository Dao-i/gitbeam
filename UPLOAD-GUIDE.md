# GitHub 上传指南（给 AI 助手看）

## 任务

把本文件夹（`github-release/`）的内容上传到 GitHub 新建仓库。

## 文件夹内容

```
github-release/
├── main.js
├── preload.js
├── renderer.html
├── renderer.js
├── style.css
├── icon.png
├── package.json
├── .gitignore
├── README.md       ← 仓库首页介绍
├── AGENTS.md       ← 给 AI 助手看的项目文档
├── UPLOAD-GUIDE.md ← 本文件
```

## 执行步骤

### 1. 创建 GitHub 仓库

```bash
# 先确保已登录
gh auth status

# 创建公开仓库
gh repo create gitbeam --public --description "像刷小红书一样刷 GitHub 有趣项目 | Browse GitHub trending projects like TikTok" --source=. --push
```

如果没有 `gh` CLI，用浏览器手动创建：
1. 打开 https://github.com/new
2. Repository name: `gitbeam`
3. Description: `像刷小红书一样刷 GitHub 有趣项目 | Browse GitHub trending projects like TikTok`
4. Public
5. 不要勾选 Initialize with README（我们自己有）

### 2. 初始化并推送

```bash
cd /path/to/github-release
git init
git add .
git commit -m "feat: GitBeam v2.0 — GitHub trending browser with AI translation & smart categories"
git branch -M main
git remote add origin https://github.com/Dao-i/gitbeam.git
git push -u origin main
```

### 3. 验证

推送后检查：
- https://github.com/Dao-i/gitbeam — README 正确显示
- 所有文件都在
- 没有敏感信息（API Key、密码等）

## 仓库名称

建议：`gitbeam`

## 给仓库加 Topics

在 GitHub 仓库页面设置中加以下 Topics：
```
electron desktop-app github-trending translator chinese ai-summary desktop-widget
```

## 注意事项

- **绝对不要**上传 `node_modules/`、`dist/`、任何包含 API Key 的文件
- 已经确认 `renderer.js` 中没有硬编码的 API Key（只有 placeholder 示例）
- README.md 是双语（中文为主 + 英文副标题）
- AGENTS.md 是给 AI 编码助手看的，人在仓库里也能看
