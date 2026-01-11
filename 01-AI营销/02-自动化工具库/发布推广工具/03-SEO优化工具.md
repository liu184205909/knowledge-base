# SEO优化自动化:直接调用AI API

> **AI SEO优化的底层实现** | 2026-01-11 | 聚焦API而非封装工具

---

## 🎯 核心理念

**不要使用封装工具,直接调用AI API + SEO API!**

```
❌ 错误方式:
Surfer SEO/Clearscope → 封装工具 → 成本更高,功能受限

✅ 正确方式:
Claude/OpenAI API(生成内容) + Ahrefs API(关键词研究) → 成本更低,完全控制
```

---

## 🚀 三种实现方式

### 方式1: MCP工具集成 (最简单)

**适用场景**: 快速SEO优化

**MCP配置**:
```json
{
  "mcpServers": {
    "ahrefs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-ahrefs"]
    }
  }
}
```

**在Claude Code中使用**:
```bash
# SEO优化流程
任务:
1. 使用Ahrefs API研究关键词"AI工具"
2. 使用Claude生成SEO优化文章
3. 检查关键词密度、Meta标签、H标签结构
4. 返回优化建议
```

---

### 方式2: Python脚本 (推荐,最灵活)

**完整SEO自动化系统**:
```python
import os
import requests
from typing import List, Dict
import json

class SEOAutomationPipeline:
    """SEO自动化流水线"""

    def __init__(self):
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.ahrefs_api_key = os.getenv("AHREFS_API_KEY")
        self.ahrefs_api_url = "https://api.ahrefs.com/v3"

    def keyword_research(
        self,
        seed_keyword: str,
        limit: int = 50
    ) -> List[Dict]:
        """关键词研究"""

        # 使用Ahrefs Keywords Explorer API
        response = requests.get(
            f"{self.ahrefs_api_url}/keywords-explorer",
            params={
                "where": "keyword,partial,'{seed_keyword}',match",
                "order_by": "volume:desc",
                "limit": limit,
                "having": "volume,gt,100",  # 搜索量>100
                "and": "difficulty,lt,30"   # KD<30
            },
            headers={"Authorization": f"Bearer {self.ahrefs_api_key}"}
        )

        keywords = response.json()["keywords"]

        # 过滤高价值关键词
        high_value = []
        for kw in keywords:
            if kw["volume"] > 500 and kw["difficulty"] < 20:
                high_value.append(kw)

        return high_value

    def generate_seo_content(
        self,
        keyword: str,
        target_length: int = 2500,
        related_keywords: List[str] = None
    ) -> Dict:
        """生成SEO优化内容"""

        if related_keywords is None:
            related_keywords = []

        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": self.anthropic_api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 4000,
                "messages": [{
                    "role": "user",
                    "content": f"""生成SEO优化文章:

主关键词: {keyword}
目标字数: {target_length}字
相关关键词: {', '.join(related_keywords[:10])}

要求:
1. H1标题包含主关键词
2. 5-7个H2小标题
3. 每个H2下2-3个H3
4. 主关键词密度: 1-2%
5. 自然融入相关关键词
6. 包含具体数据和案例
7. Meta标题: 50-60字符
8. Meta描述: 150-160字符
9. URL建议: 简短、包含关键词

返回JSON格式:
{{
  "h1": "文章标题",
  "meta_title": "SEO标题",
  "meta_description": "SEO描述",
  "url_slug": "url建议",
  "content": "完整文章内容(Markdown格式)",
  "word_count": 实际字数,
  "keyword_density": 关键词密度百分比
}}"""
                }]
            }
        )

        content = response.json()["content"][0]["text"]
        return json.loads(content)

    def seo_audit(self, content: str, target_keyword: str) -> Dict:
        """SEO审计"""

        word_count = len(content.split())
        keyword_count = content.lower().count(target_keyword.lower())
        keyword_density = (keyword_count / word_count) * 100

        # 检查H标签结构
        has_h1 = "<h1>" in content.lower()
        h1_count = content.lower().count("<h1>")
        h2_count = content.lower().count("<h2>")
        h3_count = content.lower().count("<h3>")

        # 检查内部链接机会
        internal_link_opportunities = []

        # 检查外部链接
        external_links = []

        # 检查图片Alt标签
        images_without_alt = []

        # SEO评分
        score = 100
        issues = []

        if not has_h1:
            score -= 20
            issues.append("缺少H1标签")

        if h1_count > 1:
            score -= 10
            issues.append("多个H1标签")

        if keyword_density < 1:
            score -= 15
            issues.append(f"关键词密度过低: {keyword_density:.1f}%")

        if keyword_density > 2:
            score -= 10
            issues.append(f"关键词密度过高: {keyword_density:.1f}%")

        if word_count < 1500:
            score -= 20
            issues.append(f"内容过短: {word_count}字")

        if h2_count < 3:
            score -= 10
            issues.append(f"H2标签过少: {h2_count}个")

        return {
            "score": max(0, score),
            "word_count": word_count,
            "keyword_density": f"{keyword_density:.1f}%",
            "h1_count": h1_count,
            "h2_count": h2_count,
            "h3_count": h3_count,
            "issues": issues,
            "recommendations": self._generate_recommendations(issues)
        }

    def _generate_recommendations(self, issues: List[str]) -> List[str]:
        """生成改进建议"""

        if not issues:
            return ["SEO得分优秀,无需改进"]

        recommendations = []

        for issue in issues:
            if "H1" in issue:
                recommendations.append("添加唯一的H1标签,包含主关键词")

            elif "关键词密度" in issue:
                recommendations.append("调整关键词出现次数,保持在1-2%")

            elif "内容过短" in issue:
                recommendations.append("扩充内容到2000字以上,增加案例和数据")

            elif "H2标签" in issue:
                recommendations.append("增加更多H2小标题,丰富内容结构")

        return recommendations

    def batch_seo_optimization(
        self,
        keywords: List[str],
        output_dir: str = "./articles"
    ) -> List[Dict]:
        """批量SEO优化"""

        results = []

        for keyword in keywords:
            try:
                # 1. 生成SEO内容
                content = self.generate_seo_content(
                    keyword=keyword,
                    target_length=2500
                )

                # 2. SEO审计
                audit = self.seo_audit(
                    content=content["content"],
                    target_keyword=keyword
                )

                # 3. 保存文件
                filename = f"{output_dir}/{keyword.replace(' ', '-')}.md"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content["content"])

                results.append({
                    "keyword": keyword,
                    "filename": filename,
                    "seo_score": audit["score"],
                    "word_count": audit["word_count"],
                    "status": "optimized"
                })

            except Exception as e:
                results.append({
                    "keyword": keyword,
                    "error": str(e),
                    "status": "failed"
                })

        return results

# 使用示例
pipeline = SEOAutomationPipeline()

# 示例1: 关键词研究
keywords = pipeline.keyword_research("AI工具", limit=50)
print(f"找到{len(keywords)}个高价值关键词")

# 示例2: 生成SEO文章
content = pipeline.generate_seo_content(
    keyword="AI项目管理工具",
    target_length=2500,
    related_keywords=["项目管理软件", "team collaboration tools"]
)

# 示例3: SEO审计
audit = pipeline.seo_audit(content["content"], "AI项目管理工具")
print(f"SEO得分: {audit['score']}")
print(f"改进建议: {audit['recommendations']}")

# 示例4: 批量优化
results = pipeline.batch_seo_optimization(keywords[:10])
```

