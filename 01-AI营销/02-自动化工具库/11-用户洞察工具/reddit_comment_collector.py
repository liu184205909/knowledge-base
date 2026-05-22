#!/usr/bin/env python3
"""
reddit_comment_collector.py - Reddit 评论采集工具
基于 Reddit JSON 端点（.json 功法），无需 API 密钥
输入: subreddit 名称或搜索关键词
处理: 采集帖子 + 评论 → 输出为 comment_insight_analyzer.py 可直接分析的格式
输出: CSV（评论数据）+ 采集摘要
"""

import requests
import argparse
import csv
import os
import re
import time
from datetime import datetime
from urllib.parse import quote_plus

# ── 配置 ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) KnowledgeBaseBot/1.0"
}
OUTPUT_DIR = "results"
REQUEST_TIMEOUT = 15
DEFAULT_DELAY = 1.5  # Reddit 速率限制：未认证约 60 次/分钟
# 评论采集深度
MAX_COMMENT_DEPTH = 3
MAX_COMMENTS_PER_POST = 50


# ── Reddit JSON 请求 ──────────────────────────────────────────────────────────

def fetch_json(url: str) -> dict | list | None:
    """请求 Reddit JSON 端点"""
    try:
        # 确保 URL 以 .json 结尾
        if not url.endswith('.json'):
            url = url.rstrip('/') + '.json'
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  ✗ 请求失败: {str(e)[:60]}")
        return None


# ── 数据提取 ──────────────────────────────────────────────────────────────────

def extract_posts_from_listing(data: dict) -> list[dict]:
    """从 subreddit 列表页提取帖子"""
    posts = []
    if not data or not isinstance(data, dict):
        return posts

    children = data.get("data", {}).get("children", [])
    for child in children:
        post_data = child.get("data", {})
        if post_data:
            posts.append({
                "id": post_data.get("id", ""),
                "title": post_data.get("title", ""),
                "selftext": post_data.get("selftext", ""),
                "author": post_data.get("author", ""),
                "score": post_data.get("score", 0),
                "num_comments": post_data.get("num_comments", 0),
                "created_utc": post_data.get("created_utc", 0),
                "url": post_data.get("url", ""),
                "permalink": f"https://www.reddit.com{post_data.get('permalink', '')}",
                "subreddit": post_data.get("subreddit", ""),
                "link_flair_text": post_data.get("link_flair_text", ""),
            })
    return posts


def extract_comments(comment_data, depth: int = 0) -> list[dict]:
    """递归提取评论"""
    comments = []
    if depth > MAX_COMMENT_DEPTH:
        return comments

    if isinstance(comment_data, dict):
        replies = comment_data.get("data", {}).get("children", [])
        for reply in replies:
            if reply.get("kind") == "t1":  # 普通评论
                reply_data = reply.get("data", {})
                if reply_data:
                    comments.append({
                        "text": reply_data.get("body", ""),
                        "author": reply_data.get("author", ""),
                        "score": reply_data.get("score", 0),
                        "created_utc": reply_data.get("created_utc", 0),
                        "depth": depth,
                        "source": "reddit",
                    })
                    # 递归提取子评论
                    if depth < MAX_COMMENT_DEPTH:
                        comments.extend(extract_comments(reply, depth + 1))
            elif reply.get("kind") == "more":
                # 深层评论需要额外请求，跳过
                pass
    elif isinstance(comment_data, list):
        for item in comment_data:
            comments.extend(extract_comments(item, depth))

    return comments


def extract_post_with_comments(post_url: str) -> dict:
    """采集单个帖子及其评论"""
    url = post_url.rstrip('/') + '.json'
    data = fetch_json(url)

    result = {
        "post": {},
        "comments": [],
        "status": "ok",
        "error": "",
    }

    if not data or not isinstance(data, list) or len(data) < 2:
        result["status"] = "error"
        result["error"] = "无法获取帖子数据"
        return result

    # 第一个元素：帖子信息
    post_children = data[0].get("data", {}).get("children", [])
    if post_children:
        post_data = post_children[0].get("data", {})
        result["post"] = {
            "id": post_data.get("id", ""),
            "title": post_data.get("title", ""),
            "selftext": post_data.get("selftext", ""),
            "author": post_data.get("author", ""),
            "score": post_data.get("score", 0),
            "num_comments": post_data.get("num_comments", 0),
            "created_utc": post_data.get("created_utc", 0),
            "subreddit": post_data.get("subreddit", ""),
        }

    # 第二个元素：评论
    result["comments"] = extract_comments(data[1], depth=0)

    return result


