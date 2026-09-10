# -*- coding: utf-8 -*-
"""rosetoys fishnet-lingerie (term 258) SKU 深修计划生成器
16 个 publish SKU, 输出 plan_deepfish.json (结构与第一波 plan_deepfix.json 一致)
"""
import json, re

def wc(html):
    return len(re.sub(r"<[^>]+>", " ", html).split())

P = []

def add(pid, old, new, note, short, desc, tkd_t, tkd_d, changed=True):
    P.append({"id": pid, "old_name": old, "new_name": new, "name_changed": changed,
              "title_note": note, "short": short, "desc": desc,
              "tkd_title": tkd_t, "tkd_desc": tkd_d})

# 1. 21590
add(21590,
 "Christmas-style golden-edged fishnet lingerie",
 "Gold-Trim Christmas Fishnet Lingerie Set",
 "Christmas-Style→Christmas; golden-edged→Gold-Trim(自然化); 补 Set(参数 hat+jumpsuit+mesh socks 三件属实); 剥风格连字符噪音",
 "Three-piece Christmas fishnet set — gold-trim jumpsuit, matching hat, and mesh socks — in sheer breathable polyester. One size for 40–65 kg.",
 "<p>Christmas mornings deserve better than plain red cotton, and this fishnet set was made for exactly that occasion. It arrives as a full three-piece: a gold-trimmed fishnet jumpsuit, a matching hat, and a pair of mesh socks — everything the holiday look needs, in one package.</p>\n<p>The net itself is sheer and breathable polyester, the kind of open weave that reads as decoration rather than coverage. Gold trim runs along the edges, catching tree lights and candle glow in a way flat red fabric never manages. Wear the full set for the season's photo moments, or split the pieces — the socks work under everyday outfits long after December ends.</p>\n<p>Fast facts:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Set includes:</strong> jumpsuit, hat, mesh socks (3 pieces)</li>\n<li><strong>Features:</strong> sheer, breathable open mesh</li>\n<li><strong>Detail:</strong> gold trim edges</li>\n<li><strong>Size:</strong> one size, recommended for 40–65 kg (about 88–143 lb)</li>\n</ul>\n<p>One box, one holiday outfit — solved before the eggnog is poured.</p>",
 "Gold-Trim Christmas Fishnet Lingerie Set | RoseToys",
 "Gold-trim Christmas fishnet lingerie set with jumpsuit, hat and mesh socks. Sheer breathable polyester, one size for 40-65kg. Shop RoseToys.")

# 2. 21561
add(21561,
 "Erotic lingerie jacquard sexy colorful mesh",
 "Iridescent Jacquard Fishnet Bodystocking",
 "剥 Erotic lingerie jacquard sexy colorful 机翻堆词; 保留 jacquard(提花属实); iridescent(参数 Color) 上标题; netsuit→bodystocking 标准词",
 "Full iridescent jacquard fishnet bodystocking in stretch polyamide — one sheer net suit that shifts color as it catches the light. One size for 40–70 kg.",
 "<p>Mesh that reads as texture rather than coverage is the whole idea behind iridescent net — and this bodystocking commits to it from shoulder to thigh. The jacquard knit builds a pattern directly into the mesh, and the polyamide yarn throws an iridescent shimmer that shifts as the light moves. Under a phone flash it lands closer to oil-slick; under warm lamps it goes soft pearl.</p>\n<p>As a one-piece net suit, it settles the entire outfit question in a single step: no top to match, no briefs to find, no styling decisions left over. The stretch in the polyamide keeps the net close to the body without digging in, and the sheer weave stays breathable through a full night of wear.</p>\n<p>The color does the talking here — it photographs differently from every angle, which is exactly the point.</p>\n<p>The breakdown:</p>\n<ul>\n<li><strong>Material:</strong> polyamide (stretch)</li>\n<li><strong>Type:</strong> one-piece net suit</li>\n<li><strong>Net:</strong> jacquard-pattern fishnet</li>\n<li><strong>Color:</strong> iridescent</li>\n<li><strong>Size:</strong> one size, recommended for 40–70 kg (about 88–154 lb)</li>\n</ul>",
 "Iridescent Jacquard Fishnet Bodystocking | RoseToys",
 "Iridescent jacquard fishnet bodystocking in stretch polyamide. One-piece net suit that shifts color in the light, one size 40-70kg. Shop RoseToys.")

