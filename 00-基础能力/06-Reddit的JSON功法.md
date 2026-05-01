# Reddit 的 JSON 功法

> 来源：Reddit r/ClaudeCode 社区、AI Jason（@AIJasonZ）YouTube/Instagram 系列内容整理
> 核心思路：利用 Reddit 的隐藏 JSON 端点，免费获取结构化数据，无需 API 密钥

## 一、核心技巧

在任意 Reddit URL 后面加上 `.json`，即可将该页面的所有内容以 JSON 文档返回。

**示例：**

```
https://www.reddit.com/r/ClaudeCode.json
```

**关键优势：**
- 无需认证，无需 API 密钥
- 对公开 subreddit 完全开放
- 返回结构化数据（标题、正文、评论、投票数、时间戳等）
- 可替代 Reddit 官方 API（2023年后官方API限制越来越严）

## 二、URL 格式参考

| 目标 | URL 示例 |
|------|---------|
| 某个 subreddit 的帖子列表 | `reddit.com/r/ClaudeCode.json` |
| 某篇帖子 + 评论 | `reddit.com/r/ClaudeCode/comments/1rlrjg5.json` |
| 某个用户的帖子 | `reddit.com/user/username.json` |
| 搜索结果 | `reddit.com/search.json?q=claude+code` |
| 热门帖子 | `reddit.com/r/ClaudeCode/hot.json` |
| 新帖 | `reddit.com/r/ClaudeCode/new.json` |
| Top 帖子 | `reddit.com/r/ClaudeCode/top.json?t=week` |

## 三、JSON 数据结构速览

返回的 JSON 包含两层（数组形式）：

1. **第一个对象** — 帖子信息（title, selftext, score, num_comments, author, created_utc 等）
2. **第二个对象** — 评论信息（树状嵌套结构，每个评论包含 body, score, replies 等）

关键字段说明：

```
data.children[].data.title        — 帖子标题
data.children[].data.selftext     — 帖子正文（纯文本）
data.children[].data.score        — 投票数
data.children[].data.num_comments — 评论数
data.children[].data.author       — 作者
data.children[].data.created_utc  — 创建时间（Unix时间戳）
data.children[].data.url          — 链接（外部链接贴）
data.children[].data.permalink    — Reddit内部链接
```

## 四、配合 Claude Code 使用

### 方式 1：直接让 Claude Code 读取 JSON

```
请读取 https://www.reddit.com/r/ClaudeCode.json，
提取今天得分最高的前10个帖子，标题和摘要整理成表格。
```

### 方式 2：编写 Python 脚本批量采集

让 Claude Code 写一个脚本：

```
请写一个 Python 脚本，功能如下：
1. 通过 Reddit JSON 端点获取 r/ClaudeCode 的最新帖子
2. 提取标题、得分、评论数、作者
3. 按得分排序，保存到 CSV 文件
4. 支持分页（使用 after 参数）
```

### 方式 3：做成 Skill 定期监控

创建一个 Claude Code Skill，定期抓取你关注的 subreddit，自动生成摘要报告。

### 方式 4：Claude Code 中的 MCP 工具

如果装了 web-reader 或 web-search MCP，可以直接在 Claude Code 对话中让 AI 读取 JSON URL。

## 五、注意事项

1. **速率限制**：Reddit 会对未认证请求做速率限制（约60次/分钟），大量采集需要加入延时
2. **User-Agent**：建议在请求头中设置合理的 User-Agent，避免被封
3. **私有 subreddit**：`.json` 只对公开内容有效
4. **数据量**：热门 subreddit 的 JSON 可能很大（几MB），注意处理
5. **评论分页**：深层评论需要用 `more` 对象的 `children` 字段继续请求

## 六、与其他采集方式对比

来自 r/ClaudeCode 社区的 9 种 Claude Code 数据采集方式：

| 方式 | 成本 | 适用场景 |
|------|------|---------|
| 直接让 Claude Code 爬 | 免费 | 简单页面 |
| 让 Claude Code 逆向API | 免费 | 动态加载页面 |
| Apify Actor | 付费 | 难爬站点（如Google Maps） |
| Firecrawl → Markdown | 付费 | 大规模非结构化页面 |
| DIY HTML → Markdown | 免费 | 中小规模结构化 |
| yt-dlp | 免费 | YouTube 视频/字幕 |
| **Reddit JSON 端点** | **免费** | **Reddit 数据** |
| Agent Browser + 凭证 | 免费/付费 | 需要登录的站点 |

## 七、延伸玩法

- **竞品监控**：监控竞争对手相关 subreddit 的讨论
- **用户需求挖掘**：分析用户痛点帖子，找到产品灵感
- **内容灵感**：追踪热门话题，为内容创作提供素材
- **情感分析**：将 JSON 数据喂给 LLM，分析社区对特定话题的情感倾向
- **趋势发现**：定期抓取，对比数据变化，发现新兴趋势

## 参考来源

- [Best Ways to Scrape Data with Claude Code](https://www.reddit.com/r/ClaudeCode/comments/1rlrjg5/best_ways_to_scrape_data_with_claude_code/) — r/ClaudeCode 原帖
- [Best way to Scrape Reddit posts](https://www.reddit.com/r/ClaudeCode/comments/1sjl56y/best_way_to_scrape_reddit_posts/) — r/ClaudeCode 讨论帖
- AI Jason YouTube/Instagram 系列：[the reddit json endpoint trick](https://www.instagram.com/reel/DW_xAR-j-L5/)
