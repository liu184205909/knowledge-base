# -*- coding: utf-8 -*-
"""
读取 5 个清洗 md 文件,解析 slug + 竞对名 + 文章类型,批量写入飞书多维表格。

输入文件:
  1. 清洗_AlfaLaval_SPXFlow_GEA_Myande.md (主数据源,3712 条)
  2. 清洗_原报告6家_ANDRITZ_Saltworks_EBNER_Sunevap_Vanoo_Enchem.md
  3. 清洗_中小站9家.md
  4. 清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md (反引号包裹 slug)
  5. 清洗_AlfaLaval_SPXFlow.md  -- 已确认为文件 1 的子集,忽略

格式变体:
  - 文件 1: "- slug" 或 "- slug | 推断主题"
  - 文件 2/3: 三反引号代码块,每行一个 slug,可能有 # 注释或箭头注释
  - 文件 4: 反引号包裹 slug,后跟可选注释
"""

import json
import re
import time
import urllib.request
import urllib.error
import os

# ============================================================
# 配置
# ============================================================
APP_ID = os.environ.get("LARK_APP_ID", "")
APP_SECRET = os.environ.get("LARK_APP_SECRET", "")
BASE_TOKEN = "NVS3bslX5aAlVWsXdGIcnOwinWh"
TABLE_ID = "tblU9N0w0fWN3KEk"
TOKEN_URL = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
BATCH_CREATE_URL = (
    "https://open.feishu.cn/open-apis/bitable/v1/apps/"
    + BASE_TOKEN
    + "/tables/"
    + TABLE_ID
    + "/records/batch_create"
)
BATCH_SIZE = 500
SLEEP_BETWEEN_BATCH = 0.5

INPUT_DIR = r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析"

# ============================================================
# 国别映射
# ============================================================
COUNTRY_MAP = {
    # 国际
    "ANDRITZ": "国际",
    "Saltworks": "国际",
    "EBNER": "国际",
    "Alfa Laval": "国际",
    "SPX Flow": "国际",
    "GEA": "国际",
    "Swenson": "国际",
    # 外贸(中国外贸站)
    "Sunevap": "外贸",
    "Vanoo": "外贸",
    "Enchem": "外贸",
    "SAMCO": "外贸",  # 实际是美国品牌,但归到外贸组(任务书如此)
    "Alaqua": "外贸",
    "Toption": "外贸",
    "ENCO": "外贸",
    "ASOS": "外贸",
    "Condorchem": "外贸",
    "Zewatech": "外贸",
    "Goldfinch": "外贸",
    "Ace": "外贸",
    "Vteya": "外贸",
    "Shachi": "外贸",
    # 国内
    "嘉泰": "国内",
    "Myande": "国内",
    "敏杰": "国内",
    "乐科": "国内",
    "MKS": "国内",
    # 新发现(默认外贸,除非明确国内)
    "Ion Exchange": "外贸",
    "MJJX": "国内",
    "Jiatai": "国内",
}

# ============================================================
# 文章类型映射(类型 N → 飞书字段值)
# ============================================================
TYPE_MAP = {
    1: "1-解决方案/案例",
    2: "2-What-Is/原理",
    3: "3-FAQ/买家提问",
    4: "4-技术对比/ROI",
    5: "5-运维/材料/节能",
    6: "6-展会/新闻/项目",
    7: "7-地理SEO",  # 注意:飞书表里选项是 "7-地理SEO",没有"模板"二字
    8: "8-其他",
}