# 3. 21549
add(21549,
 "Pure lust lace slip nightdress",
 "Lace Slip Nightdress with Mesh Pants",
 "剥 Pure lust(「纯欲」直译); 保留 slip nightdress 品类(title 语义); 参数 jumpsuit+mesh pants 与 title 冲突,保守取 title 品类词+参数部件词 mesh pants 上标题",
 "Sheer lace slip nightdress with matching mesh pants — a soft two-piece lingerie set in picture color, one size for 40–60 kg.",
 "<p>One layer of lace can carry an entire evening — and this set adds a matching pant to finish the look. It pairs a sheer lace slip nightdress with mesh pants, so the two halves of the look arrive together instead of being hunted down separately.</p>\n<p>The slip cut skims rather than clings: thin straps, a soft drape through the body, and lace that shows skin in the way only open weave can. The mesh pants match the weight of the top, which keeps the set reading as deliberate — bedroom lighting does the rest.</p>\n<p>Color is as pictured, and the one-size cut is drafted for 40–60 kg. It is the kind of set that works for a slow evening in as easily as for a planned occasion.</p>\n<p>What the set includes:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Includes:</strong> slip nightdress + mesh pants</li>\n<li><strong>Features:</strong> sheer mesh</li>\n<li><strong>Color:</strong> as pictured</li>\n<li><strong>Size:</strong> one size, recommended for 40–60 kg (about 88–132 lb)</li>\n</ul>",
 "Lace Slip Nightdress with Mesh Pants | RoseToys",
 "Sheer lace slip nightdress with matching mesh pants. Soft two-piece lingerie set, one size for 40-60kg. Shop lingerie at RoseToys.")

# 4. 21544
add(21544,
 "Christmas Elk Fishnet Lingerie Set",
 "Red Christmas Reindeer Fishnet Lingerie Set",
 "Elk→Reindeer(圣诞驯鹿语义修正,elk=麋鹿误译); 补 Red(参数 Color=Red 属实); 其余保留",
 "Red Christmas reindeer fishnet lingerie set in sheer polyester mesh — holiday red, one size for 40–65 kg, made for festive nights.",
 "<p>Holiday lingerie has one job: be memorable by the tree. This fishnet set handles it in seasonal red, with a reindeer motif worked into the sheer mesh so the theme shows up from across the room, not just on close inspection.</p>\n<p>The set is cut from polyester net — lightweight, open, and quick to warm up to body temperature — in the shade of red that reads unmistakably as Christmas without tipping into costume-aisle loud. It layers under a robe for the gift-opening hour, then stands on its own once the evening thins out. Red mesh also layers well over black or nude basics if the night calls for a little more coverage on paper than in person.</p>\n<p>At a glance:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> lingerie set</li>\n<li><strong>Theme:</strong> Christmas, reindeer motif</li>\n<li><strong>Color:</strong> red</li>\n<li><strong>Size:</strong> one size, recommended for 40–65 kg (about 88–143 lb)</li>\n</ul>\n<p>Festive, sheer, and one less thing to coordinate in December.</p>",
 "Red Christmas Reindeer Fishnet Lingerie Set | RoseToys",
 "Red Christmas reindeer fishnet lingerie set in sheer polyester mesh. Holiday-themed, one size for 40-65kg. Shop festive lingerie at RoseToys.")

# 5. 21533
add(21533,
 "Open-gear-free jumpie stockings large size cutout see-through mesh stockings",
 "Open-Crotch Sheer Lace Bodystocking",
 "「开档」机译 Open-gear-free→Open-Crotch(裆误译为gear); jumpie→bodystocking(连体袜标准词); 剥 large size(40-60kg 参数非大码,无法确证); cutout/see-through→Sheer+cut-out lace pattern",
 "Open-crotch sheer lace bodystocking — one-piece mesh in picture color, made to stay on all night. One size for 40–60 kg.",
 "<p>An open-crotch cut sounds blunt in a listing and makes complete sense on the body: the bodystocking stays on from the first look to the last, and nothing has to be unlaced, unhooked, or peeled away midway.</p>\n<p>The rest of the piece is sheer lace in a one-piece mesh cut — cut-out patterning across the body, skin visible through the open weave, with enough stretch in the fabric to move the way you do. The cut-out pattern does the styling work on its own, so there is nothing to build around it — it arrives as the whole look. The original listing called this a no-undressing stocking piece, and that is genuinely the selling point: it is built to be worn, not removed.</p>\n<p>Color is as pictured, and the one-size cut is drafted for 40–60 kg.</p>\n<p>Specs in short:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Type:</strong> one-piece mesh bodystocking</li>\n<li><strong>Features:</strong> open crotch, cut-out lace pattern</li>\n<li><strong>Color:</strong> as pictured</li>\n<li><strong>Size:</strong> one size, recommended for 40–60 kg (about 88–132 lb)</li>\n</ul>",
 "Open-Crotch Sheer Lace Bodystocking | RoseToys",
 "Open-crotch sheer lace bodystocking in one-piece mesh with cut-out pattern. Made to stay on all night, one size for 40-60kg. Shop RoseToys.")

