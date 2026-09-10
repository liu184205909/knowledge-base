#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""文本工具分类 hub（slug=text-tools，parent=tools → /tools/text-tools/，id 34265）
11 个文本工具（rmb-uppercase/pinyin-converter/chinese-converter/working-days-calculator
四个工具页已放弃删除，卡片不留死链）。卡内用 span 防 wpautop 拆 a>div。
用法：python build_text_hub_page.py（生成 payload 后由发布脚本 curl POST）"""
import json, io, sys

sys.stdout.reconfigure(encoding='utf-8')

css = """
#kjg-tt-hub{position:relative;left:50%;transform:translateX(-50%);width:calc(100vw - 36px);max-width:960px;margin:24px 0;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#0b0b0b}
.tt-crumb{font-size:12.5px;color:#898781;margin-bottom:14px}
.tt-crumb a{color:#52514e;text-decoration:none}
.tt-crumb a:hover{color:#2a78d6}
.tt-hero h1{font-size:24px;margin:0 0 8px}
.tt-hero p{font-size:14px;color:#52514e;margin:0 0 22px;line-height:1.75}
.tt-catsub{font-size:13px;color:#52514e;background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:14px 18px;margin:0 0 24px;line-height:1.8}
.tt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:26px}
.tt-card{display:block;background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:13px 15px;text-decoration:none;color:#0b0b0b;transition:border-color .15s,box-shadow .15s}
.tt-card:hover{border-color:#2a78d6;box-shadow:0 2px 10px rgba(42,120,214,.12)}
.tt-card .t{display:block;font-size:14px;font-weight:700;margin-bottom:3px}
.tt-card .d{display:block;font-size:12px;color:#52514e;line-height:1.55}
.tt-faq details{background:#fff;border:1px solid #e1e0d9;border-radius:10px;padding:12px 16px;margin-bottom:8px}
.tt-faq summary{font-weight:600;cursor:pointer;font-size:14.5px}
.tt-faq p{font-size:13.5px;color:#4a4945;margin:8px 0 0;line-height:1.7}
.tt-foot{font-size:12px;color:#898781;margin-top:8px}
.tt-foot a{color:#898781}
@media(max-width:760px){.tt-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.tt-grid{grid-template-columns:1fr}}
"""

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
    # span（inline）防 wpautop 拆 a>div（曾致浏览器解析出 3 倍克隆卡）
    return ''.join(
        f'<a class="tt-card" href="{u}"><span class="t">{t}</span><span class="d">{d}</span></a>'
        for t, u, d in items)

html = ('<div id="kjg-tt-hub">\n<style>' + css + '</style>\n'
  '<p class="tt-crumb"><a href="/">首页</a> › <a href="/tools/">在线工具</a> › 文本与效率工具</p>\n'
  '<div class="tt-hero">\n<h1>文本与效率工具</h1>\n'
  '<p>11 个高频文本与效率工具，覆盖大小写与命名风格转换、英文金额、字数统计、文本去重、花体英文、URL 与 Base64 编解码、时间戳、进制转换、随机密码与增值税计算。全部在浏览器本地运行，输入内容不上传服务器、不留存，即开即用无需注册——写 Listing、开支票、整理关键词清单、核对财务金额时随手可用。</p>\n</div>\n'
  '<div class="tt-catsub"><strong>怎么选：</strong>改文案风格用大小写与花体转换；开支票与财务金额场景用英文金额大写与增值税计算器；处理关键词与清单用去重、字数统计；开发与数据对接用 URL / Base64 / 时间戳 / 进制转换。</div>\n'
  f'<div class="tt-grid">{cards(text_tools)}</div>\n'
  '<div class="tt-faq">\n'
  '<details><summary>这些工具会保存我输入的内容吗？</summary><p>不会。全部 11 个工具都在浏览器本地完成计算，文本与数据不发送到任何服务器、不写入数据库。关闭页面即消失，敏感内容（如密码生成、财务金额）可以放心使用。</p></details>\n'
  '<details><summary>金额与税率计算符合财务规范吗？</summary><p>英文金额大写输出支票标准写法，支持美元、英镑、欧元、日元四种币种；增值税计算器按含税/不含税互算，覆盖 13%/9%/6%/3% 四档税率。重要票据建议再按银行要求人工复核一遍。</p></details>\n'
  '<details><summary>字数统计与 Word 的口径一致吗？</summary><p>提供 12 项口径：字数（汉字+单词，与 Word 主口径基本一致）、字符数（计空格/不计空格）、汉字、单词、标点、行数等。不同平台审核口径不同，按目标平台要求选用对应数字即可。</p></details>\n'
  '</div>\n'
  '<div class="tt-foot">工具持续增加 · <a href="/tools/">全部工具</a> · <a href="/tools/seo-tools/">SEO 与域名工具</a> · 跨境谷 kuajinggu.com</div>\n'
  '</div>')

payload = {"title": "文本与效率工具", "slug": "text-tools", "status": "publish", "content": html}
io.open('text_hub_payload.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('text hub payload ready:', len(html))
