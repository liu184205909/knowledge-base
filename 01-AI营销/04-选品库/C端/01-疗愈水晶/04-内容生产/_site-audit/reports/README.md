# GoEarthward English Article Audit

- Audited: 2026-07-10T08:10:26.448Z
- Scope: all 1738 WordPress posts returned by authenticated `status=any`; English source content only
- Checks: visible CJK text and product/commerce inclusion in the article body

## All posts

### Status

| Status | Posts |
|---|---:|
| future | 1470 |
| publish | 268 |

### Chinese text

| Result | Posts |
|---|---:|
| No visible CJK | 1738 |
| Intentional term or gloss | 0 |
| Needs editorial review | 0 |

### Product inclusion

| Level | Posts |
|---|---:|
| dynamic_product_module | 1736 |
| specific_product | 2 |

## Tarot category

- Total: 690
- With visible CJK: 0
- Needs editorial review: 0
- No commerce entry: 0

| Product level | Tarot posts |
|---|---:|
| dynamic_product_module | 690 |

## Requested example

- `five-card-advice-spread`: CJK=none; product=dynamic_product_module.
- The CJK strings are short Chinese-medicine terms accompanied by pinyin and English glosses, so they are classified as intentional terminology, not translation leakage.

## Files

- `audit-cjk-posts.csv`: every post with visible Chinese characters and surrounding context
- `audit-no-commerce-entry.csv`: posts with no product, WooCommerce module, product category, or shop link
- `audit-tarot-posts.csv`: Tarot-only audit
- `audit-all-posts.csv`: one-row-per-post inventory