# 6. 21518
add(21518,
 "Elk-style one-piece fishnet lingerie set",
 "Sheer Reindeer Fishnet Lingerie Set",
 "Elk-style→Reindeer(驯鹿语义修正); one-piece 与 A SET 参数冲突剥除; 补 Sheer(参数 sheer breathable); 与 21544 用 Sheer/Red 区分近似款",
 "Sheer reindeer fishnet lingerie set in breathable polyester mesh — holiday motif, one size for 40–65 kg, made for Christmas-season nights.",
 "<p>December dressing, at least the fun kind, leans into the season instead of ignoring it. This set does exactly that: sheer fishnet lingerie with a reindeer motif running through the mesh — holiday-themed without being a full costume.</p>\n<p>The polyester net is graded sheer and breathable, so it wears lighter than it photographs. That openness is what makes the motif legible: the reindeer pattern shows against skin instead of getting lost in dense fabric. As a set, it covers the look in one purchase — pull it on and the seasonal box is ticked.</p>\n<p>Where it lands between costume and everyday lingerie is up to the styling; the set itself works both ways. Either way, the net weighs close to nothing, which matters for a piece that may not stay on for the whole evening.</p>\n<p>Here is the full spec:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> lingerie set</li>\n<li><strong>Features:</strong> sheer, breathable mesh</li>\n<li><strong>Motif:</strong> reindeer, holiday theme</li>\n<li><strong>Size:</strong> one size, recommended for 40–65 kg (about 88–143 lb)</li>\n</ul>",
 "Sheer Reindeer Fishnet Lingerie Set | RoseToys",
 "Sheer reindeer fishnet lingerie set in breathable polyester mesh. Holiday motif, one size for 40-65kg. Shop festive lingerie online.")

# 7. 21499
add(21499,
 "Erotic mesh bandeau open crotch one-piece",
 "Black Open-Crotch Mesh Bandeau Teddy",
 "语序机翻改自然英文; one-piece full mesh→Teddy(连体三角标准词); 补 Black(参数); bandeau/open crotch 属实保留",
 "Black open-crotch mesh teddy with a strapless bandeau top — sheer stretch lace in one piece, one size for 40–70 kg.",
 "<p>A bandeau top and an open crotch, on one piece of stretch mesh, do their talking without straps or ties. This black teddy is the full-mesh version of that idea: the bandeau front holds its line across the bust, and the sheer lace net continues down over the torso and hips without interruption.</p>\n<p>The one-piece cut is what makes it practical — nothing to match, nothing to adjust, and the open crotch means nothing has to come off later in the evening. Black mesh under bedroom lighting is about as forgiving as lingerie gets, on every skin tone and from every angle. The bandeau line also means no strap shadows across the shoulders in photos — a small thing that shows up in every shot.</p>\n<p>The rundown:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Type:</strong> one-piece teddy, full mesh</li>\n<li><strong>Top:</strong> bandeau (strapless)</li>\n<li><strong>Features:</strong> open crotch, sheer</li>\n<li><strong>Color:</strong> black</li>\n<li><strong>Size:</strong> one size, recommended for 40–70 kg (about 88–154 lb)</li>\n</ul>",
 "Black Open-Crotch Mesh Bandeau Teddy | RoseToys",
 "Black open-crotch mesh teddy with strapless bandeau top. One-piece sheer stretch lace, one size 40-70kg. Shop lingerie at RoseToys.")

