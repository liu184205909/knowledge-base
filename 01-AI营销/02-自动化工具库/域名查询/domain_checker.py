#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
域名批量查询工具 - 增强版（集成Whois API）
功能: DNS查询 + Whois API查询（更准确）
作者: Claude Code
日期: 2026-01-23

使用方法:
1. 安装依赖: pip install requests
2. 运行: python domain_checker.py [域名列表文件.txt]
   - 不指定文件时使用内置 DOMAIN_CANDIDATES 列表
   - 指定文件时每行一个域名（支持 # 注释行）
3. 结果保存至 domain_availability_with_whois.csv
"""

import sys
import io
import argparse

# 修复Windows控制台编码问题
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import requests
import socket
import time
import csv
from datetime import datetime
from typing import List, Dict, Optional

# ============================================
# 配置
# ============================================

# 域名候选列表（球衣独立站 - 第二批变体）
DOMAIN_CANDIDATES = [
    # 可能可用的4个（需确认）
    "diehardkits.com",   # Die Hard Kits（死忠球迷）
    "kultkits.com",      # Kult Kits（潮流球衣）
    "boldjersey.com",    # Bold Jersey（大胆球衣）
    "soccio.com",        # Soccer + io

    # 新变体：加后缀
    "goaldealshop.com",  # GoalDeal + Shop
    "kitdealstore.com",  # KitDeal + Store
    "truefanjersey.com", # TrueFan + Jersey
    "fankitshop.com",    # FanKit + Shop
    "worldkitshop.com",  # WorldKit + Shop

    # 新变体：加前缀
    "mygoaldeal.com",    # My + GoalDeal
    "thekultkits.com",   # The + KultKits
    "getkultkits.com",   # Get + KultKits
    "buyboldjersey.com", # Buy + BoldJersey

    # 新变体：其他后缀
    "goaldeals.com",     # GoalDeals（复数）
    "kitdeals.com",      # KitDeals（复数）
    "fankitsonline.com", # FanKits + Online
    "jerseykult.com",    # Jersey + Kult
    "kitculture.com",    # Kit + Culture

    # 新变体：创意组合
    "goalsgear.com",     # Goals + Gear
    "kitforce.com",      # Kit + Force
    "jerseyvault.com",   # Jersey + Vault
    "kitleague.com",     # Kit + League
    "soccerkult.com",    # Soccer + Kult
]

# 输出文件
OUTPUT_CSV = "domain_availability_with_whois.csv"

# 请求延迟(秒)
REQUEST_DELAY = 2

# 自动运行（无需确认）
AUTO_RUN = True

# Whois API配置
USE_WHOIS_API = True  # 是否使用Whois API查询

# ============================================
# Whois API集成
# ============================================

class WhoisAPIClient:
    """Whois API客户端 - 支持多个免费API"""

    def __init__(self):
        self.api_list = [
            "rdap",  # RDAP协议（官方推荐）
            "whoiscom",  # Whois.com API
            "whoisjs",  # whoisjs.com (JSON格式)
        ]

    def check_whois_rdap(self, domain: str) -> Dict:
        """
        使用RDAP协议查询（官方推荐）
        RDAP是Whois的现代化替代协议
        """
        result = {
            "available": False,
            "registered": False,
            "registrar": None,
            "created_date": None,
            "error": None
        }

        try:
            rdap_url = f"https://rdap.org/domain/{domain}"

            response = requests.get(
                rdap_url,
                headers={'Accept': 'application/rdap+json'},
                timeout=10
            )

            if response.status_code == 200:
                # 域名已注册
                data = response.json()

                # 提取注册商信息
                result["registered"] = True
                result["available"] = False

                # 尝试提取注册商
                if "entities" in data:
                    for entity in data["entities"]:
                        if "role" in entity and entity["role"] == "registrar":
                            if "vcardArray" in entity:
                                try:
                                    vcard = entity["vcardArray"][1]
                                    for item in vcard:
                                        if item[0] == "fn":
                                            result["registrar"] = item[3]
                                            break
                                except (KeyError, IndexError, TypeError):
                                    pass

                # 尝试提取创建日期
                if "events" in data:
                    for event in data["events"]:
                        if event["eventAction"] == "registration":
                            result["created_date"] = event["eventDate"]
                            break

            elif response.status_code == 404:
                # 域名未注册
                result["available"] = True
                result["registered"] = False
            elif response.status_code == 429:
                result["error"] = "Rate limited"
            else:
                result["error"] = f"HTTP {response.status_code}"

        except requests.exceptions.Timeout:
            result["error"] = "Timeout"
        except Exception as e:
            result["error"] = str(e)

        return result

    def check_whois_com_api(self, domain: str) -> Dict:
        """
        使用Whois.com API查询
        注意：Whois.com官方API可能需要注册密钥
        这里使用公开的查询接口
        """
        result = {
            "available": False,
            "registered": False,
            "registrar": None,
            "created_date": None,
            "error": None
        }

        try:
            # Whois.com公开API（可能有速率限制）
            url = f"https://www.whois.com/whois/{domain}"

            response = requests.get(url, timeout=15)

            if response.status_code == 200:
                content = response.text

                # 检查是否包含"Domain not found"或"No match"
                if "Domain not found" in content or "No match for domain" in content:
                    result["available"] = True
                    result["registered"] = False
                else:
                    # 域名已注册（粗略判断）
                    result["registered"] = True
                    result["available"] = False
                    result["registrar"] = "Detected via Whois.com"

        except Exception as e:
            result["error"] = str(e)

        return result

    def check_whois_js(self, domain: str) -> Dict:
        """
        使用whoisjs.com API（返回JSON格式）
        """
        result = {
            "available": False,
            "registered": False,
            "registrar": None,
            "created_date": None,
            "error": None
        }

        try:
            # whoisjs.com API
            url = f"https://whoisjs.com/api/v1/{domain}"

            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()

                if data.get("available", False):
                    result["available"] = True
                    result["registered"] = False
                else:
                    result["registered"] = True
                    result["available"] = False
                    result["registrar"] = data.get("registrar")
                    result["created_date"] = data.get("created_date")

            elif response.status_code == 404:
                # 域名可用
                result["available"] = True
                result["registered"] = False

        except Exception as e:
            result["error"] = str(e)

        return result

    def check_domain_whois(self, domain: str, method: str = "rdap") -> Dict:
        """
        综合Whois查询
        method: "rdap", "whoiscom", "whoisjs"
        """
        if method == "rdap":
            return self.check_whois_rdap(domain)
        elif method == "whoiscom":
            return self.check_whois_com_api(domain)
        elif method == "whoisjs":
            return self.check_whois_js(domain)
        else:
            return {"error": f"Unknown method: {method}"}


# ============================================
# DNS查询功能
# ============================================

def check_domain_dns(domain: str) -> Dict:
    """DNS快速查询，返回 available: "Available"/"Registered"/"Unknown" 字符串"""
    result = {
        "domain": domain,
        "available": "Unknown",
        "has_dns": False,
        "has_www": False,
        "ip_address": None,
        "registrar": "Unknown",
        "check_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "error": None
    }

    try:
        socket.setdefaulttimeout(3)
        ip = socket.gethostbyname(domain)
        result["has_dns"] = True
        result["ip_address"] = ip
        result["available"] = "Registered"
        result["registrar"] = "DNS Record Found"

    except socket.gaierror:
        result["available"] = "Available"
        result["registrar"] = "No DNS Record"

    except Exception as e:
        result["error"] = str(e)
        result["available"] = "Unknown"

    return result


# ============================================
# 综合查询（DNS + Whois）
# ============================================

def check_domain_comprehensive(domain: str, whois_client: WhoisAPIClient) -> Dict:
    """
    综合查询：DNS + Whois API
    结合两种方法的结果，给出最终判断
    """
    print(f"  📡 查询: {domain}...")

    # 步骤1: DNS查询
    dns_result = check_domain_dns(domain)

    # 步骤2: Whois API查询
    whois_result = whois_client.check_domain_whois(domain, method="rdap")

    # 综合判断
    final_result = {
        "domain": domain,
        "dns_status": dns_result["available"],
        "whois_available": whois_result["available"],
        "whois_registered": whois_result["registered"],
        "has_dns": dns_result["has_dns"],
        "ip_address": dns_result["ip_address"],
        "registrar": whois_result.get("registrar") or dns_result["registrar"],
        "created_date": whois_result.get("created_date"),
        "check_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "final_status": "Unknown",
        "confidence": "Low"
    }

    dns_avail = dns_result["available"]
    whois_avail = whois_result["available"]

    if dns_avail == "Available" and whois_avail == True:
        final_result["final_status"] = "Available"
        final_result["confidence"] = "High"
    elif dns_avail == "Registered" or whois_result["registered"] == True:
        final_result["final_status"] = "Registered"
        final_result["confidence"] = "High"
    elif dns_avail == "Available" and whois_result["error"]:
        final_result["final_status"] = "Possibly Available"
        final_result["confidence"] = "Medium"
    else:
        final_result["final_status"] = "Unknown"
        final_result["confidence"] = "Low"

    return final_result


# ============================================
# 批量查询
# ============================================

def check_domains_batch(domains: List[str], use_whois: bool = True) -> List[Dict]:
    """批量查询域名"""
    results = []
    whois_client = WhoisAPIClient() if use_whois else None

    total = len(domains)
    print(f"\n🚀 开始批量查询 {total} 个域名...")

    if use_whois:
        print(f"📡 方法: DNS + Whois API (RDAP)")
        print(f"⏱️  延迟: {REQUEST_DELAY}秒")
    else:
        print(f"📡 方法: DNS查询 (快速)")

    for i, domain in enumerate(domains, 1):
        print(f"\n[{i}/{total}]", end=" ")

        if use_whois:
            result = check_domain_comprehensive(domain, whois_client)
        else:
            result = check_domain_dns(domain)

        results.append(result)

        # 显示结果
        status = result.get("final_status") or result.get("available", "Unknown")
        status_icon = "✅" if status == "Available" else "❌"
        print(f"{status_icon} {status}")

        # 延迟
        if i < total:
            time.sleep(REQUEST_DELAY)

    return results


# ============================================
# 结果保存
# ============================================

def save_to_csv(results: List[Dict], filename: str = None):
    """保存结果到CSV"""
    if filename is None:
        filename = OUTPUT_CSV

    try:
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            fieldnames = results[0].keys()
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)

        print(f"\n✅ 结果已保存到: {filename}")
        print(f"💡 建议: 使用Excel打开查看")

    except Exception as e:
        print(f"❌ 保存失败: {e}")


def save_to_readable_text(results: List[Dict], filename: str = "domain_results.txt"):
    """保存为易读的文本格式"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("域名查询结果报告\n")
            f.write("="*80 + "\n\n")

            # 按状态分组
            available = [r for r in results if r.get("final_status") == "Available"]
            registered = [r for r in results if r.get("final_status") == "Registered"]

            # 可用域名
            f.write(f"✅ 可用域名 ({len(available)}个)\n")
            f.write("-"*80 + "\n")
            for r in available:
                f.write(f"\n域名: {r['domain']}\n")
                f.write(f"  状态: {r['final_status']}\n")
                f.write(f"  置信度: {r['confidence']}\n")
                if r.get('created_date'):
                    f.write(f"  注册日期: {r['created_date']}\n")
                if r.get('registrar') and r['registrar'] != 'No DNS Record':
                    f.write(f"  注册商: {r['registrar']}\n")
                f.write(f"  查询时间: {r['check_time']}\n")

            # 已注册域名
            if registered:
                f.write(f"\n\n❌ 已注册域名 ({len(registered)}个)\n")
                f.write("-"*80 + "\n")
                for r in registered:
                    f.write(f"\n域名: {r['domain']}\n")
                    f.write(f"  状态: {r['final_status']}\n")
                    if r.get('created_date'):
                        f.write(f"  注册日期: {r['created_date']}\n")
                    if r.get('ip_address'):
                        f.write(f"  IP地址: {r['ip_address']}\n")
                    f.write(f"  查询时间: {r['check_time']}\n")

            f.write("\n" + "="*80 + "\n")

        print(f"\n✅ 易读结果已保存到: {filename}")

    except Exception as e:
        print(f"❌ 保存失败: {e}")