# ============================================================
# 行业场景关键词推断(根据 slug 关键词)
# ============================================================
INDUSTRY_KEYWORDS = [
    # (关键词列表, 行业场景)
    (["lithium", "li2co3", "spodumene", "battery", "lithium-ion"], "锂电/电池"),
    (["coal", "mining", "rare-earth", "mineral", "kaolin"], "矿业/选矿"),
    (["pfas", "pfos"], "PFAS/PFOS"),
    (["oil", "gas", "petrochemical", "refinery", "crude"], "油气/石化"),
    (["pharma", "biotech", "medical"], "制药/生物"),
    (["food", "beverage", "dairy", "brew", "beer", "wine", "starch", "sugar"], "食品/饮料"),
    (["chemical", "chlor-alkali", "sulphuric", "caustic"], "化工"),
    (["wastewater", "sewage", "effluent", "water-treatment"], "废水处理"),
    (["zld", "zero-liquid-discharge", "zero liquid"], "ZLD"),
    (["desalination", "seawater"], "海水淡化"),
    (["semiconductor", "microelectronics"], "半导体"),
    (["textile", "dye", "dyeing"], "纺织/印染"),
    (["power", "energy", "boiler"], "电力/能源"),
    (["marine", "ship", "ballast"], "船舶/海运"),
    (["data-center", "datacenter"], "数据中心"),
    (["steel", "metallurgy", "metal"], "钢铁/冶金"),
    (["pulp", "paper"], "造纸/纸浆"),
    (["cement"], "水泥"),
    (["fertilizer", "ammonia", "urea", "npk"], "化肥"),
]


def infer_industry(slug):
    """根据 slug 中的关键词推断行业场景。"""
    slug_lower = slug.lower()
    for keywords, industry in INDUSTRY_KEYWORDS:
        for kw in keywords:
            if kw in slug_lower:
                return industry
    return ""


# ============================================================
# 解析函数
# ============================================================
def clean_slug(raw):
    """
    清理 slug 行,返回 (slug, note)。
    支持的格式:
      - "slug"                                → ("slug", "")
      - "slug | 推断主题"                     → ("slug", "推断主题")
      - "slug # 注释"                         → ("slug", "")
      - "slug ← 注释"                         → ("slug", "")
      - "/industries/xxx/yyy/  | [xx] yy _(zz)_"  → ("xxx/yyy", "")
      - "/industries/xxx/yyy/"                → ("xxx/yyy", "") 取最后两段
    """
    raw = raw.strip()
    if not raw:
        return None

    # 去掉行首的 - 或 * 列表标记
    raw = re.sub(r"^[-*\u2022]\s+", "", raw)

    # 去掉行首的反引号包裹 `slug`
    raw = re.sub(r"^`([^`]+)`", r"\1", raw)

    # 去掉行首的 URL 域名(如果有)
    raw = re.sub(r"^https?://[^/\s]+/", "/", raw)

    # 处理 | 分隔的"推断主题"
    note = ""
    if "|" in raw:
        parts = raw.split("|", 1)
        raw = parts[0].strip()
        if len(parts) > 1:
            note = parts[1].strip()

    # 处理 # 注释
    if "#" in raw:
        raw = raw.split("#", 1)[0].strip()

    # 处理 ← 注释
    if "\u2190" in raw:  # ← 箭头
        raw = raw.split("\u2190", 1)[0].strip()

    raw = raw.strip()

    # 去掉行尾的多余 _(xxx)_ 标记(文件 5 的格式)
    raw = re.sub(r"\s*_\([^)]*\)_\s*$", "", raw)

    # 去掉行尾的方括号标记 [xxx]
    raw = re.sub(r"\s*\[[^\]]*\]\s*", " ", raw).strip()

    # 去掉两端反引号、引号、空格
    raw = raw.strip("`\"' ")

    # 去掉行尾斜杠
    raw = raw.rstrip("/")

    if not raw:
        return None

    # 如果是完整 URL 路径(以 / 开头),取最后两段做 slug
    if raw.startswith("/"):
        segments = [s for s in raw.split("/") if s]
        if not segments:
            return None
        # 如果只有 1-2 段,直接拼接
        if len(segments) <= 2:
            slug = "/".join(segments)
        else:
            # 取最后两段(更具有描述性)
            slug = "/".join(segments[-2:])
    else:
        slug = raw

    # 清理 slug 中的空格(替换为连字符)
    slug = re.sub(r"\s+", "-", slug)

    # 去掉行首行尾的连字符
    slug = slug.strip("-")

    if not slug or len(slug) < 2:
        return None

    # 过滤明显非 slug 的行(URL、整段文字)
    if " " in slug and len(slug) > 80:
        # 可能是描述文字,取第一段
        slug = slug.split()[0]

    return (slug, note)


