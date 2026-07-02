# -*- coding: utf-8 -*-
"""
生成 22 Major Arcana 两两配对关系判定 config（231 对）。
数据源：07-互动工具/_shared/tarot-knowledge.json
框架：模板-Tarot-配对文章框架.md §5（5 类关系判定）
"""
import json, os

OUT = os.path.join(os.path.dirname(__file__), "pair-knowledge.json")

# 22 牌查询表（number -> meta）；crystal.slug/name 取自 tarot-knowledge.json 的 crystals.best_overall
CARDS = {
    0:  {"slug": "the-fool",          "name": "The Fool",          "arch": "Innocent Pioneer", "elem": "Air",   "cslug": "quartz",           "cname": "Clear Quartz"},
    1:  {"slug": "the-magician",      "name": "The Magician",      "arch": "Manifestor",       "elem": "Air",   "cslug": "quartz",           "cname": "Clear Quartz"},
    2:  {"slug": "the-high-priestess","name": "The High Priestess","arch": "Intuitive",        "elem": "Water", "cslug": "moonstone",        "cname": "Moonstone"},
    3:  {"slug": "the-empress",       "name": "The Empress",       "arch": "Nurturer",         "elem": "Earth", "cslug": "rose-quartz",      "cname": "Rose Quartz"},
    4:  {"slug": "the-emperor",       "name": "The Emperor",       "arch": "Sovereign",        "elem": "Fire",  "cslug": "red-jasper",       "cname": "Red Jasper"},
    5:  {"slug": "the-hierophant",    "name": "The Hierophant",    "arch": "Teacher",          "elem": "Earth", "cslug": "amethyst",         "cname": "Amethyst"},
    6:  {"slug": "the-lovers",        "name": "The Lovers",        "arch": "Choosers",         "elem": "Air",   "cslug": "rhodonite",        "cname": "Rhodonite"},
    7:  {"slug": "the-chariot",       "name": "The Chariot",       "arch": "Victor",           "elem": "Water", "cslug": "hematite",         "cname": "Hematite"},
    8:  {"slug": "strength",          "name": "Strength",          "arch": "Gentle Power",     "elem": "Fire",  "cslug": "tiger-eye",        "cname": "Tiger Eye"},
    9:  {"slug": "the-hermit",        "name": "The Hermit",        "arch": "Seeker",           "elem": "Earth", "cslug": "labradorite",      "cname": "Labradorite"},
    10: {"slug": "wheel-of-fortune",  "name": "Wheel of Fortune",  "arch": "Turning",          "elem": "Fire",  "cslug": "aventurine",       "cname": "Green Aventurine"},
    11: {"slug": "justice",           "name": "Justice",           "arch": "Truth-Seeker",     "elem": "Air",   "cslug": "lapis",            "cname": "Lapis Lazuli"},
    12: {"slug": "the-hanged-man",    "name": "The Hanged Man",    "arch": "Surrendered",      "elem": "Water", "cslug": "selenite",         "cname": "Selenite"},
    13: {"slug": "death",             "name": "Death",             "arch": "Transformer",      "elem": "Water", "cslug": "obsidian",         "cname": "Obsidian"},
    14: {"slug": "temperance",        "name": "Temperance",        "arch": "Alchemist",        "elem": "Fire",  "cslug": "amethyst",         "cname": "Amethyst"},
    15: {"slug": "the-devil",         "name": "The Devil",         "arch": "Shadow-Knower",    "elem": "Earth", "cslug": "black-tourmaline", "cname": "Black Tourmaline"},
    16: {"slug": "the-tower",         "name": "The Tower",         "arch": "Awakener",         "elem": "Fire",  "cslug": "smoky-quartz",     "cname": "Smoky Quartz"},
    17: {"slug": "the-star",          "name": "The Star",          "arch": "Hopeful",          "elem": "Air",   "cslug": "aquamarine",       "cname": "Aquamarine"},
    18: {"slug": "the-moon",          "name": "The Moon",          "arch": "Dreamer",          "elem": "Water", "cslug": "moonstone",        "cname": "Moonstone"},
    19: {"slug": "the-sun",           "name": "The Sun",           "arch": "Radiant",          "elem": "Fire",  "cslug": "sunstone",         "cname": "Sunstone"},
    20: {"slug": "judgment",          "name": "Judgment",          "arch": "Awakened",         "elem": "Fire",  "cslug": "angelite",         "cname": "Angelite"},
    21: {"slug": "the-world",         "name": "The World",         "arch": "Complete",         "elem": "Earth", "cslug": "quartz",           "cname": "Clear Quartz"},
}

# PAIRS：键 = (a_num, b_num) 升序 a<b；值为 dict：
#   relationship_type, judgment_basis, combination_story_seed, synergy_logic, eastern_lens
# 分三批录入：批1 a=0；批2 a=1..6；批3 a=7..13；批4 a=14..20（按 a 主牌分组，便于核对）
PAIRS = {}

# =========================================================================
# 批 1：The Fool (0) × 其余 21 张
# =========================================================================
PAIRS[(0,1)] = {
  "relationship_type": "causal",
  "judgment_basis": "Fool=Air 开端 / Magician=Air 显化 → 同元素(风) 序列因果：开端(leap)是显化(having tools & directing them)的因，Fool 的 leap 落地即 Magician 上桌摆开四元素开始作为",
  "combination_story_seed": "the leap that picks up the tools — Fool's cliff-step walks straight onto the Magician's table, where the white rose of pure intention becomes the wand that directs the four suits; the beginning is not separate from the manifestation, the moment you commit to the jump you already have everything you need to build",
  "synergy_logic": "Clear Quartz(意图清明/看准哪个 leap 值得) + Clear Quartz(聚焦意志/as above so below 的放大器) → 同一颗 Master Healer 既帮 Fool 看清纯洁意图、又帮 Magician 聚焦显化意志，协同 = 让冒险从一开始就带着清晰的意图方向，而非盲目一跳",
  "eastern_lens": "初发心(Fool 菩萨石清明)→ 专注意图的念珠(Magician) — 风元素由 'open' 收束为 'directed'，东方'始→作'的显化链"}
PAIRS[(0,2)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 外向行动开端 / High Priestess=Water 内向静默知晓 → 互补元素(风/水)+ 对立互补 archetype(外向 leap vs 内向 stillness)：一动一静拼成'先静后动'的完整直觉决策",
  "combination_story_seed": "the step that follows the silence — Fool's cliff-edge meets the veil of pomegranates; before the white-rose traveler leaps, the priestess between the pillars hands over the gut-answer the dog at the Fool's heels already senses, so the jump lands on knowing rather than on nothing",
  "synergy_logic": "Clear Quartz(清明直觉，看准跳跃时机) + Moonstone(内在知晓/月亮节律) → Quartz 帮你在跳跃前看清，Moonstone 帮你在静默中听见 gut sense，协同 = 外向冒险有内在直觉为锚，明明白白地跳",
  "eastern_lens": "动(Fool 风/行)与静(Priestess 水/止)的阴阳和合 — 'openness to experience' 配 'interoceptive awareness'，东方'行前先观'"}
PAIRS[(0,3)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 精神性开端(无重量的白玫瑰) / Empress=Earth 具身丰饶(麦穗肉体) → 互补元素(风/土)+ 阴阳配(轻灵之父式开端 vs 滋养之母式具身)：精神 leap 与具身滋养互补",
  "combination_story_seed": "the leap that lands in the wheat field — Fool's weightless satchel steps off the cliff and is caught by the Empress's lush garden; the white rose of pure intention takes root and becomes the crown of twelve stars, the bodiless beginning finds a body to grow in",
  "synergy_logic": "Clear Quartz(清明意图，看准新开端) + Rose Quartz(心轮滋养，给予也接受) → Quartz 让 leap 有方向，Rose Quartz 让落地有温度，协同 = 让新开端既有清晰意图又有滋养的土壤，不至于干跳或空长",
  "eastern_lens": "风(轻灵)土(具身)互补 — 'bodhicitta 初发心'落入 'Devi 大地母亲'，东方'父性开端×母性滋养'的和合"}
PAIRS[(0,4)] = {
  "relationship_type": "tension",
  "judgment_basis": "Fool=Air 自由无结构(悬崖边野性 leap) / Emperor=Fire 结构权威(石座骨架) → 对立 archetype(自由 vs 秩序)且用户难两全：要 leap 还是要 scaffolding，当下拉扯",
  "combination_story_seed": "the cliff versus the throne — Fool's dog pulls toward the edge while the Emperor's ram-headed stone seat demands a foundational rule first; the traveler without a map meets the sovereign who has mapped everything, and the pull is not which to choose but whether the leap needs a scaffold to land on or whether scaffolding is exactly what kills the leap",
  "synergy_logic": "Clear Quartz(清明，辨别何时该跳) + Red Jasper(稳固根基/耐心纪律) → Quartz 帮你看清这次是 wise leap 还是 impulsive，Red Jasper 帮你给 leap 铺一根底线结构，协同 = 让自由有底线、让结构不僵死，在拉扯里找'有根基的冒险'",
  "eastern_lens": "风(散/行)与火(固/立)的拉扯 — '开放不立结构' vs '正稳固原则'，东方'散与立'的张力抉择"}
PAIRS[(0,5)] = {
  "relationship_type": "tension",
  "judgment_basis": "Fool=Air 自发白纸(beginner's mind) / Hierophant=Earth 传承师承(received wisdom) → 对立 archetype(无师自通 vs 跪受衣钵)且难两全：自己发明还是站在前人肩上",
  "combination_story_seed": "the blank slate before the vestments — Fool's empty satchel with no lineage walks past the two initiates kneeling for the Hierophant's blessing; the question is whether beginner's-mind needs a teacher's lineage before it leaps, or whether the very freshness that makes the leap possible is what the inherited rule would flatten",
  "synergy_logic": "Clear Quartz(清明，辨别哪些传承还适用) + Amethyst(恭敬接受/灵性虔诚) → Quartz 帮你筛掉不再适用的旧规，Amethyst 帮你谦卑接住真正服务你的师承，协同 = '该学的学、该跳的跳'，破除非此即彼",
  "eastern_lens": "风(自发)与土(传承)的张力 — 'beginner's mind' vs 'lineage 传承'，东方'顿悟与渐学'的老命题"}
PAIRS[(0,6)] = {
  "relationship_type": "causal",
  "judgment_basis": "Fool=Air 开端 / Lovers=Air 价值对齐的选择 → 同元素(风)+ 序列因果：Fool 的'开始'是 Lovers'有意识选择 union'的前提，先有 leap 才有可选的对齐",
  "combination_story_seed": "the leap that becomes a choice — Fool steps off the cliff carrying only a white rose, and the rose turns out to be the very thing the Lovers' angel watches over; the spontaneous beginning ripens into the moment you must choose whether this new path aligns with what you stand for, the leap was the prelude to the vow",
  "synergy_logic": "Clear Quartz(清明，看清开端意图) + Rhodonite(慈悲关系/价值对齐的选择) → Quartz 帮你看清开始的是什么，Rhodonite 帮你在关系中守住自尊与价值，协同 = 让新开端经得起价值检验，'跳对了再选，选了就对齐'",
  "eastern_lens": "风(开端)→风(择)的显化链 — '初发心'落为 'right association 择友择道'，东方'始→择'的成长序列"}
PAIRS[(0,7)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Fool=Air 无方向的开端(被狗追着跳) / Chariot=Water 聚焦意志的方向(驭两狮鹫朝一目标) → 阶段跃迁 archetype(散漫 leap → 统驭方向)：从盲目一跳升华到驾驭对立力前进",
  "combination_story_seed": "the leap learns to hold the reins — Fool's untethered cliff-step grows up into the Chariot's driver holding two sphinxes pulling opposite ways; the spontaneity that began without a map becomes the focused will that harnesses opposing forces toward a single horizon, the puppy at the heel becomes the team in front",
  "synergy_logic": "Clear Quartz(清明，认清单一方向) + Hematite(扎根意志/统驭对立拉力) → Quartz 帮你看清要往哪走，Hematite 帮你把相互拉扯的力收拢成一队，协同 = 让无向的开端长出有向的统驭力，'跳得自由更要赢得有方向'",
  "eastern_lens": "风(散)→水(聚)的阶段跃迁 — '开放'炼成 '中道整合对立力'，东方'从无明 leap 到统驭'的炼金"}