# 8. 21489
add(21489,
 "Patterned one-piece mesh",
 "Patterned Sheer Mesh Bodysuit",
 "原名 19 字符过短; one-piece mesh→Bodysuit(clothing only 单衣标准词); 补 Patterned(原图案)+Sheer(参数 see-through); 与 21485 用 Patterned/Plain 区分同参数款",
 "Patterned sheer mesh bodysuit in see-through breathable polyester — a single clothing piece with allover pattern, one size for 40–75 kg.",
 "<p>Pattern is what separates one mesh piece from the next, and this bodysuit carries its pattern in the weave itself — a motif worked through the sheer net so the design shows against skin rather than sitting on top of the fabric.</p>\n<p>The base is see-through, breathable polyester: an open weave that ventilates as it reveals, cut as a single bodysuit with no separates to coordinate. The weight is light enough to forget it is on. Wear it as the base layer under a slip dress or an open shirt, or on its own when the point is the pattern.</p>\n<p>Sold as clothing only — one piece, no stockings or accessories attached.</p>\n<p>Quick specs:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> bodysuit, clothing only</li>\n<li><strong>Features:</strong> see-through, breathable</li>\n<li><strong>Pattern:</strong> allover motif</li>\n<li><strong>Size:</strong> one size, recommended for 40–75 kg (about 88–165 lb)</li>\n</ul>\n<p>A plain net bodysuit disappears into an outfit; this one gives the outfit somewhere to start.</p>",
 "Patterned Sheer Mesh Bodysuit | RoseToys",
 "Patterned sheer mesh bodysuit in see-through breathable polyester. One-piece clothing with allover pattern, one size for 40-75kg.")

# 9. 21485
add(21485,
 "One-piece mesh",
 "Sheer Mesh Bodysuit",
 "原名 14 字符过短; one-piece mesh→Bodysuit; 补 Sheer(参数 see-through breathable); 素网无图案,与 21489 Patterned 款区分",
 "Sheer mesh bodysuit in see-through breathable polyester — a plain one-piece layering base, clothing only, one size for 40–75 kg.",
 "<p>Plain mesh is the white t-shirt of the lingerie drawer: it goes with everything and never argues. This bodysuit is that piece in its purest form — a single sheer net garment with no pattern, no trim, nothing but open weave and cut.</p>\n<p>The see-through polyester keeps it breathable through long wear, and the one-piece bodysuit shape means it layers flat under slip dresses, skirts, or open shirts without bunching at the waist. Solo, it is a full statement with the minimum of material involved. It is also the piece that makes the pieces around it read louder: mesh under lace, mesh under leather, mesh under an oversized shirt.</p>\n<p>Clothing only — one piece, sized generously through its one-size draft.</p>\n<p>What you are getting:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> bodysuit, clothing only</li>\n<li><strong>Features:</strong> see-through, breathable</li>\n<li><strong>Net:</strong> plain, no pattern</li>\n<li><strong>Size:</strong> one size, recommended for 40–75 kg (about 88–165 lb)</li>\n</ul>\n<p>Every lingerie collection ends up needing one of these; this is the one.</p>",
 "Sheer Mesh Bodysuit | RoseToys",
 "Sheer mesh bodysuit in see-through breathable polyester. Plain one-piece base for layering or wearing solo, one size 40-75kg.")

# 10. 21442
add(21442,
 "Open European and American erotic underwear mesh three-point one-piece one-piece",
 "Black Sheer Mesh Teddy",
 "剥 European and American(「欧美」直译风格噪音)/three-point(「三点式」直译,无对应英文货架词)/重复 one-piece; Full set of mesh clothing→Teddy; 补 Black(参数); open 语义不明(疑「开放风」)剥除",
 "Black sheer mesh teddy in one-piece stretch lace — a minimal full-mesh cut that bares and covers in equal measure. One size for 40–70 kg.",
 "<p>A teddy earns its drawer space by solving the outfit in a single piece, and this black mesh version keeps the solution as minimal as the material allows. One layer of sheer stretch lace, one seam line, done — there is no trim, no hardware, and nothing between the net and the eye.</p>\n<p>The full-mesh cut covers the whole frame while hiding very little of it, which is the particular trade a black teddy offers. The lace has enough give to fit a wide one-size range without sagging, and the black colorway does what black lingerie does under low light: flatters everything it touches. For a piece this bare, the simplicity is the design brief.</p>\n<p>The details, in plain terms:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Type:</strong> one-piece teddy, full mesh</li>\n<li><strong>Features:</strong> sheer mesh</li>\n<li><strong>Color:</strong> black</li>\n<li><strong>Size:</strong> one size, recommended for 40–70 kg (about 88–154 lb)</li>\n</ul>\n<p>Minimum fabric, maximum effect — the oldest trick in lingerie, still working.</p>",
 "Black Sheer Mesh Teddy | RoseToys",
 "Black sheer mesh teddy in one-piece stretch lace. Minimal full-mesh lingerie, one size for 40-70kg. In stock at RoseToys.")

