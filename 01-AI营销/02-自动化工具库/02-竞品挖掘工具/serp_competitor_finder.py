#!/usr/bin/env python3
"""
serp_competitor_finder.py - Competitor Discovery Tool
Discover independent competitor sites via Google SERP, filter platforms
"""

import argparse
import time
import os
import re
import sys
from urllib.parse import urlparse
from datetime import datetime

try:
    from googlesearch import search
except ImportError:
    print("[ERROR] Install dependencies: pip install googlesearch-python requests beautifulsoup4")
    raise

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

# -- Config --
OUTPUT_FILE = "competitor_urls.txt"
DEFAULT_PAGES = 3
DEFAULT_DELAY = 2.0

BLACKLIST_DOMAINS = {
    "amazon", "ebay", "walmart", "target", "costco",
    "reddit", "quora", "youtube", "tiktok", "instagram",
    "facebook", "twitter", "pinterest", "linkedin",
    "wikipedia", "wikihow", "fandom",
    "etsy", "shopify", "aliexpress", "alibaba", "dhgate",
    "wayfair", "homedepot", "lowes", "bestbuy",
    "google", "bing", "yahoo", "forbes", "cnn", "bbc",
    "medium", "substack", "wordpress.com", "blogspot",
}

def is_blacklisted(url):
    domain = urlparse(url).netloc.lower()
    domain = re.sub(r"^www\.", "", domain)
    for bl in BLACKLIST_DOMAINS:
        if bl in domain:
            return True
    return False

def get_root_domain(url):
    netloc = urlparse(url).netloc.lower()
    netloc = re.sub(r"^www\.", "", netloc)
    return netloc

def search_competitors(keyword, pages=DEFAULT_PAGES, delay=DEFAULT_DELAY):
    num_results = pages * 10
    print(f"\n[*] Searching: \"{keyword}\" (top {num_results} results)")
    found_domains = set()
    try:
        results = search(keyword, num_results=num_results, lang="en", sleep_interval=delay)
        for url in results:
            if is_blacklisted(url):
                continue
            domain = get_root_domain(url)
            if domain and domain not in found_domains:
                found_domains.add(domain)
                print(f"  [+] Found: {domain}")
    except Exception as e:
        print(f"  [!] Error: {e}")
    return list(found_domains)

def save_results(all_domains, keywords, output_dir=None):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "# Competitor Discovery Results",
        f"# Generated: {timestamp}",
        f"# Keywords: {', '.join(keywords)}",
        f"# Total: {len(all_domains)} independent competitor sites",
        "# Format: one URL per line",
        "",
    ]
    lines += sorted(all_domains)
    save_dir = output_dir if output_dir else os.getcwd()
    output_path = os.path.join(save_dir, OUTPUT_FILE)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return output_path

def main():
    parser = argparse.ArgumentParser(description="Competitor Discovery Tool - find independent sites via SERP")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--keyword", help="Single keyword")
    group.add_argument("--file", help="Keywords file (one per line)")
    parser.add_argument("--pages", type=int, default=DEFAULT_PAGES)
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    args = parser.parse_args()

    if args.keyword:
        keywords = [args.keyword]
    else:
        with open(args.file, encoding="utf-8") as f:
            keywords = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        print(f"[OK] Loaded {len(keywords)} keywords from file")

    all_domains = set()
    for kw in keywords:
        domains = search_competitors(kw, pages=args.pages, delay=args.delay)
        all_domains.update(f"https://{d}" for d in domains)
        if len(keywords) > 1:
            time.sleep(args.delay * 2)

    output_path = save_results(all_domains, keywords)
    print(f"\n[Done] Found {len(all_domains)} competitor sites")
    print(f"  Output: {output_path}")

if __name__ == "__main__":
    main()
