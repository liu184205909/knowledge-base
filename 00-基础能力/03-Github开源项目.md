# 推荐开源项目收藏

> **优质GitHub项目集合** | 持续更新 | 最后更新：2026-03-02

---

## 🔖 项目列表

### ERPNext

**GitHub**: https://github.com/frappe/erpnext

**简介**: 100%免费开源的企业资源计划系统（ERP）

**核心功能**: 财务、销售、采购、库存、制造、人力资源、客户关系、项目管理

**特点**:
- 用户友好且可定制
- 低代码/无代码构建器
- API优先设计
- 多子公司、多币种支持

**适用场景**: 中小型企业资源管理

---

### Fluent-M3U8

**GitHub**: https://github.com/zhiyiYo/Fluent-M3U8

**简介**: 跨平台M3U8流媒体下载工具

**特点**:
- 跨平台（Windows/macOS/Linux）
- 多线程并发下载
- 支持AES-128-CBC解密
- 批量任务管理

**适用场景**: 视频下载和流媒体处理

---

### Vibe

**GitHub**: https://github.com/thewh1teagle/vibe

**简介**: 跨平台本地语音转录利器，基于 OpenAI Whisper 模型实现全离线音频/视频转录

**核心功能**: 音频转录、视频转录、实时转录、多语言识别、说话人分离

**特点**:
- 全离线处理，数据本地完成，隐私安全
- 支持100+种语言，可翻译为英文
- 全格式兼容（MP4/MP3/MKV等），导出SRT/VTT/PDF等
- GPU加速（Nvidia/AMD/Intel），转录速度提升3-5倍
- 支持视频网站链接解析、麦克风/系统音频实时转录
- AI增强拓展（Claude API、Ollama本地分析）
- 跨平台（Windows/macOS/Linux）

**适用场景**: 会议记录、视频字幕、语音笔记、内容转录

---

### QtScrcpy

**GitHub**: https://github.com/barry-ran/QtScrcpy

**简介**: 安卓手机实时投屏到电脑的开源工具，支持电脑控制手机

**核心功能**: 实时投屏、键鼠控制、屏幕录制、截图、剪贴板同步、群控

**特点**:
- 无需Root权限
- 支持USB或无线网络连接
- 跨平台（Windows/Mac/Linux）
- 支持多设备连接与批量操作

**适用场景**: 办公自动化、游戏娱乐、开发调试、教学演示

---

### ebook2audiobook

**GitHub**: https://github.com/DrewThomasson/ebook2audiobook

**简介**: 将电子书一键转换为有声读物的开源工具，支持1100+种语言

**核心功能**:
- 电子书转有声书（支持epub、pdf、mobi、txt等20+格式）
- 语音克隆（可上传自己的声音样本）
- 智能章节划分
- 多语言支持（1100+种语言）

**特点**:
- 全离线处理，隐私安全
- 跨平台支持（Windows/macOS/Linux）
- GPU加速，转换速度快
- 输出m4b格式，包含完整章节信息

**快速使用**:
```bash
# 克隆项目
git clone https://github.com/DrewThomasson/ebook2audiobook.git
cd ebook2audiobook

# Linux/macOS
./ebook2audiobook.sh

# Windows
ebook2audiobook.cmd
```

**适用场景**: 碎片化学习、通勤听书、技术文档转音频

---

### AiToEarn

**GitHub**: https://github.com/yikart/AiToEarn

**简介**: AI 驱动的内容增长与变现平台，一站式搞定创作、发布、互动、变现

**核心功能**:
- 多平台一键分发（抖音、小红书、B站、TikTok、YouTube等）
- 热点灵感智能挖掘（爆款案例库 + 实时热点雷达）
- 精准评论挖掘转化（识别高转化意向评论）
- AI 全流程内容创作（文案、图片、视频生成）
- 统一互动管理后台
- 跨平台数据复盘

**特点**:
- 11.5K+ star
- Docker 一键部署
- 对接主流 AI 模型（OpenAI、DeepSeek、Claude、Gemini）
- 面向自媒体博主、品牌方、电商商家

**适用场景**: 自媒体运营、内容分发、流量变现

---

### bb-browser（坏孩子浏览器）

**GitHub**: https://github.com/epiral/bb-browser

**简介**: 通过复用真实 Chrome 浏览器登录态进行网站自动化操作的工具，专为 AI Agent 和开发者设计，天然绕过反爬检测

**核心功能**: 平台数据抓取、浏览器自动化（打开/点击/输入/执行JS/抓包/截图）、结构化JSON输出、MCP模式接入AI编辑器

**特点**:
- 复用真实浏览器登录态，无需重新登录或导出Cookie
- 内置36大平台、103条命令（知乎/微博/Twitter/GitHub/YouTube/雪球等）
- CLI直接调用 + MCP模式，可接入Claude Code、Cursor
- AI可在10分钟内自动逆向新网站生成适配命令（`bb-browser guide`）
- 支持`jq`过滤与多标签页并发，方便Agent批量处理

**快速使用**:
```bash
# 安装
npm install -g bb-browser

# 更新适配器并查看推荐站点
bb-browser site update
bb-browser site recommend

# 示例：知乎热榜 / Twitter搜索 / 股票行情
bb-browser site zhihu/hot
bb-browser site twitter/search "RAG"
bb-browser site eastmoney/stock "茅台"
```

**适用场景**: 需要登录态的平台数据采集、AI Agent信息调研、跨平台批量数据抓取

---

**最后更新**: 2026-04-16