# 11. 21412
add(21412,
 "Funny lingerie Playboy Bunny sling mesh coat",
 "Sheer Bunny Mesh Costume Set with Headpiece",
 "Funny lingerie(「情趣」误译为funny)剥除; Playboy(商标词)剥除; sling(「吊带」直译)与 coat(连体参数不符)剥除; 参数 jumpsuit+headwear+hand sleeves→Costume Set with Headpiece; Bunny 保留(造型语义)",
 "Sheer bunny costume set — mesh jumpsuit, headpiece, and hand sleeves in breathable polyester. One size, chest 70–120 cm, for 40–60 kg.",
 "<p>A bunny costume lives or dies by its headpiece, and this set ships with one. The full character call: a mesh jumpsuit as the base, plus the two pieces that sell the character — a headpiece and matching hand sleeves.</p>\n<p>The jumpsuit is polyester net, sheer and stretchy, drafted with a generous one-size fit that spans a 70–120 cm chest and 60–90 cm waist (about 28–47 in and 24–35 in). The headpiece sets the silhouette the moment it goes on, and the hand sleeves complete the pose — together they turn a mesh bodysuit into a costume with almost no extra fabric.</p>\n<p>Wear it for costume parties, themed nights, or the private version of both. The whole set packs smaller than a folded shirt.</p>\n<p>The full listing includes:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Includes:</strong> mesh jumpsuit, headpiece, hand sleeves (3 pieces)</li>\n<li><strong>Features:</strong> sheer mesh</li>\n<li><strong>Fit:</strong> chest 70–120 cm, waist 60–90 cm</li>\n<li><strong>Size:</strong> one size, recommended for 40–60 kg (about 88–132 lb)</li>\n</ul>",
 "Sheer Bunny Mesh Costume Set with Headpiece | RoseToys",
 "Sheer bunny mesh costume set with headpiece and hand sleeves. Stretch polyester, one size for 40-60kg. Shop costume lingerie.")

# 12. 21398
add(21398,
 "Lace seductive and sexy lingerie with drawstring opening jumpsuit",
 "Black Lace Jumpsuit with Drawstring Opening",
 "剥 seductive and sexy(双形容词堆砌,erotic 语境词留正文); 保留 drawstring opening(功能事实)/jumpsuit(参数); 补 Black(参数); lingerie 剥(品类冗余)",
 "Black lace jumpsuit with a drawstring opening — sheer mesh lingerie that adjusts as the night goes on, one size for 40–80 kg.",
 "<p>Adjustability is rare in sheer lingerie, and this black lace jumpsuit builds its whole character around it: a drawstring opening that lets the wearer decide how much the night reveals, and when.</p>\n<p>The body of the piece is sheer mesh lace in a one-piece jumpsuit cut — full coverage in fabric terms, very little of it in practice. The drawstring adds a practical side to all that sheerness: loosen it as the night warms up, cinch it for effect, or leave it exactly where the evening started. Clothing only, no stockings attached.</p>\n<p>The one-size draft runs wide, graded for 40–80 kg, which is one of the more forgiving ranges in this category. In practice that means the same piece works layered over a bodysuit for costume nights or worn alone.</p>\n<p>Specs at a glance:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Type:</strong> jumpsuit, clothing only</li>\n<li><strong>Features:</strong> sheer mesh, drawstring opening</li>\n<li><strong>Color:</strong> black</li>\n<li><strong>Size:</strong> one size, recommended for 40–80 kg (about 88–176 lb)</li>\n</ul>",
 "Black Lace Jumpsuit with Drawstring Opening | RoseToys",
 "Black lace jumpsuit with drawstring opening. Sheer mesh lingerie that adjusts as you wear it, one size 40-80kg. Shop RoseToys.")

