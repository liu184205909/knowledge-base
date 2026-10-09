# CushionMill 站内配图盘点与缺图报告 2026-10-09b

> 由 `gen-pipeline/scan_weak_images.py` 生成（只读 WP REST；可参数化日期重复运行）。
> 口径：泛义图=cm-前缀数字尾(moleapi通用图)/材质卡卷尺类；复用图=同一URL被>=2对象引用。

## 一、统计面板

- 内容对象：409（post/page/product 见下表）
- 全站唯一配图：1148 张 = 专属 453（39.5%） + AI泛义 616（53.7%） + 材质/工具 79
- 被>=2对象复用的图：272 张
- 社媒素材池规模：564 张（pin-素材库.json）

| 类型 | 总数 | 无featured | featured率 | 专属为主页 | 泛义为主页 | 内文图<2 | 含复用图页 | 配图已入池页 |
|---|---|---|---|---|---|---|---|---|
| posts | 132 | 0 | 100.0% | 23 | 109 | 1 | 55 | 125 |
| pages | 116 | 8 | 93.1% | 104 | 6 | 11 | 110 | 100 |
| products | 161 | 0 | 100.0% | 136 | 25 | 0 | 153 | 161 |

**缺图分层**：P0 产品页 144 · P1 文章/页面 6 · P2 轻度泛义 2 · P3 复用超标 132；合计 284 页

## 二、生图需求清单（按优先级）

### P0 — 产品页无图/泛义为主（转化直接损失）（144）