# ── 采集模式 ──────────────────────────────────────────────────────────────────

def collect_from_subreddit(subreddit: str, sort: str = "hot", limit: int = 10) -> list[dict]:
    """从 subreddit 采集帖子和评论"""
    url = f"https://www.reddit.com/r/{subreddit}/{sort}.json?limit={limit}"
    print(f"📡 采集 r/{subreddit}（{sort}，前 {limit} 帖）")

    data = fetch_json(url)
    posts = extract_posts_from_listing(data)

    all_comments = []
    for i, post in enumerate(posts, 1):
        title = post["title"][:50]
        print(f"  [{i:2d}/{len(posts)}] 采集评论: {title}...")

        # 帖子正文也作为一条"评论"纳入分析
        if post["selftext"]:
            all_comments.append({
                "text": f"{post['title']}\n\n{post['selftext']}",
                "author": post["author"],
                "score": post["score"],
                "created_utc": post["created_utc"],
                "source": "reddit_post",
                "subreddit": subreddit,
                "post_title": post["title"],
                "post_url": post["permalink"],
            })

        # 采集评论
        if post["num_comments"] > 0:
            post_data = extract_post_with_comments(post["permalink"])
            for comment in post_data["comments"][:MAX_COMMENTS_PER_POST]:
                comment["subreddit"] = subreddit
                comment["post_title"] = post["title"]
                comment["post_url"] = post["permalink"]
                all_comments.append(comment)

            count = len(post_data["comments"])
            print(f"      → {count} 条评论")

        time.sleep(DEFAULT_DELAY)

    return all_comments


def collect_from_search(query: str, subreddit: str = "", limit: int = 25) -> list[dict]:
    """通过搜索采集帖子和评论"""
    if subreddit:
        url = f"https://www.reddit.com/r/{subreddit}/search.json?q={quote_plus(query)}&restrict_sr=on&limit={limit}&sort=relevance"
        print(f"📡 搜索 r/{subreddit}: "{query}"")
    else:
        url = f"https://www.reddit.com/search.json?q={quote_plus(query)}&limit={limit}&sort=relevance"
        print(f"📡 搜索全站: "{query}"")

    data = fetch_json(url)
    posts = extract_posts_from_listing(data)

    all_comments = []
    for i, post in enumerate(posts, 1):
        title = post["title"][:50]
        print(f"  [{i:2d}/{len(posts)}] {title}...")

        # 帖子正文
        if post["selftext"]:
            all_comments.append({
                "text": f"{post['title']}\n\n{post['selftext']}",
                "author": post["author"],
                "score": post["score"],
                "created_utc": post["created_utc"],
                "source": "reddit_post",
                "subreddit": post.get("subreddit", ""),
                "post_title": post["title"],
                "post_url": post["permalink"],
            })

        # 采集评论（限制只采集高互动帖子）
        if post["num_comments"] > 0 and post["score"] >= 5:
            post_data = extract_post_with_comments(post["permalink"])
            for comment in post_data["comments"][:MAX_COMMENTS_PER_POST]:
                comment["subreddit"] = post.get("subreddit", "")
                comment["post_title"] = post["title"]
                comment["post_url"] = post["permalink"]
                all_comments.append(comment)

        time.sleep(DEFAULT_DELAY)

    return all_comments


def collect_from_post_url(url: str) -> list[dict]:
    """采集单个帖子的评论"""
    print(f"📡 采集帖子: {url}")

    result = extract_post_with_comments(url)

    if result["status"] != "ok":
        print(f"  ✗ {result['error']}")
        return []

    post = result["post"]
    comments = result["comments"]

    all_comments = []

    # 帖子正文
    if post.get("selftext"):
        all_comments.append({
            "text": f"{post.get('title', '')}\n\n{post.get('selftext', '')}",
            "author": post.get("author", ""),
            "score": post.get("score", 0),
            "created_utc": post.get("created_utc", 0),
            "source": "reddit_post",
            "subreddit": post.get("subreddit", ""),
            "post_title": post.get("title", ""),
            "post_url": url,
        })

    # 评论
    for comment in comments:
        comment["post_title"] = post.get("title", "")
        comment["post_url"] = url
        all_comments.append(comment)

    print(f"  ✓ 采集 {len(comments)} 条评论")
    return all_comments