def detect_competitor_from_h2(line):
    """
    从 ## 标题中识别竞对名。
    返回 (竞对名, is_new_section) 或 None。
    """
    # 去掉 ## 前缀
    text = re.sub(r"^#+\s*", "", line).strip()
    # 去掉行尾的 (xxx) 说明
    text = re.sub(r"\s*[\(（].*[\)）]\s*$", "", text).strip()
    # 去掉行尾的全量 slug 说明
    text = re.sub(r"\s+全量 slug.*$", "", text, flags=re.IGNORECASE).strip()
    # 去掉 "一、" "二、" 等中文序号
    text = re.sub(r"^[一二三四五六七八九十]+\s*[、\.]\s*", "", text).strip()
    # 去掉行首数字
    text = re.sub(r"^\d+[\.\s]+", "", text).strip()

    # 已知的竞对名模式
    known = [
        "Alfa Laval",
        "SPX Flow",
        "GEA",
        "Myande",
        "ANDRITZ",
        "Saltworks",
        "EBNER",
        "Sunevap",
        "Vanoo",
        "Enchem",
        "SAMCO",
        "Alaqua",
        "Toption",
        "ENCO",
        "ASOS",
        "Condorchem",
        "Zewatech",
        "Shachi",
        "Goldfinch",
        "Ion Exchange",
        "Swenson",
        "MJJX",
        "嘉泰",
        "Jiatai",
        "Ace",
        "MKS",
        "敏杰",
        "乐科",
        "Vteya",
    ]

    for name in known:
        if text.startswith(name) or text == name:
            return name
        # 也处理 "SAMCO" 后面跟 ( 的情况
        if name + "(" in text or name + "（" in text:
            return name
        # 处理大小写不敏感
        if text.lower().startswith(name.lower()):
            return name

    # 特殊情况:## 三、Zewatech...
    for name in known:
        if name in text:
            return name

    return None


def detect_type_from_h3(line):
    """
    从 ### 标题中识别文章类型编号。
    返回 1-8 的整数,或 None(表示不是类型标题)。
    """
    text = line.strip()

    # 必须以 # 开头
    if not text.startswith("#"):
        return None

    # 去掉 ## 前缀
    text = re.sub(r"^#+\s*", "", text)

    # 模式 1: "类型 1：xxx" 或 "类型1. xxx"
    m = re.match(r"类型\s*(\d)\s*[:：\.·]", text, re.IGNORECASE)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 8:
            return n

    # 模式 2: "Cat 1 — xxx" 或 "Cat 1: xxx"
    m = re.match(r"Cat\s*(\d)\s*[—:\-]", text, re.IGNORECASE)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 8:
            return n

    # 模式 3: "### 类型1 行业应用" (没有冒号)
    m = re.match(r"类型\s*(\d)\s+[\u4e00-\u9fff]", text)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 8:
            return n

    # 模式 4: 文件 2 的 "#### 6.1 行业 case-study" 这种四级标题带类型
    # 不匹配——这是 Ion Exchange 的内部子分类,不是主类型

    # 模式 5: 文件 3 的 "### 类型2 设备原理"
    m = re.match(r"类型\s*(\d)\s", text)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 8:
            return n

    return None


def detect_type_from_code_section(line, current_h4_context):
    """
    文件 3 (中小站)在代码块内有时嵌套 #### 标题(如 "#### 6.3 蒸发器/ZLD 相关")。
    这些子标题通常表示类型 2(技术指南)。
    返回推测的类型,或 None。
    """
    # Ion Exchange 的子章节都是技术指南(类型 2)
    return None  # 默认不识别


