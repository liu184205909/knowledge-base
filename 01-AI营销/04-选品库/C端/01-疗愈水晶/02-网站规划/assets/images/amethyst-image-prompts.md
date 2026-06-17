# Amethyst Meaning — 图片生成清单

> 共 6 张图片，每张有唯一 prompt，不可复用。
> 生成后放到 `assets/images/generated/crystal-meaning/amethyst/` 目录。
> 上传脚本会自动读取这些文件并上传到 WordPress 媒体库。
> **最终入库格式必须是 WebP，所有图片必须统一为 16:9 横图。不要保留 JPG 作为项目最终资产。**
> **推荐最终尺寸：Hero 使用 1600×900；正文模块图也使用 1600×900。如需较小文件，可使用 1200×675，但不得使用 1200×900 / 4:3。**

---

## 图片存放路径

```
02-网站规划/assets/images/generated/crystal-meaning/amethyst/
├── amethyst-hero.webp          ← Featured image (1600×900, 16:9)
├── amethyst-overview.webp      ← Module 4: Meaning Overview (1600×900, 16:9)
├── amethyst-properties.webp    ← Module 5: Properties (1600×900, 16:9)
├── amethyst-benefits.webp      ← Module 6: Benefits (1600×900, 16:9)
├── amethyst-how-to-use.webp    ← Module 8: How to Use (1600×900, 16:9)
└── amethyst-pairings.webp      ← Module 10: Pairings (1600×900, 16:9, 可选)
```

---

## 1. Featured Image (Hero)

- **文件名**: `amethyst-hero.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `featured_media`（WordPress 原生）
- **Alt**: `Amethyst meaning guide with purple crystal cluster`
- **Prompt**:
```
Premium wide hero banner for a crystal meaning guide page: a stunning natural amethyst geode split open to reveal deep purple crystal points catching warm golden sunlight. The geode rests on a dark slate surface with subtle bokeh of smaller amethyst clusters in the background. Rich purple and violet tones with golden highlights. Clean, editorial quality suitable for a header image. No people, no faces, no hands, no text overlay. Photorealistic, 1600x900 landscape.
```

---

## 2. Overview Image (Module 4)

- **文件名**: `amethyst-overview.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `overview_image`
- **Alt**: `Amethyst meaning and symbolism visual guide`
- **Prompt**:
```
Editorial crystal photography for meaning and symbolism section: a single large tumbled amethyst stone resting on a piece of cream-colored raw silk fabric, with soft diffused natural light creating gentle shadows. Beside it, a small vintage book and a dried lavender sprig suggesting ancient wisdom and spiritual use. Muted purple and warm beige tones, serene and contemplative mood. No people, no faces, no hands, no text overlay. Photorealistic, 1600x900 landscape.
```

---

## 3. Properties Image (Module 5)

- **文件名**: `amethyst-properties.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `properties_image`
- **Alt**: `Amethyst color and texture close-up for crystal properties`
- **Prompt**:
```
Macro product photography of amethyst crystal properties: an extreme close-up of a raw amethyst crystal point showing the natural geometric facets, deep purple to violet color gradient, and transparent edges backlit by soft white light. The crystal structure is clearly visible with sharp crystal faces and natural inclusions. Scientific yet beautiful, like a mineralogy textbook plate. No people, no faces, no hands, no text overlay. Photorealistic, 1600x900 landscape.
```

---

## 4. Benefits Image (Module 6)

- **文件名**: `amethyst-benefits.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `benefits_image`
- **Alt**: `Amethyst bracelet benefits for meditation and calm`
- **Prompt**:
```
Lifestyle product photography for crystal benefits section: a beautiful amethyst crystal bracelet resting on a meditation cushion in a serene home setting. Soft morning light filters through a nearby window casting gentle shadows. A lit candle and a small ceramic bowl with sage suggest a meditation space. Calm, peaceful, aspirational mood. Purple and warm neutral tones. No people, no faces, no hands, no text overlay. Photorealistic, 1600x900 landscape.
```

---

## 5. How to Use Image (Module 8)

- **文件名**: `amethyst-how-to-use.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `how_to_use_image`
- **Alt**: `Amethyst bracelet used for meditation and daily intention setting`
- **Prompt**:
```
Lifestyle product photography for how-to-use section: an amethyst crystal bracelet worn on a wrist resting on a wooden desk beside a journal and pen, suggesting daily intention-setting practice. Warm natural desk lamp light, cozy productive atmosphere. The bracelet beads are clearly visible with rich purple color. Background slightly blurred showing a plant and a cup of tea. No faces visible, only hand and wrist. Photorealistic, 1600x900 landscape.
```

---

## 6. Pairings Image (Module 10, 可选)

- **文件名**: `amethyst-pairings.webp`
- **尺寸**: 1600×900（16:9）
- **ACF 字段**: `pairings_image`
- **Alt**: `Amethyst paired with complementary healing crystals`
- **Prompt**:
```
Flat lay product photography for crystal pairings section: three crystal bracelets arranged in a row on a light linen surface — amethyst (purple), rose quartz (pink), and clear quartz (transparent). Each bracelet is neatly coiled. Small handwritten labels on kraft paper beside each one. Soft natural overhead light, clean minimalist composition. Earthy and elegant brand aesthetic. No people, no faces, no hands, no text overlay. Photorealistic, 1600x900 landscape.
```

---

## 生成流程

1. **逐张生成**: 用 Codex 内置生图（gpt-image-2 模型），按上方 prompt 逐张生成
2. **质量验收**: 检查无文字、无人脸、无手部（除 How to Use 图允许手部）、尺寸匹配、风格统一
3. **裁切与转码**: 所有最终图片裁切为 16:9，导出为 WebP；Hero 与正文模块图默认均为 1600×900
4. **重命名**: 将生成文件重命名为上方指定文件名
5. **放入目录**: 复制到 `assets/images/generated/crystal-meaning/amethyst/`
6. **清理中间格式**: 项目资产目录只保留最终 WebP，不保留 JPG/PNG 中间文件

## 文章 JSON 图片引用

文章 JSON（`amethyst-meaning.json`）中 images 部分使用相对路径引用：

```json
"images": {
    "featured":  { "file": "assets/images/generated/crystal-meaning/amethyst/amethyst-hero.webp", "alt": "..." },
    "overview":  { "file": "assets/images/generated/crystal-meaning/amethyst/amethyst-overview.webp", "alt": "..." },
    ...
}
```

上传脚本会自动读取这些路径，上传到 WordPress 媒体库，并替换为 media ID。