| # | slug | 状况 | 建议生图场景 |
|---|---|---|---|
| 1 | [custom-porch-swing-cushions](https://cushionmill.com/product/custom-porch-swing-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属0/泛义3；入素材池2 | porch swing with tufted cushion, farmhouse porch |
| 2 | [custom-rv-dinette-cushions](https://cushionmill.com/product/custom-rv-dinette-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属0/泛义3；入素材池2 | RV camper dinette with custom cushions, interior daylight |
| 3 | [replacement-chair-cushions](https://cushionmill.com/product/replacement-chair-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属0/泛义3；复用图1；入素材池2 | dining chair custom seat cushions, bright kitchen |
| 4 | [custom-dining-bench-cushions](https://cushionmill.com/product/custom-dining-bench-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属1/泛义3；复用图1；入素材池3 | outdoor garden bench with tailored bench cushion, morning light |
| 5 | [pottery-barn-westport-cushions](https://cushionmill.com/product/pottery-barn-westport-cushions/) | featured=专属；内文图2(非swatch 0)；专属1/泛义2；复用图3；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 6 | [allenwood-cushions](https://cushionmill.com/product/allenwood-cushions/) | featured=材质图；内文图2(非swatch 1)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 7 | [custom-boat-mattress](https://cushionmill.com/product/custom-boat-mattress/) | featured=专属；内文图3(非swatch 1)；专属1/泛义2；入素材池2 | custom mattress on daybed / RV berth, neutral bedding |
| 8 | [homecrest-pearl-creek-cushions](https://cushionmill.com/product/homecrest-pearl-creek-cushions/) | featured=材质图；内文图3(非swatch 1)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 9 | [ow-lee-cibolo-cushions](https://cushionmill.com/product/ow-lee-cibolo-cushions/) | featured=AI泛义；内文图2(非swatch 1)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 10 | [ow-lee-creighton-cushions](https://cushionmill.com/product/ow-lee-creighton-cushions/) | featured=AI泛义；内文图2(非swatch 1)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 11 | [ow-lee-silana-cushions](https://cushionmill.com/product/ow-lee-silana-cushions/) | featured=AI泛义；内文图2(非swatch 1)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 12 | [ow-lee-studio-cushions](https://cushionmill.com/product/ow-lee-studio-cushions/) | featured=AI泛义；内文图2(非swatch 1)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 13 | [square-outdoor-cushions](https://cushionmill.com/product/square-outdoor-cushions/) | featured=材质图；内文图3(非swatch 1)；专属1/泛义2；复用图2；入素材池3 | backyard patio lounge set with custom cushions, golden hour |
| 14 | [sunbrella-replacement-cushions](https://cushionmill.com/product/sunbrella-replacement-cushions/) | featured=材质图；内文图3(非swatch 1)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 15 | [dutailier-grand-cushions](https://cushionmill.com/product/dutailier-grand-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 16 | [geneva-cushions](https://cushionmill.com/product/geneva-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 17 | [hampshire-cushions](https://cushionmill.com/product/hampshire-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 18 | [hampton-bay-fire-pit-cushions](https://cushionmill.com/product/hampton-bay-fire-pit-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图1；入素材池3 | dining chair custom seat cushions, bright kitchen |
| 19 | [laguna-cushions](https://cushionmill.com/product/laguna-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 20 | [lloyd-flanders-calypso-cushions](https://cushionmill.com/product/lloyd-flanders-calypso-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图1；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 21 | [mainstays-willow-springs-cushions](https://cushionmill.com/product/mainstays-willow-springs-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 22 | [salem-cushions](https://cushionmill.com/product/salem-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义2；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 23 | [custom-outdoor-sofa-cushions](https://cushionmill.com/product/custom-outdoor-sofa-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属1/泛义2；复用图2；入素材池3 | living room sofa with custom-fit cushions, natural light |
| 24 | [thick-outdoor-cushions](https://cushionmill.com/product/thick-outdoor-cushions/) | featured=专属；内文图3(非swatch 3)；专属1/泛义2；复用图2；入素材池2 | backyard patio lounge set with custom cushions, golden hour |
| 25 | [tropitone-montreux-cushions](https://cushionmill.com/product/tropitone-montreux-cushions/) | featured=专属；内文图3(非swatch 1)；专属2/泛义2；复用图3；入素材池4 | worn patio furniture being refreshed with new replacement cushions |
| 26 | [woodard-briarwood-cushions](https://cushionmill.com/product/woodard-briarwood-cushions/) | featured=专属；内文图3(非swatch 1)；专属2/泛义2；复用图3；入素材池4 | worn patio furniture being refreshed with new replacement cushions |
| 27 | [woodard-cortland-cushions](https://cushionmill.com/product/woodard-cortland-cushions/) | featured=专属；内文图3(非swatch 1)；专属2/泛义2；复用图3；入素材池4 | worn patio furniture being refreshed with new replacement cushions |
| 28 | [lloyd-flanders-embassy-cushions](https://cushionmill.com/product/lloyd-flanders-embassy-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义1；复用图1；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 29 | [mainstays-lawson-ridge-cushions](https://cushionmill.com/product/mainstays-lawson-ridge-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义1；复用图2；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 30 | [orbit-lounger-cushions](https://cushionmill.com/product/orbit-lounger-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属1/泛义1；复用图2；入素材池2 | outdoor chaise lounge by the pool with striped cushion |
| 31 | [ow-lee-ashbury-cushions](https://cushionmill.com/product/ow-lee-ashbury-cushions/) | featured=AI泛义；内文图3(非swatch 2)；专属2/泛义2；复用图2；入素材池4 | worn patio furniture being refreshed with new replacement cushions |
| 32 | [ow-lee-casa-cushions](https://cushionmill.com/product/ow-lee-casa-cushions/) | featured=AI泛义；内文图3(非swatch 2)；专属2/泛义2；复用图2；入素材池4 | worn patio furniture being refreshed with new replacement cushions |
| 33 | [wicker-seat-cushions](https://cushionmill.com/product/wicker-seat-cushions/) | featured=专属；内文图3(非swatch 2)；专属2/泛义2；复用图2；入素材池4 | wicker/rattan patio conversation set, weathered teak frame, outdoor |
| 34 | [hampton-bay-swivel-cushions](https://cushionmill.com/product/hampton-bay-swivel-cushions/) | featured=AI泛义；内文图3(非swatch 3)；专属2/泛义2；复用图1；入素材池4 | dining chair custom seat cushions, bright kitchen |
| 35 | [custom-egg-chair-cushions](https://cushionmill.com/product/custom-egg-chair-cushions/) | featured=AI泛义；内文图25(非swatch 25)；专属8/泛义17；复用图12；入素材池7 | dining chair custom seat cushions, bright kitchen |
| 36 | [custom-cushion-built-to-your-spec](https://cushionmill.com/product/custom-cushion-built-to-your-spec/) | featured=专属；内文图4(非swatch 2)；专属3/泛义2；入素材池5 | custom cushion workshop: measuring tape, fabric rolls, cut foam, sewing bench |
| 37 | [berkley-bay-cushions](https://cushionmill.com/product/berkley-bay-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 38 | [brown-jordan-florentine-cushions](https://cushionmill.com/product/brown-jordan-florentine-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 39 | [broyhill-san-marino-cushions](https://cushionmill.com/product/broyhill-san-marino-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 40 | [homecrest-riviera-cushions](https://cushionmill.com/product/homecrest-riviera-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 41 | [lovesac-sactionals-cushions](https://cushionmill.com/product/lovesac-sactionals-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 42 | [ow-lee-cambria-cushions](https://cushionmill.com/product/ow-lee-cambria-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 43 | [ow-lee-chalet-cushions](https://cushionmill.com/product/ow-lee-chalet-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 44 | [ow-lee-classico-cushions](https://cushionmill.com/product/ow-lee-classico-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 45 | [ow-lee-heartland-cushions](https://cushionmill.com/product/ow-lee-heartland-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 46 | [ow-lee-vista-cushions](https://cushionmill.com/product/ow-lee-vista-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 47 | [this-end-up-classic-cushions](https://cushionmill.com/product/this-end-up-classic-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 48 | [tropitone-ravello-cushions](https://cushionmill.com/product/tropitone-ravello-cushions/) | featured=专属；内文图2(非swatch 1)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 49 | [amelia-springs-cushions](https://cushionmill.com/product/amelia-springs-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 50 | [barclay-cushions](https://cushionmill.com/product/barclay-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: barclay cushions — realistic photo, natural light |
| 51 | [barnsley-cushions](https://cushionmill.com/product/barnsley-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: barnsley cushions — realistic photo, natural light |
| 52 | [belcourt-cushions](https://cushionmill.com/product/belcourt-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: belcourt cushions — realistic photo, natural light |
| 53 | [benedetto-cushions](https://cushionmill.com/product/benedetto-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: benedetto cushions — realistic photo, natural light |
| 54 | [bhg-azalea-ridge-cushions](https://cushionmill.com/product/bhg-azalea-ridge-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 55 | [braxton-park-cushions](https://cushionmill.com/product/braxton-park-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: braxton park cushions — realistic photo, natural light |
| 56 | [broyhill-eastlake-cushions](https://cushionmill.com/product/broyhill-eastlake-cushions/) | featured=材质图；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 57 | [broyhill-pembroke-cushions](https://cushionmill.com/product/broyhill-pembroke-cushions/) | featured=材质图；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 58 | [camrose-cushions](https://cushionmill.com/product/camrose-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图3；入素材池3 | custom cushions scene for: camrose cushions — realistic photo, natural light |
| 59 | [cane-crossing-cushions](https://cushionmill.com/product/cane-crossing-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: cane crossing cushions — realistic photo, natural light |
| 60 | [castle-rock-cushions](https://cushionmill.com/product/castle-rock-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: castle rock cushions — realistic photo, natural light |
| 61 | [cavasso-cushions](https://cushionmill.com/product/cavasso-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图1；入素材池3 | custom cushions scene for: cavasso cushions — realistic photo, natural light |
| 62 | [cedarvale-cushions](https://cushionmill.com/product/cedarvale-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | RV camper dinette with custom cushions, interior daylight |
| 63 | [chasewood-cushions](https://cushionmill.com/product/chasewood-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: chasewood cushions — realistic photo, natural light |
| 64 | [cibola-cushions](https://cushionmill.com/product/cibola-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: cibola cushions — realistic photo, natural light |
| 65 | [custom-mattress-topper](https://cushionmill.com/product/custom-mattress-topper/) | featured=专属；内文图3(非swatch 2)；专属2/泛义1；入素材池2 | custom mattress on daybed / RV berth, neutral bedding |
| 66 | [devonwood-cushions](https://cushionmill.com/product/devonwood-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图1；入素材池3 | custom cushions scene for: devonwood cushions — realistic photo, natural light |
| 67 | [dockview-cushions](https://cushionmill.com/product/dockview-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: dockview cushions — realistic photo, natural light |
| 68 | [fall-river-cushions](https://cushionmill.com/product/fall-river-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: fall river cushions — realistic photo, natural light |
| 69 | [folian-cushions](https://cushionmill.com/product/folian-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: folian cushions — realistic photo, natural light |
| 70 | [fordham-cushions](https://cushionmill.com/product/fordham-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: fordham cushions — realistic photo, natural light |
| 71 | [garborone-cushions](https://cushionmill.com/product/garborone-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: garborone cushions — realistic photo, natural light |
| 72 | [granbury-cushions](https://cushionmill.com/product/granbury-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图1；入素材池3 | custom cushions scene for: granbury cushions — realistic photo, natural light |
| 73 | [hampton-bay-ottoman-cushions](https://cushionmill.com/product/hampton-bay-ottoman-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 74 | [haymont-cushions](https://cushionmill.com/product/haymont-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图1；入素材池3 | custom cushions scene for: haymont cushions — realistic photo, natural light |
| 75 | [ow-lee-aris-cushions](https://cushionmill.com/product/ow-lee-aris-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 76 | [pottery-barn-chesapeake-cushions](https://cushionmill.com/product/pottery-barn-chesapeake-cushions/) | featured=材质图；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 77 | [round-patio-cushions](https://cushionmill.com/product/round-patio-cushions/) | featured=专属；内文图3(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | backyard patio lounge set with custom cushions, golden hour |
| 78 | [this-end-up-woods-end-cushions](https://cushionmill.com/product/this-end-up-woods-end-cushions/) | featured=材质图；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 79 | [waterproof-outdoor-cushions](https://cushionmill.com/product/waterproof-outdoor-cushions/) | featured=专属；内文图3(非swatch 2)；专属2/泛义1；复用图2；入素材池2 | backyard patio lounge set with custom cushions, golden hour |
| 80 | [willow-glen-cushions](https://cushionmill.com/product/willow-glen-cushions/) | featured=AI泛义；内文图2(非swatch 2)；专属2/泛义1；复用图2；入素材池3 | custom cushions scene for: willow glen cushions — realistic photo, natural light |
| 81 | [custom-d-shaped-cushions](https://cushionmill.com/product/custom-d-shaped-cushions/) | featured=专属；内文图4(非swatch 3)；专属3/泛义1；复用图1；入素材池2 | custom cushions scene for: custom d shaped cushions — realistic photo, natural light |
| 82 | [custom-patio-cushions](https://cushionmill.com/product/custom-patio-cushions/) | featured=AI泛义；内文图11(非swatch 11)；专属8/泛义3；复用图1；入素材池2 | backyard patio lounge set with custom cushions, golden hour |
| 83 | [custom-bay-window-cushions](https://cushionmill.com/product/custom-bay-window-cushions/) | featured=材质图；内文图11(非swatch 10)；专属9/泛义2；复用图10；入素材池5 | bay window seat with custom cushions, cozy reading nook |
| 84 | [bhg-brookbury-cushions](https://cushionmill.com/product/bhg-brookbury-cushions/) | featured=专属；内文图2(非swatch 2)；专属2/泛义0；复用图2；入素材池2 | worn patio furniture being refreshed with new replacement cushions |
| 85 | [custom-l-shaped-cushions](https://cushionmill.com/product/custom-l-shaped-cushions/) | featured=AI泛义；内文图11(非swatch 11)；专属9/泛义2；复用图9；入素材池5 | custom cushions scene for: custom l shaped cushions — realistic photo, natural light |
| 86 | [custom-outdoor-seat-cushions](https://cushionmill.com/product/custom-outdoor-seat-cushions/) | featured=AI泛义；内文图11(非swatch 11)；专属9/泛义2；复用图8；入素材池5 | backyard patio lounge set with custom cushions, golden hour |
| 87 | [lake-ridge-cushions](https://cushionmill.com/product/lake-ridge-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: lake ridge cushions — realistic photo, natural light |
| 88 | [layton-pointe-cushions](https://cushionmill.com/product/layton-pointe-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: layton pointe cushions — realistic photo, natural light |
| 89 | [lemon-grove-cushions](https://cushionmill.com/product/lemon-grove-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: lemon grove cushions — realistic photo, natural light |
| 90 | [niles-park-cushions](https://cushionmill.com/product/niles-park-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: niles park cushions — realistic photo, natural light |
| 91 | [ow-lee-monterra-cushions](https://cushionmill.com/product/ow-lee-monterra-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 92 | [ow-lee-palazzo-cushions](https://cushionmill.com/product/ow-lee-palazzo-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | worn patio furniture being refreshed with new replacement cushions |
| 93 | [padova-cushions](https://cushionmill.com/product/padova-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: padova cushions — realistic photo, natural light |
| 94 | [park-meadows-cushions](https://cushionmill.com/product/park-meadows-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: park meadows cushions — realistic photo, natural light |
| 95 | [pinnacle-cushions](https://cushionmill.com/product/pinnacle-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: pinnacle cushions — realistic photo, natural light |
| 96 | [posada-cushions](https://cushionmill.com/product/posada-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: posada cushions — realistic photo, natural light |
| 97 | [rock-cliff-cushions](https://cushionmill.com/product/rock-cliff-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图1；入素材池3 | custom cushions scene for: rock cliff cushions — realistic photo, natural light |
| 98 | [rossano-cushions](https://cushionmill.com/product/rossano-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: rossano cushions — realistic photo, natural light |
| 99 | [sanopelo-cushions](https://cushionmill.com/product/sanopelo-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: sanopelo cushions — realistic photo, natural light |
| 100 | [tacana-cushions](https://cushionmill.com/product/tacana-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: tacana cushions — realistic photo, natural light |
| 101 | [tolston-cushions](https://cushionmill.com/product/tolston-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: tolston cushions — realistic photo, natural light |
| 102 | [tramore-cushions](https://cushionmill.com/product/tramore-cushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: tramore cushions — realistic photo, natural light |
| 103 | [window-seat-cushion](https://cushionmill.com/product/window-seat-cushion/) | featured=专属；内文图15(非swatch 12)；专属12/泛义3；复用图1；入素材池2 | bay window seat with custom cushions, cozy reading nook |
| 104 | [custom-camper-van-mattress](https://cushionmill.com/product/custom-camper-van-mattress/) | featured=专属；内文图3(非swatch 3)；专属3/泛义0；入素材池2 | custom mattress on daybed / RV berth, neutral bedding |
| 105 | [custom-wedge-cushion](https://cushionmill.com/product/custom-wedge-cushion/) | featured=专属；内文图3(非swatch 3)；专属3/泛义0；复用图1；入素材池2 | custom cushions scene for: custom wedge cushion — realistic photo, natural light |
| 106 | [custom-cushion-inserts](https://cushionmill.com/product/custom-cushion-inserts/) | featured=专属；内文图4(非swatch 4)；专属4/泛义0；入素材池2 | custom cushion workshop: measuring tape, fabric rolls, cut foam, sewing bench |
| 107 | [custom-papasan-cushions](https://cushionmill.com/product/custom-papasan-cushions/) | featured=专属；内文图4(非swatch 4)；专属4/泛义0；入素材池2 | dining chair custom seat cushions, bright kitchen |
| 108 | [custom-wicker-chaise-cushions](https://cushionmill.com/product/custom-wicker-chaise-cushions/) | featured=专属；内文图11(非swatch 10)；专属10/泛义1；复用图11；入素材池6 | wicker/rattan patio conversation set, weathered teak frame, outdoor |
| 109 | [custom-adirondack-chair-cushions](https://cushionmill.com/product/custom-adirondack-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 110 | [custom-back-cushions](https://cushionmill.com/product/custom-back-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom back cushions — realistic photo, natural light |
| 111 | [custom-banquette-cushions](https://cushionmill.com/product/custom-banquette-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom banquette cushions — realistic photo, natural light |
| 112 | [custom-bar-stool-cushions](https://cushionmill.com/product/custom-bar-stool-cushions/) | featured=专属；内文图11(非swatch 11)；专属12/泛义0；复用图10；入素材池6 | kitchen bar stools with round custom cushions |
| 113 | [custom-bench-cushions](https://cushionmill.com/product/custom-bench-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池4 | outdoor garden bench with tailored bench cushion, morning light |
| 114 | [custom-bench-cushions-indoor](https://cushionmill.com/product/custom-bench-cushions-indoor/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | outdoor garden bench with tailored bench cushion, morning light |
| 115 | [custom-boat-cushions](https://cushionmill.com/product/custom-boat-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | boat cockpit seats with marine cushions, harbor |
| 116 | [custom-breakfast-nook-cushions](https://cushionmill.com/product/custom-breakfast-nook-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom breakfast nook cushions — realistic photo, natural light |
| 117 | [custom-chair-back-cushions](https://cushionmill.com/product/custom-chair-back-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 118 | [custom-chair-cushions](https://cushionmill.com/product/custom-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 119 | [custom-chaise-lounge-cushions](https://cushionmill.com/product/custom-chaise-lounge-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池5 | outdoor chaise lounge by the pool with striped cushion |
| 120 | [custom-church-pew-cushions](https://cushionmill.com/product/custom-church-pew-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom church pew cushions — realistic photo, natural light |
| 121 | [custom-couch-cushions](https://cushionmill.com/product/custom-couch-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池6 | living room sofa with custom-fit cushions, natural light |
| 122 | [custom-daybed-cushions](https://cushionmill.com/product/custom-daybed-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池5 | daybed with tailored cushion and throw pillows |
| 123 | [custom-deep-seat-cushions](https://cushionmill.com/product/custom-deep-seat-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池6 | deep seating patio sofa with thick cushions, sunset |
| 124 | [custom-dining-chair-cushions](https://cushionmill.com/product/custom-dining-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池6 | patio dining set, six chairs with custom seat cushions |
| 125 | [custom-dog-bed-cushions](https://cushionmill.com/product/custom-dog-bed-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池5 | custom cushions scene for: custom dog bed cushions — realistic photo, natural light |
| 126 | [custom-floor-cushions](https://cushionmill.com/product/custom-floor-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | floor cushion seating corner, living room |
| 127 | [custom-futon-cushions](https://cushionmill.com/product/custom-futon-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom futon cushions — realistic photo, natural light |
| 128 | [custom-glider-cushions](https://cushionmill.com/product/custom-glider-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池6 | custom cushions scene for: custom glider cushions — realistic photo, natural light |
| 129 | [custom-golf-cart-cushions](https://cushionmill.com/product/custom-golf-cart-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | custom cushions scene for: custom golf cart cushions — realistic photo, natural light |
| 130 | [custom-lawn-furniture-cushions](https://cushionmill.com/product/custom-lawn-furniture-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池5 | custom cushions scene for: custom lawn furniture cushions — realistic photo, natural light |
| 131 | [custom-lounge-chair-cushions](https://cushionmill.com/product/custom-lounge-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池6 | outdoor chaise lounge by the pool with striped cushion |
| 132 | [custom-loveseat-cushions](https://cushionmill.com/product/custom-loveseat-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池5 | custom cushions scene for: custom loveseat cushions — realistic photo, natural light |
| 133 | [custom-outdoor-bench-cushions](https://cushionmill.com/product/custom-outdoor-bench-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池5 | outdoor garden bench with tailored bench cushion, morning light |
| 134 | [custom-outdoor-swing-cushions](https://cushionmill.com/product/custom-outdoor-swing-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池5 | porch swing with tufted cushion, farmhouse porch |
| 135 | [custom-patio-chair-cushions](https://cushionmill.com/product/custom-patio-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属12/泛义0；复用图10；入素材池7 | dining chair custom seat cushions, bright kitchen |
| 136 | [custom-rattan-cushions](https://cushionmill.com/product/custom-rattan-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池6 | wicker/rattan patio conversation set, outdoor |
| 137 | [custom-rocking-chair-cushions](https://cushionmill.com/product/custom-rocking-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 138 | [custom-rv-camper-cushions](https://cushionmill.com/product/custom-rv-camper-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | RV camper dinette with custom cushions, interior daylight |
| 139 | [custom-seat-cushions](https://cushionmill.com/product/custom-seat-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池5 | custom cushions scene for: custom seat cushions — realistic photo, natural light |
| 140 | [custom-sectional-cushions](https://cushionmill.com/product/custom-sectional-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图10；入素材池6 | custom cushions scene for: custom sectional cushions — realistic photo, natural light |
| 141 | [custom-settee-cushions](https://cushionmill.com/product/custom-settee-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图9；入素材池5 | custom cushions scene for: custom settee cushions — realistic photo, natural light |
| 142 | [custom-sofa-cushions](https://cushionmill.com/product/custom-sofa-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池6 | living room sofa with custom-fit cushions, natural light |
| 143 | [custom-wicker-cushions](https://cushionmill.com/product/custom-wicker-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图11；入素材池6 | wicker/rattan patio conversation set, weathered teak frame, outdoor |
| 144 | [custom-wrought-iron-chair-cushions](https://cushionmill.com/product/custom-wrought-iron-chair-cushions/) | featured=专属；内文图11(非swatch 11)；专属11/泛义0；复用图8；入素材池5 | dining chair custom seat cushions, bright kitchen |

### P1 — 文章内文图<2 / 无featured（阅读体验与图片搜索损失）（6）

| # | slug | 状况 | 建议生图场景 |
|---|---|---|---|
| 1 | [contact](https://cushionmill.com/contact/) | featured=专属；内文图0(非swatch 0)；专属1/泛义0；复用图1 | custom cushions scene for: contact — realistic photo, natural light |
| 2 | [custom-mattress-topper-guide](https://cushionmill.com/custom-mattress-topper-guide/) | featured=专属；内文图1(非swatch 0)；专属1/泛义1；入素材池2 | custom mattress on daybed / RV berth, neutral bedding |
| 3 | [faq](https://cushionmill.com/faq/) | featured=专属；内文图0(非swatch 0)；专属1/泛义0；复用图1 | custom cushions scene for: faq — realistic photo, natural light |
| 4 | [partners](https://cushionmill.com/partners/) | featured=专属；内文图0(非swatch 0)；专属1/泛义0；复用图1 | custom cushions scene for: partners — realistic photo, natural light |
| 5 | [shipping](https://cushionmill.com/shipping/) | featured=专属；内文图0(非swatch 0)；专属1/泛义0；复用图1 | custom cushions scene for: shipping — realistic photo, natural light |
| 6 | [about](https://cushionmill.com/about/) | 无featured图；内文图3(非swatch 3)；专属2/泛义1；复用图2；入素材池1 | custom cushions scene for: about — realistic photo, natural light |

### P2 — 产品页轻度泛义（专属图占比不足）（2）

| # | slug | 状况 | 建议生图场景 |
|---|---|---|---|
| 1 | [couch-foam-cushions](https://cushionmill.com/product/couch-foam-cushions/) | featured=专属；内文图24(非swatch 24)；专属14/泛义11；复用图16；入素材池10 | living room sofa with custom-fit cushions, natural light |
| 2 | [replacement-rocking-chair-cushions](https://cushionmill.com/product/replacement-rocking-chair-cushions/) | featured=AI泛义；内文图26(非swatch 26)；专属15/泛义11；复用图19；入素材池12 | dining chair custom seat cushions, bright kitchen |

### P3 — 复用图超标（图片多样性不足）（132）

| # | slug | 状况 | 建议生图场景 |
|---|---|---|---|
| 1 | [15x15-seat-cushions](https://cushionmill.com/sizes/15x15-seat-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | custom cushions scene for: 15x15 seat cushions — realistic photo, natural light |
| 2 | [16x16-outdoor-chair-cushions](https://cushionmill.com/sizes/16x16-outdoor-chair-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 3 | [17x17-outdoor-cushions](https://cushionmill.com/sizes/17x17-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 4 | [17x18-outdoor-cushions](https://cushionmill.com/sizes/17x18-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图33；入素材池5 | backyard patio lounge set with custom cushions, golden hour |
| 5 | [18x18-outdoor-chair-cushions](https://cushionmill.com/sizes/18x18-outdoor-chair-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图33；入素材池5 | dining chair custom seat cushions, bright kitchen |
| 6 | [18x20-patio-cushions](https://cushionmill.com/sizes/18x20-patio-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池7 | backyard patio lounge set with custom cushions, golden hour |
| 7 | [20x20-outdoor-cushions](https://cushionmill.com/sizes/20x20-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 8 | [21x21-outdoor-cushions](https://cushionmill.com/sizes/21x21-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池5 | backyard patio lounge set with custom cushions, golden hour |
| 9 | [22x22-outdoor-cushions](https://cushionmill.com/sizes/22x22-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 10 | [22x24-outdoor-seat-cushions](https://cushionmill.com/sizes/22x24-outdoor-seat-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 11 | [22x26-outdoor-cushions](https://cushionmill.com/sizes/22x26-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池5 | backyard patio lounge set with custom cushions, golden hour |
| 12 | [23x26-outdoor-cushions](https://cushionmill.com/sizes/23x26-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 13 | [24x24-outdoor-cushions](https://cushionmill.com/sizes/24x24-outdoor-cushions/) | featured=AI泛义；内文图34(非swatch 33)；专属20/泛义15；复用图33；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 14 | [24x26-outdoor-cushions](https://cushionmill.com/sizes/24x26-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 15 | [25x25-outdoor-cushions](https://cushionmill.com/sizes/25x25-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池5 | backyard patio lounge set with custom cushions, golden hour |
| 16 | [26x26-outdoor-cushions](https://cushionmill.com/sizes/26x26-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 17 | [27x27-outdoor-cushions](https://cushionmill.com/sizes/27x27-outdoor-cushions/) | featured=AI泛义；内文图29(非swatch 29)；专属19/泛义11；复用图28；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 18 | [28x28-outdoor-cushions](https://cushionmill.com/sizes/28x28-outdoor-cushions/) | featured=AI泛义；内文图35(非swatch 34)；专属21/泛义15；复用图34；入素材池6 | backyard patio lounge set with custom cushions, golden hour |
| 19 | [alenya](https://cushionmill.com/replacement-cushions/ashley/alenya/) | featured=AI泛义；内文图28(非swatch 28)；专属20/泛义9；复用图28；入素材池8 | custom cushions scene for: alenya — realistic photo, natural light |
| 20 | [antilop](https://cushionmill.com/replacement-cushions/ikea/antilop/) | featured=专属；内文图35(非swatch 34)；专属32/泛义4；复用图35；入素材池7 | custom cushions scene for: antilop — realistic photo, natural light |
| 21 | [ashley](https://cushionmill.com/replacement-cushions/ashley/) | featured=AI泛义；内文图35(非swatch 33)；专属26/泛义10；复用图35；入素材池8 | custom cushions scene for: ashley — realistic photo, natural light |
| 22 | [beachside](https://cushionmill.com/replacement-cushions/hampton-bay/beachside/) | featured=AI泛义；内文图34(非swatch 33)；专属30/泛义5；复用图33；入素材池6 | custom cushions scene for: beachside — realistic photo, natural light |
| 23 | [bench-cushion-one-piece-or-two](https://cushionmill.com/bench-cushion-one-piece-or-two/) | featured=专属；内文图3(非swatch 3)；专属2/泛义2；复用图3；入素材池1 | outdoor garden bench with tailored bench cushion, morning light |
| 24 | [beverly](https://cushionmill.com/replacement-cushions/hampton-bay/beverly/) | featured=AI泛义；内文图34(非swatch 33)；专属30/泛义5；复用图33；入素材池7 | custom cushions scene for: beverly — realistic photo, natural light |
| 25 | [cambridge](https://cushionmill.com/replacement-cushions/hampton-bay/cambridge/) | featured=AI泛义；内文图34(非swatch 33)；专属30/泛义5；复用图33；入素材池6 | custom cushions scene for: cambridge — realistic photo, natural light |
| 26 | [cedar-island](https://cushionmill.com/replacement-cushions/martha-stewart/cedar-island/) | featured=AI泛义；内文图33(非swatch 32)；专属23/泛义11；复用图33；入素材池8 | custom cushions scene for: cedar island — realistic photo, natural light |
| 27 | [charleston](https://cushionmill.com/product/charleston/) | featured=AI泛义；内文图19(非swatch 19)；专属19/泛义1；复用图19；入素材池8 | custom cushions scene for: charleston — realistic photo, natural light |
| 28 | [charlottetown](https://cushionmill.com/replacement-cushions/martha-stewart/charlottetown/) | featured=AI泛义；内文图33(非swatch 32)；专属23/泛义11；复用图33；入素材池8 | custom cushions scene for: charlottetown — realistic photo, natural light |
| 29 | [chateau](https://cushionmill.com/replacement-cushions/hampton-bay/chateau/) | featured=AI泛义；内文图35(非swatch 34)；专属31/泛义5；复用图34；入素材池6 | custom cushions scene for: chateau — realistic photo, natural light |
| 30 | [cushion-covers](https://cushionmill.com/product/cushion-covers/) | featured=专属；内文图20(非swatch 19)；专属20/泛义1；复用图19；入素材池8 | custom cushions scene for: cushion covers — realistic photo, natural light |
| 31 | [cushion-thickness-seat-height](https://cushionmill.com/cushion-thickness-seat-height/) | featured=AI泛义；内文图3(非swatch 2)；专属2/泛义2；复用图4；入素材池3 | custom cushions scene for: cushion thickness seat height — realistic photo, natural light |
| 32 | [cushionmill-vs-customcushions](https://cushionmill.com/cushionmill-vs-customcushions/) | featured=专属；内文图2(非swatch 2)；专属3/泛义0；复用图2；入素材池3 | custom cushions scene for: cushionmill vs customcushions — realistic photo, natural light |
| 33 | [custom-bed-gap-filler](https://cushionmill.com/product/custom-bed-gap-filler/) | featured=专属；内文图23(非swatch 20)；专属17/泛义7；复用图17；入素材池9 | custom cushions scene for: custom bed gap filler — realistic photo, natural light |
| 34 | [custom-cushions](https://cushionmill.com/custom-cushions/) | featured=AI泛义；内文图35(非swatch 33)；专属24/泛义12；复用图31；入素材池7 | custom cushion workshop: measuring tape, fabric rolls, cut foam, sewing bench |
| 35 | [custom-ottoman-cushions](https://cushionmill.com/product/custom-ottoman-cushions/) | featured=AI泛义；内文图21(非swatch 21)；专属20/泛义2；复用图22；入素材池16 | custom cushions scene for: custom ottoman cushions — realistic photo, natural light |
| 36 | [custom-round-cushions](https://cushionmill.com/custom-round-cushions/) | featured=AI泛义；内文图3(非swatch 2)；专属1/泛义3；复用图3；入素材池1 | custom cushions scene for: custom round cushions — realistic photo, natural light |
| 37 | [custom-t-cushions](https://cushionmill.com/custom-t-cushions/) | featured=AI泛义；内文图3(非swatch 2)；专属2/泛义2；复用图3；入素材池3 | custom cushions scene for: custom t cushions — realistic photo, natural light |
| 38 | [darcy](https://cushionmill.com/replacement-cushions/ashley/darcy/) | featured=AI泛义；内文图28(非swatch 28)；专属20/泛义9；复用图28；入素材池8 | custom cushions scene for: darcy — realistic photo, natural light |
| 39 | [edington](https://cushionmill.com/replacement-cushions/hampton-bay/edington/) | featured=AI泛义；内文图34(非swatch 33)；专属30/泛义5；复用图33；入素材池6 | custom cushions scene for: edington — realistic photo, natural light |
| 40 | [ektorp](https://cushionmill.com/replacement-cushions/ikea/ektorp/) | featured=专属；内文图35(非swatch 34)；专属32/泛义4；复用图35；入素材池8 | custom cushions scene for: ektorp — realistic photo, natural light |

*（仅列前 40 条，全量见 JSON：weak-images-data-2026-10-09b.json）*

## 三、用法备注

- 重跑：`python scan_weak_images.py --date <YYYY-MM-DD>`（自动覆盖同名输出）
- 生图后回写：替换对应 slug 的 featured/内文图后重跑本扫描器，专属图率应上升
- 素材池联动：`in_pool` 表示该页配图已有部分进 pin-素材库.json，可直接复用为社媒素材
