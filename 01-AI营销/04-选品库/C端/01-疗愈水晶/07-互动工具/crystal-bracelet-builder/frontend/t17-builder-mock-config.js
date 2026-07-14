/* Local UI fixture only. Never load this file on a WordPress preview or production page. */
window.EW_T17_UI_CONFIG = {
  mockMode: true,
  officialDesignId: Number(new URLSearchParams(window.location.search).get('t17_design') || 0),
  currencySymbol: '$',
  trayImage: '',
  mockCatalog: {
    schema_version: 'ew-t17-v3-ui-fixture',
    materials: [
      { material_key: 'fixture-clear-quartz', component_type: 'bead', name_en: 'Fixture Clear Quartz', primary_color: 'clear', color_tags: ['clear'], image_url: '', variants: [
        { id: 'fixture-clear-6', size_mm: 6, price: 1.2, weight_g: 0.5, occupied_length_mm: 6, display_scale: 0.78, image_url: '' },
        { id: 'fixture-clear-8', size_mm: 8, price: 1.6, weight_g: 0.9, occupied_length_mm: 8, display_scale: 1, image_url: '' },
        { id: 'fixture-clear-10', size_mm: 10, price: 2.1, weight_g: 1.4, occupied_length_mm: 10, display_scale: 1.2, image_url: '' }
      ] },
      { material_key: 'fixture-amethyst', component_type: 'bead', name_en: 'Fixture Amethyst', primary_color: 'purple', color_tags: ['purple'], image_url: '', variants: [
        { id: 'fixture-amethyst-8', size_mm: 8, price: 1.8, weight_g: 0.9, occupied_length_mm: 8, display_scale: 1, image_url: '' }
      ] },
      { material_key: 'fixture-spacer', component_type: 'decor', name_en: 'Fixture Spacer', primary_color: 'gold', color_tags: ['gold'], image_url: '', variants: [
        { id: 'fixture-spacer-2', size_mm: 2, price: 0.5, weight_g: 0.2, occupied_length_mm: 2, display_scale: 0.45, compatible_bead_sizes: [6, 8, 10], image_url: '' }
      ] },
      { material_key: 'fixture-cord', component_type: 'finish', name_en: 'Fixture Elastic Cord', primary_color: 'clear', color_tags: ['clear'], image_url: '', variants: [
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
        sequence: [{variant_id: 'fixture-clear-6'}, {variant_id: 'fixture-amethyst-8'}, {variant_id: 'fixture-clear-10'}],
        packaging: {label: 'Fixture packaging'}
      },
      quote: {currency: '$', total: 5.1, weight_g: 2.8, used_length_mm: 24, target_length_mm: 173, fit_status: 'short'}
    }
  }
};