def parse_file_1(filepath):
    """
    文件 1: 清洗_AlfaLaval_SPXFlow_GEA_Myande.md
    格式: ## 竞对名 / ### 类型 N / - slug
    """
    records = []
    current_competitor = None
    current_type = None

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            stripped = line.strip()

            # 跳过空行
            if not stripped:
                continue

            # ## 标题:竞对名
            if stripped.startswith("## ") and not stripped.startswith("### "):
                comp = detect_competitor_from_h2(stripped)
                if comp:
                    current_competitor = comp
                    current_type = None  # 重置类型
                continue

            # ### 标题:类型
            if stripped.startswith("### "):
                t = detect_type_from_h3(stripped)
                if t is not None:
                    current_type = t
                continue

            # slug 行:以 - 开头
            if stripped.startswith("- ") and current_competitor and current_type:
                result = clean_slug(stripped[2:])
                if result:
                    slug, note = result
                    records.append(
                        {
                            "竞对": current_competitor,
                            "国别": COUNTRY_MAP.get(current_competitor, ""),
                            "文章类型": TYPE_MAP.get(current_type, ""),
                            "行业场景": infer_industry(slug),
                            "slug": slug,
                            "推断主题": note,
                            "备注": "",
                        }
                    )

    return records


def parse_file_2(filepath):
    """
    文件 2: 清洗_原报告6家.md
    格式: ## 一、ANDRITZ / ### 类型1 · /xxx/ (N 篇) / ```代码块```
    特殊:Sunevap/Vanoo/Enchem 只有样本(在 > 引用块里),需要单独提取。
    """
    records = []
    current_competitor = None
    current_type = None
    in_code_block = False

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            stripped = line.strip()

            # 代码块标记
            if stripped.startswith("```"):
                in_code_block = not in_code_block
                continue

            # 在代码块内
            if in_code_block:
                if not stripped or stripped.startswith("#"):
                    continue
                # 代码块内的 slug
                if current_competitor and current_type:
                    result = clean_slug(stripped)
                    if result:
                        slug, note = result
                        records.append(
                            {
                                "竞对": current_competitor,
                                "国别": COUNTRY_MAP.get(current_competitor, ""),
                                "文章类型": TYPE_MAP.get(current_type, ""),
                                "行业场景": infer_industry(slug),
                                "slug": slug,
                                "推断主题": note,
                                "备注": "",
                            }
                        )
                continue

            # 跳过空行
            if not stripped:
                continue

            # ## 标题:竞对名
            if stripped.startswith("## ") and not stripped.startswith("### "):
                comp = detect_competitor_from_h2(stripped)
                if comp:
                    current_competitor = comp
                    current_type = None
                continue

            # ### 标题:类型(需要识别 "### 类型1 · /xxx/")
            if stripped.startswith("### "):
                t = detect_type_from_h3(stripped)
                if t is not None:
                    current_type = t
                # 文件 2 还有 "### `/articles/` (39 篇)" 这种,需要判断子类型
                # 这里简化:如果标题里包含 articles,默认是类型 2
                elif "/articles/" in stripped or "/insights/" in stripped:
                    current_type = 2  # 大部分 articles 是技术指南
                continue

            # #### 四级标题:Saltworks 的二次归类 "#### 类型2 设备/技术深度指南"
            if stripped.startswith("#### "):
                t = detect_type_from_h3(stripped)
                if t is not None:
                    current_type = t
                # "#### 类型1 行业应用案例"
                elif "类型1" in stripped or "行业应用" in stripped:
                    current_type = 1
                elif "类型2" in stripped or "技术指南" in stripped or "设备" in stripped:
                    current_type = 2
                elif "类型4" in stripped or "对比" in stripped:
                    current_type = 4
                elif "类型5" in stripped or "运维" in stripped:
                    current_type = 5
                elif "类型3" in stripped or "FAQ" in stripped.upper():
                    current_type = 3
                continue

            # Sunevap/Vanoo/Enchem 的样本行:"> - 类型7:`mvr-evaporator-spain`、..."
            if (
                stripped.startswith("> -")
                or stripped.startswith(">类型")
                or "类型" in stripped and ":" in stripped and "`" in stripped
            ):
                # 提取反引号内的 slug
                slugs = re.findall(r"`([^`]+)`", stripped)
                # 提取类型编号
                type_match = re.search(r"类型\s*(\d)", stripped)
                if slugs and type_match and current_competitor:
                    t = int(type_match.group(1))
                    if 1 <= t <= 8:
                        for slug_raw in slugs:
                            # 可能是 "slug1、slug2、slug3" 的情况
                            for slug in re.split(r"[、,]", slug_raw):
                                slug = slug.strip()
                                if slug and len(slug) > 2:
                                    records.append(
                                        {
                                            "竞对": current_competitor,
                                            "国别": COUNTRY_MAP.get(
                                                current_competitor, ""
                                            ),
                                            "文章类型": TYPE_MAP.get(t, ""),
                                            "行业场景": infer_industry(slug),
                                            "slug": slug,
                                            "推断主题": "",
                                            "备注": "样本(原报告未列全量)",
                                        }
                                    )
                continue

    return records