**成本计算**:
```bash
# 月度成本估算

Ahrefs API定价:
- Standard: $129/月
- 5000次请求/月
- 每次关键词研究 = 1次请求

Claude API定价:
- 每篇文章生成: ~5000 tokens
- 50篇文章 = 250K tokens
- 成本: $0.75

vs 封装工具(Surfer SEO: $69-149/月):
- 成本降低: 30-60%
- 功能更强: 直接控制
```

---

### 方式3: n8n工作流 (可视化)

**n8n工作流示例: 自动化SEO内容生产**:
```javascript
// Node 1: 关键词研究
节点类型: HTTP Request
URL: https://api.ahrefs.com/v3/keywords-explorer
Method: GET

// Node 2: 循环处理关键词
节点类型: Split In Batches
批次大小: 5

// Node 3: 生成SEO文章
节点类型: HTTP Request
URL: https://api.anthropic.com/v1/messages

// Node 4: SEO检查
节点类型: Code
代码: SEO评分逻辑

// Node 5: 质量评分
节点类型: If
条件: SEO评分 > 80

// Node 6: 不合格重新生成
节点类型: HTTP Request
重新生成内容

// Node 7: 保存到WordPress
节点类型: WordPress
创建文章

// Node 8: 记录结果
节点类型: Google Sheets
```

