/* Local UI fixture only. Never load this file on a WordPress preview or production page.
 * The Dzi images are local visual references and the values reuse legacy-v2 test figures.
 * Neither is approved catalog, sales, or production-import data. */
window.EW_T17_UI_CONFIG = {
  mockMode: true,
  fixtureLabel: 'Development fixture — not for sale',
  officialDesignId: Number(new URLSearchParams(window.location.search).get('t17_design') || 0),
  currencySymbol: '$',
  trayImage: '',
  trayThemes: [
    {id: 'celadon', label: 'Celadon', image: 'assets/tray-celadon-alpha.png'},
    {id: 'blue', label: 'Misty blue', image: 'assets/tray-blue-alpha.png'},
    {id: 'ice', label: 'Ice white', image: 'assets/tray-ice-alpha.png'},
    {id: 'walnut', label: 'Deep walnut', image: 'assets/tray-walnut-alpha.png'}
  ],
  mockInitialSequence: [
    {variant_id:'fixture-clear-6'}, {variant_id:'fixture-amethyst-8'}, {variant_id:'fixture-dzi-10'}, {variant_id:'fixture-clear-8'},
    {variant_id:'fixture-amethyst-6'}, {variant_id:'fixture-clear-10'}, {variant_id:'fixture-dzi-8'}, {variant_id:'fixture-clear-6'},
    {variant_id:'fixture-amethyst-10'}, {variant_id:'fixture-clear-8'}, {variant_id:'fixture-spacer-2'}, {variant_id:'fixture-dzi-12'},
    {variant_id:'fixture-clear-8'}, {variant_id:'fixture-amethyst-6'}, {variant_id:'fixture-dzi-8'}, {variant_id:'fixture-clear-10'},
    {variant_id:'fixture-amethyst-8'}, {variant_id:'fixture-clear-6'}, {variant_id:'fixture-dzi-10'}, {variant_id:'fixture-clear-8'}
  ],
  mockCatalog: {
    schema_version: 'ew-t17-v3-ui-fixture',
    materials: [
      { material_key: 'fixture-clear-quartz', component_type: 'bead', is_fixture: true, name_en: 'Clear Quartz', primary_color: 'clear', swatch_color: '#d9e5e3', color_tags: ['clear', 'white'], image_url: '', variants: [
        { id: 'fixture-clear-6', size_mm: 6, price: 1.5, weight_g: 0.5, occupied_length_mm: 6, display_scale: 0.78, image_url: '' },
        { id: 'fixture-clear-8', size_mm: 8, price: 2, weight_g: 0.9, occupied_length_mm: 8, display_scale: 1, image_url: '' },
        { id: 'fixture-clear-10', size_mm: 10, price: 3, weight_g: 1.4, occupied_length_mm: 10, display_scale: 1.12, image_url: '' },
        { id: 'fixture-clear-12', size_mm: 12, price: 4.5, weight_g: 2, occupied_length_mm: 12, display_scale: 1.18, image_url: '' }
      ] },
      { material_key: 'fixture-amethyst', component_type: 'bead', is_fixture: true, name_en: 'Amethyst', primary_color: 'purple', swatch_color: '#745082', color_tags: ['purple'], image_url: '', variants: [
        { id: 'fixture-amethyst-6', size_mm: 6, price: 1.5, weight_g: 0.5, occupied_length_mm: 6, display_scale: 0.78, image_url: '' },
        { id: 'fixture-amethyst-8', size_mm: 8, price: 2, weight_g: 0.9, occupied_length_mm: 8, display_scale: 1, image_url: '' },
        { id: 'fixture-amethyst-10', size_mm: 10, price: 3, weight_g: 1.4, occupied_length_mm: 10, display_scale: 1.12, image_url: '' }
      ] },
      { material_key: 'fixture-dzi-visual-study', component_type: 'bead', is_fixture: true, name_en: 'Dzi Visual Study', primary_color: 'brown', swatch_color: '#9c6a39', color_tags: ['brown', 'gold'], image_url: '../../../02-网站规划/images/tibetan-dzi/hero-dzi-bead-1-eye.webp', variants: [
        { id: 'fixture-dzi-6', size_mm: 6, price: 2.5, weight_g: 0.6, occupied_length_mm: 6, display_scale: 0.76, image_url: '../../../02-网站规划/images/tibetan-dzi/hero-dzi-bead-1-eye.webp' },
        { id: 'fixture-dzi-8', size_mm: 8, price: 3.5, weight_g: 1, occupied_length_mm: 8, display_scale: 0.96, image_url: '../../../02-网站规划/images/tibetan-dzi/hero-dzi-bead-7-eye.webp' },
        { id: 'fixture-dzi-10', size_mm: 10, price: 4.8, weight_g: 1.6, occupied_length_mm: 10, display_scale: 1.08, image_url: '../../../02-网站规划/images/tibetan-dzi/hero-dzi-bead-12-eye.webp' },
        { id: 'fixture-dzi-12', size_mm: 12, price: 6.5, weight_g: 2.3, occupied_length_mm: 12, display_scale: 1.14, image_url: '../../../02-网站规划/images/tibetan-dzi/hero-dzi-bead-12-eye.webp' }
      ] },
      { material_key: 'fixture-spacer', component_type: 'decor', is_fixture: true, name_en: 'Spacer', primary_color: 'gold', swatch_color: '#b8934e', color_tags: ['gold'], image_url: '', variants: [
        { id: 'fixture-spacer-2', size_mm: 2, price: 0.5, weight_g: 0.2, occupied_length_mm: 2, display_scale: 0.45, compatible_bead_sizes: [6, 8, 10], image_url: '' }
      ] },
      { material_key: 'fixture-cord', component_type: 'finish', is_fixture: true, name_en: 'Elastic Cord', primary_color: 'clear', swatch_color: '#ddd7c9', color_tags: ['clear'], image_url: '', variants: [
        { id: 'fixture-cord', size_mm: 1, price: 0, weight_g: 0, occupied_length_mm: 0, display_scale: 0.2, image_url: '' }
      ] }
    ]
  },
  mockOfficialDesigns: {
    9001: {
      product_id: 9001,
      name: 'Fixture Official Design',
      recipe: {
        target_wrist_cm: 16,
        fit_preference: 'regular',
        sequence: [{variant_id: 'fixture-clear-6'}, {variant_id: 'fixture-dzi-8'}, {variant_id: 'fixture-amethyst-10'}],
        packaging: {label: 'Fixture packaging'}
      },
      quote: {currency: '$', total: 8, weight_g: 3, used_length_mm: 24, target_length_mm: 173, fit_status: 'short'}
    }
  }
};