def parse_file_3(filepath):
    """
    文件 3: 清洗_中小站9家.md
    格式: ## 三、Zewatech / ### 类型1 行业应用(N 篇) / ```代码块```
    有些代码块内有 #### 子分类。
    """
    records = []
    current_competitor = None
    current_type = None
    in_code_block = False

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            stripped = line.strip()

            # 代码块标记
            if stripped.startswith("```"):
                in_code_block = not in_code_block
                continue

            # 在代码块内
            if in_code_block:
                if not stripped or stripped.startswith("#"):
                    continue
                # 跳过 URL 样式
                if stripped.startswith("http"):
                    continue
                if current_competitor and current_type:
                    result = clean_slug(stripped)
                    if result:
                        slug, note = result
                        # 去掉明显的非 slug 行(如 "1. xxx" 这种说明性文字)
                        if len(slug) > 100 or slug.startswith("##"):
                            continue
                        # 过滤中文说明行
                        if re.search(r"[\u4e00-\u9fff]{5,}", slug):
                            continue
                        records.append(
                            {
                                "竞对": current_competitor,
                                "国别": COUNTRY_MAP.get(current_competitor, ""),
                                "文章类型": TYPE_MAP.get(current_type, ""),
                                "行业场景": infer_industry(slug),
                                "slug": slug,
                                "推断主题": note,
                                "备注": "",
                            }
                        )
                continue

            # 跳过空行
            if not stripped:
                continue

            # ## 标题:竞对名
            if stripped.startswith("## ") and not stripped.startswith("### "):
                # 跳过 "## 一、总站统计" "## 二、各站分类汇总" 这种非竞对章节
                if any(
                    x in stripped
                    for x in ["总站统计", "各站分类", "横向对比", "策略启示", "数据完整性"]
                ):
                    current_competitor = None
                    current_type = None
                    continue

                comp = detect_competitor_from_h2(stripped)
                if comp:
                    current_competitor = comp
                    current_type = None
                else:
                    current_competitor = None
                continue

            # ### 标题:类型
            if stripped.startswith("### "):
                t = detect_type_from_h3(stripped)
                if t is not None:
                    current_type = t
                # 文件 3 还有 "### 有效内容(N 篇产品/技术页)" 这种,默认类型 2
                elif "有效内容" in stripped or "产品" in stripped:
                    current_type = 2
                elif "35 个 URL 全集" in stripped:
                    # Swenson 全是产品页,类型 8
                    current_type = 8
                continue

            # #### 四级标题:Ion Exchange 的子分类
            if stripped.startswith("#### "):
                # 通常保持当前 ### 设定的类型不变
                # 但如果是 "#### 6.3 蒸发器/ZLD 相关" 这种数字标题,是 Ion Exchange 的分类
                # 默认继承外层 ### 类型(2)
                continue

    return records


