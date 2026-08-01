#!/bin/bash
# 批量生成 78 篇 × 3 张图片（共 234 张）
# 用法：bash batch-generate-images.sh
cd "d:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶"
DIR="04-内容生产/4.zodiac-compatibility/articles"
GEN="02-网站规划/scripts/generate-crystal-images.js"
COUNT=0
TOTAL=$(ls "$DIR"/*.json 2>/dev/null | wc -l)
echo "=== 批量图片生成：$TOTAL 篇 × 3 张 = $((TOTAL * 3)) 张 ==="
echo "=== 开始时间：$(date) ==="
for f in "$DIR"/*.json; do
  COUNT=$((COUNT + 1))
  SLUG=$(basename "$f" .json)
  echo "--- [$COUNT/$TOTAL] $SLUG ---"
  node "$GEN" "$f" --quality low 2>&1 | grep -E '^\[|✓|❌|完成|Error'
done
echo "=== 全部完成：$(date) ==="
echo "=== 共处理 $COUNT 篇 ==="
