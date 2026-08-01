# Ethical Sourcing 页面 — 图片生成清单

> 共 8 张独立图片，每张有唯一 prompt，不可复用。
> 生成后复制到 `assets/images/generated/` 目录，文件名与 prompt key 一致。
> 上传 WordPress 媒体库后，回写 URL 到 `site-images.js` 对应条目。

---

## 1. sourcing.hero — 道德采购 Hero 背景

- **文件名**: `sourcing-hero-earth-to-wrist-v1.png`
- **尺寸**: 1920 x 900
- **用途**: Ethical Sourcing 页面 Section 1 Hero 背景图（"Ethically Sourced, From Earth to You"），深色叠层 overlay 0.65
- **Alt**: `Ethically sourced crystal bracelets journey from mine to wrist`
- **Prompt**:
```
Premium wide hero banner for an ethical crystal sourcing page: raw unpolished crystals in natural earth tones emerging from rich dark soil at the left side, transitioning smoothly to polished crystal bracelet beads arranged on a clean linen surface at the right. A single shaft of warm sunlight illuminates the polished stones. Earthy browns and warm golds color palette, deep moody atmosphere suitable for dark overlay text. No people, no faces, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.
```

---

## 2. sourcing.mining — 供应链步骤1：矿山来源

- **文件名**: `sourcing-step-mining-origins-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤1 配图（"Traceable Origins"）
- **Alt**: `Raw crystal specimens in natural mine environment showing traceable origins`
- **Prompt**:
```
Educational product photo for ethical mining step: a collection of raw unpolished amethyst and rose quartz crystal specimens resting on natural dark earth and stone surface, with a small label card and a magnifying glass beside them. Warm natural outdoor light filtering through. Shows the natural origin and raw beauty of ethically mined crystals. No people, no faces, no hands, no text overlay. Photorealistic, warm earth tones, 800x600 landscape.
```

---

## 3. sourcing.selection — 供应链步骤2：手工选品

- **文件名**: `sourcing-step-hand-selection-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤2 配图（"Hand-Selected Quality"）
- **Alt**: `Hand-selected polished crystal beads sorted by color and quality grade`
- **Prompt**:
```
Educational product photo for crystal selection step: sorted polished crystal beads in small wooden bowls arranged by color — amethyst purple, rose quartz pink, citrine gold, clear quartz white, black tourmaline — on a clean light wood workbench. A brass loupe and a small notepad visible at the edge. Top-down flat lay, warm studio light, clean and organized aesthetic. Shows quality control and careful hand selection. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.
```

---

## 4. sourcing.cleansing — 供应链步骤3：净化充能

- **文件名**: `sourcing-step-energy-cleansing-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤3 配图（"Energetic Cleansing"）
- **Alt**: `Crystal bracelet being energetically cleansed with sage smoke and selenite`
- **Prompt**:
```
Educational product photo for crystal cleansing step: a single crystal bracelet resting on a large flat selenite charging plate, with a thin stream of dried white sage smoke gently rising around it. A single beeswax candle providing warm amber light from the left. Dark charcoal background for contrast. Mystical yet clean and professional atmosphere. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.
```

---

## 5. sourcing.inspection — 供应链步骤4：质量检验

- **文件名**: `sourcing-step-quality-inspection-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤4 配图（"Quality Inspection"）
- **Alt**: `Crystal bracelet quality inspection under natural light with measurement tools`
- **Prompt**:
```
Educational product photo for quality inspection step: a finished crystal bracelet lying on a white inspection mat under bright natural daylight, with a brass jeweler's loupe and a small digital caliper placed beside it. A quality checklist card with handwritten notes visible at the corner. Clean professional studio setting, bright and trustworthy. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.
```

---

## 6. sourcing.packaging — 供应链步骤5：环保包装

- **文件名**: `sourcing-step-eco-packaging-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤5 配图（"Eco-Friendly Packaging"）
- **Alt**: `Crystal bracelet in eco-friendly kraft box with velvet pouch and guide card`
- **Prompt**:
```
Educational product photo for eco-friendly packaging step: an open recyclable kraft gift box containing a dark purple velvet pouch with a crystal bracelet visible inside, placed beside a cream-colored energy guide card and a small dried flower sprig. All materials look natural and sustainable. Warm neutral linen background, top-down flat lay, soft natural light. Premium yet earth-conscious brand aesthetic. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.
```

---

## 7. sourcing.delivery — 供应链步骤6：发货送达

- **文件名**: `sourcing-step-delivery-reveal-v1.png`
- **尺寸**: 800 x 600
- **用途**: Section 3 供应链流程 步骤6 配图（"Delivered to You"）
- **Prompt**:
```
Educational product photo for delivery step: a sealed kraft shipping box with a branded wax seal on top, placed on a warm wooden doorstep or entryway surface. The box is accompanied by a small handwritten thank-you note and a single dried lavender sprig. Warm welcoming morning light, conveying the unboxing experience and care in delivery. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.
```

---

## 8. sourcing.cta — CTA 背景

- **文件名**: `sourcing-cta-shop-ethical-v1.png`
- **尺寸**: 1920 x 900
- **用途**: Section 5 CTA 背景图（"Shop Ethically Sourced Crystals"），深色叠层 overlay 0.7
- **Alt**: `Shop ethically sourced crystal bracelets with full supply chain transparency`
- **Prompt**:
```
Premium wide hero banner for ethical crystal sourcing call-to-action: a beautiful arrangement of five different finished crystal bracelets displayed on a raw natural stone slab, surrounded by small potted succulents, dried botanicals, and scattered raw crystal chips. Warm sunset golden light, organic and earthy color palette. Inviting atmosphere suitable for dark overlay with white text. No people, no faces, no hands, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.
```

---

## 执行流程

1. **逐张生成**: 用 Codex 内置生图（gpt-image-2 模型），按上方 prompt 逐张生成
2. **质量验收**: 检查无文字、无人脸、无手部、尺寸匹配、视觉风格统一
3. **复制入库**: 复制到 `assets/images/generated/` 目录，文件名与上方一致
4. **更新 site-images.js**: 将 sourcing 部分的 8 个条目 URL 改为新文件名，status 改为 `needs_generation`
5. **上传 WP**: 运行部署脚本或手动通过 `POST /wp-json/wp/v2/media` 上传
6. **回写 URL**: 更新 `site-images.js` 中每个条目的 `url` 和 `status`
7. **上传页面**: 执行 `node pages/ethical-sourcing.js` 创建 draft 页面
8. **验收页面**: 检查所有图片、H1/H2/H3、内链、布局

## 竞品参考

- **Moonrise Crystals** — 道德采购标杆站，每个矿山有独立故事页
- **Conscious Items** — 供应链可视化做得好，图标+数据组合
- **Tiny Rituals** — 简洁信任感，4步流程展示
