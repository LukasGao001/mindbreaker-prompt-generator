# 思维破壁机 · MindBreaker Prompt Generator

> 用思维模型打破认知壁垒，把零散的任务"炼"成高质量、可直接粘贴给 AI 的 Prompt。
> A single-file, local-first prompt generator that augments your tasks with mental models and reusable context — then produces a clean prompt you can paste into Claude / GPT.

**[👉 在线使用 / Live Demo](https://lukasgao001.github.io/mindbreaker-prompt-generator/)**

零安装、零依赖、零后端：整个工具就是**一个 HTML 文件**，下载双击即用，数据全部存在你本机浏览器里。

---

## ✨ 功能特性 Features

- **上下文复用**：管理公司、项目（含背景）、你在项目中的角色，下拉即选，免去每次重输。
- **思维模型匹配**：内置 24 个思维模型（逆向思维、第一性原理、安全边际……）+ 12 个 Prompt 框架（角色扮演、思维链、对比多方案……）。描述任务后，本地关键词算法自动推荐相关模型并简介，可勾选增减。
- **一键生成 Prompt**：把角色 + 身份 + 项目背景 + 项目记忆 + 附件 + 任务 + 选中模型 + 输出要求，拼装成结构化 Prompt，预览区可微调，一键复制。
- **持续记忆**：全局"身份"始终生效 + 每个项目独立"记忆"，随做随记，注入每次生成；可手动编辑，或用 AI 一键提炼追加。
- **补充信息源（附件）**：支持 Word / Excel / CSV / PPT / PDF / 图片，作为信息源注入 Prompt。文本类离线直读，Office/PDF 联网用解析库自动提取文字，图片留给 AI 识图。文件存于浏览器 IndexedDB。
- **模型库可视化编辑**：在界面里增删改自定义思维模型 / 框架，无需改代码，可一键恢复默认。
- **导出 / 导入配置**：一份 JSON 带走全部数据（公司 / 项目 / 角色 / 模型库 / 历史 / 设置），换电脑无缝迁移。
- **可选接入 AI（OpenAI 兼容）**：填入 API Key 后可启用「AI 智能匹配」与「AI 直接生成结果」（支持图片识图）。Key 只存本机。

---

## 🚀 快速开始 Quick Start

### 方式一：在线直接用
打开 **[在线版](https://lukasgao001.github.io/mindbreaker-prompt-generator/)** 即可，数据存在你自己的浏览器。

### 方式二：本地使用
1. 下载本仓库的 `index.html`（或 `Code → Download ZIP`）。
2. 双击用浏览器打开，开始使用。

无需安装 Node、无需构建、无需联网（解析 Office/PDF 与调用 AI 时除外）。

---

## 🧠 使用流程

1. 选择公司 → 选择/新增项目（填背景）→ 选择/新增你的角色。
2. （可选）在「记忆 / 身份」里写下你的长期身份与项目记忆；在左栏添加附件作为信息源。
3. 在中栏描述任务，点「匹配模型」，勾选合适的思维模型与框架。
4. 点 **Generate**，在右侧预览区微调，点「复制」。
5. 粘贴到 Claude / GPT，得到你的交付物。

---

## 🔒 隐私 Privacy

- 所有数据（上下文、模型库、附件、历史、API Key）**只保存在你本地浏览器**（`localStorage` + `IndexedDB`），不上传任何服务器。
- 仅当你**主动启用 AI** 或**解析 Office/PDF** 时，才会分别向你配置的 AI 接口、或公共 CDN 发起网络请求。

---

## 🛠️ 技术说明 Tech Notes

- 单文件原生 HTML + CSS + JavaScript，无框架、无构建步骤。
- 文档解析按需从 CDN 懒加载：[mammoth.js](https://github.com/mwilliamson/mammoth.js)（docx）、[SheetJS](https://github.com/SheetJS/sheetjs)（xlsx）、[JSZip](https://github.com/Stuk/jszip)（pptx）、[pdf.js](https://github.com/mozilla/pdf.js)（pdf）。
- AI 调用走标准 OpenAI 兼容 `/chat/completions` 接口。

> 注意：浏览器直接调用第三方 AI 接口可能受 CORS 限制。如遇拦截，可改用支持 CORS 的网关地址。

---

## 🤝 贡献 Contributing

欢迎 Issue 与 PR：新增高质量思维模型 / Prompt 框架、改进匹配算法、增加文件格式支持、UI 优化等。
由于是单文件项目，直接编辑 `index.html` 即可。

---

## 📄 License

[MIT](./LICENSE) © Lukas Gao
