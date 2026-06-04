# 视频转文稿工具

> 从 YouTube / B站 等平台提取视频音频，使用 Groq Whisper 转写为文字，输出到 stdout 供 Claude Code 直接总结。
>
> **支持平台**: YouTube、B站、抖音、小红书等数千个网站（yt-dlp + 哼哼猫双通道）

---

## 工作流程

```
视频 URL
  │
  ├─ yt-dlp 提取音频（主通道）
  │    └─ 失败 → 哼哼猫 API 提取（备选通道）
  │
  ├─ Groq Whisper Large V3 Turbo 转写
  │    └─ 216x 实时速度、支持 99+ 语言
  │
  └─ 输出到 stdout（不保存文件）
       └─ Claude Code 读取转写文本 → 总结 → 写入知识库
```

---

## 前置准备

### 1. 安装依赖

```bash
pip install yt-dlp groq requests
```

### 2. 获取 Groq API Key（免费）

1. 访问 [https://console.groq.com/keys](https://console.groq.com/keys)
2. 用 Google / GitHub 登录
3. 点「Create API Key」
4. 复制生成的 Key（`gsk_xxxxxxxx` 格式）

**费用**: 免费额度充足，Whisper Large V3 Turbo 约 $0.03/小时转录

### 3. 配置 .env 文件

```bash
# 必需 — Groq API Key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx

# 可选 — HTTP 代理（访问 YouTube 需要）
PROXY=http://127.0.0.1:10808

# 可选 — 哼哼猫 API（yt-dlp 失败时的备选通道）
# 获取地址: https://www.henghengmao.com/user/developer
HHM_USER_ID=你的用户ID
HHM_SECRET_KEY=你的密钥
```

---

## 使用方法

### 基本用法（默认输出到 stdout）

```bash
# YouTube 视频
python video_to_note.py https://www.youtube.com/watch?v=xxxxx

# B站视频（yt-dlp 失败时自动切换哼哼猫）
python video_to_note.py https://www.bilibili.com/video/BVxxxxx

# 英文视频
python video_to_note.py URL --lang en
```

### 完整参数

```
python video_to_note.py <URL> [选项]

参数:
  URL                   视频 URL

选项:
  --lang, -l LANG       音频语言（默认: zh，英文: en）
  --save                保存 Markdown 文件到磁盘（默认不保存）
  --output, -o DIR      输出目录（配合 --save 使用，默认: ./results）
  --keep-audio          保留音频文件（需配合 --save）
  --proxy, -p URL       HTTP 代理地址
  --api-key KEY         Groq API Key（或设置环境变量）
```

### 与 Claude Code 配合使用

脚本默认将转写结果输出到 stdout，进度信息输出到 stderr。

在 Claude Code 中：

1. 运行脚本，stdout 的转写文本会被 Claude 直接读取
2. Claude 自动总结内容、提炼重点
3. 决定是否写入知识库（与读文章的处理方式完全一致）

```bash
# 在 Claude Code 中运行（stderr 显示进度，stdout 供 Claude 读取）
python video_to_note.py https://www.youtube.com/watch?v=xxxxx
```

---

## 双通道下载

| 通道 | 适用场景 | 费用 |
|------|----------|------|
| **yt-dlp**（主） | YouTube 等大多数平台 | 免费 |
| **哼哼猫 API**（备选） | B站等反爬严格的平台 | ~3分钱/次 |

脚本自动处理：优先尝试 yt-dlp，失败后自动切换哼哼猫（需配置 .env）。

---

## 技术架构

```
视频 URL
  │
  ├─ yt-dlp 提取音频（免费、开源，支持数千平台）
  │    └─ 失败 → 哼哼猫 API 提取（备选，支持 999+ 平台）
  │
  ├─ Groq Whisper Large V3 Turbo 转写（$0.03/小时）
  │    └─ 216x 实时速度、支持 99+ 语言
  │
  └─ stdout 输出转写文本
       └─ 含时间戳、元数据，可直接用于 Claude Code 总结
```

---

## 常见问题

### Q: yt-dlp 下载失败？
- **YouTube**: 尝试添加代理 `--proxy http://127.0.0.1:10808`
- **B站**: 配置哼哼猫 API 作为备选通道（在 .env 设置 HHM_USER_ID 和 HHM_SECRET_KEY）
- 更新 yt-dlp: `pip install -U yt-dlp`

### Q: 音频文件超过 25MB？
脚本会自动使用 ffmpeg 分段处理。如未安装 ffmpeg:
- Windows: `winget install ffmpeg` 或从 [ffmpeg.org](https://ffmpeg.org) 下载
- 安装后确保 `ffmpeg` 在 PATH 中

### Q: 转写质量不好？
- 确认 `--lang` 参数正确（中文 `zh`、英文 `en`、日文 `ja`）
- 噪音大的视频转写质量会下降
- 技术术语多的视频可尝试 `--lang en`（中英混合时英文模式有时更好）

### Q: 如何保存原始文稿？
添加 `--save` 参数：`python video_to_note.py URL --save`

---

## 相关文档

- [自动化工具库 README](../README.md)