PAIRS[(0,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 鲁莽开放 / Strength=Fire 温柔驯伏(无畏以柔) → 风火相生互补(风助火)+ archetype 互补(冲动 leap vs 对 raw instinct 的耐心慈悲)：开放需要温柔的内在力量来兜底",
  "combination_story_seed": "the leap and the open jaws — Fool's white-rose innocence walks past the lion whose mouth the woman calmly opens with bare hands; the spontaneity that would otherwise be reckless meets the gentle power that tames raw instinct without force, so the leap carries courage rather than folly",
  "synergy_logic": "Clear Quartz(清明，辨别 wise vs reckless leap) + Tiger Eye(平衡勇气/对恐惧的临在而非压制) → Quartz 让你看清跳得对不对，Tiger Eye 让你在跳时带着对恐惧的耐心而非蛮力，协同 = 让冒险既有胆又有度，'勇敢而不鲁莽'",
  "eastern_lens": "风(勇)火(柔)相生 — 'bodhicitta 开放'配 '调伏非暴力'，东方'勇与柔'的和合"}
PAIRS[(0,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 向外的开端(跟狗追着跳) / Hermit=Earth 向内的独处(雪峰举灯) → 互补元素(风/土)+ 对立互补 archetype(外向随众 leap vs 内向持灯独行)：向外跳与向内听互补",
  "combination_story_seed": "the leap that pauses to raise the lantern — Fool at the cliff edge meets the hooded figure on the snowy peak holding the six-pointed star; the dog yapping forward and the staff planted still are the same journey seen from two ends, the beginning that does not yet know where it goes pauses to borrow the Hermit's light before stepping off",
  "synergy_logic": "Clear Quartz(清明，看准开端方向) + Labradorite(内在之光，答案本就在内) → Quartz 帮你看清外在往哪跳，Labradorite 帮你听见内在早就有的答案，协同 = '向外跳前先向内听'，让 leap 不靠借来的光",
  "eastern_lens": "风(外/行)土(内/止)互补 — 'openness 向外'配 '闭关 retreat 向内'，东方'行与止、外与内'的和合"}
PAIRS[(0,10)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Fool=Air 单次开端(线性 leap) / Wheel=Fire 循环转折(轮转非一次性) → 阶段跃迁 archetype(单点开端 → 认出循环)：从'一次新开始'升华到'认清一切在转、骑住变化'",
  "combination_story_seed": "the single step meets the turning wheel — Fool's one cliff-edge leap steps onto the great wheel already spinning, sphinx and snake and jackal riding its rim; the beginner who thought this was one new beginning discovers it is the same beginning the wheel has turned before, and the leap becomes learning to ride the cycle rather than resist it",
  "synergy_logic": "Clear Quartz(清明，认出这次 leap 在哪个周期位置) + Green Aventurine(机会/愿意随转而动) → Quartz 帮你看清时位，Aventurine 帮你不抗拒地随轮而转，协同 = 把'一次性 leap'升级为'骑住循环的智慧'",
  "eastern_lens": "风(线)→火(环)的跃迁 — 'bodhicitta 一次初发心'展开为 '无常轮回观'，东方'从一点到一轮'的视野升华"}
PAIRS[(0,11)] = {
  "relationship_type": "tension",
  "judgment_basis": "Fool=Air 自发不计后果(leap of faith) / Justice=Air 诚实称量后果(剑与秤) → 同元素但 archetype 对立(凭信而跳 vs 据实而断)且难两全：信还是称",
  "combination_story_seed": "the faith leap under the raised sword — Fool's white rose meets Justice's upright blade and level scales; the leap that asks no questions stands before the figure who must weigh every consequence, and the pull is whether to trust the beginner's heart or to lay the leap on the scales first and let the evidence decide",
  "synergy_logic": "Clear Quartz(清明，看准 leap 的真实意图) + Lapis Lazuli(诚实称量/不回避真相) → Quartz 帮你看清，Lapis 帮你不带粉饰地称出后果，协同 = '信而有据'，让信仰之跳经得起诚实的称量",
  "eastern_lens": "风(信)vs 风(称)的同元对立 — 'leap of faith' vs '因果 cause-effect'，东方'信与据'的张力"}
PAIRS[(0,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 自发正立 leap / Hanged Man=Water 自愿倒悬换视角 → 互补元素(风/水)+ archetype 互补(正立冲前 vs 倒悬悬停)：前进与悬停、惯常视角与反转视角互补",
  "combination_story_seed": "the leap and the deliberate inversion — Fool steps forward off the cliff while the Hanged Man hangs serene by one ankle from the T-tree, halo lit; one moves without thinking, the other stops to see upside-down, and the leap that would be blind is saved by the pause that reverses the frame so the cliff is seen for what it is before the foot leaves it",
  "synergy_logic": "Clear Quartz(清明，看准方向) + Selenite(高维清明/反转后洗净的视角) → Quartz 帮你向前看清，Selenite 帮你倒过来重新看清，协同 = '前看 + 倒看'双视角，让 leap 不是盲冲",
  "eastern_lens": "风(前)水(倒)互补 — 'beginner's mind 正向开放'配 '反转惯常视角'，东方'正与反、行与悬'的和合"}
PAIRS[(0,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Fool=Air 开端(白纸起点) / Death=Water 终结转化(清场让新生) → 阶段跃迁 archetype(开始 → 结束即开始)：Fool 的新开始正是 Death 转化后让出的空间，构成'终结即重启'的炼金弧线",
  "combination_story_seed": "the leap that walks through the skeleton's clearing — Fool's white rose steps off the cliff and onto the path the armored skeleton on the pale horse has just cleared; what the dog yaps toward as a fresh start is the same doorway Death has opened by ending what already completed, the beginning is the rebirth side of the ending",
  "synergy_logic": "Clear Quartz(清明，看清新开端) + Obsidian(诚实面对必须结束的) → Quartz 帮你看清新的在哪，Obsidian 帮你诚实地放手旧的，协同 = '先死而后生'，让 leap 有真正让出的空间可落",
  "eastern_lens": "风(始)水(终)的炼金跃迁 — 'bodhicitta 初发心'即 '无常观'的另一面，东方'终即是始'的圆环"}
PAIRS[(0,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 单一纯粹意图(白玫瑰) / Temperance=Fire 双杯慢调和(一脚水一脚土) → 风火相生互补 + archetype 互补(一心冲前 vs 不急调和两端)：纯粹与调和互补",
  "combination_story_seed": "the single rose and the two cups — Fool carries one white rose of pure intention while the winged Temperance pours liquid endlessly between two cups; the leap that knows only one direction meets the patient blending that holds opposites, and the pure beginning is tempered into something that can integrate rather than collide",
  "synergy_logic": "Clear Quartz(清明单一意图) + Amethyst(平衡心/不醉的中道) → Quartz 帮你守住纯粹方向，Amethyst 帮你不急地调和冲突两端，协同 = 让纯粹意图经得起慢调和，'一心而不偏'",
  "eastern_lens": "风(纯)火(和)相生 — 'openness 一往无前'配 '中道动态平衡'，东方'专一与调和'的和合"}
PAIRS[(0,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Fool=Air 纯真开放(白玫瑰无挂碍) / Devil=Earth 执念束缚(松链可解却自觉被困) → 对立 archetype(自由无缚 vs 自缚于 attach)且难两全：leap 是真自由还是又一次掉进同一条松链",
  "combination_story_seed": "the white rose and the loose chains — Fool's pure intention walks past the two figures chained loosely before the horned pillar; the leap that feels like freedom is shadowed by the question of whether the cliff is real openness or just the latest attachment wearing a rose, and the dog at the heel may be the same chain the Devil's figures haven't yet noticed they can lift",
  "synergy_logic": "Clear Quartz(清明，分辨真自由 vs 伪装的 attach) + Black Tourmaline(看清执念的松链/不被吞噬) → Quartz 帮你看清这次跳是不是真自由，Black Tourmaline 帮你看清哪条链其实早就松了，协同 = '自由而不自缚'，让 leap 不掉进同一条链",
  "eastern_lens": "风(自由)vs 土(执)的对立 — 'bodhicitta 无挂碍' vs '对治内魔 attachment'，东方'自由与执念'的拉扯"}
PAIRS[(0,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Fool=Air 鲁莽 leap(悬崖不顾) / Tower=Fire 突然崩塌(雷击已不稳的结构) → 阶段跃迁 archetype(鲁莽一跳 → 那一跳本身引发崩塌)：leap 触发 collapse，构成'冒险即破局'的转化弧线（框架 §3 代表对之一）",
  "combination_story_seed": "the leap that triggers the collapse — Fool's innocence walks straight into the Tower's demolition, and what falls was already unsound; the combination is not 'change then start over,' it is that the reckless leap is the very thing that brings the structure down, the cliff-step and the lightning strike are the same moment seen twice",
  "synergy_logic": "Clear Quartz(清明，看准哪个 leap 值得) + Smoky Quartz(动荡中扎根/穿越必然震荡) → Quartz 帮你辨明智 leap，Smoky Quartz 在崩塌时给你 grounding，协同 = '明智冒险 + 稳稳落地'，跳了也不被雷劈散",
  "eastern_lens": "风(鲁)→火(崩)的炼金 — 'openness 鲁莽'触发 '无常结构性崩塌即清明'，东方'妄动招崩、崩后见真'的跃迁"}
PAIRS[(0,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 新开端(白纸) / Star=Air 风暴后希望(八芒星重连意义) → 同元素(风)+ archetype 互补(开端之纯 vs 低谷后之信)：开始与重新开始、初次 leap 与劫后 renewal 互补",
  "combination_story_seed": "the first leap and the leap after the storm — Fool steps off the cliff in broad daylight while the Star kneels pouring water back into the pool under eight points of light; one is the beginning before anything has happened, the other is the beginning that returns after everything has fallen, and the white rose and the still pool are the same trust seen at two different hours",
  "synergy_logic": "Clear Quartz(清明，看准开端) + Aquamarine(风暴后清明之水/重连希望) → Quartz 帮你看清新的往哪走，Aquamarine 帮你在低谷后重连意义与希望，协同 = 让 leap 不论是初次还是劫后都带着清明与信心",
  "eastern_lens": "风(始)风(续)的同元互补 — 'bodhicitta 初发心'与 '菩提心 re-arises after difficulty'，东方'始与续'的同源两态"}
PAIRS[(0,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Fool=Air 凭白纸直觉 leap(明朗天) / Moon=Water 半明不白的潜意识迷雾(双塔月光) → 互补元素但 archetype 拉扯(凭信冲前 vs 停在不确定里)且难两全：跳还是停在半明中",
  "combination_story_seed": "the cliff in the half-light — Fool's daylight leap toward a clear edge meets the Moon's path winding between two towers under uncertain light, crayfish surfacing, dog and wolf howling; the beginner who needs a visible cliff stands where the rational mind cannot map what is surfacing, and the pull is whether to leap on faith or to stay with the not-yet-clear and let the images arrive",
  "synergy_logic": "Clear Quartz(清明，看准可见的部分) + Moonstone(停在不确定里/反射而非直射的内在光) → Quartz 帮你看清明朗处，Moonstone 帮你耐受半明不白，协同 = '可见处跳、未明处停'，让 leap 不强行制造假清晰",
  "eastern_lens": "风(明)vs 水(晦)的拉扯 — 'leap of faith' vs '无意识深处梦观'，东方'明与晦、信与待'的张力"}
PAIRS[(0,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Fool=Air 纯真活力(自发无负担) / Sun=Fire 喜悦明朗(孩童白马向日葵) → 风火相生同主题 archetype(纯真活力 × 喜悦明朗 共振放大)：开放与喜悦同频加成",
  "combination_story_seed": "the leap under the full sun — Fool's white rose and small dog meet the Sun's content child on the white horse among the sunflowers; the beginner's spontaneous vitality and the radiant joy of simply being alive amplify each other, the leap is not just a beginning but a beginning that is openly enjoyed",
  "synergy_logic": "Clear Quartz(清明活力) + Sunstone(阳光喜悦/自信温暖) → Quartz 放大纯粹意图，Sunstone 放大喜悦与活力，协同 = 让 leap 带着被光照亮的喜悦，'跳得自由且快乐'",
  "eastern_lens": "风(纯)火(喜)相生共振 — 'openness 活力'与 'luminosity 明性'同频，东方'童心与明性'的共振放大"}
PAIRS[(0,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Fool=Air 未醒的开端(尚未受召唤) / Judgment=Fire 听号角觉醒(墓中起身回应召唤) → 阶段跃迁 archetype(无意识的 leap → 听见更大生命的召唤并回应)：从自发 leap 升华到回应 calling",
  "combination_story_seed": "the leap hears the trumpet — Fool's idle cliff-step stops when the angel's trumpet sounds and figures rise from their graves arms outstretched; the spontaneity that began without a why is met by a call from a larger life, and the purposeless leap becomes the answer to something that was always summoning it",
  "synergy_logic": "Clear Quartz(清明，看清召唤的方向) + Angelite(温柔的更高沟通/召唤听作指引非谴责) → Quartz 帮你看清召唤，Angelite 帮你把召唤听成指引而非审判，协同 = 让 leap 从自发升级为'回应更大生命的召唤'",
  "eastern_lens": "风(未醒)→火(觉醒)的跃迁 — 'bodhicitta 微动'接 '如实自省后的召唤'，东方'从无明行到闻召唤'的升华"}
PAIRS[(0,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Fool=Air 始(白纸开端) / World=Earth 终(花环圆满) → 互补元素(风/土)+ 始终配 archetype(0 起点 vs 21 完成)：阴阳和合的完整循环（框架代表对）",
  "combination_story_seed": "the leap that completes the cycle — Fool's beginning meets the World's wreath, and the cliff the traveler steps off turns out to be the same circle the dancer completes; the white rose that started the journey is woven into the green garland, every ending is the threshold of the next leap, and the Fool's Journey closes only to reopen at zero",
  "synergy_logic": "Clear Quartz(清明开端意图) + Clear Quartz(大师和合/整合全程) → 同一颗 Master Harmonizer 在起点帮你清明地跳、在终点帮你和合整段旅程，协同 = 让一个 cycle 始终如一地清明，终点即下一段 leap 的起点",
  "eastern_lens": "风(始)土(终)的阴阳和合 — '复卦始'配 '既济终/曼荼罗圆满即下一环起点'，东方'始终于一'的完整循环"}

# =========================================================================
# 批 2：The Magician (1) 起，a=1..6
# =========================================================================
PAIRS[(1,2)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 外向主动显化(举手向天接地) / High Priestess=Water 内向静默知晓(两柱之间垂幕) → 互补元素(风/水)+ 对立互补 archetype(做/收、显/隐)：显化与接收、as above so below 与 veil behind，阴阳和合（框架代表对）",
  "combination_story_seed": "the raised hand and the pulled veil — Magician's arm reaching sky-to-earth stands before the priestess who sits still behind pomegranates; the manifestation that directs every tool meets the knowing that arrives only when you stop directing, and the four suits on the table are useless without the gut-answer the moon at her feet already holds",
  "synergy_logic": "Clear Quartz(聚焦意志显化/as above so below 放大器) + Moonstone(静默中接收内在知晓) → Quartz 帮你显化，Moonstone 帮你接收，协同 = '做与收'并重，让显化不脱离直觉，'as above so below' 配 '内在月亮节律'",
  "eastern_lens": "风(显)水(收)的阴阳和合 — '创造神原则 mind shapes matter'配 '内观 stillness'，东方'作与收、显与隐'的和合"}
PAIRS[(1,3)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 意志显化(无重量工具) / Empress=Earth 具身丰饶(麦穗生长) → 互补元素(风/土)+ archetype 互补(主动造物 vs 被动滋养生长)：意志造物与具身孕育互补",
  "combination_story_seed": "the wand and the wheat — Magician's four suits laid out on the table meet the Empress's field of grain; the will that shapes form meets the abundance that grows what is shaped, and the manifestation needs the gestation the Empress gives or it stays a trick on the table",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Rose Quartz(心轮滋养/给予也接受) → Quartz 帮你造，Rose Quartz 帮你滋养它长，协同 = '造得出也养得大'，让显化有具身的温度与持续",
  "eastern_lens": "风(造)土(养)互补 — '创造神意志'配 'Devi 大地母亲孕育'，东方'造与养、父与母'的和合"}
PAIRS[(1,4)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Magician=Air 意志显化(skill+resource) / Emperor=Fire 结构权威(foundations) → 风火相生同主题 archetype(主动造物 × 建立结构 共振)：显化意志与结构搭建叠加",
  "combination_story_seed": "the table before the throne — Magician's tools laid out to begin shaping meet the Emperor's stone seat demanding the foundation first; the will that says 'I have what I need' and the structure that says 'lay the rule first' amplify each other, manifestation finds its scaffolding and the throne gets something built on it",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Red Jasper(稳固根基/耐心搭建结构) → Quartz 帮你显化，Red Jasper 帮你给它搭骨架，协同 = '显化有结构、结构有内容'，共振放大执行力",
  "eastern_lens": "风(造)火(立)相生共振 — 'mind shapes matter 显化'配 '正稳固原则结构'，东方'造与立'的同频放大"}
PAIRS[(1,5)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Magician=Air 技能显化(resourcefulness) / Hierophant=Earth 师承学问(lineage wisdom) → 风土虽异但同主题 archetype(掌握工具 × 学得工具 共振)：自学成才与师承学问在'掌握技艺'上叠加",
  "combination_story_seed": "the four suits before the two initiates — Magician who already holds the tools stands before the Hierophant handing down the keys; the self-taught manifestor and the lineage teacher amplify each other when the resourcefulness that gathered the tools meets the wisdom that knows the deeper use of them, skill meets craft",
  "synergy_logic": "Clear Quartz(聚焦意志用工具) + Amethyst(恭敬深学/灵性虔诚) → Quartz 帮你用工具，Amethyst 帮你深学其用法，协同 = '会用工具更懂其道'，让技能升华为 craft",
  "eastern_lens": "风(技)土(学)的主题共振 — 'self-efficacy 自学'配 'lineage 师承'，东方'技与道、自学与师承'的叠加"}
PAIRS[(1,6)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 单向意志显化(I direct) / Lovers=Air 双向价值对齐选择(union with another) → 同元素(风)+ archetype 互补(独自造物 vs 与人对齐选择)：单独显化与联合选择互补",
  "combination_story_seed": "the single wand and the angel between two — Magician's 'I have what I need to build alone' meets the Lovers' angel presiding over a values-aligned choice; the manifestation that centers the will encounters the union that requires the will to align with another, and the table built for one is asked whether it can hold two",
  "synergy_logic": "Clear Quartz(聚焦个人意志显化) + Rhodonite(关系中的慈悲与自尊) → Quartz 帮你显化自己的，Rhodonite 帮你与人对齐不失自尊，协同 = '独自能造、对人能合'，让显化经得起关系检验",
  "eastern_lens": "风(独)风(合)的同元互补 — 'self-efficacy 独自显化'配 'right association 与人对齐'，东方'独与合、我与众'的互补"}
PAIRS[(1,7)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Magician=Air 意志显化(direct tools) / Chariot=Water 聚焦意志前进(harness opposing forces) → 风水虽异但同主题 archetype(意志显化 × 意志统驭 共振)：显化意志与统驭意志叠加放大",
  "combination_story_seed": "the table becomes the chariot — Magician's tools that direct intention meet the Chariot's reins that direct opposing sphinxes; the will that manifests form and the will that drives forward amplify each other, 'I have what I need' becomes 'I am moving with all of it toward one aim'",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Hematite(扎根统驭对立拉力) → Quartz 帮你聚意志显化，Hematite 帮你把意志变成前进的统驭，协同 = '想造 + 真的前进'，共振放大执行力",
  "eastern_lens": "风(显)水(驭)的主题共振 — 'mind shapes matter'配 '中道整合对立力前进'，东方'造与驭、显与行'的叠加"}
PAIRS[(1,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 强力显化意志(I direct) / Strength=Fire 以柔克刚(徒手开狮口) → 风火相生但 archetype 互补(强力 direct vs 柔和 patience)：刚显化与柔掌控互补，刚柔并济",
  "combination_story_seed": "the wand and the open jaws — Magician's raised arm directing the four suits meets the woman calmly opening the lion's mouth; the will that imposes form encounters the power that tames without force, and the manifestation that could become manipulation is softened into mastery that does not wage war",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Tiger Eye(平衡勇气/对 raw instinct 的临在) → Quartz 帮你显化，Tiger Eye 帮你不靠蛮力而靠临在，协同 = '显化而不操纵、有力而不刚硬'，刚柔并济",
  "eastern_lens": "风(刚显)火(柔驯)相生互补 — 'self-efficacy 强力'配 '调伏非暴力'，东方'刚与柔'的和合"}
PAIRS[(1,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 外向显化(摆工具开干) / Hermit=Earth 内向独处(雪峰举灯) → 互补元素(风/土)+ archetype 互补(外向造物 vs 向内持灯)：向外造与向内听互补",
  "combination_story_seed": "the table under the lantern — Magician laying out tools to build meets the Hermit on the peak holding the six-pointed star; the manifestation that begins with action pauses to borrow the lantern, because the tools are only as good as the inner knowing that directs them, the raised hand lowers to listen first",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Labradorite(内在之光/答案本在内) → Quartz 帮你显化，Labradorite 帮你先听清内在，协同 = '听清了再造'，让显化不脱离内在指引",
  "eastern_lens": "风(外造)土(内听)互补 — 'mind shapes matter 向外'配 '闭关 retreat 向内'，东方'造与听、外与内'的和合"}
PAIRS[(1,10)] = {
  "relationship_type": "tension",
  "judgment_basis": "Magician=Air 主控显化(I direct the tools) / Wheel=Fire 非自主的循环(turning beyond your control) → 风火相生但 archetype 对立(自主掌控 vs 超出掌控的轮转)且难两全：我能造还是命运在转",
  "combination_story_seed": "the tools and the turning wheel — Magician's 'I direct everything' meets the great wheel already turning beyond any single will; the manifestor who believes in agency stands before the sphinx and snake riding the rim, and the pull is how much of this is your direction and how much is the cycle that turns whether you direct or not",
  "synergy_logic": "Clear Quartz(聚焦你的能动意志) + Green Aventurine(分清可控/不可控、随转而动) → Quartz 帮你用力，Aventurine 帮你认出哪些不在你手里，协同 = '尽力而为 + 认出时位'，化解'全能 vs 全非自主'的拉扯",
  "eastern_lens": "风(主)vs 火(转)的张力 — 'self-efficacy 我能' vs '无常轮回非宿命但非我控'，东方'自主与缘起'的张力"}
PAIRS[(1,11)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Magician=Air 技能显化(resourcefulness) / Justice=Air 诚实称量(truth+accountability) → 同元素(风)+ 同主题 archetype(用工具造物 × 称量真相 共振)：显化与诚信同频，技能需诚信校正",
  "combination_story_seed": "the table weighed on the scales — Magician's tools laid out to build meet Justice's upright sword and level scales; the resourcefulness that could become manipulation is amplified into integrity when the manifestation is weighed for honesty, skill meets accountability and the four suits are used with the truth in mind",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Lapis Lazuli(诚实称量/不回避真相) → Quartz 帮你显化，Lapis 帮你称量是否诚实，协同 = '有能力 + 用得正'，共振放大诚信的显化",
  "eastern_lens": "风(技)风(正)的同元共振 — 'self-efficacy 技能'配 '因果 cause-effect 诚实'，东方'术与正、能与诚'的叠加"}
PAIRS[(1,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 主动显化(rushing to direct) / Hanged Man=Water 自愿悬停反转视角 → 互补元素(风/水)+ archetype 互补(急着造 vs 停下来倒过来看)：行动与暂停、正与反互补",
  "combination_story_seed": "the wand pauses upside down — Magician's hand reaching sky-to-earth meets the Hanged Man serene by one ankle; the manifestation that rushes to direct tools is inverted, and the build that began with 'I know how' sees from the new angle that changes what 'how' even means",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Selenite(反转后洗净的高维视角) → Quartz 帮你造，Selenite 帮你先倒过来看清，协同 = '造之前先换个角度'，让显化不基于旧框架",
  "eastern_lens": "风(造)水(悬)互补 — 'mind shapes matter 急造'配 '反转惯常视角'，东方'造与悬、正与反'的和合"}
PAIRS[(1,13)] = {
  "relationship_type": "causal",
  "judgment_basis": "Magician=Air 显化造物(begin shaping) / Death=Water 终结清场(clear what completed) → 风水虽异但序列因果：旧的不死新的显化不出来，Death 的清场是 Magician 真正显化的前提",
  "combination_story_seed": "the table cleared for the new build — Magician's tools laid out to begin shaping meet the skeleton clearing what has completed; the manifestation stalls until Death clears the old form it would otherwise build on top of, the build and the ending are cause and effect, you cannot manifest the new while the dead thing still sits on the table",
  "synergy_logic": "Clear Quartz(聚焦显化新物) + Obsidian(诚实放掉已死的旧物) → Quartz 帮你造新的，Obsidian 帮你清掉旧的，协同 = '先清后造'，让显化有真正的空间",
  "eastern_lens": "风(造)→水(清)的因果链 — '显化造物'以 '无常清场'为前提，东方'死而后生、除旧布新'的因果"}
PAIRS[(1,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 单向强力显化(one direction) / Temperance=Fire 双向慢调和(blending opposites) → 风火相生但 archetype 互补(强力 direct vs 不急调和两端)：强力造与慢调和互补",
  "combination_story_seed": "the single wand and the two cups — Magician's focused will meets Temperance pouring endlessly between two cups; the manifestation that drives one direction is tempered by the patient blending that holds opposites, and the build that would impose finds the middle that integrates instead",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Amethyst(不急的中道调和) → Quartz 帮你聚方向，Amethyst 帮你调和冲突两端，协同 = '有力 + 不急不偏'，让显化经得起调和",
  "eastern_lens": "风(强)火(和)相生互补 — 'self-efficacy 强力'配 '中道动态平衡'，东方'专与和、力与度'的和合"}
PAIRS[(1,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Magician=Air 正向显化技能(integrity of tools) / Devil=Earth 显化的暗面操纵(manipulation/misuse of power) → 风土虽异但 archetype 直接对立(正用 vs 滥用同一份 resourcefulness)且难两全：用得正还是用得诡",
  "combination_story_seed": "the wand turned to the trickster — Magician's 'I have what I need to build' meets the Devil's loose chains; the same resourcefulness that manifests with integrity can slide into the manipulation that bends others, and the four suits on the table are the very tools that could become the chain, the trickster is the Magician who stopped weighing whether the build served something larger",
  "synergy_logic": "Clear Quartz(清明，分辨正用 vs 滥用) + Black Tourmaline(看清执念松链/不被吞噬) → Quartz 帮你看清用得正不正，Black Tourmaline 帮你认出哪条链已松，协同 = '有能而不操纵'，守住显化的诚信",
  "eastern_lens": "风(正)vs 土(诡)的对立 — 'self-efficacy 正用' vs '对治内魔 滥用同一份能'，东方'正术与邪术、能与贪'的张力"}
PAIRS[(1,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Magician=Air 自信显化(I direct stable build) / Tower=Fire 显化结构崩塌(已不稳的结构被击) → 阶段跃迁 archetype(自信造物 → 那造物若不真则崩)：自信显化触底见真，构成破局弧线",
  "combination_story_seed": "the table struck by lightning — Magician's stable build of tools meets the Tower's lightning on a structure already unsound; the manifestation that believed it was real is revealed as either solid foundation or performance, and the collapse clarifies which, the confident build is the very thing the lightning tests",
  "synergy_logic": "Clear Quartz(清明，看清造的是真还是表演) + Smoky Quartz(崩塌中扎根重建于真) → Quartz 帮你看清，Smoky Quartz 帮你在崩后稳稳重建，协同 = '造真的、崩了也不怕'，让显化经得起雷击",
  "eastern_lens": "风(自信造)→火(崩见真)的跃迁 — 'self-efficacy 自信'经 '无常崩塌即清明'检验，东方'自信造物经崩见真'的炼金"}
PAIRS[(1,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 主动显化意志(doing) / Star=Air 风暴后被动重连意义(receiving guidance) → 同元素(风)+ archetype 互补(主动造 vs 被动接收指引)：做与受、显化与重连互补",
  "combination_story_seed": "the wand and the still pool — Magician's active 'I will build this' meets the Star kneeling pouring water in serene renewal; the manifestation that does meets the guidance that is received, and the build that began with effort is softened by the quiet faith that the way is being shown, doing and being-done-through",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Aquamarine(重连意义/清明之水) → Quartz 帮你做，Aquamarine 帮你接收指引，协同 = '既尽力又信指引'，让显化不靠蛮干",
  "eastern_lens": "风(做)风(受)的同元互补 — 'self-efficacy 主动'配 '菩提心 re-arises 被动重连'，东方'做与受、为与无为'的和合"}
PAIRS[(1,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Magician=Air 清晰显化意志(rational directing) / Moon=Water 半明不白的潜意识迷雾 → 风水相克但 archetype 拉扯(清醒显化 vs 模糊未明的潜意识)且难两全：用意志强造还是停在半明中",
  "combination_story_seed": "the clear table in the half-light — Magician's clear 'I know what I am building' meets the Moon's path where the rational mind cannot map what is surfacing; the manifestor who needs a clear plan stands in the half-light where the crayfish rises, and the pull is whether to force the build or to stay with the not-yet-clear until the image surfaces",
  "synergy_logic": "Clear Quartz(清明显化) + Moonstone(停在半明里/反射的内在光) → Quartz 帮你看清可见的，Moonstone 帮你耐受未明的，协同 = '可见处造、未明处待'，让显化不强造假清晰",
  "eastern_lens": "风(清)vs 水(晦)的拉扯 — 'self-efficacy 清醒造' vs '无意识深处未明'，东方'清与晦、造与待'的张力"}
PAIRS[(1,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Magician=Air 显化技能(manifestation) / Sun=Fire 成功明朗(success+vitality) → 风火相生同主题 archetype(造物 × 成功 共振)：显化与成功同频加成",
  "combination_story_seed": "the table in full sun — Magician's tools that manifest form meet the Sun's content child on the white horse; the build and the success amplify each other, manifestation ripens into the visible joy of something going well, the four suits become the sunflowers turning toward what was made",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Sunstone(成功喜悦/自信温暖) → Quartz 帮你造，Sunstone 帮你享其成，协同 = '造得成 + 乐在其中'，共振放大成功的显化",
  "eastern_lens": "风(造)火(成)相生共振 — 'mind shapes matter 显化'配 '明性 success'，东方'造与成'的同频放大"}
PAIRS[(1,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Magician=Air 小我显化(I direct my build) / Judgment=Fire 听召唤回应更大生命(hear the call) → 阶段跃迁 archetype(小我造物 → 造物被更大召唤重新校准)：从'我造我的'升华到'造物回应召唤'",
  "combination_story_seed": "the table hears the trumpet — Magician's 'I am building what I want' meets the angel's trumpet calling figures from their graves; the self-authored manifestation is met by a calling larger than the original intent, and the build that served the small will is reborn to serve what was always summoning it",
  "synergy_logic": "Clear Quartz(清明，看清召唤方向) + Angelite(召唤听作指引非谴责) → Quartz 帮你看清召唤，Angelite 帮你温柔接收，协同 = 让显化从小我升级为回应更大生命的召呼",
  "eastern_lens": "风(小我造)→火(应召唤)的跃迁 — 'self-efficacy 小我显化'接 '如实自省后的召呼'，东方'从我造到应天召'的升华"}
PAIRS[(1,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Magician=Air 显化开端(begin shaping) / World=Earth 完成整合(completion) → 互补元素(风/土)+ 始终配 archetype(显化之始 vs 整合之终)：造物之始与完成之终互补",
  "combination_story_seed": "the table becomes the wreath — Magician's tools laid out to begin shaping meet the World dancer inside the completed garland; the manifestation that began with 'I have what I need' reaches the integration that says 'it is whole,' the raised hand and the dancing figure are the same build seen at start and finish",
  "synergy_logic": "Clear Quartz(聚焦显化意志) + Clear Quartz(大师和合整合全程) → 同一颗 Master Harmonizer 在始帮你显化、在终帮你和合，协同 = 让一段造物始终清明、由显化到整合一气贯通",
  "eastern_lens": "风(始造)土(终整)的始终互补 — '创造神显化之始'配 '曼荼罗整合之终'，东方'造始与成终'的和合"}

# ---- a=2 The High Priestess ----
PAIRS[(2,3)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 内在静默知晓(stillness) / Empress=Earth 外在具身丰饶(embodied abundance) → 水土相生 + archetype 互补(内向隐秘 vs 外向具身)：静中之知与形中之养互补，月亮与金星",
  "combination_story_seed": "the veil and the wheat field — High Priestess behind her pomegranate veil meets the Empress reclining in grain under a crown of stars; the inward knowing that needs stillness and the outward abundance that needs a body complete each other, the moon at her feet and the wheat in her hand are the same feminine seen in dark and in light",
  "synergy_logic": "Moonstone(内在知晓/月亮节律) + Rose Quartz(心轮滋养/给予接受) → Moonstone 帮你听见内知，Rose Quartz 帮你把它养出来给出去，协同 = '听得见也养得出'，内在知晓落为具身滋养",
  "eastern_lens": "水(内知)土(外养)相生互补 — '内观 stillness'配 'Devi 大地母亲具身'，东方'阴中之阴与阴中之阳、月与地'的和合"}
PAIRS[(2,4)] = {
  "relationship_type": "tension",
  "judgment_basis": "High Priestess=Water 柔内隐(stillness/secrets) / Emperor=Fire 刚外显(structure/authority) → 水火相克 + archetype 对立(隐秘内在 vs 刚硬结构)且难两全：听直觉还是立规矩",
  "combination_story_seed": "the veil before the stone throne — High Priestess sitting still between pillars meets the Emperor on his ram-headed seat demanding structure; the inward knowing that resists words stands before the outward rule that demands form, and the pull is whether to honor the gut that won't speak or to lay the foundational rule the situation asks for",
  "synergy_logic": "Moonstone(听内在直觉) + Red Jasper(稳固立结构) → Moonstone 帮你听，Red Jasper 帮你立，协同 = '直觉立成规矩、规矩不压直觉'，化解刚柔拉扯",
  "eastern_lens": "水(柔内)vs 火(刚外)的拉扯 — '内观直觉' vs '正稳固结构'，东方'柔与刚、隐与立'的张力"}
PAIRS[(2,5)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "High Priestess=Water 内在直觉(inner knowing) / Hierophant=Earth 灵性师承(spiritual wisdom) → 水土相生同主题 archetype(内在直觉 × 灵性智慧 共振)：直觉与灵性学问同频，内在知与师承知叠加",
  "combination_story_seed": "the veil and the vestments — High Priestess keeper of the unspoken meets the Hierophant keeper of the taught; the inward knowing that comes through stillness and the lineage wisdom that comes through teaching amplify each other, the lunar intuition and the devotional study are two paths up the same sacred mountain",
  "synergy_logic": "Moonstone(内在直觉) + Amethyst(灵性虔诚深学) → Moonstone 帮你直觉到，Amethyst 帮你深学印证，协同 = '直觉 + 学问'双轨印证，共振放大灵性知晓",
  "eastern_lens": "水(内觉)土(灵学)相生共振 — '内观 stillness'配 'lineage 灵性传承'，东方'内证与教证、顿与渐'的叠加"}
PAIRS[(2,6)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 内在静默知晓(stillness) / Lovers=Air 价值对齐的选择(conscious choice) → 风水相生 + archetype 互补(静中听 vs 听后择)：先听直觉后做对齐选择互补",
  "combination_story_seed": "the veil behind the angel — High Priestess sitting in stillness meets the Lovers' angel presiding over a values-aligned choice; the gut-answer the priestess guards is exactly what the Lovers' choice needs before it can be made from alignment, the pause to listen precedes the vow",
  "synergy_logic": "Moonstone(听内在直觉) + Rhodonite(关系中对齐价值与自尊) → Moonstone 帮你听清心里要什么，Rhodonite 帮你据此对齐选择，协同 = '听准了再择、择了就对齐'",
  "eastern_lens": "水(听)风(择)相生互补 — 'interoceptive awareness 听'配 'right association 择'，东方'闻而后择'的和合"}
PAIRS[(2,7)] = {
  "relationship_type": "tension",
  "judgment_basis": "High Priestess=Water 静默不动(stillness) / Chariot=Water 聚焦前进(direction/momentum) → 同元素(水)但 archetype 对立(静 vs 动)且难两全：停下来听还是驱车前进",
  "combination_story_seed": "the veil beside the moving chariot — High Priestess motionless between pillars meets the Chariot driver steering sphinxes forward; the stillness that hears the gut-answer and the momentum that drives toward a goal pull against each other, and the question is whether the chariot knows where it is going or whether it needs the priestess's pause first",
  "synergy_logic": "Moonstone(静中听直觉) + Hematite(聚焦统驭前进) → Moonstone 帮你停下来听，Hematite 帮你听清后驱车，协同 = '听准了再驭、驭有方向'，化解动静拉扯",
  "eastern_lens": "水(静)vs 水(动)的同元对立 — '内观 stillness' vs '中道整合前进'，东方'止与观、静与动'的张力"}
PAIRS[(2,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 内在静默直觉 / Strength=Fire 以柔制刚(柔中带韧) → 水火既济 + archetype 同向(内向柔收 × 柔中克刚)：直觉之柔与力量之柔互补，柔的两面",
  "combination_story_seed": "the veil and the lion's mane — High Priestess in lunar stillness meets Strength calmly opening the lion's jaws; the inward softness that receives knowing and the outward softness that tames raw force are the same gentleness at two depths, the moon at her feet and the infinity above the woman's head are one quiet power",
  "synergy_logic": "Moonstone(柔中接收直觉) + Tiger Eye(柔中克刚的平衡勇气) → Moonstone 帮你柔着接收，Tiger Eye 帮你柔着制住 raw instinct，协同 = '柔于内、柔于外'，让直觉与力量都走柔道",
  "eastern_lens": "水(柔内)火(柔外)既济互补 — '内观之柔'配 '调伏非暴力之柔'，东方'阴柔内外'的和合"}
PAIRS[(2,9)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "High Priestess=Water 内在知晓(inner knowing) / Hermit=Earth 向内独处举灯(inner guidance) → 水土相生同主题 archetype(内在直觉 × 向内寻光 共振)：直觉与内在之光同频叠加",
  "combination_story_seed": "the veil and the lantern — High Priestess keeper of the unspoken meets the Hermit on the peak holding the six-pointed star lantern; the inward knowing she guards and the inner light he carries amplify each other, two figures of interiority, one sitting still between pillars, one standing alone on the snow, the same inward turning seen in lunar and in earthen form",
  "synergy_logic": "Moonstone(内在直觉/月亮光) + Labradorite(内在之光/隐而不显的指引) → Moonstone 帮你接收直觉，Labradorite 帮你看见内在本有的光，协同 = '直觉 + 内在光'双轨照亮内在，共振放大内向知晓",
  "eastern_lens": "水(直觉)土(内光)相生共振 — 'interoceptive awareness'配 '闭关 retreat 内在光'，东方'内观与内光、月与灯'的叠加"}
PAIRS[(2,10)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 内在静观(stillness, observe within) / Wheel=Fire 外在轮转观察时位(cycles, observe without) → 水火相克但 archetype 互补(向内观 vs 向外认循环)：内观与外观、看心与看势互补",
  "combination_story_seed": "the veil and the spinning wheel — High Priestess watching the inward tide meets the Wheel turning with sphinx above and snake below; the inner knowing she reads and the outer cycles the wheel reads complete each other, one observes what moves within, the other what turns without, and wisdom needs both mirrors",
  "synergy_logic": "Moonstone(向内听直觉) + Green Aventurine(向外认时位随转) → Moonstone 帮你观内，Aventurine 帮你观外势，协同 = '内观心、外观势'，里外两面镜子合用",
  "eastern_lens": "水(内观)火(外观)互补 — '内观 stillness'配 '无常轮回观'，东方'内与外、心与势'的和合"}
PAIRS[(2,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 直觉之知(intuitive knowing) / Justice=Air 诚实之量(rational truth-weighing) → 风水相济 + archetype 互补(直觉 vs 理性称量)：直觉与理性互补，完整决策需两面",
  "combination_story_seed": "the veil and the scales — High Priestess keeper of the gut-answer meets Justice weighing with sword and scales; the inward knowing that won't be reasoned and the outward honesty that must be weighed complete each other, one reads the moon at her feet, the other lays the evidence on the balance, and a true decision needs both",
  "synergy_logic": "Moonstone(直觉之知) + Lapis Lazuli(理性诚实称量) → Moonstone 帮你直觉到，Lapis 帮你称量核实，协同 = '直觉 + 核实'，让决策既有 gut 又有据",
  "eastern_lens": "水(觉)风(量)相济互补 — 'interoceptive awareness 直觉'配 '因果 cause-effect 称量'，东方'觉与量、顿与渐'的和合"}
PAIRS[(2,12)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "High Priestess=Water 静默反转视角的暗示(stillness→insight) / Hanged Man=Water 自愿倒悬换视角 → 同元素(水)+ 同主题 archetype(静默见隐 × 反转见新 共振)：内观之静与反转之静同频叠加",
  "combination_story_seed": "the veil and the halo — High Priestess sitting still until insight surfaces meets the Hanged Man inverted with a halo of light; the stillness that lets the unspoken rise and the inversion that lets the unseen appear amplify each other, two watery pauses, one between pillars, one upside down, both waiting for what arrives when you stop forcing the frame",
  "synergy_logic": "Moonstone(静中浮出直觉) + Selenite(反转后洗净的高维清明) → Moonstone 帮你静着接收，Selenite 帮你倒过来看清，协同 = '静着浮出 + 反转看清'，共振放大水之洞察",
  "eastern_lens": "水(静见)水(反见)的同元共振 — '内观 stillness'配 '反转惯常视角'，东方'止观与反转、静与倒'的叠加"}
PAIRS[(2,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "High Priestess=Water 静中知晓(持守内在) / Death=Water 清场转化(放掉已完成) → 同元素(水)+ 阶段跃迁 archetype(持守内在 → 该放的就放)：从'静守所知'升华到'诚实地清掉已完成的'",
  "combination_story_seed": "the veil parts for the skeleton — High Priestess keeping the unspoken meets Death clearing what has completed; the inward knowing she guards turns toward what must be released, the stillness that holds insight becomes the stillness that lets an old form die, and the moon at her face lights the doorway the skeleton rides through",
  "synergy_logic": "Moonstone(静中看清) + Obsidian(诚实放掉已死) → Moonstone 帮你看清，Obsidian 帮你诚实地放，协同 = '看清了就敢放'，让静守升级为清明地清场",
  "eastern_lens": "水(守)→水(放)的同元跃迁 — '内观持守'接 '无常清场'，东方'守与放、静与化'的升华"}
PAIRS[(2,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 极静(stillness at one pole) / Temperance=Fire 动态调和(dynamic blending between poles) → 水火相济 + archetype 互补(纯静 vs 动态平衡)：极静与动态调和互补",
  "combination_story_seed": "the veil and the two cups pouring — High Priestess utterly still meets Temperance endlessly mixing between two cups; the pure stillness that receives and the active blending that integrates are complementary, one holds the mystery unmoved, the other keeps the two opposites in living motion, and wisdom needs both the pause and the pour",
  "synergy_logic": "Moonstone(纯静接收) + Amethyst(动态调和两端) → Moonstone 帮你极静地收，Amethyst 帮你不急地调和，协同 = '静中收 + 动中调'，让内知与调和互补",
  "eastern_lens": "水(极静)火(动调)相济互补 — '内观 stillness'配 '中道动态平衡'，东方'止与观、静极与动调'的和合"}
PAIRS[(2,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "High Priestess=Water 清明直觉(看见真相) / Devil=Earth 自欺执念(被 loose chain 困而不觉) → 水土相克 + archetype 对立(清明见真 vs 自欺于执)且难两全：信直觉看清还是困在自欺链里",
  "combination_story_seed": "the veil over the loose chains — High Priestess who sees clearly meets the Devil's two figures unaware their chains are loose; the intuition that already knows the truth stands beside the attachment that refuses to see it, and the pull is whether to lift the veil the priestess holds or to stay in the comfortable bond the devil offers",
  "synergy_logic": "Moonstone(直觉看见真相) + Black Tourmaline(看清执念松链) → Moonstone 帮你直觉到真相，Black Tourmaline 帮你直面哪条链已松，协同 = '直觉见真 + 直面执念'，化解自欺",
  "eastern_lens": "水(清明)vs 土(自欺)的拉扯 — '内观清明见真' vs '对治内魔自欺执'，东方'明与蔽、觉与执'的张力"}
PAIRS[(2,16)] = {
  "relationship_type": "causal",
  "judgment_basis": "High Priestess=Water 内在已知(the known but unsaid) / Tower=Fire 那已知突然显形崩塌(sudden revelation) → 水火相克但序列因果：High Priestess 守着的内在真相，正是 Tower 用雷击强行揭开的同一个——她早知，Tower 只是把帷幕撕掉",
  "combination_story_seed": "the veil torn by lightning — High Priestess keeper of what is known but unsaid meets the Tower's lightning ripping the structure open; the truth she held behind the veil is the same truth the lightning flash reveals, and the collapse is not new information but the forcing-open of what the priestess already knew, the moonlit knowing becomes the daylight demolition",
  "synergy_logic": "Moonstone(早已接收的内在真相) + Smoky Quartz(真相崩塌时扎根) → Moonstone 帮你早听见，Smoky Quartz 帮你崩后稳住，协同 = '既已听见、崩了也站得住'，让内在已知在显形时不致击垮",
  "eastern_lens": "水(已知)→火(显崩)的因果 — '内观早知'即 '无常崩塌所揭示'的同一真相，东方'闻之于未兆、崩之于已形'的因果"}
PAIRS[(2,17)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "High Priestess=Water 内在直觉之知(inner knowing) / Star=Air 内在重连希望(reconnect to meaning) → 风水相济同主题 archetype(内在直觉 × 内在希望 共振)：两块'内向接收'的牌同频叠加",
  "combination_story_seed": "the veil and the still pool — High Priestess pouring lunar knowing meets the Star kneeling pouring water in serene renewal; the inward intuition and the inward hope amplify each other, two figures of receiving, one between dark and light pillars, one under eight points of light, the same trust that something is being shown from within",
  "synergy_logic": "Moonstone(直觉接收) + Aquamarine(希望重连清明之水) → Moonstone 帮你接收直觉，Aquamarine 帮你重连希望，协同 = '直觉 + 希望'双轨接收，共振放大内向的信任",
  "eastern_lens": "水(觉)风(望)相济共振 — 'interoceptive awareness'配 '菩提心 re-arises'，东方'内觉与内望、月与星'的叠加"}
PAIRS[(2,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "High Priestess=Water 直觉潜意识(intuition/subconscious) / Moon=Water 潜意识迷雾(subconscious/illusion) → 同元素(水)+ 同主题 archetype(内在直觉 × 潜意识深处 共振放大)：两块水之直觉牌同频叠加（HP 是清澈的直觉，Moon 是混沌的潜意识）",
  "combination_story_seed": "the veil and the howling path — High Priestess keeper of clear inner knowing meets the Moon's half-lit path between towers where dog and wolf howl; the priestess's still intuition and the Moon's churning subconscious are the same water seen clearly and seen clouded, and together they show both faces of what moves beneath the surface",
  "synergy_logic": "Moonstone(清澈直觉) + Moonstone(混沌潜意识的耐受) → 同一颗 Moonstone 既帮你看清直觉、又帮你停在混沌潜意识里不慌，协同 = '清与浊两面同源'，共振放大对潜意识的整全觉察",
  "eastern_lens": "水(清觉)水(浊潜)的同元共振 — '内观清澈'配 '无意识深处混沌'，东方'清水与浊水同源、月之两面'的叠加"}
PAIRS[(2,19)] = {
  "relationship_type": "tension",
  "judgment_basis": "High Priestess=Water 内向静默隐秘(stillness/secrets) / Sun=Fire 外向明朗显白(clarity/joy exposed) → 水火相克 + archetype 对立(隐秘内 vs 显白外)且难两全：守秘内观还是敞亮显现",
  "combination_story_seed": "the veil before the noon sun — High Priestess behind her veil meets the Sun's bare child in the open among sunflowers; the inward secrecy that needs darkness and the outward clarity that needs full light pull against each other, and the question is whether to keep the knowing behind the veil or let it stand exposed in the sun",
  "synergy_logic": "Moonstone(内向隐秘之知) + Sunstone(外向明朗之喜) → Moonstone 帮你守内，Sunstone 帮你显外，协同 = '守得住秘也敞得开怀'，化解隐显拉扯",
  "eastern_lens": "水(隐)vs 火(显)的拉扯 — '内观隐秘' vs '明性显白'，东方'隐与显、晦与明'的张力"}
PAIRS[(2,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "High Priestess=Water 静默微闻(quiet inner signal) / Judgment=Fire 听号角觉醒回应召唤(loud call answered) → 水火相克但阶段跃迁 archetype(微弱的内在信号 → 放大成必须回应的召唤)：从'隐约听见'升华到'回应召唤'",
  "combination_story_seed": "the veil before the trumpet — High Priestess's quiet inner whisper meets Judgment's trumpet calling figures from their graves; the faint signal she guards behind the veil grows into the call that cannot be ignored, and the lunar intuition ripens into the answered calling, the still small knowing becomes the risen life",
  "synergy_logic": "Moonstone(微弱内在信号的接收) + Angelite(召呼听作指引放大) → Moonstone 帮你听见微声，Angelite 帮你把它听成召呼回应，协同 = '从微闻到回应'，让内向直觉升级为行动的召唤",
  "eastern_lens": "水(微闻)→火(应召)的跃迁 — '内观微闻'接 '如实自省后的召呼'，东方'微闻与宏应、静与起'的升华"}
PAIRS[(2,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "High Priestess=Water 内在隐秘之知(veiled within) / World=Earth 显化整合之全(integrated whole) → 水土相生 + archetype 互补(内隐 vs 外全)：隐秘内知与完整外显互补，月与曼荼罗",
  "combination_story_seed": "the veil inside the wreath — High Priestess keeper of the inward mystery meets the World dancer inside the completed garland; the hidden knowing she guards and the visible wholeness the World shows complete each other, what is known in stillness behind the veil becomes the integrated dance within the wreath",
  "synergy_logic": "Moonstone(内在隐秘之知) + Clear Quartz(显化整合之全) → Moonstone 帮你守内知，Clear Quartz 帮你和合外全，协同 = '内知落为外全'，让隐秘直觉整合成完整显化",
  "eastern_lens": "水(内隐)土(外全)相生互补 — '内观隐秘'配 '曼荼罗整合外全'，东方'内与外、隐与全'的和合"}

# =========================================================================
# 批 3：a=3 The Empress / a=4 The Emperor / a=5 The Hierophant / a=6 The Lovers
# =========================================================================
# ---- a=3 The Empress × 4..21 ----
PAIRS[(3,4)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 母性滋养(nurturing/abundance) / Emperor=Fire 父性结构(structure/authority) → 土火相生 + 阴阳父母配 archetype(母 vs 父)：滋养与结构互补（框架代表对 Emperor×Empress）",
  "combination_story_seed": "the wheat field and the stone throne — Empress reclining in grain meets the Emperor on his ram-headed seat; the nurturing that grows life and the structure that holds it upright complete each other, the crown of twelve stars and the scepter are the mother and father of anything that gets built, abundance needs the scaffold or it sprawls, structure needs the warmth or it tyrannizes",
  "synergy_logic": "Rose Quartz(心轮滋养) + Red Jasper(稳固结构) → Rose Quartz 帮你养，Red Jasper 帮你立，协同 = '养有结构、立有温度'，父母和合让事物既生长又稳固",
  "eastern_lens": "土(母)火(父)相生互补 — 'Devi 大地母亲'配 '正稳固父性结构'，东方'父母、养与立'的阴阳和合"}
PAIRS[(3,5)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Empress=Earth 具身丰饶创造力(embodied creativity) / Hierophant=Earth 师承灵性学问(lineage wisdom) → 同元素(土)+ 同主题 archetype(具身创造 × 灵性传承 共振)：创造力与灵性学问叠加",
  "combination_story_seed": "the wheat field and the vestments — Empress in her lush garden meets the Hierophant in his robes blessing initiates; the embodied creativity that grows life and the lineage wisdom that passes down the sacred amplify each other, the grain and the keys are both forms of fertility, one of body one of spirit",
  "synergy_logic": "Rose Quartz(心轮创造滋养) + Amethyst(灵性传承深学) → Rose Quartz 帮你养出，Amethyst 帮你学深，协同 = '养得出 + 懂其道'，共振放大具身灵性的丰饶",
  "eastern_lens": "土(创)土(学)同元共振 — 'Devi 具身创造'配 'lineage 灵性传承'，东方'生与教、身与灵'的同频叠加"}
PAIRS[(3,6)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Empress=Earth 丰饶之爱(abundance/love) / Lovers=Air 价值对齐之爱(values-aligned union) → 风土相克但同主题 archetype(滋养之爱 × 对齐之爱 共振)：两种爱同频叠加",
  "combination_story_seed": "the wheat field under the angel — Empress's embodied abundance meets the Lovers' angel presiding over a values-aligned union; the nurturing love that gives and the conscious love that chooses amplification each other, the crown of stars and the tree of fruit are both forms of love, one that grows, one that vows",
  "synergy_logic": "Rose Quartz(无条件滋养之爱) + Rhodonite(关系中价值对齐的爱) → Rose Quartz 帮你滋养，Rhodonite 帮你对齐，协同 = '养着爱 + 对齐着爱'，共振放大整全的爱",
  "eastern_lens": "土(养爱)风(择爱)的主题共振 — 'Devi 滋养之爱'配 'right association 对齐之爱'，东方'慈爱与择爱'的同频"}
PAIRS[(3,7)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 静态滋养 reclining(被动接受给予) / Chariot=Water 动态前进 momentum(主动驱驰) → 土水相生 + archetype 互补(静养 vs 动进)：滋养静止与统驭前进互补",
  "combination_story_seed": "the reclining garden and the moving chariot — Empress at rest in wheat meets the Chariot driver steering sphinxes forward; the abundance that is received in stillness and the will that drives forward complete each other, the garden feeds the journey, the journey carries the garden's fruit onward",
  "synergy_logic": "Rose Quartz(静态滋养接受) + Hematite(动态聚焦前进) → Rose Quartz 帮你养息，Hematite 帮你驱驰，协同 = '歇得下也跑得起'，让滋养与前进交替",
  "eastern_lens": "土(静养)水(动进)相生互补 — 'Devi 静养'配 '中道整合前进'，东方'静与动、养与驰'的和合"}
PAIRS[(3,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 外向具身滋养(embodied care) / Strength=Fire 内向温柔克己(gentle inner mastery) → 土火相生 + archetype 互补(外养他 vs 内驯己)：对他滋养与对己温柔互补",
  "combination_story_seed": "the wheat field and the lion's mane — Empress nurturing outward meets Strength taming the lion within; the embodied care that tends others and the gentle power that tends the self's raw instinct complete each other, you can only nurture without smothering once you have learned to meet your own appetite with compassion",
  "synergy_logic": "Rose Quartz(对外滋养) + Tiger Eye(对内温柔制 raw instinct) → Rose Quartz 帮你养人，Tiger Eye 帮你驯己，协同 = '养人不溺、驯己不苛'，内外温柔的互补",
  "eastern_lens": "土(外养)火(内驯)相生互补 — 'Devi 外养'配 '调伏非暴力内驯'，东方'外慈与内调'的和合"}
PAIRS[(3,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 具身丰饶向外(embodied abundance) / Hermit=Earth 独处向内举灯(inward solitude) → 同元素(土)+ archetype 对立互补(外养 vs 内寻)：具身外养与向内独处互补",
  "combination_story_seed": "the wheat field and the snowy peak — Empress in her garden meets the Hermit alone on the mountain with his lantern; the outward abundance that fills the senses and the inward solitude that fills the soul complete each other, the grain needs the lantern or it is only busyness, the lantern needs the grain or it is only withdrawal",
  "synergy_logic": "Rose Quartz(向外滋养) + Labradorite(向内寻光) → Rose Quartz 帮你向外养，Labradorite 帮你向内听，协同 = '养外也养内'，让丰饶不脱离内在之光",
  "eastern_lens": "土(外养)土(内寻)同元对立互补 — 'Devi 具身外养'配 '闭关 retreat 向内寻'，东方'外与内、养与寻'的和合"}
PAIRS[(3,10)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 静态生长季(a season of growth) / Wheel=Fire 动态循环转折(cycles turning) → 土火相生 + archetype 互补(一季之养 vs 循环之转)：生长季与轮转互补",
  "combination_story_seed": "the wheat field on the turning wheel — Empress in her growing season meets the Wheel already turning its rim; the abundance that belongs to one phase meets the recognition that phases turn, and the nurturing that would cling to its season learns to ride the cycle, the grain ripens knowing harvest will come",
  "synergy_logic": "Rose Quartz(滋养一季之长) + Green Aventurine(随转而动不抗拒) → Rose Quartz 帮你养这一季，Aventurine 帮你认出季节会转，协同 = '养得透也放得下'，让丰饶接得住循环",
  "eastern_lens": "土(养季)火(转轮)相生互补 — 'Devi 一季之养'配 '无常轮回观'，东方'季与轮、养与转'的和合"}
PAIRS[(3,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 丰饶慈悲(nurturing/abundance) / Justice=Air 诚实称量(truth/fairness) → 土风相克 + archetype 互补(慈悲滋养 vs 冷峻称量)：慈悲与公正互补，过养需公正校正",
  "combination_story_seed": "the wheat field and the scales — Empress nurturing without measure meets Justice weighing with upright sword; the abundance that tends and the honesty that weighs complete each other, the nurturing that would smother needs the fairness that draws the line, the crown of stars meets the level balance",
  "synergy_logic": "Rose Quartz(慈悲滋养) + Lapis Lazuli(诚实公正称量) → Rose Quartz 帮你养，Lapis 帮你称出是否过了，协同 = '养而有度、慈而公正'，让丰饶不滑向溺爱与失衡",
  "eastern_lens": "土(慈)风(正)相克互补 — 'Devi 慈悲'配 '因果 cause-effect 公正'，东方'慈与正、养与量'的和合"}
PAIRS[(3,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 具身生长(embodied growing) / Hanged Man=Water 自愿悬停暂停(willing pause) → 土水相生 + archetype 互补(持续生长 vs 刻意暂停)：生长与暂停互补",
  "combination_story_seed": "the wheat field and the inverted halo — Empress's patient growing meets the Hanged Man's deliberate pause; the abundance that unfolds in time and the surrender that stops time complete each other, the grain needs the season of growth and the season of letting the field lie fallow, the wreath in the hair and the halo upside down",
  "synergy_logic": "Rose Quartz(持续滋养生长) + Selenite(暂停反转后清明) → Rose Quartz 帮你养，Selenite 帮你适时停，协同 = '养与休、长与停'，让丰饶有节奏地轮作",
  "eastern_lens": "土(长)水(停)相生互补 — 'Devi 生长'配 '反转视角的暂停'，东方'长与休、作与息'的和合"}
PAIRS[(3,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Empress=Earth 丰饶生长(make grow) / Death=Water 生长季终结(clear the completed form) → 土水相生 + 阶段跃迁 archetype(生长 → 该季结束让位)：从'让长大'升华到'让该结束的结束'",
  "combination_story_seed": "the wheat field after the pale horse — Empress's growing season meets Death riding through the harvest; the abundance that makes things grow meets the transformation that clears the form that has borne its fruit, and the nurturing learns to let the field rest after yield, the crown of stars bows to the rising sun between two towers",
  "synergy_logic": "Rose Quartz(温柔滋养生长) + Obsidian(诚实放掉已结实的旧季) → Rose Quartz 帮你养，Obsidian 帮你清季，协同 = '养得熟也放得下'，让丰饶升级为'有生有收'的转化",
  "eastern_lens": "土(养)→水(收)的跃迁 — 'Devi 养长'接 '无常清场收成'，东方'生与收、养与化'的升华"}
PAIRS[(3,14)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Empress=Earth 丰饶调和之养(embodied harmony) / Temperance=Fire 调和中道(blending/middle way) → 土火相生同主题 archetype(滋养调和 × 中道调和 共振)：两种调和叠加",
  "combination_story_seed": "the wheat field and the two cups — Empress in her harmonious garden meets Temperance pouring endlessly between two cups; the embodied harmony of the garden and the active blending of the cups amplify each other, two forms of integration, one grown, one poured, the wreath of stars and the path to the crown of light",
  "synergy_logic": "Rose Quartz(滋养调和) + Amethyst(不急的中道调和) → Rose Quartz 帮你养出和谐，Amethyst 帮你慢调两端，协同 = '养与调'双轨和合，共振放大整全的平衡",
  "eastern_lens": "土(养和)火(调和)相生共振 — 'Devi 滋养和谐'配 '中道动态平衡'，东方'养和与调和'的同频"}
PAIRS[(3,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Empress=Earth 真滋养(unconditional care) / Devil=Earth 以爱为名的执念依附(attachment masquerading as love) → 同元素(土)+ archetype 对立(真养 vs 自缚的溺)且难两全：是真滋养还是 smothering attach",
  "combination_story_seed": "the wheat field before the loose chains — Empress's nurturing care meets the Devil's two figures chained in attachment; the same earth that grows life can become the smothering that keeps others small, and the pull is whether the crown of stars is genuine abundance or the chain disguised as a wreath, devotion or compulsion",
  "synergy_logic": "Rose Quartz(清明分辨真养 vs 溺) + Black Tourmaline(看清以爱为名的执念松链) → Rose Quartz 帮你辨真养，Black Tourmaline 帮你看清哪份'爱'其实是链，协同 = '养而不缚、爱而不执'，化解土之两面的拉扯",
  "eastern_lens": "土(真养)vs 土(溺执)的同元对立 — 'Devi 真滋养' vs '对治内魔 smothering attach'，东方'养与溺、慈与缚'的张力"}
PAIRS[(3,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Empress=Earth 丰饶生长(grow) / Tower=Fire 结构崩塌(collapse of structure) → 土火相克 + 阶段跃迁 archetype(生长 → 养大后被雷击见真)：丰饶之养触底见真，构成破局弧线",
  "combination_story_seed": "the wheat field struck by lightning — Empress's lush garden meets the Tower's lightning on a structure already unsound; the abundance that grew lush can hide rot underneath, and the collapse reveals which part of the garden was real growth and which was overgrowth propping up something false, the crown of stars meets the crown knocked from the tower",
  "synergy_logic": "Rose Quartz(清明滋养真长) + Smoky Quartz(崩塌中扎根分清真假) → Rose Quartz 帮你养真的，Smoky Quartz 帮你崩后分清，协同 = '养真的、崩了也不毁'，让丰饶经得起雷击",
  "eastern_lens": "土(养)→火(崩)的跃迁 — 'Devi 丰养'经 '无常崩塌即清明'检验，东方'丰养经崩见真'的炼金"}
PAIRS[(3,17)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Empress=Earth 具身丰饶滋养(embodied renewal) / Star=Air 风暴后希望 renewal(renewal after storm) → 土风相克但同主题 archetype(滋养更新 × 希望更新 共振)：两种更新叠加",
  "combination_story_seed": "the wheat field and the still pool — Empress's embodied renewal meets the Star kneeling pouring water in serene hope; the abundance that renews the body and the hope that renews the spirit amplify each other, the garden and the pool are both forms of replenishing, one in grain one in water, the crown of stars meets the eight-pointed star",
  "synergy_logic": "Rose Quartz(具身滋养更新) + Aquamarine(希望重连清明之水) → Rose Quartz 帮你养身，Aquamarine 帮你养心，协同 = '身与心双更新'，共振放大整全的 renewal",
  "eastern_lens": "土(养)风(望)的主题共振 — 'Devi 具身更新'配 '菩提心 re-arises'，东方'养与望、身与心'的同频"}
PAIRS[(3,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Empress=Earth 清明具身滋养(embodied clarity) / Moon=Water 半明不白的潜意识迷雾 → 土水相生但 archetype 拉扯(清明具身 vs 模糊未明潜意识)且难两全：具身清明滋养还是停在迷雾",
  "combination_story_seed": "the wheat field in the half-light — Empress's embodied abundance meets the Moon's path under uncertain light; the nurturing that needs a body and clear ground stands in the half-light where the crayfish rises, and the pull is whether to tend the visible garden or to stay with the murky not-yet-formed rising from the pool",
  "synergy_logic": "Rose Quartz(清明具身滋养) + Moonstone(耐受半明的潜意识) → Rose Quartz 帮你养可见的，Moonstone 帮你待住未明的，协同 = '可见处养、未明处待'，化解具身与迷雾的拉扯",
  "eastern_lens": "土(明养)vs 水(晦潜)的拉扯 — 'Devi 具身清明' vs '无意识深处迷雾'，东方'明与晦、养与待'的张力"}
PAIRS[(3,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Empress=Earth 丰饶喜悦之养(abundance/joy of being alive) / Sun=Fire 喜悦明朗之活力(joy/vitality) → 土火相生同主题 archetype(丰饶之喜 × 喜悦之活 共振)：两种生的喜悦叠加",
  "combination_story_seed": "the wheat field under the noon sun — Empress's abundant garden meets the Sun's content child on the white horse; the joy of embodied abundance and the joy of simple vitality amplify each other, the wheat and the sunflowers both turn toward the light, the crown of twelve stars meets the bright sun overhead",
  "synergy_logic": "Rose Quartz(丰饶之喜滋养) + Sunstone(喜悦明朗活力) → Rose Quartz 帮你享丰饶之喜，Sunstone 帮你享单纯之活，协同 = '双重的生之喜'，共振放大整全的喜悦",
  "eastern_lens": "土(丰喜)火(活喜)相生共振 — 'Devi 丰饶之喜'配 '明性 simple vitality'，东方'丰与活、养与喜'的同频"}
PAIRS[(3,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Empress=Earth 具身滋养小我之养(embodied care) / Judgment=Fire 听召回应更大生命(larger calling) → 土火相生 + 阶段跃迁 archetype(小我之养 → 养升华为回应召呼)：从'养好自己'升华到'回应更大召呼'",
  "combination_story_seed": "the wheat field hears the trumpet — Empress's embodied care meets Judgment's trumpet calling figures from graves; the nurturing that tended the self and its small garden is met by a calling larger than personal abundance, and the crown of stars bows toward the angel's call, the embodied life rises to answer something beyond itself",
  "synergy_logic": "Rose Quartz(清明滋养) + Angelite(召呼听作指引) → Rose Quartz 帮你养好自己，Angelite 帮你听清更大召呼，协同 = '养好了应召'，让滋养升级为回应召呼的力量",
  "eastern_lens": "土(养己)→火(应召)的跃迁 — 'Devi 小我之养'接 '如实自省后的召呼'，东方'养己与应召、私与公'的升华"}
PAIRS[(3,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Empress=Earth 丰饶生长季(a growing season) / World=Earth 整合完成之全(integrated completion) → 同元素(土)+ archetype 互补(生长之中段 vs 完成之终段)：丰饶生长与整合完成互补，同为土之过程",
  "combination_story_seed": "the wheat field inside the wreath — Empress's growing garden meets the World dancer inside the completed garland; the abundance that is mid-growth and the wholeness that is fully integrated complete each other, the wheat ripens into the green wreath, the crown of twelve stars becomes the four fixed signs at the corners, the season finds its closure",
  "synergy_logic": "Rose Quartz(丰饶生长) + Clear Quartz(整合完成和合) → Rose Quartz 帮你养中段，Clear Quartz 帮你整合终段，协同 = '养得成也合得拢'，让土之过程从生长走到完成",
  "eastern_lens": "土(养)土(成)同元互补 — 'Devi 生长中段'配 '曼荼罗整合完成'，东方'养与成、中与终'的和合"}

# ---- a=4 The Emperor × 5..21 ----
PAIRS[(4,5)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Emperor=Fire 结构权威(structure/authority) / Hierophant=Earth 师承传统秩序(lineage/tradition) → 火土相生同主题 archetype(世俗结构 × 传统秩序 共振)：结构与传承叠加（框架代表对）",
  "combination_story_seed": "the stone throne and the vestments — Emperor on his ram-headed seat meets the Hierophant blessing initiates in robes; the secular structure that builds the kingdom and the sacred tradition that blesses it amplify each other, the scepter and the keys are two forms of order, one of law one of lineage, the throne gets its consecration",
  "synergy_logic": "Red Jasper(稳固结构) + Amethyst(恭敬传承秩序) → Red Jasper 帮你立世俗结构，Amethyst 帮你接灵性传承，协同 = '立得住 + 传得下'，共振放大整全的秩序",
  "eastern_lens": "火(立)土(传)相生共振 — '正稳固结构'配 'lineage 灵性传承'，东方'立与传、法与道'的同频"}
PAIRS[(4,6)] = {
  "relationship_type": "tension",
  "judgment_basis": "Emperor=Fire 结构权威管理(manage/control) / Lovers=Air 自由价值对齐选择(free values-aligned choice) → 风火相克 + archetype 对立(管控 vs 自由选择)且难两全：立结构管还是放由心择",
  "combination_story_seed": "the stone throne and the angel — Emperor's structure demanding rules meets the Lovers' angel presiding over a free values-aligned choice; the authority that would manage and the union that must be chosen from alignment pull against each other, and the question is whether the scepter protects the choice or whether the structure is exactly what kills the alignment",
  "synergy_logic": "Red Jasper(立保护性结构) + Rhodonite(关系中守自由与自尊) → Red Jasper 帮你立不压人的界，Rhodonite 帮你守选择自由，协同 = '有界也有择、立而不缚'，化解管控与自由的拉扯",
  "eastern_lens": "火(管)vs 风(择)的拉扯 — '正稳固管控' vs 'right association 自由择'，东方'管与择、立与放'的张力"}
PAIRS[(4,7)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Emperor=Fire 结构意志权威(structure/will) / Chariot=Water 聚焦意志前进(will/direction) → 火水相克但同主题 archetype(意志立结构 × 意志驱前进 共振)：两种意志叠加",
  "combination_story_seed": "the stone throne and the moving chariot — Emperor's structured will meets the Chariot's driving will; the authority that holds the foundation and the direction that drives forward amplify each other, the scepter and the reins are two forms of will, one that builds the seat one that drives the team, the throne sends the chariot out",
  "synergy_logic": "Red Jasper(稳固意志立基) + Hematite(聚焦意志驱进) → Red Jasper 帮你立基，Hematite 帮你驱进，协同 = '立得稳也跑得快'，共振放大整全意志力",
  "eastern_lens": "火(立志)水(驱志)的主题共振 — '正稳固意志'配 '中道整合驱进'，东方'立志与驱志、守与攻'的同频"}
PAIRS[(4,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 刚硬结构权威(hard structure) / Strength=Fire 柔韧温柔之力(gentle power) → 同元素(火)+ archetype 互补(刚硬 vs 柔韧)：刚硬结构需温柔之力补，刚柔并济",
  "combination_story_seed": "the stone throne and the lion's mane — Emperor's rigid scepter meets Strength calmly opening the lion's jaws; the hard structure that builds the kingdom and the gentle power that tames raw force complete each other, the authority that would harden into tyranny is softened by the compassion that rules without force, the ram and the lion",
  "synergy_logic": "Red Jasper(刚硬稳固) + Tiger Eye(柔韧平衡勇气) → Red Jasper 帮你立刚，Tiger Eye 帮你以柔驭，协同 = '刚有柔配、硬而不僵'，让结构不滑向暴政",
  "eastern_lens": "火(刚)火(柔)同元互补 — '正稳固刚硬'配 '调伏非暴力柔韧'，东方'刚与柔、硬与韧'的和合"}
PAIRS[(4,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 外向立世结构(outward structure) / Hermit=Earth 内向独处寻光(inward solitude) → 火土相生 + archetype 互补(外立 vs 内寻)：立世与独处、向外立规与向内听互补",
  "combination_story_seed": "the stone throne and the snowy peak — Emperor building outward structure meets the Hermit alone on the peak with his lantern; the authority that builds the kingdom and the solitude that seeks inner truth complete each other, the throne needs the lantern or it rules without wisdom, the lantern needs the throne or it never returns to serve",
  "synergy_logic": "Red Jasper(向外立结构) + Labradorite(向内寻光) → Red Jasper 帮你向外立，Labradorite 帮你向内听，协同 = '立得正也听得清'，让结构有内在智慧支撑",
  "eastern_lens": "火(外立)土(内寻)相生互补 — '正稳固外立'配 '闭关 retreat 内寻'，东方'外与内、立与寻'的和合"}
PAIRS[(4,10)] = {
  "relationship_type": "tension",
  "judgment_basis": "Emperor=Fire 主动立结构掌控(I structure/control) / Wheel=Fire 非自主循环转折(turning beyond control) → 同元素(火)+ archetype 对立(主动立 vs 超出掌控的轮转)且难两全：我立的住还是命运在转",
  "combination_story_seed": "the stone throne on the turning wheel — Emperor's structured control meets the Wheel turning beyond any scepter; the authority that builds stable foundations stands before the cycle that turns whether he rules or not, and the pull is how much of this throne is his to build and how much is the wheel that will carry it away",
  "synergy_logic": "Red Jasper(稳固你立的) + Green Aventurine(认出哪些不在你控、随转) → Red Jasper 帮你用力立，Aventurine 帮你认时位，协同 = '立得住也放得下'，化解自主与轮转的拉扯",
  "eastern_lens": "火(立)vs 火(转)的同元对立 — '正稳固主动立' vs '无常轮回非我控'，东方'自立与缘转'的张力"}
PAIRS[(4,11)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Emperor=Fire 结构权威秩序(structure/law) / Justice=Air 诚实公正称量(truth/law) → 风火相克同主题 archetype(结构秩序 × 公正称量 共振)：两种秩序叠加，世俗结构需公正校正",
  "combination_story_seed": "the stone throne and the scales — Emperor's structured authority meets Justice weighing with sword and scales; the order that builds the kingdom and the fairness that weighs it amplify each other, the scepter and the sword are two forms of law, one that lays the rule one that tests its honesty, the throne is weighed for whether it serves or dominates",
  "synergy_logic": "Red Jasper(立结构秩序) + Lapis Lazuli(公正诚实称量) → Red Jasper 帮你立，Lapis 帮你称量是否公正，协同 = '立得正也称得公'，共振放大正义的秩序",
  "eastern_lens": "火(立序)风(公正)的主题共振 — '正稳固结构'配 '因果 cause-effect 公正'，东方'立序与公正、法与衡'的同频"}
PAIRS[(4,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 刚硬主动立结构(active rigid structure) / Hanged Man=Water 柔和自愿暂停反转(passive willing pause) → 火水相克 + archetype 互补(主动刚立 vs 被动柔悬)：立与悬、刚与柔互补",
  "combination_story_seed": "the stone throne and the inverted halo — Emperor's rigid structure meets the Hanged Man hanging serene by one ankle; the active authority that lays foundations and the passive surrender that reverses the frame complete each other, the scepter pauses upside down, and the throne is seen from a new angle that may reveal where the structure has hardened past its use",
  "synergy_logic": "Red Jasper(主动刚立) + Selenite(被动柔悬反转后清明) → Red Jasper 帮你立，Selenite 帮你倒过来看清，协同 = '立得稳也换得了角度'，让结构不僵死",
  "eastern_lens": "火(刚立)水(柔悬)相克互补 — '正稳固刚立'配 '反转惯常视角'，东方'立与悬、刚与柔'的和合"}
PAIRS[(4,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Emperor=Fire 立结构守成(build & hold structure) / Death=Water 结构终结清场(clear the completed structure) → 火水相克 + 阶段跃迁 archetype(立结构 → 该结构终结让位)：从'立与守'升华到'让该倒的结构倒'",
  "combination_story_seed": "the stone throne before the pale horse — Emperor's structure built to last meets Death clearing what has completed; the authority that holds foundations is met by the transformation that ends the form whose time is done, and the scepter learns that some thrones are meant to fall so the next can be built, the ram-headed seat bows to the rising sun",
  "synergy_logic": "Red Jasper(稳固立守) + Obsidian(诚实放掉该倒的结构) → Red Jasper 帮你立，Obsidian 帮你敢放，协同 = '立得住也倒得下该倒的'，让结构升级为'有立有废'的转化",
  "eastern_lens": "火(立守)→水(倒废)的跃迁 — '正稳固立守'接 '无常清场'，东方'立与废、守与化'的升华"}
PAIRS[(4,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 刚硬极结构(rigid at one pole) / Temperance=Fire 动态调和(dynamic blending) → 同元素(火)+ archetype 互补(极刚 vs 动态平衡)：刚硬极结构与动态调和互补",
  "combination_story_seed": "the stone throne and the two cups — Emperor's rigid structure meets Temperance pouring endlessly between two cups; the hard authority that holds one form and the active blending that holds opposites in motion complete each other, the scepter and the cups, the throne needs the middle way or it hardens into tyranny, the cups need the throne or they never take shape",
  "synergy_logic": "Red Jasper(刚硬稳固) + Amethyst(动态调和两端) → Red Jasper 帮你立刚，Amethyst 帮你调和，协同 = '刚有调、极有中'，让结构不僵死",
  "eastern_lens": "火(刚极)火(动调)同元互补 — '正稳固刚极'配 '中道动态平衡'，东方'刚与调、极与中'的和合"}
PAIRS[(4,15)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Emperor=Fire 正向结构权威(healthy structure) / Devil=Earth 结构的暗面(domination/abuse of control) → 火土相生 + 阶段跃迁 archetype(健康结构 → 结构滑向控制欲的暗面)：从'立保护性结构'跌入'为控而控'的暗面（用 shadow aspect 口径）",
  "combination_story_seed": "the stone throne behind the loose chains — Emperor's healthy structure meets the Devil's bondage; the same authority that builds protecting foundations can slide into the domination that controls for its own sake, and the scepter becomes the chain, the throne and the dark pillar are the same will to order seen in service and in shadow, an invitation to ask which the structure serves",
  "synergy_logic": "Red Jasper(清明分辨立守 vs 滥控) + Black Tourmaline(看清控制欲的松链) → Red Jasper 帮你立正，Black Tourmaline 帮你看清哪份'立'已变成缚，协同 = '立而不控、守而不缚'，让结构守住健康不滑暗面",
  "eastern_lens": "火(正立)→土(暗控)的暗面跃迁 — '正稳固结构'阴影面即 '对治内魔 domination'，东方'正立与暗控、守与缚'的 shadow 转化"}
PAIRS[(4,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Emperor=Fire 立结构守成(build to last) / Tower=Fire 结构崩塌(collapse of unstable structure) → 同元素(火)+ 阶段跃迁 archetype(立结构 → 那结构若不稳则崩)：立结构与结构崩塌构成破局弧线",
  "combination_story_seed": "the stone throne struck by lightning — Emperor's structure built to last meets the Tower's lightning on a foundation already unsound; the same fire that builds the throne tests whether it stands, and the collapse reveals which structures were built on truth and which on control, the ram-headed seat meets the crown knocked from the tower top",
  "synergy_logic": "Red Jasper(清明立真结构) + Smoky Quartz(崩塌中扎根重建于真) → Red Jasper 帮你立真的，Smoky Quartz 帮你崩后稳住重建，协同 = '立得真、崩了也立得起来'，让结构经得起雷击见真",
  "eastern_lens": "火(立)→火(崩)的同元跃迁 — '正稳固立'经 '无常崩塌即清明'检验，东方'立与崩、守与破'的炼金"}
PAIRS[(4,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 刚硬结构(structure) / Star=Air 风暴后柔信希望(serene hope) → 风火相克 + archetype 互补(刚立 vs 柔信)：刚硬结构与柔信希望互补",
  "combination_story_seed": "the stone throne and the still pool — Emperor's rigid structure meets the Star kneeling in serene hope; the authority that builds the kingdom and the renewal that follows its collapse complete each other, the scepter is steadied by the still pool, the throne learns that after every structure falls there is the water poured patiently back onto the land",
  "synergy_logic": "Red Jasper(刚硬稳固) + Aquamarine(柔信希望清明之水) → Red Jasper 帮你立刚，Aquamarine 帮你守柔信，协同 = '刚立 + 柔信'，让结构不脱离希望",
  "eastern_lens": "火(刚立)风(柔信)相克互补 — '正稳固刚立'配 '菩提心 re-arises 柔信'，东方'刚与柔、立与信'的和合"}
PAIRS[(4,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Emperor=Fire 清醒立结构(rational structure) / Moon=Water 半明不白潜意识迷雾 → 火水相克 + archetype 拉扯(清醒立规 vs 模糊未明)且难两全：立清楚结构还是停在迷雾",
  "combination_story_seed": "the stone throne in the half-light — Emperor's clear structure meets the Moon's path under uncertain light; the authority that needs a clear foundation stands where the rational mind cannot map what is surfacing, and the pull is whether to lay the rule on what is visible or to wait while the crayfish rises from the murky pool",
  "synergy_logic": "Red Jasper(清醒立可见结构) + Moonstone(耐受未明迷雾) → Red Jasper 帮你立可见的，Moonstone 帮你待住未明，协同 = '可见处立、未明处待'，化解立规与迷雾的拉扯",
  "eastern_lens": "火(清立)vs 水(晦潜)的拉扯 — '正稳固清醒立' vs '无意识深处迷雾'，东方'清与晦、立与待'的张力"}
PAIRS[(4,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Emperor=Fire 结构权威成功(structure/success) / Sun=Fire 喜悦明朗成功(joy/success) → 同元素(火)+ 同主题 archetype(结构之成 × 喜悦之成 共振)：两种成功叠加",
  "combination_story_seed": "the stone throne under the noon sun — Emperor's structured success meets the Sun's radiant success; the authority that builds the kingdom and the vitality that enjoys it amplify each other, the scepter and the sunflowers both stand upright, the throne and the white horse, two forms of a season going well, one built one simply lived",
  "synergy_logic": "Red Jasper(结构之成) + Sunstone(喜悦之成活力) → Red Jasper 帮你建成，Sunstone 帮你享成，协同 = '建得成也乐得成'，共振放大整全的成功",
  "eastern_lens": "火(建成)火(乐成)同元共振 — '正稳固结构之成'配 '明性 success'，东方'建成与乐成'的同频"}
PAIRS[(4,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Emperor=Fire 世俗结构权威(earthly authority) / Judgment=Fire 听召回应更大生命(higher calling) → 同元素(火)+ 阶段跃迁 archetype(世俗权威 → 听见更高召呼重新校准)：从'立世俗结构'升华到'回应更高召呼'",
  "combination_story_seed": "the stone throne hears the trumpet — Emperor's earthly authority meets Judgment's trumpet calling figures from graves; the scepter that ruled the kingdom is met by a calling higher than any throne, and the structure that served the small realm is reborn to answer something larger, the ram-headed seat bows toward the angel's call",
  "synergy_logic": "Red Jasper(清明立世俗结构) + Angelite(更高召呼听作指引) → Red Jasper 帮你立世，Angelite 帮你听更高召呼，协同 = '立世俗 + 应更高'，让结构升级为回应召呼的权威",
  "eastern_lens": "火(世立)→火(应召)的同元跃迁 — '正稳固世俗立'接 '如实自省后的更高召呼'，东方'世立与应召、俗与真'的升华"}
PAIRS[(4,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Emperor=Fire 立结构之始段(begin building) / World=Earth 整合完成之终段(integrated completion) → 火土相生 + 始终配 archetype(立结构之始 vs 完成之终)：立与成互补",
  "combination_story_seed": "the stone throne inside the wreath — Emperor's foundation-laying meets the World dancer inside the completed garland; the structure that began the build and the integration that completes it are the same cycle, the scepter becomes the wreath, the ram-headed seat was always destined to be the throne inside the green garland, the four fixed signs watch the cycle close",
  "synergy_logic": "Red Jasper(立结构之始) + Clear Quartz(整合完成和合) → Red Jasper 帮你立始，Clear Quartz 帮你合终，协同 = '立得始也合得终'，让结构从立走到完成",
  "eastern_lens": "火(立始)土(成终)相生始终互补 — '正稳固立始'配 '曼荼罗整合成终'，东方'立始与成终'的和合"}

# ---- a=5 The Hierophant × 6..21 ----
PAIRS[(5,6)] = {
  "relationship_type": "tension",
  "judgment_basis": "Hierophant=Earth 师承传统婚配(conventional union) / Lovers=Air 自由价值对齐选择(free values-aligned union) → 风土相克 + archetype 对立(按传统 vs 凭心择)且难两全：按规矩婚配还是自由择偶",
  "combination_story_seed": "the vestments and the angel — Hierophant blessing initiates by rule meets the Lovers' angel presiding over a free values-aligned choice; the conventional union that follows form and the conscious union that follows alignment pull against each other, and the question is whether the relationship follows the inherited template or whether two people choose each other from what they actually stand for",
  "synergy_logic": "Amethyst(恭敬传统但辨其适用) + Rhodonite(关系中守自由价值) → Amethyst 帮你看清传统哪些还适用，Rhodonite 帮你守自由对齐，协同 = '该循的循、该择的择'，化解传统与自由的拉扯",
  "eastern_lens": "土(循)vs 风(择)的拉扯 — 'lineage 传统婚配' vs 'right association 自由择'，东方'循与择、礼与心'的张力"}
PAIRS[(5,7)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hierophant=Earth 师承秩序(lineage order) / Chariot=Water 聚焦前进(direction) → 土水相生同主题 archetype(传承秩序 × 聚焦前进 共振)：师承指引方向与统驭前进叠加",
  "combination_story_seed": "the vestments and the moving chariot — Hierophant's lineage teaching meets the Chariot's focused drive; the wisdom that points the way from tradition and the will that drives toward it amplify each other, the keys bless the reins, the teacher sends the victor out with a map drawn from those who came before",
  "synergy_logic": "Amethyst(师承指引方向) + Hematite(聚焦统驭前进) → Amethyst 帮你看清路，Hematite 帮你驱车走，协同 = '有指引也有方向'，共振放大有传承的前进",
  "eastern_lens": "土(指)水(驱)相生共振 — 'lineage 指引'配 '中道整合驱进'，东方'指与驱、传与行'的同频"}
PAIRS[(5,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 外向师道传承(outer teaching) / Strength=Fire 内向温柔克己(inner gentle mastery) → 土火相生 + archetype 互补(外教 vs 内驯)：外授与内驯、师道与自我调伏互补",
  "combination_story_seed": "the vestments and the lion's mane — Hierophant teaching outward meets Strength taming the lion within; the lineage that hands down the form and the gentle power that masters the self's raw instinct complete each other, the keys need the open jaws, the teaching only lands once the inner beast is met with compassion",
  "synergy_logic": "Amethyst(恭敬外学) + Tiger Eye(温柔内驯 raw instinct) → Amethyst 帮你外学，Tiger Eye 帮你内驯，协同 = '外学 + 内驯'，让传承落地于自我调伏",
  "eastern_lens": "土(外教)火(内驯)相生互补 — 'lineage 外教'配 '调伏非暴力内驯'，东方'外教与内驯、传与调'的和合"}
PAIRS[(5,9)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hierophant=Earth 师承灵性学问(lineage spiritual wisdom) / Hermit=Earth 独处内在寻光(solitary inner seeking) → 同元素(土)+ 同主题 archetype(师承学问 × 独处寻光 共振)：两种灵性求知叠加，师承与独修互参",
  "combination_story_seed": "the vestments and the lantern — Hierophant in his lineage meets the Hermit alone on the peak; the wisdom handed down through teaching and the wisdom found in solitude amplify each other, two paths of knowing, one received one sought, the keys and the lantern both light the way, the teacher and the recluse are the same sage at two hours",
  "synergy_logic": "Amethyst(师承深学) + Labradorite(独处寻内在光) → Amethyst 帮你接传承，Labradorite 帮你独修印证，协同 = '师承 + 独修'双轨求知，共振放大灵性智慧",
  "eastern_lens": "土(师承)土(独修)同元共振 — 'lineage 师承'配 '闭关 retreat 独修'，东方'教证与内证、传与证'的叠加"}
PAIRS[(5,10)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 传承秩序之恒(lineage continuity) / Wheel=Fire 循环转折之变(cycles of change) → 土火相生 + archetype 互补(恒 vs 变)：传承的恒与轮转的变互补",
  "combination_story_seed": "the vestments and the turning wheel — Hierophant's lineage continuity meets the Wheel's cycles of change; the tradition that hands down what endures and the wheel that turns every phase complete each other, the keys bless what lasts through the turning, the form adapts as the rim spins, wisdom knows both what to keep and what to release as the cycle moves",
  "synergy_logic": "Amethyst(认传承中恒常的) + Green Aventurine(随轮转变动) → Amethyst 帮你守恒，Aventurine 帮你随变，协同 = '守得住恒也随得转'，让传承不脱离循环",
  "eastern_lens": "土(恒)火(变)相生互补 — 'lineage 恒常'配 '无常轮回变'，东方'恒与变、传与转'的和合"}
PAIRS[(5,11)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hierophant=Earth 师承法则(lineage law) / Justice=Air 诚实公正法则(truth/law) → 土风相克同主题 archetype(师承法 × 公正法 共振)：两种法则叠加，传承需公正核实",
  "combination_story_seed": "the vestments and the scales — Hierophant's lineage law meets Justice weighing with sword and scales; the rule handed down through teaching and the honesty that weighs it amplify each other, the keys and the sword are two forms of law, one received one tested, and the tradition is weighed for whether it still serves truth or has become empty form",
  "synergy_logic": "Amethyst(恭敬师承法) + Lapis Lazuli(公正诚实称量核实) → Amethyst 帮你接传承，Lapis 帮你核实是否还公正，协同 = '该接的接、该改的改'，共振放大正义的法则",
  "eastern_lens": "土(师法)风(公正)的主题共振 — 'lineage 师承法'配 '因果 cause-effect 公正'，东方'师法与公正、传与衡'的同频"}
PAIRS[(5,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 师道正统视角(orthodox received view) / Hanged Man=Water 反转异端视角(inverted new view) → 土水相克 + archetype 对立互补(正统 vs 反转)：正统师承与反转视角互补",
  "combination_story_seed": "the vestments and the inverted halo — Hierophant's orthodox teaching meets the Hanged Man hanging upside down; the lineage that hands down the right-side-up view and the surrender that reverses the frame complete each other, the keys and the halo, the received form seen from below reveals what the orthodox angle hides, tradition needs its inversion to stay alive",
  "synergy_logic": "Amethyst(恭敬正统) + Selenite(反转后异端清明) → Amethyst 帮你接正统，Selenite 帮你倒过来看清，协同 = '正看 + 倒看'双视角，让传承不僵化",
  "eastern_lens": "土(正统)水(反转)相克互补 — 'lineage 正统'配 '反转惯常视角'，东方'正与倒、正统与异端'的和合"}
PAIRS[(5,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hierophant=Earth 传承守旧(conformity to lineage) / Death=Water 终结破旧(transformation/end old form) → 土水相克 + 阶段跃迁 archetype(守旧 → 让旧形式终结)：从'循传统'升华到'让该终的传统终'",
  "combination_story_seed": "the vestments before the pale horse — Hierophant's inherited form meets Death clearing what has completed; the tradition that hands down the old way is met by the transformation that ends the form whose time is done, and the keys learn that some teachings must die to be reborn in living form, the robes meet the rising sun between two towers",
  "synergy_logic": "Amethyst(清明辨哪些传承还活) + Obsidian(诚实放掉已死的旧形式) → Amethyst 帮你辨活的传承，Obsidian 帮你放掉死的，协同 = '守活的、放死的'，让传承升级为'有传有化'的活传统",
  "eastern_lens": "土(守旧)→水(破旧)的跃迁 — 'lineage 守旧'接 '无常清场破旧'，东方'守与破、传与化'的升华"}
PAIRS[(5,14)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hierophant=Earth 师承中道(lineage middle teaching) / Temperance=Fire 调和中道(blending middle way) → 土火相生同主题 archetype(师承之道 × 调和之道 共振)：两种中道叠加",
  "combination_story_seed": "the vestments and the two cups — Hierophant's lineage teaching of the middle meets Temperance pouring endlessly between two cups; the wisdom handed down and the active blending amplify each other, two forms of the middle way, one taught one practiced, the keys and the cups both hold the balance between extremes",
  "synergy_logic": "Amethyst(师承中道) + Amethyst(调和中道) → 同一颗 Amethyst 既帮你学传承的中道、又帮你实践调和的中道，协同 = '学与行'双轨中道，共振放大平衡的智慧",
  "eastern_lens": "土(师道)火(调道)相生共振 — 'lineage 师道'配 '中道动态平衡'，东方'师道与调道、教中与行中'的同频"}
PAIRS[(5,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Hierophant=Earth 正向师承诚信(lineage devotion) / Devil=Earth 师承的暗面盲信教条(dogma clung past use) → 同元素(土)+ archetype 对立(虔诚 vs 盲信教条)且难两全：是虔诚学问还是 dogma",
  "combination_story_seed": "the vestments behind the loose chains — Hierophant's lineage devotion meets the Devil's bondage; the same reverence for the sacred can slide into the dogma that clings to a rule past its use, and the keys become the chain, the robes and the dark pillar are the same devotion seen in living faith and in dead letter, an invitation to ask which the teaching serves",
  "synergy_logic": "Amethyst(清明分辨虔诚 vs 教条) + Black Tourmaline(看清盲信的松链) → Amethyst 帮你辨虔诚，Black Tourmaline 帮你看清哪份'信'已变成 dogma 链，协同 = '虔诚而不盲信、敬而不缚'，化解土之两面的拉扯",
  "eastern_lens": "土(虔诚)vs 土(教条)的同元对立 — 'lineage 虔诚' vs '对治内魔 dogma'，东方'虔诚与盲信、敬与缚'的张力"}
PAIRS[(5,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hierophant=Earth 传承结构稳固(lineage structure stable) / Tower=Fire 结构崩塌见真(structural collapse reveals truth) → 土火相生 + 阶段跃迁 archetype(传承结构 → 那结构若空则崩)：稳固传承触底见真，破局弧线",
  "combination_story_seed": "the vestments struck by lightning — Hierophant's lineage structure meets the Tower's lightning on a foundation already unsound; the tradition that looked stable is tested for whether it carries living wisdom or only empty form, and the collapse reveals which teachings were built on truth and which were robes with nothing underneath, the keys meet the crown knocked from the tower",
  "synergy_logic": "Amethyst(清明辨传承真伪) + Smoky Quartz(崩塌中扎根守真传统) → Amethyst 帮你辨真，Smoky Quartz 帮你崩后守住活的，协同 = '辨得清真、守得住活'，让传承经得起雷击",
  "eastern_lens": "土(稳传)→火(崩真)的跃迁 — 'lineage 稳传'经 '无常崩塌即清明'检验，东方'稳传经崩见真'的炼金"}
PAIRS[(5,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 师承灵性学问(spiritual teaching) / Star=Air 风暴后希望重连(renewal/hope) → 土风相克 + archetype 互补(学问之深 vs 希望之柔)：师承深学与希望柔信互补",
  "combination_story_seed": "the vestments and the still pool — Hierophant's deep teaching meets the Star kneeling in serene hope; the wisdom handed down through lineage and the renewal that pours from the still pool complete each other, the keys need the water, the teaching lands when it is carried by hope rather than by weight alone",
  "synergy_logic": "Amethyst(师承深学) + Aquamarine(希望柔信清明之水) → Amethyst 帮你深学，Aquamarine 帮你柔信，协同 = '深学 + 柔信'，让传承不沉重而带希望",
  "eastern_lens": "土(深学)风(柔信)相克互补 — 'lineage 深学'配 '菩提心 re-arises 柔信'，东方'深与柔、学与信'的和合"}
PAIRS[(5,18)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 师承显白教法(overt teaching) / Moon=Water 隐秘潜意识之暗(esoteric subconscious) → 土水相克 + archetype 互补(显白教 vs 隐秘知)：显教与密教、明与暗互补",
  "combination_story_seed": "the vestments and the howling path — Hierophant's overt teaching meets the Moon's half-lit path of the hidden; the lineage that names the sacred in daylight and the subconscious that moves in half-light complete each other, the keys and the crayfish, exoteric form and esoteric depth, the teaching needs what cannot yet be said aloud",
  "synergy_logic": "Amethyst(显白教法) + Moonstone(隐秘潜意识耐受) → Amethyst 帮你学显教，Moonstone 帮你待住密意，协同 = '显教 + 密意'双轨，让传承兼顾明暗",
  "eastern_lens": "土(显教)水(密意)相克互补 — 'lineage 显教'配 '无意识深处密意'，东方'显与密、明与暗'的和合"}
PAIRS[(5,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hierophant=Earth 师承明朗学问(clear teaching) / Sun=Fire 喜悦明朗(clarity/joy) → 土火相生同主题 archetype(明朗学问 × 喜悦明朗 共振)：两种明朗叠加",
  "combination_story_seed": "the vestments under the noon sun — Hierophant's clear teaching meets the Sun's radiant joy; the wisdom handed down in daylight and the simple clarity of being alive amplify each other, the keys and the sunflowers, two forms of lucidity, one taught one simply lived, the lineage shines when it is enjoyed rather than only obeyed",
  "synergy_logic": "Amethyst(明朗师承学问) + Sunstone(喜悦明朗活力) → Amethyst 帮你明学，Sunstone 帮你明活，协同 = '学得明也活得明'，共振放大整全的明朗",
  "eastern_lens": "土(明学)火(明活)相生共振 — 'lineage 明学'配 '明性 simple clarity'，东方'明学与明活、教明与活明'的同频"}
PAIRS[(5,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hierophant=Earth 师承小我学问(small-self lineage learning) / Judgment=Fire 听召回应更大生命(call to larger life) → 土火相生 + 阶段跃迁 archetype(师承学问 → 学问升华为回应召呼)：从'学传承'升华到'回应更大召呼'",
  "combination_story_seed": "the vestments hear the trumpet — Hierophant's lineage learning meets Judgment's trumpet calling figures from graves; the wisdom received from teachers is met by a calling larger than any lineage, and the keys that opened the small doctrine are reborn to answer something beyond inheritance, the robes rise at the angel's call",
  "synergy_logic": "Amethyst(清明师承学问) + Angelite(更大召呼听作指引) → Amethyst 帮你学传承，Angelite 帮你听更高召呼，协同 = '学传承 + 应更高召'，让学问升级为回应召呼的活智慧",
  "eastern_lens": "土(师学)→火(应召)的跃迁 — 'lineage 师学'接 '如实自省后的更高召呼'，东方'师学与应召、承与应'的升华"}
PAIRS[(5,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hierophant=Earth 师承之中段(lineage mid-path) / World=Earth 整合完成之终段(integrated completion) → 同元素(土)+ archetype 互补(传承中段 vs 完成终段)：师承之路与整合完成互补",
  "combination_story_seed": "the vestments inside the wreath — Hierophant's lineage path meets the World dancer inside the completed garland; the teaching handed down mid-journey and the wholeness that integrates the whole path complete each other, the keys open into the wreath, the lineage was always a road to the mandala, the four fixed signs watch the teaching close into wholeness",
  "synergy_logic": "Amethyst(师承中段深学) + Clear Quartz(整合完成和合) → Amethyst 帮你承中段，Clear Quartz 帮你合终段，协同 = '承得中段也合得终段'，让师承之路走到完整",
  "eastern_lens": "土(承中)土(合终)同元互补 — 'lineage 承中'配 '曼荼罗整合合终'，东方'承中与合终、传与圆'的和合"}

# ---- a=6 The Lovers × 7..21 ----
PAIRS[(6,7)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 价值对齐之选择(values-aligned choice) / Chariot=Water 聚焦意志前进(focused will) → 风水相生 + archetype 互补(选好对齐 → 驱车前进)：选择与驱进互补，先选后驱",
  "combination_story_seed": "the angel and the moving chariot — Lovers' values-aligned choice meets the Chariot's focused drive; the union that chose its direction and the will that drives it forward complete each other, the angel blesses the reins, the two who chose each other now harness opposing forces toward the same horizon",
  "synergy_logic": "Rhodonite(选好对齐价值) + Hematite(聚焦驱车前进) → Rhodonite 帮你选对，Hematite 帮你驱进，协同 = '选对了就一起往前'，让选择落为共同前进",
  "eastern_lens": "风(择)水(驱)相生互补 — 'right association 择'配 '中道整合驱进'，东方'择与驱、选与行'的和合"}
PAIRS[(6,8)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 关系之爱(union/love) / Strength=Fire 柔韧克己之爱(gentle self-mastery) → 风火相克 + archetype 互补(对他爱 vs 对己柔驯)：爱他与驯己互补，爱需自我调伏",
  "combination_story_seed": "the angel and the lion's mane — Lovers' union of two meets Strength taming the lion within; the love that joins with another and the gentle power that masters the self's raw instinct complete each other, you can only love without smothering once you have learned to meet your own appetite with compassion, the angel needs the open jaws",
  "synergy_logic": "Rhodonite(关系中的爱) + Tiger Eye(柔驯己之 raw instinct) → Rhodonite 帮你爱人，Tiger Eye 帮你驯己，协同 = '爱人不溺、驯己不苛'，让爱有自我调伏托底",
  "eastern_lens": "风(爱他)火(驯己)相克互补 — 'right association 爱他'配 '调伏非暴力驯己'，东方'爱他与驯己、慈与调'的和合"}
PAIRS[(6,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 价值对齐之合(conscious union) / Hermit=Earth 独处向内(solitude) → 风土相克 + archetype 对立互补(合 vs 独)：结合与独处互补",
  "combination_story_seed": "the angel and the snowy peak — Lovers' union meets the Hermit alone on the mountain; the choice to join with another and the choice to withdraw into solitude complete each other, the angel and the lantern, union needs its seasons of solitude or it becomes fusion, solitude needs the return to the other or it becomes isolation",
  "synergy_logic": "Rhodonite(关系中对齐) + Labradorite(独处寻内在光) → Rhodonite 帮你合，Labradorite 帮你独，协同 = '合得来也独得下'，让结合有健康的独处节奏",
  "eastern_lens": "风(合)土(独)相克互补 — 'right association 合'配 '闭关 retreat 独'，东方'合与独、聚与散'的和合"}
PAIRS[(6,10)] = {
  "relationship_type": "tension",
  "judgment_basis": "Lovers=Air 价值对齐稳定选择(stable aligned choice) / Wheel=Fire 循环转折(turning phases) → 风火相克 + archetype 拉扯(稳定对齐 vs 阶段会转)且难两全：选了就稳还是关系有阶段",
  "combination_story_seed": "the angel on the turning wheel — Lovers' values-aligned union meets the Wheel turning its phases; the choice that aimed to align forever stands before the cycle that turns every relationship through seasons, and the pull is whether the vow holds through the turning or whether the alignment itself was just one phase the wheel carried in",
  "synergy_logic": "Rhodonite(守稳定对齐) + Green Aventurine(认关系阶段会转) → Rhodonite 帮你守对齐，Aventurine 帮你认阶段，协同 = '守得住对齐也接得住转变'，化解稳定与轮转的拉扯",
  "eastern_lens": "风(稳择)vs 火(转轮)的拉扯 — 'right association 稳择' vs '无常轮回转'，东方'稳与转、择与变'的张力"}
PAIRS[(6,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 价值对齐之爱(aligned love) / Justice=Air 诚实公正(accountability) → 同元素(风)+ archetype 互补(爱 vs 诚实称量)：爱与公正互补，爱需诚实校正",
  "combination_story_seed": "the angel and the scales — Lovers' union meets Justice weighing with sword and scales; the love that joins two people and the honesty that holds them accountable complete each other, the angel and the level balance, love needs fairness or it slides into fusion, fairness needs love or it becomes cold accounting",
  "synergy_logic": "Rhodonite(关系之爱) + Lapis Lazuli(诚实公正称量) → Rhodonite 帮你爱，Lapis 帮你称量是否诚实公正，协同 = '爱而有诚、合而公平'，让结合不脱离诚信",
  "eastern_lens": "风(爱)风(正)同元互补 — 'right association 爱'配 '因果 cause-effect 公正'，东方'爱与正、合与公'的和合"}
PAIRS[(6,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 正立价值选择(upright values choice) / Hanged Man=Water 倒悬换视角(inverted new view) → 风水相生 + archetype 互补(正立择 vs 倒悬看)：正立的选择与倒悬的视角互补",
  "combination_story_seed": "the angel and the inverted halo — Lovers' upright choice meets the Hanged Man hanging upside down; the values you chose standing up are seen from the inverted angle that may reveal what the upright view missed, and the angel and the halo, the choice benefits from being turned on its head before it is final",
  "synergy_logic": "Rhodonite(正立价值选择) + Selenite(倒悬后清明新视角) → Rhodonite 帮你正着选，Selenite 帮你倒着看清，协同 = '正选 + 倒看'双视角，让选择不基于盲点",
  "eastern_lens": "风(正择)水(倒看)相生互补 — 'right association 正择'配 '反转惯常视角'，东方'正与倒、择与转'的和合"}
PAIRS[(6,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Lovers=Air 关系之结合(union) / Death=Water 关系形式终结(transformation of the form) → 风水相生 + 阶段跃迁 archetype(结合 → 该关系形式转化让位)：从'结合'升华到'让该转的关系形式转'",
  "combination_story_seed": "the angel before the pale horse — Lovers' union meets Death clearing what has completed; the relationship that joined two people is met by the transformation that ends the form whose time is done, and the angel learns that some unions must change shape to stay alive, the tree of fruit bows to the rising sun between two towers",
  "synergy_logic": "Rhodonite(温柔守关系之真) + Obsidian(诚实放掉该转的关系形式) → Rhodonite 帮你守真，Obsidian 帮你放旧形式，协同 = '守得住真也转得了形'，让结合升级为'有合有化'的活关系",
  "eastern_lens": "风(合)→水(转)的跃迁 — 'right association 合'接 '无常清场转形'，东方'合与转、聚与化'的升华"}
PAIRS[(6,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 价值对齐之爱(aligned love) / Temperance=Fire 慢调和(blending/patience) → 风火相克 + archetype 互补(对齐 vs 调和)：对齐之爱与慢调和互补",
  "combination_story_seed": "the angel and the two cups — Lovers' aligned union meets Temperance pouring endlessly between two cups; the love that chose its values and the patience that blends two different people complete each other, the angel and the cups, alignment needs the slow mixing or it stays an idea, blending needs the alignment or it has no direction",
  "synergy_logic": "Rhodonite(对齐价值) + Amethyst(慢调和两端) → Rhodonite 帮你对齐，Amethyst 帮你慢调，协同 = '对齐 + 调和'双轨，让爱既有方向又有耐心",
  "eastern_lens": "风(对齐)火(调和)相克互补 — 'right association 对齐'配 '中道动态调和'，东方'对齐与调和、择与融'的和合"}
PAIRS[(6,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Lovers=Air 自由价值选择(free aligned choice) / Devil=Earth 执念束缚之伪爱(attachment as love) → 风土相克 + archetype 直接对立(自由真爱 vs 自缚伪爱)且难两全（框架代表对 Lovers×Devil）",
  "combination_story_seed": "the angel and the apple-tree chains — Lovers' angel presiding over a free values-aligned union meets the Devil's two figures chained loosely before the horned pillar; the same love that was chosen in the garden can slide into the attachment that calls itself devotion, and the tree of fruit becomes the chain, the angel's wings and the reversed pentagram are the same draw toward another seen as conscious union and as compulsion",
  "synergy_logic": "Rhodonite(清明分辨真爱 vs 伪爱) + Black Tourmaline(看清以爱为名的执念松链) → Rhodonite 帮你辨真爱，Black Tourmaline 帮你看清哪份'爱'是链，协同 = '爱而不缚、择而不执'，化解自由爱与执念的拉扯",
  "eastern_lens": "风(真爱)vs 土(伪执)的对立 — 'right association 真爱' vs '对治内魔 attachment 伪爱'，东方'真爱与伪执、择与缚'的张力"}
PAIRS[(6,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Lovers=Air 关系对齐之稳(aligned stability) / Tower=Fire 关系真相崩塌(revelation that breaks unstable union) → 风火相克 + 阶段跃迁 archetype(对齐之稳 → 那对齐若不真则崩)：关系触底见真，破局弧线",
  "combination_story_seed": "the angel struck by lightning — Lovers' aligned union meets the Tower's lightning on a foundation already unsound; the relationship that looked aligned is tested for whether it was built on real shared values or on performance, and the collapse reveals which, the angel's sun meets the crown knocked from the tower, the union that survives the lightning is the one that was true",
  "synergy_logic": "Rhodonite(清明辨关系真伪) + Smoky Quartz(真相崩塌中扎根) → Rhodonite 帮你辨真，Smoky Quartz 帮你崩后稳住，协同 = '辨得清真、崩了也站得住'，让爱经得起真相的雷击",
  "eastern_lens": "风(稳合)→火(崩真)的跃迁 — 'right association 稳合'经 '无常崩塌即清明'检验，东方'稳合经崩见真'的炼金"}
PAIRS[(6,17)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Lovers=Air 价值对齐之爱(aligned love) / Star=Air 风暴后希望重连(renewal/hope) → 同元素(风)+ 同主题 archetype(对齐之爱 × 希望重连 共振)：两种'连结'叠加",
  "combination_story_seed": "the angel and the still pool — Lovers' union meets the Star kneeling pouring water in serene renewal; the love that aligns two people and the hope that reconnects after difficulty amplify each other, two forms of connection, one chosen one renewed, the angel and the eight-pointed star both preside over bonds that hold",
  "synergy_logic": "Rhodonite(对齐之爱连结) + Aquamarine(希望重连连结) → Rhodonite 帮你与人连结，Aquamarine 帮你与意义重连，协同 = '人与人 + 人与意义'双重连结，共振放大整全的联结",
  "eastern_lens": "风(爱连)风(望连)同元共振 — 'right association 爱连'配 '菩提心 re-arises 望连'，东方'爱连与望连'的同频"}
PAIRS[(6,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Lovers=Air 清醒价值对齐(clear aligned choice) / Moon=Water 半明不白的潜意识迷雾 → 风水相克 + archetype 拉扯(清醒对齐 vs 模糊未明)且难两全：清醒选对齐还是停在半明的暧昧",
  "combination_story_seed": "the angel on the half-lit path — Lovers' clear values choice meets the Moon's path under uncertain light; the union that needs clear alignment stands in the half-light where the crayfish rises, and the pull is whether to commit to the values you can name or to stay with the murky not-yet-known feelings surfacing from the pool",
  "synergy_logic": "Rhodonite(清醒价值对齐) + Moonstone(耐受半明暧昧) → Rhodonite 帮你清醒对齐，Moonstone 帮你待住未明，协同 = '可见处对齐、未明处待'，化解清醒与迷雾的拉扯",
  "eastern_lens": "风(清择)vs 水(晦潜)的拉扯 — 'right association 清醒择' vs '无意识深处迷雾'，东方'清与晦、择与待'的张力"}
PAIRS[(6,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Lovers=Air 价值对齐之爱(aligned love/joy) / Sun=Fire 喜悦明朗(joy shared) → 风火相生同主题 archetype(对齐之爱 × 共享之喜 共振)：两种'共享'叠加",
  "combination_story_seed": "the angel under the noon sun — Lovers' union meets the Sun's content child on the white horse; the love that aligns two people and the joy that is shared amplify each other, the angel and the sunflowers, two forms of being-together, one chosen one simply enjoyed, the union ripens into the open warmth of tending the good together",
  "synergy_logic": "Rhodonite(对齐之爱) + Sunstone(共享之喜活力) → Rhodonite 帮你对齐，Sunstone 帮你共享喜悦，协同 = '对齐着爱、共享着喜'，共振放大共享的爱",
  "eastern_lens": "风(爱)火(喜)相生共振 — 'right association 爱'配 '明性 shared joy'，东方'爱与喜、择与享'的同频"}
PAIRS[(6,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Lovers=Air 关系对齐之爱(personal aligned love) / Judgment=Fire 听召回应更大生命(call to larger life) → 风火相生 + 阶段跃迁 archetype(关系之爱 → 爱升华为回应更大召呼)：从'两人的爱'升华到'回应更大召呼'",
  "combination_story_seed": "the angel hears the trumpet — Lovers' personal union meets Judgment's trumpet calling figures from graves; the love that joined two people is met by a calling larger than the relationship, and the angel's wings turn toward the angel of the trumpet, the aligned partnership rises to answer something beyond the two of them",
  "synergy_logic": "Rhodonite(清明关系之爱) + Angelite(更大召呼听作指引) → Rhodonite 帮你爱人，Angelite 帮你听更大召呼，协同 = '爱着人 + 应着召'，让关系升级为回应召呼的联合",
  "eastern_lens": "风(人爱)→火(应召)的跃迁 — 'right association 人爱'接 '如实自省后的更大召呼'，东方'人爱与应召、私与公'的升华"}
PAIRS[(6,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Lovers=Air 价值对齐之结合(union mid-journey) / World=Earth 整合完成之全(integrated completion) → 风土相克 + archetype 互补(结合中段 vs 完成终段)：结合与完成互补",
  "combination_story_seed": "the angel inside the wreath — Lovers' union meets the World dancer inside the completed garland; the love that joined two people mid-journey and the wholeness that integrates the whole path complete each other, the angel opens into the wreath, the union was always a road to the mandala of two-becoming-whole, the four fixed signs watch the love close into integration",
  "synergy_logic": "Rhodonite(结合中段对齐) + Clear Quartz(整合完成和合) → Rhodonite 帮你结合，Clear Quartz 帮你整合完成，协同 = '合得来也圆得满'，让结合走到完整",
  "eastern_lens": "风(合)土(成)相克始终互补 — 'right association 合'配 '曼荼罗整合成'，东方'合与成、聚与圆'的和合"}

# =========================================================================
# 批 4：a=7 The Chariot / a=8 Strength / a=9 Hermit / a=10 Wheel / a=11 Justice /
#       a=12 Hanged Man / a=13 Death
# =========================================================================
# ---- a=7 The Chariot × 8..21 ----
PAIRS[(7,8)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Chariot=Water 外向意志统驭前进(outward will) / Strength=Fire 内向温柔克己(inner fortitude) → 水火既济同主题 archetype(意志力 × 内在力 共振)：两种力量叠加（框架代表对 Chariot×Strength）",
  "combination_story_seed": "the reins and the lion's mane — Chariot driving sphinxes forward meets Strength calmly opening the lion's jaws; the will that harnesses opposing forces outward and the gentle power that tames raw instinct within amplify each other, the two sphinxes and the one lion, two forms of mastery, one that drives the team one that masters the self, victory through focused effort meets courage through softness",
  "synergy_logic": "Hematite(外向统驭意志) + Tiger Eye(内向温柔克己) → Hematite 帮你驭外，Tiger Eye 帮你驯内，协同 = '驭得外也驯得内'，共振放大整全的力量",
  "eastern_lens": "水(外驭)火(内驯)既济共振 — '中道整合外驭'配 '调伏非暴力内驯'，东方'外驭与内驯、攻与调'的同频"}
PAIRS[(7,9)] = {
  "relationship_type": "tension",
  "judgment_basis": "Chariot=Water 外向前进驱驰(outward momentum) / Hermit=Earth 内向独处静止(inward stillness) → 水土相克 + archetype 对立(动进 vs 静独)且难两全：驱车前进还是退回独处",
  "combination_story_seed": "the chariot and the snowy peak — Chariot driving forward meets the Hermit alone on the mountain; the momentum that drives toward a goal and the solitude that seeks inner truth pull against each other, the reins and the lantern, and the question is whether the chariot knows where it is going or whether it needs the hermit's stillness first",
  "synergy_logic": "Hematite(聚焦驱驰) + Labradorite(独处寻内在光) → Hematite 帮你驱，Labradorite 帮你停，协同 = '驱得动也停得下'，化解动进与静独的拉扯",
  "eastern_lens": "水(动进)vs 土(静独)的拉扯 — '中道整合动进' vs '闭关 retreat 静独'，东方'动与静、驰与止'的张力"}
PAIRS[(7,10)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Chariot=Water 聚焦前进的动量(focused momentum) / Wheel=Fire 循环转折的动量(cyclic momentum) → 水火相克同主题 archetype(前进之势 × 转折之势 共振)：两种动量叠加",
  "combination_story_seed": "the chariot on the turning wheel — Chariot's focused momentum meets the Wheel's cyclic turning; the will that drives forward and the cycle that turns phases amplify each other, the reins ride the rim, momentum meets momentum, the sphinxes pull as the wheel spins, focused drive and the larger cycle moving together",
  "synergy_logic": "Hematite(聚焦前进) + Green Aventurine(随循环转动) → Hematite 帮你驱，Aventurite 帮你借势，协同 = '驱得动 + 借得势'，共振放大顺势的前进",
  "eastern_lens": "水(驱势)火(转势)的主题共振 — '中道整合驱势'配 '无常轮回转势'，东方'驱与转、动与运'的同频"}
PAIRS[(7,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Chariot=Water 意志驱进(will/drive) / Justice=Air 诚实公正称量(truth-weighing) → 风水相济 + archetype 互补(驱进 vs 称量)：前进与称量互补，驱进需公正定向",
  "combination_story_seed": "the chariot and the scales — Chariot's focused drive meets Justice weighing with sword and scales; the momentum that drives toward a goal and the honesty that weighs the direction complete each other, the reins and the balance, drive needs to know it is going where fairness points or it becomes aggression, the chariot needs the scales to know its aim is just",
  "synergy_logic": "Hematite(聚焦驱进) + Lapis Lazuli(公正诚实称量方向) → Hematite 帮你驱，Lapis 帮你称量方向对不对，协同 = '驱得猛也正得准'，让前进有公正定向",
  "eastern_lens": "水(驱)风(量)相济互补 — '中道整合驱'配 '因果 cause-effect 量'，东方'驱与量、动与正'的和合"}
PAIRS[(7,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Chariot=Water 外向驱驰动量(outward momentum) / Hanged Man=Water 内向悬停反转暂停(inward pause) → 同元素(水)+ archetype 对立互补(动 vs 静悬)：驱驰与悬停互补",
  "combination_story_seed": "the chariot and the inverted halo — Chariot's forward drive meets the Hanged Man hanging upside down; the momentum that drives and the surrender that pauses complete each other, the reins and the halo, the chariot needs to stop and invert its frame sometimes or its drive becomes blind, the pause serves the momentum",
  "synergy_logic": "Hematite(聚焦驱驰) + Selenite(悬停反转后清明) → Hematite 帮你驱，Selenite 帮你停着看清，协同 = '驱得动也停得清'，让前进有反转视角的暂停",
  "eastern_lens": "水(驱)水(悬)同元对立互补 — '中道整合驱'配 '反转惯常视角悬'，东方'驱与悬、动与止'的和合"}
PAIRS[(7,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Chariot=Water 聚焦前进赢取(victory through drive) / Death=Water 前进势的终结(transformation of the drive) → 同元素(水)+ 阶段跃迁 archetype(赢取之势 → 该势终结让位)：从'驱驰赢取'升华到'让该终的势终结'",
  "combination_story_seed": "the chariot before the pale horse — Chariot's victorious drive meets Death clearing what has completed; the momentum that won its race is met by the transformation that ends the form of striving whose time is done, and the sphinxes learn that some victories are meant to close so the next can begin, the reins bow to the rising sun between two towers",
  "synergy_logic": "Hematite(清明驱驰赢取) + Obsidian(诚实放掉该终的势) → Hematite 帮你驱赢，Obsidian 帮你放旧势，协同 = '赢得下也放得下'，让前进升级为'有取有舍'的转化",
  "eastern_lens": "水(取)→水(舍)的同元跃迁 — '中道整合取'接 '无常清场舍'，东方'取与舍、驱与化'的升华"}
PAIRS[(7,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Chariot=Water 单向聚焦驱驰(one-direction drive) / Temperance=Fire 双向慢调和(two-cup blending) → 水火相克 + archetype 互补(单向驱 vs 双向调)：单向驱进与双向调和互补",
  "combination_story_seed": "the chariot and the two cups — Chariot's one-direction drive meets Temperance pouring endlessly between two cups; the will that drives straight and the patience that blends opposites complete each other, the reins and the cups, drive needs the blending or it scatters, blending needs the drive or it never advances",
  "synergy_logic": "Hematite(单向聚焦驱) + Amethyst(双向慢调) → Hematite 帮你驱，Amethyst 帮你调，协同 = '驱得直 + 调得平'，让前进不偏执",
  "eastern_lens": "水(单驱)火(双调)相克互补 — '中道整合单驱'配 '中道动态双调'，东方'单与双、驱与调'的和合"}
PAIRS[(7,15)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Chariot=Water 正向聚焦意志(healthy focused will) / Devil=Earth 意志的暗面(scattered force/aggression as bondage) → 水土相克 + 阶段跃迁 archetype(健康意志 → 意志滑向为驱而驱的暗面)：从'健康统驭'跌入'为控而控的散力'暗面（shadow aspect 口径）",
  "combination_story_seed": "the chariot behind the loose chains — Chariot's healthy focused will meets the Devil's bondage; the same drive that harnessed opposing forces toward a goal can slide into the aggression that scatters for its own sake, and the reins become the chain, the two sphinxes and the two chained figures are the same will to control seen in service and in shadow",
  "synergy_logic": "Hematite(清明分辨健康驱 vs 散力控) + Black Tourmaline(看清为驱而驱的松链) → Hematite 帮你辨健康驱，Black Tourmaline 帮你看清哪份'驱'已变成缚，协同 = '驱而不散、控而不缚'，让意志守住健康",
  "eastern_lens": "水(正驱)→土(暗散)的暗面跃迁 — '中道整合正驱'阴影即 '对治内魔 scattered force'，东方'正驱与暗散、驭与缚'的 shadow 转化"}
PAIRS[(7,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Chariot=Water 驱驰赢取之稳(stable victory drive) / Tower=Fire 那驱驰若方向错则崩(direction collapse) → 水火相克 + 阶段跃迁 archetype(驱驰之稳 → 方向不稳则崩)：驱驰触底见真方向，破局弧线",
  "combination_story_seed": "the chariot struck by lightning — Chariot's victorious drive meets the Tower's lightning on a direction already unsound; the momentum that felt like victory is tested for whether it was headed somewhere true or somewhere built on false aim, and the collapse reveals which, the crown knocked from the tower tests whether the chariot's win was real",
  "synergy_logic": "Hematite(清明辨方向真伪) + Smoky Quartz(方向崩塌中扎根重定向) → Hematite 帮你辨真方向，Smoky Quartz 帮你崩后重定向，协同 = '方向真、崩了也重得起'，让驱驰经得起雷击见真",
  "eastern_lens": "水(稳驱)→火(崩真)的跃迁 — '中道整合稳驱'经 '无常崩塌即清明'检验，东方'稳驱经崩见真方向'的炼金"}
PAIRS[(7,17)] = {
  "relationship_type": "causal",
  "judgment_basis": "Chariot=Water 驱驰消耗(focused drive that spends) / Star=Air 驱驰后重连希望(renewal after the effort) → 风水相济 + 序列因果：驱驰的消耗是 Star 重连希望的前提，跑累了才需要星光下的静水",
  "combination_story_seed": "the chariot stops at the still pool — Chariot's spent drive meets the Star kneeling pouring water in serene renewal; the momentum that drove toward victory pulls over at the pool where renewal is poured, and the race that spent everything is met by the hope that returns, the reins are set down by the eight-pointed star",
  "synergy_logic": "Hematite(聚焦驱驰) + Aquamarine(驱驰后重连希望之水) → Hematite 帮你跑，Aquamarine 帮你跑后补水，协同 = '跑得动也补得回'，让驱驰有希望接得住",
  "eastern_lens": "水(驱耗)→风(望续)的因果 — '中道整合驱耗'以 '菩提心 re-arises 望续'为果，东方'驰后得息、劳后得望'的因果"}
PAIRS[(7,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Chariot=Water 清醒定向驱驰(clear-direction drive) / Moon=Water 半明不白潜意识迷雾 → 同元素(水)+ archetype 拉扯(清醒定向 vs 模糊未明)且难两全：定向驱驰还是停在迷雾",
  "combination_story_seed": "the chariot on the half-lit path — Chariot's clear-direction drive meets the Moon's path under uncertain light; the momentum that needs a visible goal stands in the half-light where the crayfish rises, and the pull is whether to drive forward on what is clear or to wait while the murky not-yet-known surfaces",
  "synergy_logic": "Hematite(清醒定向驱) + Moonstone(耐受半明迷雾) → Hematite 帮你驱可见的，Moonstone 帮你待未明，协同 = '可见处驱、未明处待'，化解定向与迷雾的拉扯",
  "eastern_lens": "水(清驱)vs 水(晦潜)的同元拉扯 — '中道整合清驱' vs '无意识深处迷雾'，东方'清与晦、驱与待'的张力"}
PAIRS[(7,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Chariot=Water 赢取之喜(victory) / Sun=Fire 喜悦成功之活力(joy/success) → 水火相克同主题 archetype(赢取 × 喜悦 共振)：两种成功叠加",
  "combination_story_seed": "the chariot under the noon sun — Chariot's victory meets the Sun's radiant success; the focused drive that won and the simple joy of being alive amplify each other, the reins and the sunflowers, two forms of triumph, one earned one simply lived, victory ripens into the open enjoyment of what was won",
  "synergy_logic": "Hematite(赢取之驱) + Sunstone(喜悦成功活力) → Hematite 帮你赢，Sunstone 帮你享赢，协同 = '赢得下也乐得起'，共振放大整全的成功",
  "eastern_lens": "水(赢)火(喜)的主题共振 — '中道整合赢'配 '明性 success'，东方'赢与喜、取与乐'的同频"}
PAIRS[(7,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Chariot=Water 世俗驱驰赢取(earthly victory) / Judgment=Fire 听召回应更大生命(call to larger life) → 水火相克 + 阶段跃迁 archetype(世俗赢取 → 赢取升华为回应召呼)：从'驱驰赢取'升华到'回应更大召呼'",
  "combination_story_seed": "the chariot hears the trumpet — Chariot's earthly victory meets Judgment's trumpet calling figures from graves; the focused drive that won its race is met by a calling larger than any victory, and the reins turn toward the angel's call, the chariot that won the small race rises to answer something beyond the finish line",
  "synergy_logic": "Hematite(清明世俗赢取) + Angelite(更大召呼听作指引) → Hematite 帮你赢世，Angelite 帮你听更高召呼，协同 = '赢世俗 + 应更高召'，让驱驰升级为回应召呼的前进",
  "eastern_lens": "水(世赢)→火(应召)的跃迁 — '中道整合世赢'接 '如实自省后的更高召呼'，东方'世赢与应召、取与应'的升华"}
PAIRS[(7,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Chariot=Water 驱驰前进之中段(drive mid-journey) / World=Earth 整合完成之终段(integrated completion) → 水土相克 + archetype 互补(驱驰中段 vs 完成终段)：前进与完成互补",
  "combination_story_seed": "the chariot inside the wreath — Chariot's drive meets the World dancer inside the completed garland; the momentum that drove toward the goal and the wholeness that completes the journey are the same cycle, the reins become the wreath, the sphinxes pull toward the four fixed signs at the corners, the drive was always bound for the mandala",
  "synergy_logic": "Hematite(驱驰中段前进) + Clear Quartz(整合完成和合) → Hematite 帮你驱中段，Clear Quartz 帮你合终段，协同 = '驱得动也圆得满'，让前进走到完成",
  "eastern_lens": "水(驱)土(成)相克始终互补 — '中道整合驱'配 '曼荼罗整合成'，东方'驱与成、动与圆'的和合"}

# ---- a=8 Strength × 9..21 ----
PAIRS[(8,9)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Strength=Fire 内向温柔克己(inner gentle mastery) / Hermit=Earth 内向独处寻光(inward solitude) → 火土相生 + archetype 同向(内向驯己 × 内向寻光)：两种内向功夫互补",
  "combination_story_seed": "the lion's mane and the lantern — Strength taming within meets the Hermit alone on the peak; the gentle mastery of the self's raw instinct and the solitude that seeks inner light complete each other, the open jaws and the six-pointed star, two interior practices, one tames the beast one raises the lamp, inner fortitude and inner seeking",
  "synergy_logic": "Tiger Eye(内向温柔驯 raw instinct) + Labradorite(内向独处寻光) → Tiger Eye 帮你驯内，Labradorite 帮你寻内，协同 = '驯得内也寻得见'，共振放大双重的内向功夫",
  "eastern_lens": "火(内驯)土(内寻)相生互补 — '调伏非暴力内驯'配 '闭关 retreat 内寻'，东方'内驯与内寻、调与观'的和合"}
PAIRS[(8,10)] = {
  "relationship_type": "tension",
  "judgment_basis": "Strength=Fire 柔韧耐心克己(patient gentle mastery) / Wheel=Fire 循环转折(cycles turning) → 同元素(火)+ archetype 拉扯(耐心驯 vs 时位转)且难两全：柔韧等还是认清轮转",
  "combination_story_seed": "the lion under the turning wheel — Strength's patient taming meets the Wheel turning its phases; the gentle mastery that takes its time and the cycle that turns whether you are ready or not pull against each other, and the question is whether to keep taming patiently or to recognize the phase has already turned",
  "synergy_logic": "Tiger Eye(柔韧耐心驯) + Green Aventurine(认轮转随转) → Tiger Eye 帮你耐心驯，Aventurine 帮你认时位，协同 = '驯得稳也转得准'，化解耐心与时位的拉扯",
  "eastern_lens": "火(耐驯)vs 火(轮转)的同元拉扯 — '调伏非暴力耐驯' vs '无常轮回转'，东方'耐与转、驯与时'的张力"}
PAIRS[(8,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Strength=Fire 柔韧克己之勇(gentle courage) / Justice=Air 诚实公正称量(honest weighing) → 风火相克 + archetype 互补(柔勇 vs 诚实称量)：温柔之勇与诚实称量互补",
  "combination_story_seed": "the lion's mane and the scales — Strength's gentle courage meets Justice weighing with sword and scales; the compassion that meets raw instinct and the honesty that weighs what is true complete each other, the open jaws and the level balance, courage needs fairness or it becomes force, fairness needs courage or it cannot face what weighs",
  "synergy_logic": "Tiger Eye(柔韧克己之勇) + Lapis Lazuli(诚实公正称量) → Tiger Eye 帮你柔勇，Lapis 帮你诚实称量，协同 = '勇而柔、公而诚'，让力量不脱离公正",
  "eastern_lens": "火(柔勇)风(公正)相克互补 — '调伏非暴力柔勇'配 '因果 cause-effect 公正'，东方'柔勇与公正、调与量'的和合"}
PAIRS[(8,12)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Strength=Fire 柔韧耐心(gentle patience) / Hanged Man=Water 悬停耐心(willing pause) → 水火既济同主题 archetype(耐心驯 × 耐心悬 共振)：两种耐心叠加",
  "combination_story_seed": "the lion's mane and the inverted halo — Strength's patient taming meets the Hanged Man's willing pause; the gentleness that meets the beast over time and the surrender that hangs upside down until the new view arrives amplify each other, two forms of patience, one with raw instinct one with the fixed frame, both waiting without forcing",
  "synergy_logic": "Tiger Eye(柔韧耐心驯) + Selenite(悬停耐心反转) → Tiger Eye 帮你耐着驯，Selenite 帮你耐着悬，协同 = '双重的耐心'，共振放大不靠蛮力的功夫",
  "eastern_lens": "火(耐驯)水(耐悬)既济共振 — '调伏非暴力耐驯'配 '反转视角耐悬'，东方'驯耐与悬耐、调与止'的同频"}
PAIRS[(8,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Strength=Fire 柔韧克己制 raw instinct(master raw instinct) / Death=Water 让该终的 raw 形式终结(clear the completed instinct-form) → 水火相克 + 阶段跃迁 archetype(克己 → 让旧本能终结)：从'驯住 raw instinct'升华到'让该死的旧本能死'",
  "combination_story_seed": "the lion before the pale horse — Strength's tamed beast meets Death clearing what has completed; the gentle mastery that met raw instinct is met by the transformation that ends the old instinct-form whose time is done, and the lion's mane bows to the rising sun between two towers, the tamed beast is released so a new one can be met",
  "synergy_logic": "Tiger Eye(清明驯 raw instinct) + Obsidian(诚实放掉该终的旧本能) → Tiger Eye 帮你驯，Obsidian 帮你放旧本能，协同 = '驯得住也放得下该放的'，让克己升级为'有驯有化'的转化",
  "eastern_lens": "火(驯)→水(化)的跃迁 — '调伏非暴力驯'接 '无常清场化旧本能'，东方'驯与化、调与放'的升华"}
PAIRS[(8,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Strength=Fire 柔韧克己(gentle self-mastery) / Temperance=Fire 慢调和(blending) → 同元素(火)+ archetype 互补(驯己 vs 调两端)：克己与调和互补",
  "combination_story_seed": "the lion's mane and the two cups — Strength's gentle mastery meets Temperance pouring between two cups; the taming of raw instinct within and the blending of opposites around complete each other, the open jaws and the cups, you can only blend outer opposites once you have tamed the inner beast, the wreath in the hair meets the path to the crown",
  "synergy_logic": "Tiger Eye(内向驯己) + Amethyst(外向调两端) → Tiger Eye 帮你驯内，Amethyst 帮你调外，协同 = '驯内 + 调外'，让克己落为外在调和",
  "eastern_lens": "火(驯内)火(调外)同元互补 — '调伏非暴力驯内'配 '中道动态调外'，东方'驯内与调外、调己与和人'的和合"}
PAIRS[(8,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Strength=Fire 柔韧克己制 raw instinct(healthy mastery) / Devil=Earth raw instinct 反被它缚(raw instinct binds as attachment) → 火土相生 + archetype 对立(驯住 raw vs 被 raw 反缚)且难两全：驯住本能还是被本能缚",
  "combination_story_seed": "the lion behind the loose chains — Strength's gentle mastery meets the Devil's bondage; the same raw instinct that was tamed can reassert as the attachment that chains, and the lion and the horned figure are the same appetite seen mastered and seen ruling, an invitation to ask whether the beast is still tamed or whether it has retaken the reins",
  "synergy_logic": "Tiger Eye(清明分辨驯住 vs 被缚) + Black Tourmaline(看清 raw instinct 松链) → Tiger Eye 帮你辨驯没驯住，Black Tourmaline 帮你看清哪条 raw 已松，协同 = '驯而不缚、勇而不溺'，化解克己与本能反缚的拉扯",
  "eastern_lens": "火(驯)vs 土(缚)的对立 — '调伏非暴力驯' vs '对治内魔 raw instinct 缚'，东方'驯与缚、调与执'的张力"}
PAIRS[(8,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Strength=Fire 柔韧克己之稳(stable gentle mastery) / Tower=Fire 克己结构崩塌(mastery collapse reveals truth) → 同元素(火)+ 阶段跃迁 archetype(克己之稳 → 那克己若假则崩)：克己触底见真，破局弧线",
  "combination_story_seed": "the lion struck by lightning — Strength's stable mastery meets the Tower's lightning on a self-mastery already unsound; the gentleness that looked like courage is tested for whether it was real patience or suppressed force, and the collapse reveals which, the infinity above the head meets the crown knocked from the tower, the mastered beast may have been just leashed",
  "synergy_logic": "Tiger Eye(清明辨克己真伪) + Smoky Quartz(克己崩塌中扎根重驯) → Tiger Eye 帮你辨真驯，Smoky Quartz 帮你崩后重驯，协同 = '驯得真、崩了也重得起'，让克己经得起雷击见真",
  "eastern_lens": "火(稳驯)→火(崩真)的同元跃迁 — '调伏非暴力稳驯'经 '无常崩塌即清明'检验，东方'稳驯经崩见真'的炼金"}
PAIRS[(8,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Strength=Fire 柔韧克己之勇(gentle courage) / Star=Air 风暴后希望重连(renewal/hope) → 风火相克 + archetype 互补(柔勇 vs 柔信)：温柔之勇与柔信希望互补",
  "combination_story_seed": "the lion and the still pool — Strength's gentle courage meets the Star kneeling in serene renewal; the patience that meets the beast and the hope that returns after difficulty complete each other, the open jaws and the pouring water, courage needs the renewal or it burns out, hope needs the courage or it cannot face what is hard",
  "synergy_logic": "Tiger Eye(柔韧克己之勇) + Aquamarine(柔信希望之水) → Tiger Eye 帮你柔勇，Aquamarine 帮你柔信，协同 = '柔勇 + 柔信'，让克己有希望接得住",
  "eastern_lens": "火(柔勇)风(柔信)相克互补 — '调伏非暴力柔勇'配 '菩提心 re-arises 柔信'，东方'柔勇与柔信、调与望'的和合"}
PAIRS[(8,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Strength=Fire 柔韧克己清明驯(gentle clear mastery) / Moon=Water 半明不白潜意识迷雾 → 水火相克 + archetype 拉扯(清明驯 vs 模糊未明本能)且难两全：清明驯住还是停在半明的本能迷雾",
  "combination_story_seed": "the lion on the half-lit path — Strength's clear mastery meets the Moon's path under uncertain light; the gentleness that meets known instinct stands in the half-light where the murky beast rises, and the pull is whether to keep taming what you can name or to wait while the not-yet-known instinct surfaces",
  "synergy_logic": "Tiger Eye(清明驯已知本能) + Moonstone(耐受未明本能迷雾) → Tiger Eye 帮你驯可见的，Moonstone 帮你待未明，协同 = '可见处驯、未明处待'，化解清明驯与迷雾的拉扯",
  "eastern_lens": "火(清驯)vs 水(晦潜)的拉扯 — '调伏非暴力清驯' vs '无意识深处迷雾本能'，东方'清与晦、驯与待'的张力"}
PAIRS[(8,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Strength=Fire 柔韧克己之活力(gentle vitality) / Sun=Fire 喜悦明朗活力(joy/vitality) → 同元素(火)+ 同主题 archetype(柔韧活力 × 喜悦活力 共振)：两种活力叠加",
  "combination_story_seed": "the lion under the noon sun — Strength's gentle vitality meets the Sun's radiant joy; the courage that tames with softness and the simple vitality of being alive amplify each other, the open jaws and the sunflowers, two forms of aliveness, one mastered one simply lived, the infinity and the bright sun overhead",
  "synergy_logic": "Tiger Eye(柔韧活力) + Sunstone(喜悦活力) → Tiger Eye 帮你柔韧地活，Sunstone 帮你喜悦地活，协同 = '双重的活'，共振放大整全的活力",
  "eastern_lens": "火(柔活)火(喜活)同元共振 — '调伏非暴力柔活'配 '明性 simple vitality'，东方'柔活与喜活'的同频"}
PAIRS[(8,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Strength=Fire 世俗柔韧克己(earthly gentle mastery) / Judgment=Fire 听召回应更大生命(call to larger life) → 同元素(火)+ 阶段跃迁 archetype(世俗克己 → 克己升华为回应召呼)：从'柔韧克己'升华到'回应更大召呼'",
  "combination_story_seed": "the lion hears the trumpet — Strength's earthly mastery meets Judgment's trumpet calling figures from graves; the gentle courage that tamed the small beast is met by a calling larger than self-mastery, and the open jaws turn toward the angel's call, the mastered self rises to answer something beyond its own discipline",
  "synergy_logic": "Tiger Eye(清明世俗克己) + Angelite(更大召呼听作指引) → Tiger Eye 帮你克己，Angelite 帮你听更高召呼，协同 = '克着己 + 应着召'，让克己升级为回应召呼的勇气",
  "eastern_lens": "火(世驯)→火(应召)的同元跃迁 — '调伏非暴力世驯'接 '如实自省后的更高召呼'，东方'世驯与应召、调与应'的升华"}
PAIRS[(8,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Strength=Fire 柔韧克己之中段(gentle mastery mid-journey) / World=Earth 整合完成之终段(integrated completion) → 火土相生 + archetype 互补(克己中段 vs 完成终段)：克己与完成互补",
  "combination_story_seed": "the lion inside the wreath — Strength's gentle mastery meets the World dancer inside the completed garland; the patience that tamed the beast mid-journey and the wholeness that integrates the whole path complete each other, the open jaws become the wreath, the infinity and the four fixed signs, the gentle mastery was always bound for the mandala",
  "synergy_logic": "Tiger Eye(克己中段) + Clear Quartz(整合完成和合) → Tiger Eye 帮你驯中段，Clear Quartz 帮你合终段，协同 = '驯得动也圆得满'，让克己走到完整",
  "eastern_lens": "火(驯中)土(合终)相生始终互补 — '调伏非暴力驯中'配 '曼荼罗整合合终'，东方'驯中与合终、调与圆'的和合"}

# ---- a=9 The Hermit × 10..21 ----
PAIRS[(9,10)] = {
  "relationship_type": "tension",
  "judgment_basis": "Hermit=Earth 向内独处静止(inward stillness) / Wheel=Fire 向外循环转折(outward cycles) → 土火相克 + archetype 对立(静独 vs 动转)且难两全：退回独处还是随轮转而动",
  "combination_story_seed": "the lantern and the turning wheel — Hermit's inward stillness meets the Wheel's outward turning; the solitude that seeks inner light and the cycle that turns whether you seek or not pull against each other, and the question is whether to keep withdrawing or to recognize the phase has already turned and demands motion",
  "synergy_logic": "Labradorite(向内独处寻光) + Green Aventurine(随轮转而动) → Labradorite 帮你静独，Aventurine 帮你随转，协同 = '静得下也转得准'，化解静独与轮转的拉扯",
  "eastern_lens": "土(静独)vs 火(轮转)的拉扯 — '闭关 retreat 静独' vs '无常轮回转'，东方'静与转、止与运'的张力"}
PAIRS[(9,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hermit=Earth 内在寻光(inner light) / Justice=Air 诚实称量(truth-weighing) → 土风相克 + archetype 互补(内向寻真 vs 外向称真)：内在寻真与诚实称量互补",
  "combination_story_seed": "the lantern and the scales — Hermit's inner light meets Justice weighing with sword and scales; the truth found in solitude and the truth weighed in evidence complete each other, the six-pointed star and the level balance, the lantern illuminates what the scales then weigh, two forms of honesty, one sought one tested",
  "synergy_logic": "Labradorite(内向寻真) + Lapis Lazuli(外向诚实称量) → Labradorite 帮你寻内真，Lapis 帮你称量外真，协同 = '寻得见也称得准'，让内在真与外在真互证",
  "eastern_lens": "土(内寻真)风(外称真)相克互补 — '闭关 retreat 内寻真'配 '因果 cause-effect 外称真'，东方'内寻与外称、证与量'的和合"}
PAIRS[(9,12)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hermit=Earth 内向独处退省(inward solitude) / Hanged Man=Water 内向悬停反转(inward pause) → 土水相克同主题 archetype(内向退省 × 内向悬停 共振)：两种内向暂停叠加",
  "combination_story_seed": "the lantern and the inverted halo — Hermit's solitude meets the Hanged Man hanging upside down; the withdrawal to seek inner light and the surrender to reverse the frame amplify each other, two interior pauses, one on the snowy peak one on the T-tree, both stopping the world to see what forcing misses",
  "synergy_logic": "Labradorite(内向独处退省) + Selenite(内向悬停反转) → Labradorite 帮你退省，Selenite 帮你悬停反转，协同 = '双重的内向暂停'，共振放大退省的深度",
  "eastern_lens": "土(内退)水(内悬)的主题共振 — '闭关 retreat 内退'配 '反转视角内悬'，东方'内退与内悬、止与倒'的同频"}
PAIRS[(9,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hermit=Earth 退省独处(withdraw to seek) / Death=Water 退省后该放的就放(transformation after introspection) → 土水相克 + 阶段跃迁 archetype(退省寻真 → 退省后清场)：从'独处寻真'升华到'诚实地清掉寻真后该放的'",
  "combination_story_seed": "the lantern before the pale horse — Hermit's introspective withdrawal meets Death clearing what has completed; the solitude that sought inner light is met by the transformation that ends what that light revealed as already done, and the lantern bows to the rising sun between two towers, the hermit descends the peak to release what the retreat showed must go",
  "synergy_logic": "Labradorite(清明退省寻真) + Obsidian(诚实放掉退省后该放的) → Labradorite 帮你寻真，Obsidian 帮你放该放的，协同 = '寻得见也放得下'，让退省升级为'有寻有化'的转化",
  "eastern_lens": "土(退)→水(化)的跃迁 — '闭关 retreat 退'接 '无常清场化'，东方'退与化、寻与放'的升华"}
PAIRS[(9,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hermit=Earth 极内向独处(extreme inward solitude) / Temperance=Fire 动态外向调和(dynamic outward blending) → 土火相生 + archetype 对立互补(极内向 vs 动态外调)：极独处与动态调和互补",
  "combination_story_seed": "the lantern and the two cups — Hermit's extreme solitude meets Temperance pouring between two cups; the withdrawal that holds the inward light and the active blending that holds opposites in motion complete each other, the lantern and the cups, solitude needs the return to blending or it becomes isolation, blending needs the withdrawal or it has no depth",
  "synergy_logic": "Labradorite(极内向独处) + Amethyst(动态外向调和) → Labradorite 帮你独处，Amethyst 帮你调和，协同 = '独得深也调得平'，让独处与调和互为节奏",
  "eastern_lens": "土(极独)火(动调)相生互补 — '闭关 retreat 极独'配 '中道动态调和'，东方'独与调、退与融'的和合"}
PAIRS[(9,15)] = {
  "relationship_type": "tension",
  "judgment_basis": "Hermit=Earth 清明独处寻真(clear solitude seeking truth) / Devil=Earth 自欺式逃避独处(isolation as avoidance) → 同元素(土)+ archetype 对立(清明独处 vs 自欺孤立)且难两全：是真退省还是借独处逃避",
  "combination_story_seed": "the lantern behind the loose chains — Hermit's solitude seeking truth meets the Devil's isolation; the same withdrawal that illuminates can become the hiding that avoids, and the lantern and the horned pillar are the same aloneness seen as seeking and as avoidance, an invitation to ask whether the solitude is feeding or hiding",
  "synergy_logic": "Labradorite(清明分辨退省 vs 逃避) + Black Tourmaline(看清逃避式独处的松链) → Labradorite 帮你辨真退省，Black Tourmaline 帮你看清哪份'独处'是逃，协同 = '退而不避、独而不藏'，化解土之两面的拉扯",
  "eastern_lens": "土(清退)vs 土(暗避)的同元对立 — '闭关 retreat 清退' vs '对治内魔 isolation 避'，东方'清退与暗避、观与藏'的张力"}
PAIRS[(9,16)] = {
  "relationship_type": "causal",
  "judgment_basis": "Hermit=Earth 退省已寻得内在真光(inner truth already found) / Tower=Fire 那真光外化时崩掉虚假(structural collapse as the inner truth surfaces) → 土火相生 + 序列因果：Hermit 退省寻得的内在真，正是 Tower 用崩塌强行揭露的同一个——内在灯先亮，外结构后崩",
  "combination_story_seed": "the lantern before the lightning — Hermit's inner light meets the Tower's lightning ripping the structure open; the truth the lantern revealed in solitude is the same truth the lightning flash exposes in the world, and the collapse is the inner knowing forcing its way outward, the six-pointed star and the bolt are one illumination seen within and without",
  "synergy_logic": "Labradorite(早已寻得的内在真) + Smoky Quartz(真光外化崩塌时扎根) → Labradorite 帮你早寻得，Smoky Quartz 帮你崩时稳住，协同 = '既已寻得、崩了也站得住'，让内在真在外化崩塌时不致击垮",
  "eastern_lens": "土(内真)→火(外崩)的因果 — '闭关 retreat 内真'即 '无常崩塌所揭'的同一真，东方'内证之于未兆、外崩之于已形'的因果"}
PAIRS[(9,17)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hermit=Earth 内在寻光(inner light/guidance) / Star=Air 风暴后重连希望(guidance after storm) → 土风相克同主题 archetype(内在寻光 × 风暴后指引 共振)：两种'指引'叠加",
  "combination_story_seed": "the lantern and the still pool — Hermit's inner light meets the Star kneeling pouring water in serene renewal; the guidance sought in solitude and the guidance that returns after difficulty amplify each other, two forms of being-shown-the-way, one carried in one poured out, the six-pointed star and the eight-pointed star both light the path",
  "synergy_logic": "Labradorite(内在寻光) + Aquamarine(风暴后指引重连) → Labradorite 帮你寻内光，Aquamarine 帮你接外指引，协同 = '内光 + 外引'双重指引，共振放大被指引的信任",
  "eastern_lens": "土(内光)风(外引)的主题共振 — '闭关 retreat 内光'配 '菩提心 re-arises 外引'，东方'内光与外引、证与引'的同频"}
PAIRS[(9,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hermit=Earth 内向退省潜意识(inward subconscious exploration) / Moon=Water 潜意识迷雾(subconscious depths) → 土水相生同主题 archetype(内向退省 × 潜意识深处 共振)：两种'向内'叠加",
  "combination_story_seed": "the lantern on the howling path — Hermit's inward seeking meets the Moon's half-lit path of the depths; the solitude that explores within and the subconscious that rises in half-light amplify each other, two forms of inward descent, one with a lantern one with a reflected moon, the hermit and the crayfish both move through what lies beneath the surface",
  "synergy_logic": "Labradorite(内向退省潜意识) + Moonstone(潜意识迷雾耐受) → Labradorite 帮你向内寻，Moonstone 帮你待住深处，协同 = '向内寻 + 待深处'双轨，共振放大对潜意识的整全觉察",
  "eastern_lens": "土(内向退)水(深处潜)相生共振 — '闭关 retreat 内向退'配 '无意识深处潜'，东方'内向退与深处潜、观与潜'的同频"}
PAIRS[(9,19)] = {
  "relationship_type": "tension",
  "judgment_basis": "Hermit=Earth 内向独处(inward solitude) / Sun=Fire 外向明朗显白(outward clarity/joy) → 土火相生 + archetype 对立(内向独 vs 外向明)且难两全：退回独处还是走向明朗",
  "combination_story_seed": "the lantern before the noon sun — Hermit's solitude meets the Sun's radiant exposure; the inward seeking that needs the peak and the outward joy that needs the open field pull against each other, and the question is whether to keep seeking within or to descend into the simple clarity of shared daylight",
  "synergy_logic": "Labradorite(内向独处寻) + Sunstone(外向明朗显) → Labradorite 帮你独，Sunstone 帮你显，协同 = '独得深也敞得开'，化解内向与外向的拉扯",
  "eastern_lens": "土(内向)vs 火(外向明)的拉扯 — '闭关 retreat 内向' vs '明性 外向明朗'，东方'内向与外向、隐与显'的张力"}
PAIRS[(9,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Hermit=Earth 退省独处已寻得真(withdrawal that finds truth) / Judgment=Fire 退省后听见召呼觉醒(the call heard after introspection) → 土火相生 + 序列因果（框架代表对 Hermit×Judgement）：先独处寻真，后听见召呼——退省是觉醒召呼的前提",
  "combination_story_seed": "the lantern hears the trumpet — Hermit's solitude meets Judgment's trumpet calling figures from graves; the withdrawal that found inner light ripens into the call that must be answered, and the hermit descends the peak at the angel's trumpet, the lantern lit in solitude becomes the raised arm of the awakened, introspection is the prelude to the calling",
  "synergy_logic": "Labradorite(退省寻得内在真) + Angelite(退省后召呼听作指引) → Labradorite 帮你寻真，Angelite 帮你听召呼，协同 = '寻得真 → 听得召'，让退省落为回应召呼的觉醒",
  "eastern_lens": "土(退寻真)→火(听召呼)的因果 — '闭关 retreat 退寻真'接 '如实自省后的召呼'，东方'退寻与听召、止观与起应'的因果"}
PAIRS[(9,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hermit=Earth 退省之中段(introspection mid-journey) / World=Earth 整合完成之终段(integrated completion) → 同元素(土)+ archetype 互补(退省中段 vs 完成终段)：退省与完成互补",
  "combination_story_seed": "the lantern inside the wreath — Hermit's introspection meets the World dancer inside the completed garland; the solitude that sought inner light mid-journey and the wholeness that integrates the whole path complete each other, the lantern opens into the wreath, the hermit descends into the mandala, the six-pointed star becomes one of the four fixed signs",
  "synergy_logic": "Labradorite(退省中段) + Clear Quartz(整合完成和合) → Labradorite 帮你退省，Clear Quartz 帮你整合，协同 = '退得深也合得拢'，让退省走到完整",
  "eastern_lens": "土(退中)土(合终)同元互补 — '闭关 retreat 退中'配 '曼荼罗整合合终'，东方'退中与合终、观与圆'的和合"}

# ---- a=10 Wheel of Fortune × 11..21 ----
PAIRS[(10,11)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 循环转折非自主(cycles beyond control) / Justice=Air 诚实称量自主部分(accountability for what you control) → 风火相克 + archetype 互补(认不可控 vs 称可控)：认轮转与称自主互补",
  "combination_story_seed": "the turning wheel and the scales — Wheel's uncontrollable turning meets Justice weighing what is in your hands; the cycle that turns beyond will and the honesty that weighs your own actions complete each other, the rim and the balance, wisdom sorts what the wheel carries from what the scales weigh, fate and responsibility held together",
  "synergy_logic": "Green Aventurine(认不可控随转) + Lapis Lazuli(称可控的诚实) → Aventurine 帮你认轮转，Lapis 帮你称自主，协同 = '认得清不可控、称得准可控'，让命运感与责任感并立",
  "eastern_lens": "火(轮转)风(称量)相克互补 — '无常轮回转'配 '因果 cause-effect 称量'，东方'命与业、转与量'的和合"}
PAIRS[(10,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 动态轮转(dynamic turning) / Hanged Man=Water 静态悬停(static pause) → 水火相克 + archetype 对立互补(动转 vs 静悬)：轮转与悬停互补",
  "combination_story_seed": "the turning wheel and the inverted halo — Wheel's spinning meets the Hanged Man hanging upside down; the cycle that never stops and the surrender that stops time complete each other, the rim and the halo, the wheel needs the pause that lets you see which way it is turning, the pause serves the turning",
  "synergy_logic": "Green Aventurine(随轮转) + Selenite(悬停反转清明) → Aventurine 帮你随转，Selenite 帮你停着看清，协同 = '转得顺也停得清'，让轮转有暂停定方向",
  "eastern_lens": "火(转)水(悬)相克互补 — '无常轮回转'配 '反转视角悬'，东方'转与悬、运与止'的和合"}
PAIRS[(10,13)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Wheel=Fire 转折变化(change/turning) / Death=Water 终结转化(ending/transformation) → 水火相克同主题 archetype(转折 × 终结 共振)：两种变化叠加",
  "combination_story_seed": "the turning wheel before the pale horse — Wheel's turning meets Death's clearing; the cycle that turns phases and the transformation that ends forms amplify each other, the rim and the pale horse, two forms of change, one turns one clears, the wheel was always bound for the door death opens",
  "synergy_logic": "Green Aventurine(随转折变化) + Obsidian(诚实面对终结转化) → Aventurine 帮你随转，Obsidian 帮你面对终结，协同 = '转得顺也化得稳'，共振放大整全的变化应对",
  "eastern_lens": "火(转折)水(终结)的主题共振 — '无常轮回转折'配 '无常清场终结'，东方'转与终、运与化'的同频"}
PAIRS[(10,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 急转(turning momentum) / Temperance=Fire 慢调(patient blending) → 同元素(火)+ archetype 互补(急转 vs 慢调)：轮转之急与调和之慢互补",
  "combination_story_seed": "the turning wheel and the two cups — Wheel's momentum meets Temperance pouring slowly between two cups; the turning that asks you to ride and the blending that asks you to slow complete each other, the rim and the cups, the wheel needs the tempering or it spins you off, the cups need the wheel or nothing ever moves",
  "synergy_logic": "Green Aventurine(随轮转) + Amethyst(慢调中道) → Aventurine 帮你随转，Amethyst 帮你慢调，协同 = '转得顺也调得稳'，让轮转有调和的节奏",
  "eastern_lens": "火(急转)火(慢调)同元互补 — '无常轮回急转'配 '中道动态慢调'，东方'急与慢、转与调'的和合"}
PAIRS[(10,15)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 认循环放手(ride cycles/let go) / Devil=Earth 执念抓握(cling to attachment) → 火土相生 + archetype 对立互补(放手随转 vs 执念抓握)：放手与执念互补，正是对治",
  "combination_story_seed": "the turning wheel and the loose chains — Wheel's call to ride change meets the Devil's loose chains of attachment; the cycle that asks you to let go and the bond that asks you to hold on complete each other as opposites, the rim and the chain, the wheel teaches what the devil refuses, that what you clutch was always turning",
  "synergy_logic": "Green Aventurine(放手随转) + Black Tourmaline(看清执念松链) → Aventurine 帮你放手，Black Tourmaline 帮你看清哪条链可解，协同 = '放得手也解得链'，让放手成为对治执念的解药",
  "eastern_lens": "火(放手)土(执念)相生互补对立 — '无常轮回放手'配 '对治内魔执念'，东方'放手与执念、转与缚'的和合对治"}
PAIRS[(10,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Wheel=Fire 循环转折(turning point) / Tower=Fire 转折中的剧烈崩塌(sudden collapse within the turn) → 同元素(火)+ 阶段跃迁 archetype(平稳转折 → 那转折中有不稳则崩)：轮转触底剧烈崩塌见真，破局弧线",
  "combination_story_seed": "the turning wheel struck by lightning — Wheel's turning point meets the Tower's lightning on a structure already unsound; the cycle that was turning through ordinary change is interrupted by the sudden collapse of what was unstable, and the rim meets the crown knocked from the tower, the turning sharpens into the break that reveals what was false",
  "synergy_logic": "Green Aventurine(清明随平稳转折) + Smoky Quartz(剧烈崩塌中扎根) → Aventurine 帮你随转，Smoky Quartz 帮你崩时稳住，协同 = '转得稳也崩得住'，让轮转接得住剧烈见真",
  "eastern_lens": "火(平转)→火(崩真)的同元跃迁 — '无常轮回平转'经 '无常崩塌即清明'检验，东方'平转经崩见真'的炼金"}
PAIRS[(10,17)] = {
  "relationship_type": "causal",
  "judgment_basis": "Wheel=Fire 风暴式转折(storm-turning) / Star=Air 风暴后希望重连(renewal after the storm) → 风火相克 + 序列因果：Wheel 的风暴式转折是 Star 重连希望的前提（框架类代表对 Tower×Star 的轮转版）",
  "combination_story_seed": "the turning wheel before the still pool — Wheel's stormy turning meets the Star kneeling in serene renewal; the cycle that turned through upheaval pulls toward the pool where hope is poured back, and the rim that carried the storm is met by the eight-pointed star that follows it, what turns down turns up again into renewal",
  "synergy_logic": "Green Aventurine(随风暴转折) + Aquamarine(风暴后重连希望) → Aventurine 帮你扛转，Aquamarine 帮你转后重连，协同 = '扛得转也续得望'，让轮转有希望接得住",
  "eastern_lens": "火(风暴转)→风(望续)的因果 — '无常轮回风暴转'以 '菩提心 re-arises 望续'为果，东方'风暴转后得望续、否极泰来'的因果"}
PAIRS[(10,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Wheel=Fire 不确定循环(uncertain cycles) / Moon=Water 不确定迷雾(uncertain depths) → 水火相克同主题 archetype(不确定循环 × 不确定迷雾 共振)：两种不确定性叠加",
  "combination_story_seed": "the turning wheel on the half-lit path — Wheel's uncertain turning meets the Moon's uncertain half-light; the cycle you cannot map and the depths you cannot see amplify each other, two forms of not-knowing, one in time one in mind, the rim and the crayfish both move through what reason cannot grasp",
  "synergy_logic": "Green Aventurine(耐受不确定循环) + Moonstone(耐受不确定迷雾) → Aventurine 帮你待循环，Moonstone 帮你待迷雾，协同 = '双重耐受不确定'，共振放大对未知的整全安住",
  "eastern_lens": "火(不确定循环)水(不确定迷雾)的主题共振 — '无常轮回不确定'配 '无意识深处不确定'，东方'循环不定与迷雾不定'的同频"}
PAIRS[(10,19)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 循环有起落(cycles with ups and downs) / Sun=Fire 喜悦明朗常在(joy that endures) → 同元素(火)+ archetype 互补(起落循环 vs 常在喜悦)：循环起落与常在喜悦互补",
  "combination_story_seed": "the turning wheel under the noon sun — Wheel's up-and-down turning meets the Sun's enduring joy; the cycle that carries fortune in both directions and the vitality that stays steady through the turn complete each other, the rim and the sunflowers, joy that does not depend on which way the wheel points",
  "synergy_logic": "Green Aventurine(随起落循环) + Sunstone(守常在喜悦) → Aventurine 帮你接起落，Sunstone 帮你守常喜，协同 = '接得住起落也守得住常喜'，让循环不夺走喜悦",
  "eastern_lens": "火(起落)火(常喜)同元互补 — '无常轮回起落'配 '明性 常在喜'，东方'起落与常喜、运与常'的和合"}
PAIRS[(10,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Wheel=Fire 循环已转到底(cycle bottomed out) / Judgment=Fire 转到底后听见召呼觉醒(call heard after the turning) → 同元素(火)+ 序列因果：轮转到底是觉醒召呼的前提，否极而召",
  "combination_story_seed": "the turning wheel hears the trumpet — Wheel's bottomed-out turning meets Judgment's trumpet calling figures from graves; the cycle that turned all the way down ripens into the call that wakes the dead, and the rim meets the angel's trumpet, what the wheel buried the call resurrects, the lowest turn is the prelude to the awakening",
  "synergy_logic": "Green Aventurine(清明认轮转到底) + Angelite(转底后召呼听作指引) → Aventurine 帮你认转底，Angelite 帮你听召呼，协同 = '认得转底也听得召呼'，让轮转落为觉醒的契机",
  "eastern_lens": "火(转底)→火(应召)的同元因果 — '无常轮回转底'接 '如实自省后的召呼'，东方'否极而召、转底而应'的因果"}
PAIRS[(10,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Wheel=Fire 循环之中段(cycle mid-turn) / World=Earth 整合完成之终段(integrated completion) → 火土相生 + archetype 互补(循环中段 vs 完成终段)：轮转与完成互补",
  "combination_story_seed": "the turning wheel inside the wreath — Wheel's mid-turn meets the World dancer inside the completed garland; the cycle still turning and the wholeness that closes a cycle complete each other, the rim opens into the wreath, the four fixed signs that read books in the wheel's corners become the four at the mandala's corners, the turn finds its closure",
  "synergy_logic": "Green Aventurine(随循环中段转) + Clear Quartz(整合完成和合) → Aventurine 帮你随转，Clear Quartz 帮你合，协同 = '转得动也圆得满'，让轮转走到完成",
  "eastern_lens": "火(转中)土(合终)相生始终互补 — '无常轮回转中'配 '曼荼罗整合合终'，东方'转中与合终、运与圆'的和合"}

# ---- a=11 Justice × 12..21 ----
PAIRS[(11,12)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Justice=Air 正立理性称量(upright rational weighing) / Hanged Man=Water 倒悬反转视角(inverted new view) → 风水相生 + archetype 对立互补(正立称 vs 倒悬看)：正立称量与倒悬视角互补",
  "combination_story_seed": "the scales and the inverted halo — Justice's upright weighing meets the Hanged Man hanging upside down; the truth weighed from the standard angle and the truth seen from the inverted frame complete each other, the level balance and the halo, justice needs its inversion or it cannot see the angle it has been blind to",
  "synergy_logic": "Lapis Lazuli(正立理性称量) + Selenite(倒悬反转清明) → Lapis 帮你正着称，Selenite 帮你倒着看，协同 = '正称 + 倒看'双视角，让公正不基于盲角",
  "eastern_lens": "风(正称)水(倒看)相生互补 — '因果 cause-effect 正称'配 '反转视角倒看'，东方'正与倒、量与转'的和合"}
PAIRS[(11,13)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Justice=Air 诚实称量(weigh truth) / Death=Water 称量后该终的就终(weigh then end what must) → 风水相生 + archetype 互补(称量 vs 终结)：诚实称量与该终则终互补",
  "combination_story_seed": "the scales before the pale horse — Justice's weighing meets Death clearing what has completed; the honest assessment of what is and the transformation that ends what that assessment reveals as done complete each other, the level balance and the rising sun, you can only end well what you have weighed honestly first",
  "synergy_logic": "Lapis Lazuli(诚实称量真相) + Obsidian(诚实放掉该终的) → Lapis 帮你称，Obsidian 帮你放，协同 = '称得准也放得下'，让诚实称量落为该终则终的转化",
  "eastern_lens": "风(称)水(终)相生互补 — '因果 cause-effect 称'配 '无常清场终'，东方'称与终、量与化'的和合"}
PAIRS[(11,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Justice=Air 刚正称量(rigid weighing) / Temperance=Fire 柔和调和(soft blending) → 风火相克 + archetype 互补(刚正 vs 柔调)：刚正称量与柔和调和互补",
  "combination_story_seed": "the scales and the two cups — Justice's rigid weighing meets Temperance pouring between two cups; the truth weighed sharp and the opposites blended soft complete each other, the sword and the cups, justice needs temperance or it becomes cold verdict, temperance needs justice or it becomes mush",
  "synergy_logic": "Lapis Lazuli(刚正称量) + Amethyst(柔和调和) → Lapis 帮你称得正，Amethyst 帮你调得柔，协同 = '正得有度、柔得有则'，让公正有温度",
  "eastern_lens": "风(刚正)火(柔调)相克互补 — '因果 cause-effect 刚正'配 '中道动态柔调'，东方'刚正与柔调、量与融'的和合"}
PAIRS[(11,15)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Justice=Air 正向诚实公正(healthy honesty) / Devil=Earth 诚实的暗面—自欺(dishonesty as self-deception) → 风土相克 + 阶段跃迁 archetype(诚实公正 → 公正滑向自欺的暗面)：从'诚实称量'跌入'自欺式回避真相'暗面（shadow aspect）",
  "combination_story_seed": "the scales behind the loose chains — Justice's honesty meets the Devil's self-deception; the same truth-weighing that holds things accountable can slide into the dishonesty that avoids what the scales would show, and the sword becomes the chain, the level balance and the horned pillar are the same demand for truth seen honored and seen dodged",
  "synergy_logic": "Lapis Lazuli(清明分辨诚实 vs 自欺) + Black Tourmaline(看清自欺松链) → Lapis 帮你辨真，Black Tourmaline 帮你看清哪份'诚实'已变自欺链，协同 = '诚而不欺、正而不避'，让公正守住诚实",
  "eastern_lens": "风(正诚)→土(暗欺)的暗面跃迁 — '因果 cause-effect 正诚'阴影即 '对治内魔 自欺'，东方'正诚与暗欺、量与蔽'的 shadow 转化"}
PAIRS[(11,16)] = {
  "relationship_type": "causal",
  "judgment_basis": "Justice=Air 已称出真相(truth weighed/known) / Tower=Fire 那真相强行崩塌显形(truth forced into the open) → 风火相克 + 序列因果：Justice 称出的真相，正是 Tower 用崩塌强行揭露的同一个——称了不说，崩塌逼说",
  "combination_story_seed": "the scales before the lightning — Justice's weighed truth meets the Tower's lightning ripping it open; the truth the scales already showed is the same truth the lightning forces into the open, and the collapse is the honest verdict refused its gentle weighing, the level balance and the bolt are one reckoning seen private and seen public",
  "synergy_logic": "Lapis Lazuli(早已称出的真相) + Smoky Quartz(真相崩塌时扎根) → Lapis 帮你早称出，Smoky Quartz 帮你崩时稳住，协同 = '既已称出、崩了也站得住'，让真相在强行显形时不致击垮",
  "eastern_lens": "风(已称真)→火(崩显真)的因果 — '因果 cause-effect 已称真'即 '无常崩塌所揭'的同一真，东方'称之于微、崩之于显'的因果"}
PAIRS[(11,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Justice=Air 刚正称量(rigid truth-weighing) / Star=Air 柔信希望重连(soft hope renewal) → 同元素(风)+ archetype 互补(刚正 vs 柔信)：刚正称量与柔信希望互补",
  "combination_story_seed": "the scales and the still pool — Justice's rigid weighing meets the Star kneeling in serene renewal; the truth weighed sharp and the hope poured soft complete each other, the sword and the water, justice needs the renewal or it cannot carry what it weighs, hope needs the honesty or it becomes denial",
  "synergy_logic": "Lapis Lazuli(刚正称量) + Aquamarine(柔信希望重连) → Lapis 帮你称得正，Aquamarine 帮你柔着接，协同 = '正得有度、柔得有信'，让公正有希望托底",
  "eastern_lens": "风(刚正)风(柔信)同元互补 — '因果 cause-effect 刚正'配 '菩提心 re-arises 柔信'，东方'刚正与柔信、量与望'的和合"}
PAIRS[(11,18)] = {
  "relationship_type": "tension",
  "judgment_basis": "Justice=Air 清醒理性称量(clear rational weighing) / Moon=Water 半明不白潜意识迷雾 → 风水相济 + archetype 拉扯(清醒称量 vs 模糊未明)且难两全：清醒称量还是停在半明",
  "combination_story_seed": "the scales on the half-lit path — Justice's clear weighing meets the Moon's path under uncertain light; the truth that needs sharp evidence stands in the half-light where the crayfish rises, and the pull is whether to weigh what is visible or to wait while the murky not-yet-known surfaces from the pool",
  "synergy_logic": "Lapis Lazuli(清醒称可见) + Moonstone(耐受半明迷雾) → Lapis 帮你称可见的，Moonstone 帮你待未明，协同 = '可见处称、未明处待'，化解称量与迷雾的拉扯",
  "eastern_lens": "风(清称)vs 水(晦潜)的拉扯 — '因果 cause-effect 清称' vs '无意识深处迷雾'，东方'清与晦、称与待'的张力"}
PAIRS[(11,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Justice=Air 诚实公正之明(honest clarity) / Sun=Fire 喜悦明朗之明(joyful clarity) → 风火相克同主题 archetype(诚实之明 × 喜悦之明 共振)：两种明朗叠加",
  "combination_story_seed": "the scales under the noon sun — Justice's honest clarity meets the Sun's radiant clarity; the truth weighed sharp and the joy lived bright amplify each other, the sword and the sunflowers, two forms of lucidity, one honest one joyful, justice shines when it is carried into the open daylight of simple joy",
  "synergy_logic": "Lapis Lazuli(诚实公正之明) + Sunstone(喜悦明朗之明) → Lapis 帮你明真，Sunstone 帮你明喜，协同 = '明真 + 明喜'双重明朗，共振放大整全的清明",
  "eastern_lens": "风(诚明)火(喜明)的主题共振 — '因果 cause-effect 诚明'配 '明性 喜明'，东方'诚明与喜明'的同频"}
PAIRS[(11,20)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Justice=Air 诚实自省称量(honest self-reckoning) / Judgment=Fire 听召前的诚实自省(reckoning before the call) → 风火相克同主题 archetype(诚实称量 × 诚实自省 共振)：两种'诚实面对自己'叠加",
  "combination_story_seed": "the scales hear the trumpet — Justice's honest weighing meets Judgment's reckoning before the call; the truth weighed on the scales and the honest self-assessment that precedes rebirth amplify each other, two forms of reckoning, one legal one spiritual, the sword and the trumpet both call for what is honest",
  "synergy_logic": "Lapis Lazuli(诚实称量) + Angelite(诚实自省听作指引) → Lapis 帮你称，Angelite 帮你自省，协同 = '称得准也省得诚'，共振放大整全的诚实面对",
  "eastern_lens": "风(诚称)火(诚省)的主题共振 — '因果 cause-effect 诚称'配 '如实自省后的召呼'，东方'诚称与诚省、量与省'的同频"}
PAIRS[(11,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Justice=Air 诚实称量之中段(weighing mid-journey) / World=Earth 整合完成之终段(integrated completion) → 风土相克 + archetype 互补(称量中段 vs 完成终段)：称量与完成互补",
  "combination_story_seed": "the scales inside the wreath — Justice's weighing meets the World dancer inside the completed garland; the honest assessment mid-journey and the wholeness that integrates the whole path complete each other, the level balance opens into the wreath, the sword becomes the four fixed signs, the reckoning was always bound for the mandala of completion",
  "synergy_logic": "Lapis Lazuli(称量中段) + Clear Quartz(整合完成和合) → Lapis 帮你称，Clear Quartz 帮你合，协同 = '称得准也圆得满'，让称量走到完整",
  "eastern_lens": "风(称)土(成)相克始终互补 — '因果 cause-effect 称'配 '曼荼罗整合成'，东方'称与成、量与圆'的和合"}

# ---- a=12 The Hanged Man × 13..21 ----
PAIRS[(12,13)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hanged Man=Water 自愿悬停换视角(willing pause for new view) / Death=Water 悬停后该放的就放(transformation after the pause) → 同元素(水)+ 阶段跃迁 archetype(悬停反转 → 反转后清场)：从'倒悬看清'升华到'看清后放掉该放的'",
  "combination_story_seed": "the inverted halo before the pale horse — Hanged Man's willing pause meets Death clearing what has completed; the upside-down view that revealed what was stuck is met by the transformation that ends it, and the halo bows to the rising sun between two towers, the new angle becomes the release, the surrender ripens into the letting go",
  "synergy_logic": "Selenite(悬停反转看清) + Obsidian(看清后诚实放掉) → Selenite 帮你看清，Obsidian 帮你放，协同 = '看得清也放得下'，让悬停升级为'有观有化'的转化",
  "eastern_lens": "水(悬观)→水(化放)的同元跃迁 — '反转视角悬观'接 '无常清场化放'，东方'悬观与化放、止与化'的升华"}
PAIRS[(12,14)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hanged Man=Water 极静悬停(extreme still pause) / Temperance=Fire 动态调和(dynamic blending) → 水火相克 + archetype 对立互补(极静悬 vs 动态调)：极悬停与动态调和互补",
  "combination_story_seed": "the inverted halo and the two cups — Hanged Man's extreme pause meets Temperance pouring between two cups; the surrender that holds the inverted frame and the active blending that holds opposites in motion complete each other, the halo and the cups, the pause serves the blending, the blending carries the insight of the pause",
  "synergy_logic": "Selenite(极静悬停清明) + Amethyst(动态调和两端) → Selenite 帮你悬清，Amethyst 帮你调动，协同 = '悬得清也调得动'，让悬停与调和互为节奏",
  "eastern_lens": "水(极悬)火(动调)相克互补 — '反转视角极悬'配 '中道动态调'，东方'极悬与动调、止与融'的和合"}
PAIRS[(12,15)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hanged Man=Water 清明自愿悬停(clear willing pause) / Devil=Earth 自欺式逃避停滞(stalling as avoidance) → 水土相克 + archetype 对立互补(清明悬停 vs 自欺停滞)：清明悬停与自欺停滞互补，正是对治",
  "combination_story_seed": "the inverted halo behind the loose chains — Hanged Man's willing pause meets the Devil's stalling; the surrender that serves insight and the stalling that wears patience as identity are opposites, the halo and the horned pillar, an invitation to ask whether the pause is serving insight or hiding indecision, the inversion that frees versus the stuckness that binds",
  "synergy_logic": "Selenite(清明分辨悬停 vs 停滞) + Black Tourmaline(看清逃避式停滞松链) → Selenite 帮你辨真悬，Black Tourmaline 帮你看清哪份'停'是逃，协同 = '悬而不滞、停而不藏'，让悬停不滑向逃避",
  "eastern_lens": "水(清悬)vs 土(暗滞)的对立互补对治 — '反转视角清悬' vs '对治内魔 stalling 暗滞'，东方'清悬与暗滞、观与藏'的对治"}
PAIRS[(12,16)] = {
  "relationship_type": "causal",
  "judgment_basis": "Hanged Man=Water 悬停已看清真相(truth seen in the pause) / Tower=Fire 那真相外化时崩掉虚假(structural collapse as the seen truth surfaces) → 水火相克 + 序列因果：悬停看清的内在真，正是 Tower 崩塌揭露的同一个——看清不说，崩塌逼显",
  "combination_story_seed": "the inverted halo before the lightning — Hanged Man's seen truth meets the Tower's lightning ripping the structure open; the truth the upside-down view revealed is the same truth the lightning forces into the open, and the collapse is the inverted insight refused its quiet release, the halo and the bolt are one revelation seen within and without",
  "synergy_logic": "Selenite(早已看清的内在真) + Smoky Quartz(真相崩塌时扎根) → Selenite 帮你早看清，Smoky Quartz 帮你崩时稳住，协同 = '既已看清、崩了也站得住'，让悬停之真在外化崩塌时不致击垮",
  "eastern_lens": "水(已看清)→火(崩显真)的因果 — '反转视角已看清'即 '无常崩塌所揭'的同一真，东方'观之于未兆、崩之于已形'的因果"}
PAIRS[(12,17)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hanged Man=Water 悬停反转视角(inverted view) / Star=Air 风暴后希望重连(renewal/hope) → 水风相生 + archetype 互补(反转视角 vs 柔信希望)：反转看清与柔信希望互补",
  "combination_story_seed": "the inverted halo and the still pool — Hanged Man's inverted view meets the Star kneeling in serene renewal; the new angle that freed the frame and the hope that returns after difficulty complete each other, the halo and the eight-pointed star, the pause needs the renewal or it stalls, the renewal needs the new view or it repeats the old",
  "synergy_logic": "Selenite(反转视角看清) + Aquamarine(柔信希望重连) → Selenite 帮你看清新角度，Aquamarine 帮你柔着重连希望，协同 = '看得清也接得稳'，让悬停之见有希望接得住",
  "eastern_lens": "水(反转观)风(柔信望)相生互补 — '反转视角观'配 '菩提心 re-arises 柔信望'，东方'反转观与柔信望、止与续'的和合"}
PAIRS[(12,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Hanged Man=Water 悬停见潜意识之隐(pause to see what is hidden) / Moon=Water 潜意识迷雾(subconscious depths) → 同元素(水)+ 同主题 archetype(悬停见隐 × 潜意识深处 共振)：两种'向内见隐'叠加",
  "combination_story_seed": "the inverted halo on the howling path — Hanged Man's pause meets the Moon's half-lit depths; the inversion that reveals what the upright frame hides and the subconscious that surfaces in half-light amplify each other, two forms of inward seeing, one inverted one reflected, the halo and the crayfish both bring up what lay beneath",
  "synergy_logic": "Selenite(悬停见隐) + Moonstone(潜意识迷雾耐受) → Selenite 帮你悬着见隐，Moonstone 帮你待住深处，协同 = '悬见 + 深待'双轨，共振放大对潜意识的整全觉察",
  "eastern_lens": "水(悬见隐)水(深处潜)同元共振 — '反转视角悬见隐'配 '无意识深处潜'，东方'悬见与深潜、观与潜'的同频"}
PAIRS[(12,19)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hanged Man=Water 内向悬停(inward pause) / Sun=Fire 外向明朗显白(outward clarity) → 水火相克 + archetype 对立互补(内向悬停 vs 外向明朗)：悬停与明朗互补",
  "combination_story_seed": "the inverted halo before the noon sun — Hanged Man's inward pause meets the Sun's radiant exposure; the surrender that needs the inverted quiet and the joy that needs the open field complete each other, the halo and the sunflowers, the pause serves the daylight, the daylight carries the insight of the pause",
  "synergy_logic": "Selenite(内向悬停清明) + Sunstone(外向明朗显) → Selenite 帮你悬，Sunstone 帮你显，协同 = '悬得清也敞得开'，让悬停与明朗互为节奏",
  "eastern_lens": "水(内向悬)vs 火(外向明)的对立互补 — '反转视角内向悬' vs '明性 外向明朗'，东方'内向悬与外向明、止与显'的和合"}
PAIRS[(12,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Hanged Man=Water 臣服悬停换视角(surrender/perspective shift) / Judgment=Fire 听召觉醒回应(larger awakening) → 水火相克 + 阶段跃迁 archetype(臣服悬停 → 臣服后觉醒召呼)（框架代表对 Hanged Man×Judgement）：从'倒悬臣服看清'升华到'觉醒回应更大召呼'",
  "combination_story_seed": "the inverted halo hears the trumpet — Hanged Man's surrender meets Judgment's trumpet calling figures from graves; the willing inversion that changed the view ripens into the call that must be answered, and the halo turns upright at the angel's trumpet, the surrendered figure rises to answer what the pause revealed, perspective shift becomes awakening",
  "synergy_logic": "Selenite(臣服悬停看清) + Angelite(觉醒召呼听作指引) → Selenite 帮你悬清，Angelite 帮你听召，协同 = '悬得清 → 听得召'，让臣服升级为回应召呼的觉醒",
  "eastern_lens": "水(臣服悬)→火(觉醒召)的跃迁 — '反转视角臣服悬'接 '如实自省后的召呼'，东方'臣服悬与觉醒召、止观与起应'的升华"}
PAIRS[(12,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Hanged Man=Water 悬停反转之中段(pause mid-journey) / World=Earth 整合完成之终段(integrated completion) → 水土相克 + archetype 互补(悬停中段 vs 完成终段)：悬停与完成互补",
  "combination_story_seed": "the inverted halo inside the wreath — Hanged Man's pause meets the World dancer inside the completed garland; the inversion that freed the view mid-journey and the wholeness that integrates the whole path complete each other, the halo opens into the wreath, the inverted figure becomes the upright dancer, the surrendered view becomes the integrated whole",
  "synergy_logic": "Selenite(悬停反转中段) + Clear Quartz(整合完成和合) → Selenite 帮你悬，Clear Quartz 帮你合，协同 = '悬得清也圆得满'，让悬停走到完整",
  "eastern_lens": "水(悬中)土(合终)相克始终互补 — '反转视角悬中'配 '曼荼罗整合合终'，东方'悬中与合终、观与圆'的和合"}

# ---- a=13 Death × 14..21 ----
PAIRS[(13,14)] = {
  "relationship_type": "causal",
  "judgment_basis": "Death=Water 终结清场(clear the completed form) / Temperance=Fire 清场后慢慢调和重建(blending after the clearing) → 水火相克 + 序列因果：Death 的清场是 Temperance 慢调和重建的前提，先死而后和",
  "combination_story_seed": "the pale horse and the two cups — Death's clearing meets Temperance pouring slowly between two cups; the ending that emptied the old form is met by the patient blending that builds something new from what remains, and the rising sun between two towers meets the path to the crown of light, what died becomes the material for what is slowly mixed back to life",
  "synergy_logic": "Obsidian(诚实清场放掉旧) + Amethyst(清场后慢调重建) → Obsidian 帮你清，Amethyst 帮你重建，协同 = '清得净也建得稳'，让终结落为慢调和的新生",
  "eastern_lens": "水(清场)→火(调和重建)的因果 — '无常清场'以 '中道动态调和重建'为果，东方'死而后和、清而后调'的因果"}
PAIRS[(13,15)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Death=Water 诚实终结真转化(honest ending/transformation) / Devil=Earth 自欺式拒绝终结(resistance to ending as attachment) → 水土相克 + archetype 对立互补(诚实终 vs 自欺拒终)：诚实终结与自欺拒终互补，正是对治",
  "combination_story_seed": "the pale horse and the loose chains — Death's honest ending meets the Devil's refusal to let go; the transformation that ends what has completed and the attachment that keeps it alive by force are opposites, the rising sun and the horned pillar, an invitation to ask whether what is being kept is alive or only chained, death as release versus the devil as bondage",
  "synergy_logic": "Obsidian(诚实面对该终的) + Black Tourmaline(看清拒终式执念松链) → Obsidian 帮你面对终，Black Tourmaline 帮你看清哪份'不舍'是链，协同 = '终得诚也放得下'，让终结不被执念拖成 stagnation",
  "eastern_lens": "水(诚终)vs 土(拒终执)的对立互补对治 — '无常清场诚终' vs '对治内魔 拒终执'，东方'诚终与拒终、化与缚'的对治"}
PAIRS[(13,16)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Death=Water 渐进终结(gradual ending/transformation) / Tower=Fire 突然剧烈崩塌(sudden violent collapse) → 水火相克同主题 archetype(渐进终结 × 突然崩塌 共振)：两种'结构性的结束'叠加",
  "combination_story_seed": "the pale horse under the lightning — Death's gradual transformation meets the Tower's sudden collapse; the slow ending and the violent break amplify each other, two forms of structural finish, one that clears one that shatters, the rising sun between two towers meets the crown knocked from the tower top, what was ending anyway is forced into the open",
  "synergy_logic": "Obsidian(诚实面对渐进终结) + Smoky Quartz(突然崩塌中扎根) → Obsidian 帮你面对终，Smoky Quartz 帮你崩时稳住，协同 = '终得稳也崩得住'，共振放大整全的'结束应对'",
  "eastern_lens": "水(渐终)火(突崩)的主题共振 — '无常清场渐终'配 '无常崩塌突崩'，东方'渐终与突崩、化与破'的同频"}
PAIRS[(13,17)] = {
  "relationship_type": "causal",
  "judgment_basis": "Death=Water 结束清场(ending/clearing) / Star=Air 结束后希望重连(renewal after the ending) → 水风相生 + 序列因果：Death 的清场是 Star 重连希望的前提，先死后望（框架类代表对 Death×Sun 的希望版）",
  "combination_story_seed": "the pale horse before the still pool — Death's clearing meets the Star kneeling in serene renewal; the ending that emptied the form is met by the hope that returns, and the rising sun between two towers meets the eight-pointed star above the pool, what death cleared the star now fills, the ending is the doorway the renewal walks through",
  "synergy_logic": "Obsidian(诚实清场放掉旧) + Aquamarine(结束后重连希望之水) → Obsidian 帮你放旧，Aquamarine 帮你重连新望，协同 = '放得下也接得稳'，让终结落为希望的新生",
  "eastern_lens": "水(清终)→风(望续)的因果 — '无常清场清终'以 '菩提心 re-arises 望续'为果，东方'死而后望、终而后续'的因果"}
PAIRS[(13,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Death=Water 结束转化深层(transformation/depth) / Moon=Water 潜意识深层(subconscious depths) → 同元素(水)+ 同主题 archetype(深层转化 × 深层潜意识 共振)：两种'深层'叠加",
  "combination_story_seed": "the pale horse on the howling path — Death's transformation meets the Moon's deep subconscious; the ending that works at the root and the depths that surface in half-light amplify each other, two forms of depth, one of life-cycle one of mind, the rising sun and the crayfish both bring up what lay beneath",
  "synergy_logic": "Obsidian(诚实面对深层转化) + Moonstone(深层潜意识耐受) → Obsidian 帮你化深层，Moonstone 帮你待深处，协同 = '化得深也待得稳'，共振放大对深层转化的整全应对",
  "eastern_lens": "水(深转)水(深潜)同元共振 — '无常清场深转'配 '无意识深处深潜'，东方'深转与深潜、化与潜'的同频"}
PAIRS[(13,19)] = {
  "relationship_type": "causal",
  "judgment_basis": "Death=Water 结束清场(ending/clearing) / Sun=Fire 结束后重生的喜悦(rebirth into joy) → 水火相克 + 序列因果（框架代表对 Death×Sun）：Death 的结束是 Sun 重生喜悦的前提，先死后生，凤凰叙事",
  "combination_story_seed": "the pale horse before the noon sun — Death's clearing meets the Sun's radiant rebirth; the ending that made space is met by the joy that fills the space, and the rising sun between two towers meets the bright sun overhead, the phoenix narrative, what ends makes room for radiance, death is the prelude to the sun",
  "synergy_logic": "Obsidian(诚实清场放掉旧) + Sunstone(结束后重生喜悦活力) → Obsidian 帮你放旧，Sunstone 帮你迎新喜，协同 = '放得下也活得喜'，让终结落为重生的喜悦",
  "eastern_lens": "水(清终)→火(重生喜)的因果 — '无常清场清终'以 '明性 重生喜'为果，东方'死而后生、终而后喜'的因果（凤凰叙事）"}
PAIRS[(13,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Death=Water 结束旧形态(end old form) / Judgment=Fire 结束后觉醒召呼(awakening/call after the end) → 水火相克 + 序列因果：Death 的终结是 Judgment 觉醒召呼的前提，旧形不死则召不闻",
  "combination_story_seed": "the pale horse hears the trumpet — Death's ending meets Judgment's trumpet calling figures from graves; the old form that ended is exactly what needed to die for the call to be heard, and the rising sun between two towers meets the angel's trumpet, the cleared ground is where the figures rise, death is the threshold of the awakening",
  "synergy_logic": "Obsidian(诚实终结旧形态) + Angelite(终结后觉醒召呼听作指引) → Obsidian 帮你终旧，Angelite 帮你听召，协同 = '终得旧 → 听得召'，让终结落为觉醒召呼的契机",
  "eastern_lens": "水(终旧)→火(觉召)的因果 — '无常清场终旧'接 '如实自省后的召呼'，东方'终旧与觉召、死与起'的因果"}
PAIRS[(13,21)] = {
  "relationship_type": "causal",
  "judgment_basis": "Death=Water 结束清场(end of a phase) / World=Earth 该 phase 整合完成(integrated completion of the phase) → 水土相克 + 序列因果：Death 的结束是 World 完成的最后一步，先死后圆",
  "combination_story_seed": "the pale horse inside the wreath — Death's ending meets the World dancer inside the completed garland; the ending that closed the form is met by the wholeness that integrates the whole cycle, and the rising sun between two towers meets the green wreath, death is the last clearing before the mandala closes, every ending is the threshold of the world",
  "synergy_logic": "Obsidian(诚实清场收尾) + Clear Quartz(整合完成和合) → Obsidian 帮你收尾，Clear Quartz 帮你合拢，协同 = '收得净也圆得满'，让终结落为完成的最后一步",
  "eastern_lens": "水(终)→土(圆)的因果 — '无常清场终'接 '曼荼罗整合圆'，东方'终与圆、化与成'的因果"}

# =========================================================================
# 批 5（最后）：a=14 Temperance / a=15 Devil / a=16 Tower / a=17 Star /
#              a=18 Moon / a=19 Sun / a=20 Judgment
# =========================================================================
# ---- a=14 Temperance × 15..21 ----
PAIRS[(14,15)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Temperance=Fire 慢调和中道(patient blending/middle) / Devil=Earth 极端执念(extreme attachment) → 火土相生 + archetype 对立互补(慢调 vs 极执)：中道调和与极端执念互补，正是对治",
  "combination_story_seed": "the two cups before the loose chains — Temperance's slow blending meets the Devil's extreme attachment; the middle way that holds opposites and the bondage that clings to one pole are opposites, the cups and the horned pillar, the patience that blends is the antidote to the attachment that cannot let either cup go",
  "synergy_logic": "Amethyst(慢调中道) + Black Tourmaline(看清极端执念松链) → Amethyst 帮你调中道，Black Tourmaline 帮你看清哪端是执链，协同 = '调得中也解得链'，让调和成为对治执念的解药",
  "eastern_lens": "火(中调)vs 土(极执)的对立互补对治 — '中道动态调' vs '对治内魔 极执'，东方'中调与极执、和与缚'的对治"}
PAIRS[(14,16)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Temperance=Fire 慢调和稳(patient blending) / Tower=Fire 突然剧烈崩塌(sudden collapse) → 同元素(火)+ archetype 对立互补(慢调稳 vs 突然崩)：调和与崩塌互补",
  "combination_story_seed": "the two cups struck by lightning — Temperance's slow blending meets the Tower's sudden collapse; the patience that holds the middle and the break that shatters the structure complete each other, the cups and the bolt, the middle way is tested by the lightning, the collapse is met by the blending that rebuilds",
  "synergy_logic": "Amethyst(慢调中道) + Smoky Quartz(突然崩塌中扎根) → Amethyst 帮你调，Smoky Quartz 帮你崩时稳住，协同 = '调得稳也崩得住'，让调和接得住崩塌",
  "eastern_lens": "火(慢调)vs 火(突崩)的同元对立互补 — '中道动态慢调' vs '无常崩塌突崩'，东方'慢调与突崩、和与破'的和合"}
PAIRS[(14,17)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Temperance=Fire 调和 renewal(blending renewal) / Star=Air 风暴后 renewal(renewal after storm) → 风火相克同主题 archetype(调和 renewal × 希望 renewal 共振)：两种 renewal 叠加",
  "combination_story_seed": "the two cups and the still pool — Temperance's blending meets the Star kneeling pouring water in serene renewal; the patient mixing and the serene hope amplify each other, two forms of renewal, one blended one poured, the cups and the eight-pointed star, the middle way ripens into the steady hope",
  "synergy_logic": "Amethyst(调和 renewal) + Aquamarine(希望 renewal 之水) → Amethyst 帮你慢调，Aquamarine 帮你重连希望，协同 = '调得稳也望得续'，共振放大整全的 renewal",
  "eastern_lens": "火(调和 renewal)风(希望 renewal)的主题共振 — '中道动态调和 renewal'配 '菩提心 re-arises 希望 renewal'，东方'调和续与希望续'的同频"}
PAIRS[(14,18)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Temperance=Fire 清醒慢调和(clear blending) / Moon=Water 半明不白潜意识迷雾 → 水火相克 + archetype 拉扯(清醒调和 vs 模糊未明)且难两全：清醒调和还是停在半明",
  "combination_story_seed": "the two cups on the half-lit path — Temperance's clear blending meets the Moon's path under uncertain light; the patience that mixes what is visible stands in the half-light where the crayfish rises, and the pull is whether to keep blending what you can see or to wait while the murky not-yet-known surfaces",
  "synergy_logic": "Amethyst(清醒慢调) + Moonstone(耐受半明迷雾) → Amethyst 帮你调可见的，Moonstone 帮你待未明，协同 = '可见处调、未明处待'，化解调和与迷雾的拉扯",
  "eastern_lens": "火(清调)vs 水(晦潜)的拉扯 — '中道动态清调' vs '无意识深处迷雾'，东方'清与晦、调与待'的张力"}
PAIRS[(14,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Temperance=Fire 调和之平衡(balance/blending) / Sun=Fire 喜悦明朗(balance/joy) → 同元素(火)+ 同主题 archetype(调和之平 × 喜悦之明 共振)：两种平衡叠加",
  "combination_story_seed": "the two cups under the noon sun — Temperance's balanced blending meets the Sun's radiant joy; the middle way that holds opposites and the simple vitality of being alive amplify each other, the cups and the sunflowers, two forms of well-being, one balanced one joyful, the path to the crown of light meets the bright sun overhead",
  "synergy_logic": "Amethyst(调和之平) + Sunstone(喜悦之明活力) → Amethyst 帮你调得平，Sunstone 帮你活得喜，协同 = '平得稳也喜得明'，共振放大整全的安康",
  "eastern_lens": "火(调平)火(喜明)同元共振 — '中道动态调平'配 '明性 喜明'，东方'调平与喜明、和与乐'的同频"}
PAIRS[(14,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Temperance=Fire 世俗慢调和(earthly blending) / Judgment=Fire 听召回应更大生命(call to larger life) → 同元素(火)+ 阶段跃迁 archetype(世俗调和 → 调和升华为回应召呼)：从'慢调和两端'升华到'回应更大召呼'",
  "combination_story_seed": "the two cups hear the trumpet — Temperance's earthly blending meets Judgment's trumpet calling figures from graves; the patient middle way is met by a calling larger than any balance of opposites, and the cups turn toward the angel's trumpet, the blended life rises to answer something beyond the two poles it was holding",
  "synergy_logic": "Amethyst(清明世俗调和) + Angelite(更大召呼听作指引) → Amethyst 帮你调两端，Angelite 帮你听更高召呼，协同 = '调得中也应得高'，让调和升级为回应召呼的活平衡",
  "eastern_lens": "火(世调)→火(应召)的同元跃迁 — '中道动态世调'接 '如实自省后的更高召呼'，东方'世调与应召、和与应'的升华"}
PAIRS[(14,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Temperance=Fire 调和之中段(blending mid-journey) / World=Earth 整合完成之终段(integrated completion) → 火土相生 + archetype 互补(调和中段 vs 完成终段)：调和与完成互补",
  "combination_story_seed": "the two cups inside the wreath — Temperance's blending meets the World dancer inside the completed garland; the patient mixing mid-journey and the wholeness that integrates the whole path complete each other, the cups open into the wreath, the path to the crown of light meets the green garland, the blending was always bound for the mandala",
  "synergy_logic": "Amethyst(调和中段) + Clear Quartz(整合完成和合) → Amethyst 帮你调，Clear Quartz 帮你合，协同 = '调得稳也圆得满'，让调和走到完整",
  "eastern_lens": "火(调中)土(合终)相生始终互补 — '中道动态调中'配 '曼荼罗整合合终'，东方'调中与合终、和与圆'的和合"}

# ---- a=15 The Devil × 16..21 ----
PAIRS[(15,16)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Devil=Earth 执念束缚执(attachment/bondage) / Tower=Fire 执念结构崩塌(bondage structure collapses) → 土火相生 + 阶段跃迁 archetype(执念 → 执念结构被雷击崩)（框架代表对 Devil×Tower）：执念触底崩塌见真，构成破局弧线（shadow aspect 口径）",
  "combination_story_seed": "the loose chains struck by lightning — Devil's bondage meets the Tower's lightning on a structure already unsound; the attachment that felt solid is shattered, and what falls reveals the chains were loose all along, the horned pillar and the crown knocked from the tower, the collapse is the liberation the devil's figures refused to take, the breaking that frees",
  "synergy_logic": "Black Tourmaline(看清执念松链) + Smoky Quartz(执念崩塌中扎根重自由) → Black Tourmaline 帮你看清链松，Smoky Quartz 帮你崩后稳稳自由，协同 = '看得清松链 + 崩后稳自由'，让执念触底崩塌落为解脱",
  "eastern_lens": "土(执)→火(崩解)的跃迁 — '对治内魔执'经 '无常崩塌即清明'破执，东方'执念经崩而解、缚经破而脱'的炼金（shadow aspect）"}
PAIRS[(15,17)] = {
  "relationship_type": "causal",
  "judgment_basis": "Devil=Earth 执念束缚(attachment/bondage) / Star=Air 执念解脱后重连希望(liberation then renewal) → 土风相克 + 序列因果：Devil 的执念被看清解脱，是 Star 重连希望的前提——链松了才有空手接星光",
  "combination_story_seed": "the loose chains before the still pool — Devil's loosened bondage meets the Star kneeling in serene renewal; the attachment just seen through opens onto the pool where hope is poured back, and the chains lifted meet the eight-pointed star, what was bound is now free to receive, the liberation is the doorway the renewal walks through",
  "synergy_logic": "Black Tourmaline(看清执念松链解脱) + Aquamarine(解脱后重连希望) → Black Tourmaline 帮你解链，Aquamarine 帮你接望，协同 = '解得链也接得望'，让执念解脱落为希望重连",
  "eastern_lens": "土(执解)→风(望续)的因果 — '对治内魔执解'以 '菩提心 re-arises 望续'为果，东方'解缚而后得望、脱执而后续'的因果"}
PAIRS[(15,18)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Devil=Earth 阴影执念(shadow/attachment) / Moon=Water 潜意识迷雾(subconscious depths) → 土水相克同主题 archetype(阴影执 × 潜意识深 共振)：两种'向暗处'叠加（shadow aspect 口径）",
  "combination_story_seed": "the loose chains on the howling path — Devil's shadow meets the Moon's deep subconscious; the attachment that lives in shadow and the depths that surface in half-light amplify each other, two forms of the dark, one of bondage one of mind, the horned pillar and the crayfish both bring up what was disowned, the shadow-work that the moon illuminates",
  "synergy_logic": "Black Tourmaline(面对阴影执念) + Moonstone(潜意识深处耐受) → Black Tourmaline 帮你直面阴影，Moonstone 帮你待住深处，协同 = '直面阴影 + 待住深处'双轨 shadow work，共振放大对暗处的整全觉察",
  "eastern_lens": "土(阴影执)水(深处潜)的主题共振 — '对治内魔 阴影执'配 '无意识深处 潜'，东方'阴影执与深处潜、暗与暗'的同频（shadow aspect）"}
PAIRS[(15,19)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Devil=Earth 执念阴影之暗(attachment shadow) / Sun=Fire 喜悦明朗之明(joyful clarity) → 土火相生 + archetype 对立互补(阴影暗 vs 明朗明)：阴影与明朗互补，光照见影",
  "combination_story_seed": "the loose chains under the noon sun — Devil's shadow meets the Sun's radiant exposure; the attachment that lives in shadow and the joy that lives in full light complete each other, the horned pillar and the sunflowers, the sun illuminates the chains that were hidden, what was shadowed is brought into the simple clarity of daylight",
  "synergy_logic": "Black Tourmaline(面对阴影执念) + Sunstone(明朗喜悦之光) → Black Tourmaline 帮你直面阴影，Sunstone 帮你带光，协同 = '直面阴影 + 带光入暗'，让明朗照亮执念",
  "eastern_lens": "土(阴影暗)vs 火(明朗明)的对立互补 — '对治内魔 阴影暗' vs '明性 明朗明'，东方'阴影暗与明朗明、暗与明'的和合"}
PAIRS[(15,20)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Devil=Earth 执念束缚(attachment/bondage) / Judgment=Fire 执念解脱后觉醒召呼(liberation then awakening) → 土火相生 + 阶段跃迁 archetype(执念 → 执念解脱后觉醒召呼)：从'看清执念'升华到'解脱后觉醒回应更大召呼'（shadow aspect 口径）",
  "combination_story_seed": "the loose chains hear the trumpet — Devil's bondage meets Judgment's trumpet calling figures from graves; the attachment just seen through ripens into the call that must be answered, and the chains lifted meet the angel's trumpet, the figures that were chained rise at the call, the liberation becomes the awakening, what was bound is now free to answer",
  "synergy_logic": "Black Tourmaline(看清执念松链) + Angelite(解脱后觉醒召呼听作指引) → Black Tourmaline 帮你解链，Angelite 帮你听召，协同 = '解得链 → 听得召'，让执念解脱升级为觉醒召呼",
  "eastern_lens": "土(执)→火(觉醒召)的跃迁 — '对治内魔 执'接 '如实自省后的召呼'，东方'解执而后觉醒、脱缚而后应召'的升华（shadow aspect）"}
PAIRS[(15,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Devil=Earth 执念之中段(attachment mid-journey) / World=Earth 整合完成之全(integrated completion) → 同元素(土)+ archetype 对立互补(执念中段 vs 整合完成)：执念与整合互补，整合含摄阴影",
  "combination_story_seed": "the loose chains inside the wreath — Devil's attachment meets the World dancer inside the completed garland; the bondage mid-journey and the wholeness that integrates everything, shadow included, complete each other, the chains are woven into the wreath, the horned pillar becomes one of the four fixed signs, true integration includes the shadow it once carried",
  "synergy_logic": "Black Tourmaline(面对执念阴影) + Clear Quartz(整合含摄阴影的和合) → Black Tourmaline 帮你面对阴影，Clear Quartz 帮你把它整合进全，协同 = '面对得也整合得拢'，让整合含摄阴影而非排斥",
  "eastern_lens": "土(执)土(整合全)同元对立互补 — '对治内魔 执'配 '曼荼罗整合全'，东方'执念与整合全、暗与圆'的和合"}

# ---- a=16 The Tower × 17..21 ----
PAIRS[(16,17)] = {
  "relationship_type": "causal",
  "judgment_basis": "Tower=Fire 突然崩塌(sudden collapse) / Star=Air 崩塌后希望重连(renewal after the collapse) → 风火相克 + 序列因果（框架代表对 Tower×Star）：Tower 的崩塌是 Star 重连希望的前提，先崩后望",
  "combination_story_seed": "the lightning before the still pool — Tower's collapse meets the Star kneeling in serene renewal; the structure that fell is met by the hope that returns, and the crown knocked from the tower meets the eight-pointed star above the pool, what the lightning broke the star now mends, the collapse is the doorway the renewal walks through, the storm is the prelude to the calm",
  "synergy_logic": "Smoky Quartz(崩塌中扎根) + Aquamarine(崩塌后重连希望) → Smoky Quartz 帮你崩时稳，Aquamarine 帮你崩后接望，协同 = '崩得住也接得望'，让崩塌落为希望的新生",
  "eastern_lens": "火(崩)→风(望续)的因果 — '无常崩塌'以 '菩提心 re-arises 望续'为果，东方'崩而后望、破而后续'的因果"}
PAIRS[(16,18)] = {
  "relationship_type": "transformation",
  "judgment_basis": "Tower=Fire 突然剧烈显形(sudden revelation) / Moon=Water 缓慢潜意识显形(slow subconscious surfacing) → 水火相克 + 阶段跃迁 archetype(突然显真 → 缓慢潜意识显真)：从'雷击式显形'转入'潜意识缓慢显形'",
  "combination_story_seed": "the lightning on the howling path — Tower's sudden revelation meets the Moon's slow subconscious surfacing; the truth that arrived in a flash is followed by the murky depths that surface at their own pace, and the bolt and the crayfish are two forms of what-was-hidden coming to light, one violent one gradual, the collapse opens onto the half-lit path",
  "synergy_logic": "Smoky Quartz(突然显形时扎根) + Moonstone(缓慢潜意识显形耐受) → Smoky Quartz 帮你扛突然，Moonstone 帮你待缓慢，协同 = '扛得突然也待得缓慢'，让显形从剧烈转入耐受",
  "eastern_lens": "火(突显)→水(缓显)的跃迁 — '无常崩塌突显'接 '无意识深处缓显'，东方'突显与缓显、破与潜'的转化"}
PAIRS[(16,19)] = {
  "relationship_type": "causal",
  "judgment_basis": "Tower=Fire 突然崩塌见真(collapse reveals truth) / Sun=Fire 崩塌见真后重生的喜悦(rebirth into joy) → 同元素(火)+ 序列因果：Tower 的崩塌见真是 Sun 重生喜悦的前提，先崩后喜",
  "combination_story_seed": "the lightning before the noon sun — Tower's collapse meets the Sun's radiant rebirth; the structure that fell to reveal truth is met by the joy that fills the cleared ground, and the crown knocked from the tower meets the bright sun overhead, what collapsed makes room for radiance, the lightning is the prelude to the noon, truth then joy",
  "synergy_logic": "Smoky Quartz(崩塌见真时扎根) + Sunstone(见真后重生喜悦) → Smoky Quartz 帮你崩时稳，Sunstone 帮你崩后喜，协同 = '崩得稳也喜得真'，让崩塌见真落为重生的喜悦",
  "eastern_lens": "火(崩真)→火(重生喜)的同元因果 — '无常崩塌崩真'以 '明性 重生喜'为果，东方'崩而后喜、破而后乐'的因果"}
PAIRS[(16,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Tower=Fire 崩塌见真(collapse/reckoning) / Judgment=Fire 崩塌后觉醒召呼(awakening after the reckoning) → 同元素(火)+ 序列因果：Tower 的崩塌见真是 Judgment 觉醒召呼的前提，崩后才听得见召呼",
  "combination_story_seed": "the lightning hears the trumpet — Tower's collapse meets Judgment's trumpet calling figures from graves; the structure that fell to reveal truth is met by the call that the cleared ground makes audible, and the bolt meets the angel's trumpet, what the lightning broke open the call now fills with meaning, the reckoning is the prelude to the awakening",
  "synergy_logic": "Smoky Quartz(崩塌见真时扎根) + Angelite(崩塌后觉醒召呼听作指引) → Smoky Quartz 帮你崩时稳，Angelite 帮你崩后听召，协同 = '崩得稳 → 听得召'，让崩塌见真落为觉醒召呼",
  "eastern_lens": "火(崩真)→火(觉醒召)的同元因果 — '无常崩塌崩真'接 '如实自省后的召呼'，东方'崩而后觉、破而后应'的因果"}
PAIRS[(16,21)] = {
  "relationship_type": "causal",
  "judgment_basis": "Tower=Fire 崩塌清场(collapse/clearing) / World=Earth 崩塌后该 cycle 完成(integrated completion) → 火土相生 + 序列因果：Tower 的崩塌清场是 World 完成的关键一步，崩后才圆",
  "combination_story_seed": "the lightning inside the wreath — Tower's collapse meets the World dancer inside the completed garland; the structure that fell to clear the ground is met by the wholeness that integrates the cycle, and the crown knocked from the tower is woven into the green wreath, what collapsed makes the completion possible, the lightning is the last clearing before the mandala closes",
  "synergy_logic": "Smoky Quartz(崩塌清场时扎根) + Clear Quartz(清场后整合完成和合) → Smoky Quartz 帮你崩时稳，Clear Quartz 帮你崩后合，协同 = '崩得稳也圆得满'，让崩塌落为完成的最后清场",
  "eastern_lens": "火(崩清)→土(圆成)的因果 — '无常崩塌崩清'接 '曼荼罗整合圆成'，东方'崩而后圆、破而后成'的因果"}

# ---- a=17 The Star × 18..21 ----
PAIRS[(17,18)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Star=Air 风暴后清明希望(serene hope/renewal) / Moon=Water 半明不白潜意识迷雾 → 风水相生 + archetype 互补(清明希望 vs 模糊迷雾)：清明希望与潜意识迷雾互补",
  "combination_story_seed": "the still pool on the howling path — Star's serene hope meets the Moon's uncertain depths; the renewal that pours clear water and the subconscious that churns in half-light complete each other, the eight-pointed star and the crayfish, hope needs to honor the murky depths or it becomes denial, the depths need the hope or they become despair",
  "synergy_logic": "Aquamarine(清明希望重连) + Moonstone(潜意识迷雾耐受) → Aquamarine 帮你守清明希望，Moonstone 帮你待潜意识迷雾，协同 = '守得清明望、待得深处雾'，让希望不脱离对潜意识的耐受",
  "eastern_lens": "风(清明望)水(深处潜)相生互补 — '菩提心 re-arises 清明望'配 '无意识深处 潜'，东方'清明望与深处潜、续与潜'的和合"}
PAIRS[(17,19)] = {
  "relationship_type": "amplifying",
  "judgment_basis": "Star=Air 风暴后希望 renewal(hope/renewal) / Sun=Fire 喜悦明朗 vitality(joy/vitality) → 风火相克同主题 archetype(希望 renewal × 喜悦 vitality 共振)：两种光明叠加（框架代表对 Sun×Star 的希望版）",
  "combination_story_seed": "the still pool under the noon sun — Star's renewal meets the Sun's radiant joy; the hope that returns after difficulty and the simple vitality of being alive amplify each other, the eight-pointed star and the bright sun overhead, two forms of light, one hoped for one simply lived, renewal ripens into open joy",
  "synergy_logic": "Aquamarine(希望 renewal 之水) + Sunstone(喜悦 vitality 之光) → Aquamarine 帮你续望，Sunstone 帮你享喜，协同 = '续望 + 享喜'双重光明，共振放大整全的明朗",
  "eastern_lens": "风(希望 renewal)火(喜悦 vitality)的主题共振 — '菩提心 re-arises 希望 renewal'配 '明性 喜悦 vitality'，东方'希望续与喜悦活'的同频"}
PAIRS[(17,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Star=Air 风暴后重连意义(reconnect to meaning after storm) / Judgment=Fire 重连后听见更大召呼(call heard after reconnection) → 风火相克 + 序列因果：Star 的重连希望是 Judgment 听见召呼的前提，先续望后听召",
  "combination_story_seed": "the still pool hears the trumpet — Star's renewal meets Judgment's trumpet calling figures from graves; the hope that returned after the storm ripens into the call that must be answered, and the eight-pointed star meets the angel's trumpet, the renewed spirit rises to answer what the hope was always pointing toward, renewal is the prelude to the calling",
  "synergy_logic": "Aquamarine(重连希望意义) + Angelite(重连后召呼听作指引) → Aquamarine 帮你续望，Angelite 帮你听召，协同 = '续得望 → 听得召'，让希望重连落为回应召呼",
  "eastern_lens": "风(续望)→火(听召)的因果 — '菩提心 re-arises 续望'接 '如实自省后的召呼'，东方'续望而后听召、续而后应'的因果"}
PAIRS[(17,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Star=Air 希望之中段(hope mid-journey) / World=Earth 整合完成之终段(integrated completion) → 风土相克 + archetype 互补(希望中段 vs 完成终段)：希望与完成互补",
  "combination_story_seed": "the still pool inside the wreath — Star's hope meets the World dancer inside the completed garland; the renewal mid-journey and the wholeness that integrates the whole path complete each other, the eight-pointed star opens into the wreath, the pouring water becomes the green garland, the hope was always bound for the mandala",
  "synergy_logic": "Aquamarine(希望中段) + Clear Quartz(整合完成和合) → Aquamarine 帮你守望，Clear Quartz 帮你合，协同 = '守得望也圆得满'，让希望走到完整",
  "eastern_lens": "风(望中)土(合终)相克始终互补 — '菩提心 re-arises 望中'配 '曼荼罗整合合终'，东方'望中与合终、续与圆'的和合"}

# ---- a=18 The Moon × 19..21 ----
PAIRS[(18,19)] = {
  "relationship_type": "tension",
  "judgment_basis": "Moon=Water 半明不白潜意识迷雾(subconscious/illusion) / Sun=Fire 喜悦明朗显白(clarity/joy) → 水火相克 + archetype 直接对立(潜意识迷雾 vs 显意识明朗)且难两全（框架代表对 Moon×Sun）：停在迷雾还是走向明朗",
  "combination_story_seed": "the howling path before the noon sun — Moon's uncertain depths meet the Sun's radiant clarity; the subconscious that churns in half-light and the simple clarity of full day pull against each other, the crayfish and the sunflowers, and the question is whether to stay with the not-yet-clear or to step into the open joy of what can finally be seen",
  "synergy_logic": "Moonstone(耐受潜意识迷雾) + Sunstone(走向喜悦明朗) → Moonstone 帮你待迷雾，Sunstone 帮你走向明朗，协同 = '待得住雾也走得向明'，化解潜意识与显意识的拉扯",
  "eastern_lens": "水(晦潜)vs 火(明朗)的对立 — '无意识深处 晦潜' vs '明性 明朗'，东方'晦与明、潜与显'的张力"}
PAIRS[(18,20)] = {
  "relationship_type": "causal",
  "judgment_basis": "Moon=Water 潜意识缓慢显形(slow subconscious surfacing) / Judgment=Fire 显形后觉醒召呼(awakening after surfacing) → 水火相克 + 序列因果：Moon 的潜意识显形是 Judgment 觉醒召呼的前提，潜出后听召",
  "combination_story_seed": "the howling path hears the trumpet — Moon's surfacing depths meet Judgment's trumpet calling figures from graves; what rose from the subconscious in half-light ripens into the call that must be answered, and the crayfish and the dog and wolf meet the angel's trumpet, the murky depths that surfaced become the cleared ground where the figures rise, surfacing is the prelude to the awakening",
  "synergy_logic": "Moonstone(潜意识缓慢显形耐受) + Angelite(显形后召呼听作指引) → Moonstone 帮你待显形，Angelite 帮你听召，协同 = '待得显形 → 听得召'，让潜意识显形落为觉醒召呼",
  "eastern_lens": "水(潜显)→火(听召)的因果 — '无意识深处 潜显'接 '如实自省后的召呼'，东方'潜显而后听召、潜而后应'的因果"}
PAIRS[(18,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Moon=Water 潜意识之中段(subconscious mid-journey) / World=Earth 整合完成之全(integrated completion) → 水土相克 + archetype 互补(潜意识中段 vs 整合完成全)：潜意识与整合全互补，整合含摄潜意识",
  "combination_story_seed": "the howling path inside the wreath — Moon's subconscious meets the World dancer inside the completed garland; the murky depths mid-journey and the wholeness that integrates everything, depths included, complete each other, the crayfish and the dog and wolf are woven into the green wreath, the two towers become two of the four fixed signs, true integration includes what surfaced from the dark",
  "synergy_logic": "Moonstone(潜意识中段耐受) + Clear Quartz(整合含摄潜意识的全) → Moonstone 帮你待潜意识，Clear Quartz 帮你把它整合进全，协同 = '待得住也整合得拢'，让整合含摄潜意识而非排斥",
  "eastern_lens": "水(潜)土(整合全)相克互补 — '无意识深处 潜'配 '曼荼罗整合全'，东方'潜与整合全、暗与圆'的和合"}

# ---- a=19 The Sun × 20..21 ----
PAIRS[(19,20)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Sun=Fire 喜悦明朗之活(joyful living) / Judgment=Fire 听召回应更大生命(call to larger life) → 同元素(火)+ archetype 互补(单纯喜活 vs 回应召呼)：单纯喜活与回应召呼互补",
  "combination_story_seed": "the noon sun hears the trumpet — Sun's joyful living meets Judgment's trumpet calling figures from graves; the simple vitality of being alive is met by a calling larger than personal joy, and the sunflowers turn toward the angel's trumpet, the radiant life rises to answer something beyond its own enjoyment, joy finds its larger purpose",
  "synergy_logic": "Sunstone(喜悦明朗之活) + Angelite(更大召呼听作指引) → Sunstone 帮你享单纯活，Angelite 帮你听更大召呼，协同 = '享得单纯活 + 应得更大召'，让喜悦找到更大的目的",
  "eastern_lens": "火(喜活)火(应召)同元互补 — '明性 喜活'配 '如实自省后的召呼'，东方'喜活与应召、乐与应'的和合"}
PAIRS[(19,21)] = {
  "relationship_type": "complementary",
  "judgment_basis": "Sun=Fire 喜悦之中段(joy mid-journey) / World=Earth 整合完成之终段(integrated completion) → 火土相生 + archetype 互补(喜悦中段 vs 完成终段)：喜悦与完成互补",
  "combination_story_seed": "the noon sun inside the wreath — Sun's joy meets the World dancer inside the completed garland; the vitality mid-journey and the wholeness that integrates the whole path complete each other, the sunflowers open into the wreath, the bright sun meets the green garland, the joy was always bound for the mandala, the dance in the sun becomes the dance in the wreath",
  "synergy_logic": "Sunstone(喜悦中段) + Clear Quartz(整合完成和合) → Sunstone 帮你享喜中段，Clear Quartz 帮你合终段，协同 = '享得喜也圆得满'，让喜悦走到完整",
  "eastern_lens": "火(喜中)土(合终)相生始终互补 — '明性 喜中'配 '曼荼罗整合合终'，东方'喜中与合终、乐与圆'的和合"}

# ---- a=20 Judgment × 21 ----
PAIRS[(20,21)] = {
  "relationship_type": "causal",
  "judgment_basis": "Judgment=Fire 觉醒召呼回应(awakening/call answered) / World=Earth 回应召呼后该 cycle 完成(integrated completion after the call) → 火土相生 + 序列因果：Judgment 的觉醒召呼是 World 完成的关键一步，应召后才圆",
  "combination_story_seed": "the trumpet inside the wreath — Judgment's call meets the World dancer inside the completed garland; the awakening that answered the call is met by the wholeness that integrates the whole cycle, and the angel's trumpet and the rising figures meet the green wreath, what was awakened is now complete, the call was the last threshold before the mandala closes, every rebirth opens onto the world",
  "synergy_logic": "Angelite(觉醒召呼听作指引) + Clear Quartz(应召后整合完成和合) → Angelite 帮你应召，Clear Quartz 帮你合，协同 = '应得召也圆得满'，让觉醒召呼落为完成的最后一步",
  "eastern_lens": "火(应召)→土(圆成)的因果 — '如实自省后的召呼'接 '曼荼罗整合圆成'，东方'应召而后圆成、觉而后圆'的因果"}

print("全部录入完成, 总对数:", len(PAIRS))

# =========================================================================
# 组装输出 + json.dump
# =========================================================================
import itertools
# 验证：231 对全覆盖且无重复
all_expected = [(a,b) for a in range(22) for b in range(a+1,22)]
missing = [p for p in all_expected if p not in PAIRS]
extra   = [p for p in PAIRS if p not in all_expected]
assert not missing, f"缺失对({len(missing)}): {missing[:10]}..."
assert not extra,   f"多余对({len(extra)}): {extra[:10]}..."
assert len(PAIRS)==231, f"总对数={len(PAIRS)} 应=231"

pairs_out = []
for (a_num, b_num) in sorted(PAIRS.keys()):
    A, B = CARDS[a_num], CARDS[b_num]
    d = PAIRS[(a_num,b_num)]
    pairs_out.append({
        "card_a": {"slug": A["slug"], "number": a_num},
        "card_b": {"slug": B["slug"], "number": b_num},
        "pair_slug": f"{A['slug']}-and-{B['slug']}",
        "relationship_type": d["relationship_type"],
        "judgment_basis": d["judgment_basis"],
        "combination_story_seed": d["combination_story_seed"],
        "crystal_synergy": {
            "a": {"slug": A["cslug"], "name": A["cname"]},
            "b": {"slug": B["cslug"], "name": B["cname"]},
            "logic": d["synergy_logic"],
        },
        "eastern_lens": d["eastern_lens"],
    })

# 关系类型分布统计
from collections import Counter
dist = Counter(p["relationship_type"] for p in pairs_out)

out = {
    "_meta": {
        "purpose": "22 Major Arcana 两两配对关系判定 config（231 对）",
        "framework": "模板-Tarot-配对文章框架.md（§3 互动叙事 / §5 关系类型 5 类 / §6 双水晶协同）",
        "data_source": "07-互动工具/_shared/tarot-knowledge.json（22 牌 element/archetype/crystals.best_overall）",
        "total_pairs": 231,
        "relationship_type_distribution": dict(dist),
        "rules": "牌号升序去重(a<b); relationship_type 5 类每对必属其一; combination_story_seed 禁三段拼接写两牌化学反应; crystal_synergy 写协同逻辑非并列; shadow 类组合用 shadow aspect 口径禁 bad omen/curse/evil",
    },
    "relationship_type_legend": {
        "complementary": "互补：互补 element(火/水 风/土)+对立互补 archetype(始/终 做/收 父/母)，阴阳和合拼成完整图景",
        "amplifying": "强化：同 element 或同主题 archetype，共振放大能量叠加",
        "tension": "冲突：对立 archetype + 用户难两全，拉扯抉择",
        "causal": "因果：序列关系，一张是另一张的因或果(时间先后)",
        "transformation": "转化：阶段跃迁 archetype，蜕变升华构成转变弧线",
    },
    "pairs": pairs_out,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("\n=== 生成完成 ===")
print("文件:", OUT)
import os as _os
print("字节数:", _os.path.getsize(OUT))
print("总对数:", len(pairs_out))
print("关系类型分布:")
for k in ["complementary","amplifying","tension","causal","transformation"]:
    print(f"  {k}: {dist[k]} 对")
print("\n抽样3对不同类型:")
samples = [("the-fool","the-world"),("the-lovers","the-devil"),("death","the-sun")]
for sa, sb in samples:
    p = next(x for x in pairs_out if x["card_a"]["slug"]==sa and x["card_b"]["slug"]==sb)
    print(f"\n  [{p['relationship_type']}] {p['card_a']['slug']} × {p['card_b']['slug']}")
    print(f"  pair_slug: {p['pair_slug']}")
    print(f"  basis: {p['judgment_basis'][:90]}...")
    print(f"  seed:  {p['combination_story_seed'][:110]}...")
    print(f"  synergy.a={p['crystal_synergy']['a']['name']} b={p['crystal_synergy']['b']['name']}")
    print(f"  synergy.logic: {p['crystal_synergy']['logic'][:80]}...")
    print(f"  eastern: {p['eastern_lens'][:80]}...")