# 13. 21367
add(21367,
 "Sexy bandeau mesh",
 "Sexy Sheer Bandeau Mesh Bodysuit",
 "原名 17 字符过短; 补 Sheer(参数 see-through)/Bodysuit(clothing only); Sexy/bandeau 保留",
 "Sexy sheer bandeau mesh bodysuit — strapless see-through polyester with high breathability, in a single slip-on piece. One size for 40–75 kg.",
 "<p>The bandeau cut proves a lingerie piece does not need straps to stay put — or to get noticed. This bodysuit is a single slip-on piece of sheer polyester mesh, banded across the bust and running uninterrupted to the hip line.</p>\n<p>See-through and breathable by construction, the open weave keeps the piece light through a full night of wear. The lack of straps does two jobs at once: nothing to adjust mid-evening, and an unbroken line of net from shoulder to hem that photographs clean. The fabric has enough stretch to pull on over the hips and settle back into shape.</p>\n<p>It layers under open shirts and mesh tops as easily as it wears alone; clothing only, no accessories in the listing.</p>\n<p>The specifics:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> bodysuit, clothing only</li>\n<li><strong>Top:</strong> bandeau (strapless)</li>\n<li><strong>Features:</strong> see-through, breathable</li>\n<li><strong>Size:</strong> one size, recommended for 40–75 kg (about 88–165 lb)</li>\n</ul>\n<p>Simplicity is the whole play here — one piece, one line, done.</p>",
 "Sexy Sheer Bandeau Mesh Bodysuit | RoseToys",
 "Sexy sheer bandeau mesh bodysuit in see-through polyester. Strapless slip-on piece, one size for 40-75kg. Shop RoseToys.")

# 14. 21346
add(21346,
 "Sexy openwork split bikini",
 "Sexy Openwork Split Bikini in Three Colors",
 "原名 26 字符过短; 保留 openwork/split(镂空分体语义属实); 补 Three Colors(参数 Black/Red/Blue 属实)",
 "Sexy openwork split bikini in high-stretch polyester mesh — two-piece costume lingerie in black, red, or blue, one size for 40–70 kg.",
 "<p>A bikini cut in openwork mesh changes what a two-piece can get away with. This split bikini takes the familiar triangle-and-bottom structure and renders it in sheer knitted mesh — covered on paper, revealing in practice. It is the rare two-piece that reads as lingerie rather than swimwear.</p>\n<p>The polyester fabric is graded high elasticity, which on a bikini matters more than on any other cut: the pieces have to stay put through movement with only stretch holding them in place. Three colorways are stocked — black, red, and blue — so the set can match the rest of the evening's plan instead of the other way around.</p>\n<p>Sold as a two-piece costume set, one size.</p>\n<p>Quick specs:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> split bikini, two-piece costume</li>\n<li><strong>Features:</strong> openwork mesh, high elasticity</li>\n<li><strong>Color:</strong> black, red, or blue</li>\n<li><strong>Size:</strong> one size, recommended for 40–70 kg (about 88–154 lb)</li>\n</ul>\n<p>Same silhouette as a summer bikini, entirely different intentions.</p>",
 "Sexy Openwork Split Bikini in Three Colors | RoseToys",
 "Sexy openwork split bikini in high-stretch polyester mesh. Two-piece costume set in black, red or blue, one size 40-70kg.")