def parse_file_4(filepath):
    """
    文件 4: 清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md
    格式: ## SAMCO(...) / ### Cat N — xxx (N 篇) / - `slug`
    """
    records = []
    current_competitor = None
    current_type = None
    in_cross_domain_section = False  # ENCO 的"跨域 SEO"段不计数

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            stripped = line.strip()

            if not stripped:
                continue

            # ## 标题:竞对名
            if stripped.startswith("## ") and not stripped.startswith("### "):
                # 注意:不能在这里检查"跨域"二字——
                # 因为 "## ENCO（抓取 418 URL，剔除 215，跨域 106）" 也含"跨域",
                # 但它其实是正常的竞对章节标题。
                in_cross_domain_section = False

                # 跳过非竞对章节(总览/关键观察/横向对比等)
                if any(x in stripped for x in ["总览", "关键观察", "横向对比", "策略启示"]):
                    current_competitor = None
                    continue

                # 尝试识别竞对名(支持 "## SAMCO（抓取 287 URL...）" 这种格式)
                comp = detect_competitor_from_h2(stripped)
                if comp:
                    current_competitor = comp
                    current_type = None
                else:
                    current_competitor = None
                continue

            # ### 标题:类型 或 ### 跨域 SEO 内容段
            if stripped.startswith("### "):
                # 检查是否是"跨域 SEO 内容"段(只在 ### 级别判断)
                if "跨域" in stripped:
                    in_cross_domain_section = True
                    continue
                in_cross_domain_section = False
                t = detect_type_from_h3(stripped)
                if t is not None:
                    current_type = t
                continue

            # slug 行:以 - 开头
            if (
                stripped.startswith("- ")
                and current_competitor
                and current_type
                and not in_cross_domain_section
            ):
                result = clean_slug(stripped[2:])
                if result:
                    slug, note = result
                    records.append(
                        {
                            "竞对": current_competitor,
                            "国别": COUNTRY_MAP.get(current_competitor, ""),
                            "文章类型": TYPE_MAP.get(current_type, ""),
                            "行业场景": infer_industry(slug),
                            "slug": slug,
                            "推断主题": note,
                            "备注": "",
                        }
                    )

    return records