---

## 📊 SEO工具API对比

### 主流API对比

| API | 功能 | 价格 | 推荐度 |
|-----|------|------|--------|
| **Ahrefs API** | 关键词研究、竞品分析、外链分析 | $129-299/月 | ⭐⭐⭐⭐⭐ |
| **SE Ranking API** | 关键词研究、排名追踪 | $49-149/月 | ⭐⭐⭐⭐ |
| **Moz API** | 链接分析、关键词研究 | $149-999/月 | ⭐⭐⭐ |
| **SerpAPI** | 搜索结果追踪 | $50-250/月 | ⭐⭐⭐⭐ |

---

## 💡 高级技巧

### 技巧1: 自动化内链建设

```python
def build_internal_links(content: str, site_url: str) -> Dict:
    """自动生成内链建议"""

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.getenv("ANTHROPIC_API_KEY"),
            "Content-Type": "application/json"
        },
        json={
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1000,
            "messages": [{
                "role": "user",
                "content": f"""分析文章并生成内链建议:

文章内容: {content[:2000]}

网站: {site_url}

请识别:
1. 可以链接的其他相关页面(最多5个)
2. 每个链接的锚文本建议
3. 链接的自然插入位置建议

返回JSON格式。"""
            }]
        }
    )

    return response.json()["content"][0]["text"]
```

### 技巧2: 竞品内容分析

```python
def analyze_competitor_content(competitor_url: str) -> Dict:
    """分析竞品内容"""

    # 使用Playwright MCP抓取竞品页面
    # 分析:
    # - 内容结构
    # - 关键词使用
    # - 内链策略
    # - 内容长度

    # 然后使用Claude生成改进建议

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.getenv("ANTHROPIC_API_KEY"),
            "Content-Type": "application/json"
        },
        json={
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 2000,
            "messages": [{
                "role": "user",
                "content": f"""分析竞品页面并给出超越建议:

竞品URL: {competitor_url}

请分析:
1. 内容优点(3个)
2. 内容缺点(3个)
3. 我们如何超越(5个具体建议)

返回详细分析报告。"""
            }]
        }
    )

    return response.json()["content"][0]["text"]
```

### 技巧3: 排名追踪自动化

```python
def track_rankings(
    keywords: List[str],
    your_site: str
) -> Dict[str, int]:
    """追踪关键词排名"""

    # 使用SerpAPI或Ahrefs API
    rankings = {}

    for keyword in keywords:
        # 调用API获取搜索结果
        response = requests.get(
            "https://serpapi.com/search",
            params={
                "engine": "google",
                "q": keyword,
                "api_key": os.getenv("SERPAPI_KEY")
            }
        )

        # 查找你的网站排名
        results = response.json()["organic_results"]
        for i, result in enumerate(results):
            if your_site in result["link"]:
                rankings[keyword] = i + 1
                break
        else:
            rankings[keyword] = None  # 未找到

    return rankings
```

---

## 📚 相关文档

- [03-批量生产流水线.md](./03-批量生产流水线.md) - 多Agent协作
- [01-图片自动化.md](./01-图片自动化.md) - 图片生成
- [02-视频自动化.md](./02-视频自动化.md) - 视频生成

---

## ⚠️ 注意事项

1. **API速率限制**: 注意API调用频率
2. **内容质量**: AI生成内容需人工审核
3. **关键词堆砌**: 避免过度优化
4. **更新频率**: 定期更新内容保持新鲜度
5. **竞争对手**: 定期分析竞品策略

---

**创建时间**: 2026-01-11
**核心理念**: AI生成内容 + SEO API = 完全控制! 🚀