# 15. 21312
add(21312,
 "Diamond-encrusted openwork mesh",
 "Rhinestone Mesh Bodysuit in Black and Red",
 "Diamond-encrusted→Rhinestone(水钻电商标准词,17.99 价位不可能真钻,推断已标注); 补 Bodysuit(clothing only)+Black and Red(参数双色)",
 "Rhinestone-dotted mesh bodysuit in see-through polyester — allover sparkle on sheer net, black or red, one size for 40–65 kg.",
 "<p>Rhinestones on mesh work because they catch light that was already there. This bodysuit dots sheer polyester net with sparkle across the body, so every shift under lamp or candle light picks up a glint from somewhere new.</p>\n<p>The base fabric is see-through and breathable, cut as a single bodysuit — clothing only, no stockings or extras in the listing. The rhinestone detailing does the decorating on its own: no lace, no trim, just the glitter path across the net. Two colorways are stocked, black and red, and both read louder in person than on screen.</p>\n<p>One-size cut, drafted for 40–65 kg, with enough stretch in the net to sit smooth rather than pull at the dots.</p>\n<p>What you are getting:</p>\n<ul>\n<li><strong>Material:</strong> polyester</li>\n<li><strong>Type:</strong> bodysuit, clothing only</li>\n<li><strong>Decoration:</strong> rhinestone dots</li>\n<li><strong>Features:</strong> see-through, breathable</li>\n<li><strong>Color:</strong> black or red</li>\n<li><strong>Size:</strong> one size, recommended for 40–65 kg (about 88–143 lb)</li>\n</ul>\n<p>Sheer mesh plus sparkle is a two-ingredient recipe that does not need a third.</p>",
 "Rhinestone Mesh Bodysuit in Black and Red | RoseToys",
 "Rhinestone mesh bodysuit in see-through polyester with allover sparkle. Sheer net in black or red, one size 40-65kg. Shop RoseToys.")

# 16. 21292
add(21292,
 "Lace seduction jumpsuit without taking off gears",
 "Open-Crotch Lace Jumpsuit in Black and Red",
 "without taking off gears=「免脱开档」机译(裆=gear 误译)→Open-Crotch; 剥 seduction(单形容词语境词); 补 Black and Red(参数双色); 与 21533 bodystocking/21499 teddy 用品类词区分",
 "Open-crotch lace jumpsuit in black or red — sheer mesh one-piece built to stay on, one size for 40–60 kg.",
 "<p>The pitch is simple: a lace jumpsuit that never has to come off, thanks to a built-in open crotch. Everything else about the piece follows from that one decision — sheer mesh over the whole frame, one-piece construction, and a fit that stays put from the first look to the last.</p>\n<p>The lace net has enough stretch to move without pulling, and the jumpsuit cut keeps the silhouette long and unbroken. Two colorways are stocked: black for the classic route, red for the louder one. Both shades photograph well under warm light, which is where this piece will spend its evenings. The red in particular reads deeper in person than the listing photo suggests.</p>\n<p>It is the kind of piece that makes stay-as-you-are a complete instruction.</p>\n<p>The rundown:</p>\n<ul>\n<li><strong>Material:</strong> lace</li>\n<li><strong>Type:</strong> one-piece jumpsuit</li>\n<li><strong>Features:</strong> open crotch, sheer mesh</li>\n<li><strong>Color:</strong> black or red</li>\n<li><strong>Size:</strong> one size, recommended for 40–60 kg (about 88–132 lb)</li>\n</ul>",
 "Open-Crotch Lace Jumpsuit in Black and Red | RoseToys",
 "Open-crotch lace jumpsuit in black or red. Sheer mesh one-piece made to stay on all night, one size 40-60kg. Shop RoseToys.")

# ---- 校验 ----
SLOP = ["elevate", "effortless", "timeless", "perfect", "must-have", "must have",
        "whether you", "unleash", "look no further", "delve", "tapestry",
        "elevating", "game-chang", "game chang", "unparalleled", "seamless"]
errs, warns = [], []
for e in P:
    pid = e["id"]
    dw, sw = wc(e["desc"]), wc(e["short"])
    td, tt = len(e["tkd_desc"]), len(e["tkd_title"])
    if not (150 <= dw <= 250): errs.append(f"{pid} desc words {dw}")
    if not (20 <= sw <= 30): warns.append(f"{pid} short words {sw}")
    if not (120 <= td <= 155): errs.append(f"{pid} tkd_desc len {td}")
    if tt > 60: errs.append(f"{pid} tkd_title len {tt}")
    low = (e["desc"] + " " + e["short"] + " " + e["tkd_desc"] + " " + e["tkd_title"]).lower()
    for s in SLOP:
        if s in low: errs.append(f"{pid} slop '{s}'")
    if "perfect" in low: errs.append(f"{pid} slop perfect")
print("entries:", len(P))
print("ERRORS:", errs if errs else "none")
print("WARNS:", warns if warns else "none")
for e in P:
    print(f"{e['id']}  desc={wc(e['desc'])}w short={wc(e['short'])}w tkd={len(e['tkd_desc'])}c title={len(e['tkd_title'])}c  {e['new_name']}")

json.dump(P, open("plan_deepfish.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("plan_deepfish.json written")
