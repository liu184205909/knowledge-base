#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""跨境谷工具箱 hub 页（slug=tools，id 34045）：22 工具两区，无状态标签
用法：python build_hub_page.py"""
import json, io, sys

sys.stdout.reconfigure(encoding='utf-8')

css = """
#kjg-tools-hub{position:relative;left:50%;transform:translateX(-50%);width:calc(100vw - 36px);max-width:960px;margin:24px 0;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#0b0b0b}
.hub-hero h1{font-size:25px;margin:0 0 8px}
.hub-hero p{font-size:14px;color:#52514e;margin:0 0 24px;line-height:1.7}
.hub-cat{margin-bottom:30px}
.hub-cat h2{font-size:17px;margin:0 0 4px}
.hub-cat .sub{font-size:12.5px;color:#898781;margin:0 0 14px}
.hub-cat .sub a{color:#2a78d6;text-decoration:none}
.hub-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
.hub-card{display:block;background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:13px 15px;text-decoration:none;color:#0b0b0b;transition:border-color .15s,box-shadow .15s}
.hub-card:hover{border-color:#2a78d6;box-shadow:0 2px 10px rgba(42,120,214,.12)}
.hub-card .t{display:block;font-size:14px;font-weight:700;margin-bottom:3px}
.hub-card .d{display:block;font-size:12px;color:#52514e;line-height:1.55}
.hub-foot{font-size:12px;color:#898781;margin-top:8px}
@media(max-width:760px){.hub-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.hub-grid{grid-template-columns:1fr}}
"""

seo_tools = [
    ("全球网站权威生态雷达", "/tools/seo-tools/dr-radar/", "Top 100 万域名权威榜：批量外链验资、可疑域名检测、月度崛起雷达"),
    ("DR Checker 实时查询", "/tools/seo-tools/dr-checker/", "直连 Ahrefs 官方接口查任意域名 DR，附全球排名百分位"),
    ("Robots.txt 检测器", "/tools/seo-tools/robots-checker/", "解析任意站点 robots：规则/UA/sitemap+14 个 AI 爬虫权限对照"),
    ("安全响应头检测", "/tools/seo-tools/security-header-checker/", "HSTS/CSP 等六项安全头评分与逐项修复建议"),
    ("重定向链追踪器", "/tools/seo-tools/redirect-tracer/", "逐跳追踪 301/302 跳转链路，环路检测，最多 10 跳"),
    ("Meta 标签提取器", "/tools/seo-tools/meta-extractor/", "Title/OG/Canonical/hreflang 一键体检与长度校验"),
    ("Sitemap 提取器", "/tools/seo-tools/sitemap-extractor/", "URL 计数+子表结构+lastmod 月度更新分布"),
    ("AI 爬虫访问检测", "/tools/seo-tools/ai-bot-checker/", "以 GPTBot/ClaudeBot 等 5 个 UA 实测站点是否真开放"),
    ("查询扇出生成器", "/tools/seo-tools/query-fanout/", "GLM 生成同义改写/隐含查询/子问题各 5 条"),
    ("llms.txt 生成器", "/tools/seo-tools/llms-txt-generator/", "为 AI 爬虫生成站点说明文件，GEO 优化第一步"),
    ("robots.txt 生成器", "/tools/seo-tools/robots-txt-generator/", "含 Googlebot/GPTBot 等 AI 爬虫策略配置"),
    ("JSON-LD 生成器", "/tools/seo-tools/json-ld-generator/", "Organization/Article/FAQ 等结构化数据一键生成"),
    ("UTM 链接构建器", "/tools/seo-tools/utm-builder/", "渠道追踪参数拼接与预览"),
    ("hreflang 生成器", "/tools/seo-tools/hreflang-generator/", "多语言 alternate 标签组生成与互指校验"),
    ("PageSpeed 性能检测", "/tools/seo-tools/pagespeed-check/", "Lighthouse 四评分+核心指标+优化机会（移动/桌面）"),
    ("DNS 记录查询", "/tools/seo-tools/dns-lookup/", "A/MX/TXT/NS 等 7 类记录，Google DoH 直查"),
    ("Whois 域名信息", "/tools/seo-tools/whois-lookup/", "注册商/到期日/状态，RDAP 免费协议"),
    ("Wayback 历史快照", "/tools/seo-tools/wayback-check/", "任意 URL 的存档年份分布与快照链接"),
    ("SERP 预览器", "/tools/seo-tools/serp-preview/", "Title/Description 截断模拟，桌面+移动双预览"),
]

text_tools = [
    ("大小写转换", "/tools/text-tools/case-converter/", "10 种大小写与命名风格互转（含 APA 标题规范）"),
    ("英文金额大写", "/tools/text-tools/amount-in-words/", "支票标准英文金额写法，四币种"),
    ("字数统计", "/tools/text-tools/word-count/", "字数/字符/汉字/单词/标点 12 项口径"),
    ("文本去重", "/tools/text-tools/dedupe-tool/", "按行去重、计数模式、排序与自定义分隔"),
    ("花体英文转换", "/tools/text-tools/fancy-text/", "12 种 Unicode 花体风格即时预览"),
    ("URL 编码解码", "/tools/text-tools/url-encode-decode/", "中文参数与特殊字符的编码双向转换"),
    ("Base64 编解码", "/tools/text-tools/base64-tool/", "文本 Base64 双向转换，中文正确处理"),
    ("时间戳转换", "/tools/text-tools/timestamp-converter/", "Unix 时间戳与日期互转，批量模式"),
    ("进制转换器", "/tools/text-tools/base-converter/", "2-36 任意进制互转，大数 BigInt 精度"),
    ("随机密码生成", "/tools/text-tools/password-generator/", "可配置强度，排除易混淆字符"),
    ("增值税计算器", "/tools/text-tools/tax-calculator/", "含税/不含税互算，13%/9%/6%/3% 税率"),
]

def cards(items):
    # 卡内用 span（inline），wpautop 不拆 a>div 边界（曾致浏览器解析出 3 倍克隆卡）
    return ''.join(
        f'<a class="hub-card" href="{u}"><span class="t">{t}</span><span class="d">{d}</span></a>'
        for t, u, d in items)

html = ('<div id="kjg-tools-hub">\n<style>' + css + '</style>\n'
  '<div class="hub-hero">\n<h1>跨境谷在线工具箱</h1>\n'
  '<p>为跨境卖家和 SEO 从业者打造的免费工具集，共 30 个。全部本地运行或官方接口直连，不留存任何输入数据。</p>\n</div>\n\n'
  '<div class="hub-cat">\n<h2>SEO 与域名工具</h2>\n'
  '<p class="sub">19 个 · 域名权威、外链尽调、GEO 与技术 SEO · <a href="/tools/seo-tools/">查看工具列表</a></p>\n'
  f'<div class="hub-grid">\n{cards(seo_tools)}\n</div>\n</div>\n\n'
  '<div class="hub-cat">\n<h2>文本与效率工具</h2>\n'
  '<p class="sub">11 个 · 大小写、时间戳、进制等高频文本工具 · <a href="/tools/text-tools/">查看工具列表</a></p>\n'
  f'<div class="hub-grid">\n{cards(text_tools)}\n</div>\n</div>\n\n'
  '<div class="hub-foot">数据来源：Domain Rating by Ahrefs · 工具持续增加 · 跨境谷 kuajinggu.com</div>\n'
  '</div>')

payload = {"title": "在线工具箱 - 免费 SEO 与文本效率工具", "content": html}
io.open('hub_payload.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('hub payload ready:', len(html))