def print_summary(results: List[Dict]):
    """打印查询摘要"""
    available = 0
    registered = 0
    unknown = 0

    print("\n" + "="*70)
    print("📊 查询结果摘要")
    print("="*70)

    for result in results:
        status = result.get("final_status", result.get("available", "Unknown"))
        if status == "Available":
            available += 1
        elif status in ("Registered", "Possibly Available"):
            registered += 1
        else:
            unknown += 1

    total = len(results)
    print(f"✅ 可用: {available} 个 ({available/total*100:.1f}%)")
    print(f"❌ 已注册: {registered} 个 ({registered/total*100:.1f}%)")
    print(f"⚠️  未知: {unknown} 个 ({unknown/total*100:.1f}%)")
    print("="*70)

    # 显示可用域名
    if available > 0:
        print(f"\n✅ 可用的域名:")
        for result in results:
            status = result.get("final_status", result.get("available"))
            if status == "Available":
                confidence = result.get("confidence", "")
                print(f"  • {result['domain']} (置信度: {confidence})")


# ============================================
# 主程序
# ============================================

def load_domains_from_file(filepath: str) -> List[str]:
    """从文本文件读取域名列表，每行一个域名，支持 # 注释"""
    domains = []
    with open(filepath, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                domains.append(line)
    return domains


def main():
    """主程序"""
    parser = argparse.ArgumentParser(description="域名批量查询工具（DNS + RDAP）")
    parser.add_argument(
        "domains_file",
        nargs="?",
        help="域名列表文件路径（每行一个域名，# 开头为注释）。不指定则使用内置列表。"
    )
    parser.add_argument(
        "--no-whois",
        action="store_true",
        help="禁用 Whois/RDAP 查询，仅使用 DNS 查询（速度更快）"
    )
    parser.add_argument(
        "--output",
        default=OUTPUT_CSV,
        help=f"CSV 输出文件路径（默认: {OUTPUT_CSV}）"
    )
    args = parser.parse_args()

    use_whois = not args.no_whois

    if args.domains_file:
        domains = load_domains_from_file(args.domains_file)
        if not domains:
            print(f"❌ 文件 {args.domains_file} 中没有有效域名")
            sys.exit(1)
    else:
        domains = DOMAIN_CANDIDATES

    print("="*70)
    print("🔍 域名批量查询工具 - 增强版（集成Whois API）")
    print("="*70)
    print(f"⏰ 开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📋 待查询域名: {len(domains)} 个")
    print(f"📡 Whois API: {'启用' if use_whois else '禁用'}")
    print("="*70)

    print("\n📋 待查询域名列表:")
    for i, domain in enumerate(domains, 1):
        print(f"  {i:2d}. {domain}")

    if use_whois:
        print(f"\n⚠️  注意: 将使用DNS + Whois API综合查询")
        print(f"   Whois API使用RDAP协议（官方推荐）")
    else:
        print(f"\n⚠️  注意: 仅使用DNS快速查询")

    if not AUTO_RUN:
        confirm = input("\n开始查询? (y/n): ").strip().lower()
        if confirm != 'y':
            print("❌ 已取消")
            return
    else:
        print("\n🚀 自动运行模式开始查询...")

    start_time = time.time()
    results = check_domains_batch(domains, use_whois=use_whois)
    end_time = time.time()

    # 打印摘要
    print_summary(results)

    print(f"\n⏱️  查询耗时: {end_time - start_time:.2f} 秒")
    save_to_csv(results, args.output)
    save_to_readable_text(results)

    print("\n✅ 查询完成!")

    if use_whois:
        print("\n💡 下一步:")
        print("   1. 查看CSV文件了解详情")
        print("   2. 对'可用'的域名进行最终确认")
        print("   3. 进行商标检查")
        print("   4. 检查社交媒体用户名")


if __name__ == "__main__":
    main()