def collect_from_user(username: str, limit: int = 25) -> list[dict]:
    """采集用户的帖子和评论"""
    print(f"📡 采集用户 u/{username} 的评论...")

    url = f"https://www.reddit.com/user/{username}/comments.json?limit={limit}"
    data = fetch_json(url)

    comments = []
    if data and isinstance(data, dict):
        children = data.get("data", {}).get("children", [])
        for child in children:
            if child.get("kind") == "t1":
                comment_data = child.get("data", {})
                comments.append({
                    "text": comment_data.get("body", ""),
                    "author": username,
                    "score": comment_data.get("score", 0),
                    "created_utc": comment_data.get("created_utc", 0),
                    "source": "reddit_user",
                    "subreddit": comment_data.get("subreddit", ""),
                    "post_title": comment_data.get("link_title", ""),
                    "post_url": f"https://www.reddit.com{comment_data.get('permalink', '')}",
                })

    print(f"  ✓ 采集 {len(comments)} 条评论")
    return comments


# ── 保存 ──────────────────────────────────────────────────────────────────────

def save_comments_csv(comments: list[dict], filepath: str):
    """保存为 CSV（兼容 comment_insight_analyzer.py 的输入格式）"""
    fieldnames = ["text", "author", "score", "created_utc", "source",
                  "subreddit", "post_title", "post_url"]
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for comment in comments:
            if comment.get("text", "").strip():
                writer.writerow(comment)


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Reddit 评论采集工具 - 基于 .json 端点，无需 API 密钥"
    )
    parser.add_argument(
        "--subreddit", default="",
        help="采集整个 subreddit（如 crystalhealing）"
    )
    parser.add_argument(
        "--search", default="",
        help="搜索关键词（如 'crystal bracelet healing'）"
    )
    parser.add_argument(
        "--post", default="",
        help="采集单个帖子（完整 URL）"
    )
    parser.add_argument(
        "--user", default="",
        help="采集某用户的评论"
    )
    parser.add_argument(
        "--sort", default="hot",
        choices=["hot", "new", "top", "rising", "relevance"],
        help="排序方式（默认 hot）"
    )
    parser.add_argument(
        "--limit", type=int, default=10,
        help="采集帖子数量（默认 10）"
    )
    args = parser.parse_args()

    if not any([args.subreddit, args.search, args.post, args.user]):
        parser.error("至少指定一个: --subreddit / --search / --post / --user")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 采集
    comments = []
    if args.post:
        comments = collect_from_post_url(args.post)
    elif args.user:
        comments = collect_from_user(args.user, args.limit)
    elif args.search:
        comments = collect_from_search(args.search, args.subreddit, args.limit)
    elif args.subreddit:
        comments = collect_from_subreddit(args.subreddit, args.sort, args.limit)

    if not comments:
        print("\n⚠️ 未采集到任何评论")
        return

    # 过滤空内容
    comments = [c for c in comments if c.get("text", "").strip()]

    # 保存
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    source_label = args.subreddit or args.search or "post"
    csv_path = os.path.join(OUTPUT_DIR, f"reddit_{source_label.replace(' ', '_')}_{timestamp}.csv")

    save_comments_csv(comments, csv_path)

    # 汇总
    unique_authors = len(set(c.get("author", "") for c in comments))
    posts_count = sum(1 for c in comments if c.get("source") == "reddit_post")
    comments_count = len(comments) - posts_count

    print(f"\n✅ 采集完成！")
    print(f"  📄 输出文件: {csv_path}")
    print(f"  📊 采集结果: {posts_count} 条帖子 + {comments_count} 条评论")
    print(f"  👥 涉及用户: {unique_authors} 个")
    print(f"\n💡 下一步: 用分析工具处理采集结果")
    print(f"  python 10-受众反馈分析工具/comment_insight_analyzer.py \\")
    print(f"    --input {csv_path} --source 'Reddit r/{args.subreddit or args.search}'")


if __name__ == "__main__":
    main()
