"""
视频转文稿工具
==============

从 YouTube / B站 等平台提取视频音频，转写为文字文稿。

功能：
  1. yt-dlp 提取音频（优先）或哼哼猫 API（备选）
  2. Groq Whisper Large V3 Turbo 转写音频为文字
  3. 默认输出到 stdout（供 Claude Code 直接读取总结）
     可选 --save 保存为 Markdown 文件

用法：
  python video_to_note.py <视频URL> [--lang zh] [--save]

前置依赖：
  pip install yt-dlp groq requests

环境变量：
  GROQ_API_KEY   — Groq API Key（https://console.groq.com/keys 获取）
  PROXY          — 可选，HTTP 代理地址（如 http://127.0.0.1:10808）
  HHM_USER_ID    — 可选，哼哼猫 API 用户 ID（备选通道）
  HHM_SECRET_KEY — 可选，哼哼猫 API 密钥（备选通道）
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from datetime import datetime
from pathlib import Path


# ─── 配置 ──────────────────────────────────────────────────────────────

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
PROXY = os.environ.get("PROXY", os.environ.get("HTTP_PROXY", ""))
OUTPUT_DIR = os.environ.get("VIDEO_OUTPUT_DIR", "")

# 哼哼猫备选通道
HHM_USER_ID = os.environ.get("HHM_USER_ID", "")
HHM_SECRET_KEY = os.environ.get("HHM_SECRET_KEY", "")


# ─── 工具函数 ──────────────────────────────────────────────────────────

def sanitize_filename(name: str, max_len: int = 60) -> str:
    """清理文件名：移除特殊字符，截断长度"""
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '', name)
    name = re.sub(r'\s+', '_', name.strip())
    return name[:max_len]


def detect_language(title: str) -> str:
    """从视频标题自动检测语言"""
    if not title:
        return 'auto'
    # 统计中文字符占比
    cjk = sum(1 for c in title if '\u4e00' <= c <= '\u9fff')
    if cjk > len(title) * 0.15:
        return 'zh'
    return 'en'


def detect_platform(url: str) -> str:
    """检测视频平台"""
    if 'youtube.com' in url or 'youtu.be' in url:
        return 'youtube'
    elif 'bilibili.com' in url or 'b23.tv' in url:
        return 'bilibili'
    elif 'douyin.com' in url:
        return 'douyin'
    elif 'xiaohongshu.com' in url or 'xhslink.com' in url:
        return 'xiaohongshu'
    else:
        return 'other'


# ─── Step 1: 音频提取（双通道）──────────────────────────────────────────

def extract_audio_ytdlp(url: str, output_path: str, proxy: str = "") -> dict:
    """使用 yt-dlp 提取音频"""
    platform = detect_platform(url)
    print(f"[Step 1a] yt-dlp 提取音频: {url}")
    print(f"          平台: {platform}")

    # 获取视频信息（--dump-json 不下载）
    info_cmd = [
        sys.executable, '-m', 'yt_dlp',
        '--dump-json', '--no-playlist', '--no-warnings',
    ]
    if proxy:
        info_cmd.extend(['--proxy', proxy])
    info_cmd.append(url)

    result_info = subprocess.run(info_cmd, capture_output=True, timeout=120)
    info_text = None
    for enc in ['utf-8', 'gbk', 'gb18030', 'latin-1']:
        try:
            info_text = result_info.stdout.decode(enc)
            break
        except (UnicodeDecodeError, AttributeError):
            continue

    info = {}
    if info_text:
        try:
            info = json.loads(info_text)
        except json.JSONDecodeError:
            pass

    if not info:
        print("          警告: 无法获取视频元数据，继续提取音频...")

    # 下载音频
    cmd = [
        sys.executable, '-m', 'yt_dlp',
        '-x', '--audio-format', 'mp3',
        '--audio-quality', '0',
        '-o', output_path,
        '--no-playlist', '--no-warnings',
    ]
    if proxy:
        cmd.extend(['--proxy', proxy])
    cmd.append(url)

    result = subprocess.run(cmd, capture_output=True, timeout=300)

    if result.returncode != 0:
        err_text = ""
        for enc in ['utf-8', 'gbk', 'gb18030', 'latin-1']:
            try:
                err_text = result.stderr.decode(enc)
                break
            except (UnicodeDecodeError, AttributeError):
                continue
        raise RuntimeError(f"yt-dlp 下载失败")

    audio_file = str(Path(output_path).with_suffix('.mp3'))
    if not Path(audio_file).exists():
        for ext in ['.m4a', '.opus', '.webm', '.wav']:
            alt = str(Path(output_path).with_suffix(ext))
            if Path(alt).exists():
                audio_file = alt
                break

    if not Path(audio_file).exists():
        raise FileNotFoundError("yt-dlp 下载完成但音频文件未找到")

    file_size_mb = Path(audio_file).stat().st_size / (1024 * 1024)
    print(f"          音频: {file_size_mb:.1f} MB")

    return {
        'audio_file': audio_file,
        'title': info.get('title', '未知标题'),
        'description': info.get('description', ''),
        'duration': info.get('duration', 0),
        'channel': info.get('channel', info.get('uploader', '')),
        'upload_date': info.get('upload_date', ''),
        'platform': platform,
        'url': url,
    }


def extract_audio_hhm(url: str, output_dir: str, proxy: str = "") -> dict:
    """使用哼哼猫 API 提取音频（yt-dlp 失败时备选）"""
    import requests

    if not HHM_USER_ID or not HHM_SECRET_KEY:
        raise ValueError("哼哼猫 API 未配置。请在 .env 中设置 HHM_USER_ID 和 HHM_SECRET_KEY")

    platform = detect_platform(url)
    print(f"[Step 1b] 哼哼猫 API 提取: {url}")
    print(f"          平台: {platform}")

    api_url = "https://h.aaaapp.cn/single_post"
    proxies = {"https": proxy, "http": proxy} if proxy else None

    resp = requests.post(
        api_url,
        json={
            'url': url,
            'userId': HHM_USER_ID,
            'secretKey': HHM_SECRET_KEY,
        },
        proxies=proxies,
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()

    # 哼哼猫响应格式：data 字段包含提取结果
    if data.get('code') != 1 and data.get('code') != 0:
        raise RuntimeError(f"哼哼猫 API 错误: {data.get('msg', '未知错误')}")

    post_data = data.get('data', data)

    # 从响应中提取视频/音频下载地址
    audio_url = ""
    video_url = ""
    title = ""

    # 尝试多种可能的字段名
    for key in ['audio', 'audio_url', 'music', 'music_url']:
        if post_data.get(key):
            audio_url = post_data[key] if isinstance(post_data[key], str) else post_data[key].get('url', '')
            break

    if not audio_url:
        for key in ['video_url', 'video', 'download_url', 'play_url', 'url']:
            if post_data.get(key):
                video_url = post_data[key] if isinstance(post_data[key], str) else post_data[key].get('url', '')
                break

    if not audio_url and not video_url:
        raise RuntimeError("哼哼猫 API 返回中未找到音频/视频下载地址")

    # 下载音频文件
    download_url = audio_url or video_url
    print(f"          下载地址: {download_url[:80]}...")

    audio_resp = requests.get(
        download_url,
        proxies=proxies,
        timeout=300,
        stream=True,
    )
    audio_resp.raise_for_status()

    # 确定文件扩展名
    content_type = audio_resp.headers.get('Content-Type', '')
    if 'mp3' in content_type or download_url.endswith('.mp3'):
        ext = '.mp3'
    elif 'mp4' in content_type or 'm4a' in content_type or download_url.endswith(('.m4a', '.mp4')):
        ext = '.m4a'
    elif 'webm' in content_type:
        ext = '.webm'
    else:
        ext = '.mp3'  # 默认

    audio_path = Path(output_dir) / f"audio{ext}"
    with open(audio_path, 'wb') as f:
        for chunk in audio_resp.iter_content(chunk_size=8192):
            f.write(chunk)

    file_size_mb = audio_path.stat().st_size / (1024 * 1024)
    print(f"          音频: {file_size_mb:.1f} MB")

    # 提取元数据
    title = post_data.get('title', post_data.get('desc', ''))
    desc = post_data.get('desc', post_data.get('description', ''))
    author = post_data.get('author', post_data.get('nickname', post_data.get('uploader', '')))

    return {
        'audio_file': str(audio_path),
        'title': title,
        'description': desc,
        'duration': 0,  # 哼哼猫不一定返回时长
        'channel': author,
        'upload_date': '',
        'platform': platform,
        'url': url,
    }


def extract_audio(url: str, output_path: str, proxy: str = "") -> dict:
    """提取音频：优先 yt-dlp，失败后尝试哼哼猫"""
    # 尝试 yt-dlp
    try:
        return extract_audio_ytdlp(url, output_path, proxy)
    except Exception as e:
        print(f"          yt-dlp 失败: {e}")

    # 尝试哼哼猫
    if HHM_USER_ID and HHM_SECRET_KEY:
        try:
            return extract_audio_hhm(url, Path(output_path).parent, proxy)
        except Exception as e:
            raise RuntimeError(f"yt-dlp 和哼哼猫均失败。哼哼猫错误: {e}")
    else:
        raise RuntimeError(
            f"yt-dlp 失败，且哼哼猫未配置（需在 .env 设置 HHM_USER_ID 和 HHM_SECRET_KEY）\n"
            f"yt-dlp 错误: {e}"
        )


# ─── Step 2: 音频转文字 ────────────────────────────────────────────────

def transcribe_groq(audio_path: str, language: str = "zh") -> str:
    """使用 Groq Whisper API 转写音频"""
    from groq import Groq

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY 未设置。请在环境变量中设置，或运行:\n"
                         "  set GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx")

    client = Groq(api_key=GROQ_API_KEY)

    file_size_mb = Path(audio_path).stat().st_size / (1024 * 1024)
    print(f"[Step 2] Groq Whisper 转写 ({file_size_mb:.1f} MB)")

    # Groq 文件大小限制 25MB，超过需要分段
    if file_size_mb > 24:
        print(f"         文件较大 (>24MB)，将分段处理...")
        return transcribe_large_file(client, audio_path, language)

    with open(audio_path, 'rb') as f:
        transcription = client.audio.transcriptions.create(
            file=(Path(audio_path).name, f),
            model="whisper-large-v3-turbo",
            language=language,
            response_format="verbose_json",
            timestamp_granularities=["segment"],
        )

    # 拼接段落文本
    if hasattr(transcription, 'segments') and transcription.segments:
        segments = transcription.segments
        parts = []
        for s in segments:
            if isinstance(s, dict):
                start, end, text = s.get('start', 0), s.get('end', 0), s.get('text', '')
            else:
                start, end, text = s.start, s.end, s.text
            parts.append(f"[{fmt_time(start)} - {fmt_time(end)}] {text.strip()}")
        full_text = "\n\n".join(parts)
    else:
        full_text = transcription.text

    print(f"         转写完成: {len(full_text)} 字符")
    return full_text


def transcribe_large_file(client, audio_path: str, language: str) -> str:
    """分段转写大文件"""
    segment_dir = Path(audio_path).parent / "segments"
    segment_dir.mkdir(exist_ok=True)

    # 5分钟一段（更短，避免 Groq 超时）
    split_cmd = [
        'ffmpeg', '-i', audio_path,
        '-f', 'segment', '-segment_time', '300',
        '-c', 'copy',
        str(segment_dir / 'seg_%03d.mp3'),
        '-y'
    ]
    subprocess.run(split_cmd, capture_output=True, timeout=120)

    segments = sorted(segment_dir.glob('seg_*.mp3'))
    if not segments:
        print("         分割失败，尝试直接上传...")
        with open(audio_path, 'rb') as f:
            resp = client.audio.transcriptions.create(
                file=(Path(audio_path).name, f),
                model="whisper-large-v3-turbo",
                language=language,
                response_format="text",
            )
        return resp if isinstance(resp, str) else resp.text

    all_texts = []
    for i, seg in enumerate(segments):
        print(f"         转写分段 {i+1}/{len(segments)}...")
        # 重试机制（最多3次）
        for attempt in range(3):
            try:
                with open(seg, 'rb') as f:
                    resp = client.audio.transcriptions.create(
                        file=(seg.name, f),
                        model="whisper-large-v3-turbo",
                        language=language,
                        response_format="text",
                    )
                text = resp if isinstance(resp, str) else resp.text
                all_texts.append(text)
                break
            except Exception as e:
                if attempt < 2:
                    wait = (attempt + 1) * 3
                    print(f"         分段 {i+1} 失败，{wait}s 后重试 ({attempt+1}/3)...")
                    time.sleep(wait)
                else:
                    print(f"         分段 {i+1} 跳过（3次均失败）")
                    all_texts.append(f"[分段 {i+1} 转写失败]")
        time.sleep(1)

    for seg in segments:
        seg.unlink()
    segment_dir.rmdir()

    return "\n\n".join(all_texts)


def fmt_time(seconds: float) -> str:
    """格式化时间戳"""
    m, s = divmod(int(seconds), 60)
    return f"{m:02d}:{s:02d}"


# ─── Step 3: 输出 ─────────────────────────────────────────────────────

def format_output(video_info: dict, transcript: str) -> str:
    """格式化输出文本（元数据 + 文稿）"""
    title = video_info.get('title', '未知标题')
    channel = video_info.get('channel', '')
    duration = video_info.get('duration', 0)
    platform = video_info.get('platform', '')
    url = video_info.get('url', '')
    description = video_info.get('description', '')
    upload_date = video_info.get('upload_date', '')

    duration_str = ""
    if duration:
        h, rem = divmod(int(duration), 3600)
        m, s = divmod(rem, 60)
        if h:
            duration_str = f"{h}小时{m}分{s}秒"
        else:
            duration_str = f"{m}分{s}秒"

    date_str = ""
    if upload_date:
        try:
            date_str = datetime.strptime(upload_date, '%Y%m%d').strftime('%Y-%m-%d')
        except ValueError:
            date_str = upload_date

    # 构建输出
    lines = []
    lines.append(f"标题: {title}")
    lines.append(f"来源: {platform} | 频道: {channel} | 时长: {duration_str}")
    lines.append(f"链接: {url}")
    if date_str:
        lines.append(f"发布日期: {date_str}")
    lines.append(f"转写时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    if description:
        desc_short = description[:500] + ('...' if len(description) > 500 else '')
        lines.append(f"\n--- 视频简介 ---\n{desc_short}")

    lines.append(f"\n--- 完整文稿 ---\n")
    lines.append(transcript)

    return "\n".join(lines)


def save_markdown(video_info: dict, transcript: str, output_dir: str) -> str:
    """保存为 Markdown 文件（可选）"""
    title = video_info.get('title', '未知标题')
    channel = video_info.get('channel', '')
    duration = video_info.get('duration', 0)
    platform = video_info.get('platform', '')
    url = video_info.get('url', '')
    description = video_info.get('description', '')
    upload_date = video_info.get('upload_date', '')

    duration_str = ""
    if duration:
        h, rem = divmod(int(duration), 3600)
        m, s = divmod(rem, 60)
        if h:
            duration_str = f"{h}小时{m}分{s}秒"
        else:
            duration_str = f"{m}分{s}秒"

    date_str = ""
    if upload_date:
        try:
            date_str = datetime.strptime(upload_date, '%Y%m%d').strftime('%Y-%m-%d')
        except ValueError:
            date_str = upload_date

    char_count = sum(len(line) for line in transcript.split('\n') if line.strip())

    md = f"# {title}\n\n"
    md += f"> **来源**: {platform} | **频道**: {channel} | **时长**: {duration_str}\n"
    md += f"> **链接**: {url}\n"
    md += f"> **转写时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    if date_str:
        md += f"> **发布日期**: {date_str}\n"
    md += f"> **文稿字数**: ~{char_count} 字\n"

    if description:
        desc_short = description[:500] + ('...' if len(description) > 500 else '')
        md += f"\n## 视频简介\n\n{desc_short}\n"

    md += f"\n## 完整文稿\n\n{transcript}\n"

    safe_title = sanitize_filename(title)
    filepath = Path(output_dir) / f"{safe_title}.md"
    filepath.write_text(md, encoding='utf-8')
    print(f"[Step 3] 文稿已保存: {filepath}")

    return str(filepath)


# ─── 主流程 ────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='视频转文稿工具 — 输出转写文本供 Claude Code 总结',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python video_to_note.py https://www.youtube.com/watch?v=xxxxx
  python video_to_note.py https://www.bilibili.com/video/BVxxxxx
  python video_to_note.py URL --lang en
  python video_to_note.py URL --save          # 同时保存 Markdown 文件
  python video_to_note.py URL --save --output ./my_notes
        """
    )
    parser.add_argument('url', help='视频 URL')
    parser.add_argument('--output', '-o', default='', help='输出目录（配合 --save 使用，默认: ./results）')
    parser.add_argument('--lang', '-l', default='auto', help='音频语言（默认: auto=自动检测，可指定 zh/en/ja 等）')
    parser.add_argument('--save', action='store_true', help='保存 Markdown 文件到磁盘')
    parser.add_argument('--keep-audio', action='store_true', help='保留音频文件（需配合 --save）')
    parser.add_argument('--proxy', '-p', default='', help='HTTP 代理地址')
    parser.add_argument('--api-key', default='', help='Groq API Key（或设置环境变量 GROQ_API_KEY）')

    args = parser.parse_args()

    # 加载环境变量：命令行 > 环境变量 > 项目根目录 .env > 全局 .env
    def _load_env_file(path):
        if path.exists():
            for line in path.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ.setdefault(key.strip(), val.strip())

    # 1) 全局凭证（所有项目共享，优先级最低）
    _global_env = Path.home() / 'tools' / '.env'
    _load_env_file(_global_env)

    # 2) 项目根目录 .env（向上查找含 .gitignore/.git 的目录）
    _root = Path(__file__).resolve()
    for parent in _root.parents:
        if (parent / '.gitignore').exists() or (parent / '.git').exists():
            _load_env_file(parent / '.env')
            break
    # 3) 脚本所在目录 .env
    _load_env_file(Path(__file__).parent / '.env')

    if args.api_key:
        os.environ['GROQ_API_KEY'] = args.api_key

    global GROQ_API_KEY, HHM_USER_ID, HHM_SECRET_KEY
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    HHM_USER_ID = os.environ.get("HHM_USER_ID", "")
    HHM_SECRET_KEY = os.environ.get("HHM_SECRET_KEY", "")

    # 代理
    proxy = args.proxy or PROXY

    # 进度信息输出到 stderr，不干扰 stdout 的转写文本
    # 把默认 print 重定向到 stderr，stdout 只用于最终转写结果
    _orig_stdout = sys.stdout
    sys.stdout = sys.stderr

    print(f"{'='*60}")
    print(f"  视频转文稿工具")
    print(f"  URL: {args.url}")
    print(f"  语言: {args.lang}")
    print(f"  输出: stdout" + (" + 文件保存" if args.save else ""))
    print(f"{'='*60}")

    try:
        # Step 1: 提取音频（日志到 stderr）
        with tempfile.TemporaryDirectory() as tmp_dir:
            audio_tmp = str(Path(tmp_dir) / 'audio')
            video_info = extract_audio(args.url, audio_tmp, proxy)
            audio_file = video_info['audio_file']

            # 自动检测语言（未显式指定 --lang 时，从标题推断）
            lang = args.lang
            if lang == 'auto':
                lang = detect_language(video_info.get('title', ''))
            print(f"  检测语言: {lang}")

            # Step 2: 转写音频
            transcript = transcribe_groq(audio_file, lang)

            # 可选：保留音频
            if args.keep_audio:
                output_dir = args.output or OUTPUT_DIR or str(Path(__file__).parent / 'results')
                Path(output_dir).mkdir(parents=True, exist_ok=True)
                import shutil
                keep_path = Path(output_dir) / f"{sanitize_filename(video_info['title'])}.mp3"
                shutil.copy2(audio_file, keep_path)
                print(f"         音频已保留: {keep_path}")

        # Step 3: 输出结果到 stdout（Claude Code 直接读取）
        output_text = format_output(video_info, transcript)
        # 强制 UTF-8 写入，避免 Windows GBK 编码错误
        _orig_stdout.buffer.write((output_text + "\n").encode('utf-8'))
        _orig_stdout.buffer.flush()

        # 可选保存文件
        if args.save:
            output_dir = args.output or OUTPUT_DIR or str(Path(__file__).parent / 'results')
            Path(output_dir).mkdir(parents=True, exist_ok=True)
            save_markdown(video_info, transcript, output_dir)

        print(f"\n{'='*60}")
        print(f"  完成! 标题: {video_info['title']}")

    except Exception as e:
        print(f"\n[错误] {e}")
        sys.exit(1)
    finally:
        sys.stdout = _orig_stdout


if __name__ == '__main__':
    main()
