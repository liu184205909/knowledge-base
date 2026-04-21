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

### Voicebox

**GitHub**: https://github.com/jamiepine/voicebox

**简介**: 本地优先的开源语音克隆桌面应用，免费版 ElevenLabs，支持声音克隆、文本转语音、音频后期处理与多轨叙事编辑，全程不上云

**核心功能**: 声音克隆、文本转语音（TTS）、多轨叙事编辑、音频后期处理、本地API服务

**特点**:
- 17.4K+ star
- 全本地运行，隐私安全，无需联网
- 基于 Tauri (Rust) + React 构建，跨平台（macOS/Windows/Linux）
- 支持多种语音引擎（Qwen3-TTS等）
- 提供本地 API 接口，可二次集成
- 几秒音频样本即可克隆声音
- GPU加速（CUDA/Metal/XPU），CPU兼容运行

**系统要求**: 8GB+内存（推荐16GB），5GB+存储空间

**快速使用**:
```bash
# 开发部署
git clone https://github.com/jamiepine/voicebox.git
cd voicebox
just setup
just dev

# API 调用示例
curl -X POST http://localhost:17493/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "profile_id": "abc123", "language": "en"}'
```

**适用场景**: 视频配音、有声书制作、播客制作、语音克隆、内容创作

---

### BuilderPulse

**GitHub**: https://github.com/builderpulse/builderpulse

**简介**: 每日精选 AI 创业者资讯报告，通过 GitHub 仓库每日自动发布，帮独立开发者和创业者快速获取行业动态

**核心功能**: 每日 AI 创业新闻精选、趋势分析、工具与产品推荐

**特点**:
- 全自动内容生成，每日定时发布
- 覆盖 AI 创业、独立开发、SaaS 等领域
- 通过 GitHub Issues/Releases 分发，订阅方便
- 可作为行业信息源，辅助选题和趋势判断

**适用场景**: 行业信息获取、选题灵感、趋势追踪

---

### video-use

**GitHub**: https://github.com/browser-use/video-use

**简介**: Claude Code Skill，用自然语言剪辑视频，自动去口癖、加字幕、调色，完全免费开源

**核心功能**: 自动剪辑、去口头禅、自动调色、烧录字幕、音频淡入淡出、动画叠加、渲染自评

**特点**:
- 来自 browser-use 团队，Claude Code 原生 Skill
- LLM 不看视频帧，通过音频转录（12KB 文本）+ 按需视觉合成图剪辑，节省 token
- 支持 ElevenLabs Scribe 逐词时间戳 + 说话人分离
- 渲染后自动自评（画面跳变、音频爆音、字幕遮挡），不通过则自动修复
- 会话持久化（project.md），支持中断续剪

**依赖**: Python、ffmpeg、ElevenLabs API Key（可选）

**快速使用**:
```bash
git clone https://github.com/browser-use/video-use
cd video-use
ln -s "$(pwd)" ~/.claude/skills/video-use
pip install -e .
brew install ffmpeg
```
然后进入素材文件夹，对 Claude Code 说：`将这些素材剪辑成一条发布视频`

**适用场景**: 短视频制作、播客剪辑、口播去口癖、自媒体内容生产

---

**最后更新**: 2026-04-21