# ============================================================
# 飞书 API
# ============================================================
def get_tenant_access_token():
    """获取 tenant_access_token。"""
    body = json.dumps({"app_id": APP_ID, "app_secret": APP_SECRET}).encode("utf-8")
    req = urllib.request.Request(
        TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if data.get("code") != 0:
        raise RuntimeError(f"获取 token 失败: {data}")
    return data["tenant_access_token"]


def batch_create_records(token, records):
    """批量写入记录到飞书多维表格。"""
    # 飞书字段值需要包装:文本类型用 {"text": "xxx"} 结构是旧版 API;
    # 新版 bitable API 直接传字符串即可,但为兼容性,我们按字符串传
    fields_list = []
    for r in records:
        fields_list.append({"fields": {k: v for k, v in r.items()}})

    body = json.dumps({"records": fields_list}).encode("utf-8")
    req = urllib.request.Request(
        BATCH_CREATE_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=utf-8",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8") if e.fp else ""
        return {"code": e.code, "msg": body_text}


# ============================================================
# 主流程
# ============================================================
def main():
    print("=" * 60)
    print("飞书多维表格批量导入工具")
    print("=" * 60)

    # 文件路径
    file_1 = os.path.join(INPUT_DIR, "清洗_AlfaLaval_SPXFlow_GEA_Myande.md")
    file_2 = os.path.join(
        INPUT_DIR, "清洗_原报告6家_ANDRITZ_Saltworks_EBNER_Sunevap_Vanoo_Enchem.md"
    )
    file_3 = os.path.join(INPUT_DIR, "清洗_中小站9家.md")
    file_4 = os.path.join(
        INPUT_DIR, "清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md"
    )
    # 文件 5 忽略(是文件 1 的子集)

    # 解析
    print("\n[1/4] 解析文件 1: AlfaLaval_SPXFlow_GEA_Myande.md...")
    records_1 = parse_file_1(file_1)
    print(f"      解析到 {len(records_1)} 条记录")

    print("\n[2/4] 解析文件 2: 原报告6家...")
    records_2 = parse_file_2(file_2)
    print(f"      解析到 {len(records_2)} 条记录")

    print("\n[3/4] 解析文件 3: 中小站9家...")
    records_3 = parse_file_3(file_3)
    print(f"      解析到 {len(records_3)} 条记录")

    print("\n[4/4] 解析文件 4: SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem...")
    records_4 = parse_file_4(file_4)
    print(f"      解析到 {len(records_4)} 条记录")

    all_records = records_1 + records_2 + records_3 + records_4
    print(f"\n合并后总计: {len(all_records)} 条记录")

    # 按竞对统计
    from collections import Counter

    comp_stats = Counter(r["竞对"] for r in all_records)
    print("\n按竞对统计:")
    for comp, count in sorted(comp_stats.items(), key=lambda x: -x[1]):
        country = COUNTRY_MAP.get(comp, "?")
        print(f"  {comp:<15} ({country:<4}) {count:>5} 条")

    type_stats = Counter(r["文章类型"] for r in all_records)
    print("\n按文章类型统计:")
    for t, count in sorted(type_stats.items()):
        print(f"  {t:<25} {count:>5} 条")

    # 去重(同一竞对 + 同一 slug 只保留一条)
    seen = set()
    deduped = []
    duplicates = 0
    for r in all_records:
        key = (r["竞对"], r["slug"])
        if key in seen:
            duplicates += 1
            continue
        seen.add(key)
        deduped.append(r)
    print(f"\n去重:移除 {duplicates} 条重复记录,剩余 {len(deduped)} 条")

    # 写入飞书
    print("\n" + "=" * 60)
    print("开始写入飞书多维表格...")
    print("=" * 60)

    print("\n获取 tenant_access_token...")
    token = get_tenant_access_token()
    print(f"token: {token[:20]}...")

    total = len(deduped)
    success = 0
    failed = 0
    batches = (total + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, total, BATCH_SIZE):
        batch_num = i // BATCH_SIZE + 1
        batch = deduped[i : i + BATCH_SIZE]
        print(
            f"\n写入第 {batch_num}/{batches} 批,共 {len(batch)} 条 (offset={i})..."
        )

        max_retry = 3
        for attempt in range(max_retry):
            result = batch_create_records(token, batch)
            if result.get("code") == 0:
                success += len(batch)
                print(f"  成功 ({len(batch)} 条)")
                break
            else:
                print(f"  失败 (尝试 {attempt + 1}/{max_retry}): {result.get('msg', '')[:200]}")
                if attempt < max_retry - 1:
                    time.sleep(2)
                    # 重新获取 token
                    try:
                        token = get_tenant_access_token()
                    except Exception:
                        pass
                else:
                    failed += len(batch)
                    # 保存失败的批次
                    with open(
                        f"failed_batch_{batch_num}.json", "w", encoding="utf-8"
                    ) as f:
                        json.dump(batch, f, ensure_ascii=False, indent=2)

        # 批次之间 sleep
        if i + BATCH_SIZE < total:
            time.sleep(SLEEP_BETWEEN_BATCH)

    # 最终统计
    print("\n" + "=" * 60)
    print("导入完成")
    print("=" * 60)
    print(f"总条数: {total}")
    print(f"成功数: {success}")
    print(f"失败数: {failed}")

    if failed > 0:
        print(f"\n失败的批次已保存到 failed_batch_*.json,可重试")


if __name__ == "__main__":
    main()
