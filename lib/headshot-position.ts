/**
 * Per-leader object-position overrides for headshot images.
 * Default is "center top" — only leaders whose faces sit lower
 * in the original photo need an override here.
 */
const HEADSHOT_POSITIONS: Record<string, string> = {
  'emily-siegel': 'center 15%',
  'susannah-strydom': 'center 20%',
  'kevin-lawson': 'center 25%',
};

export function headshotPosition(slug: string): string {
  return HEADSHOT_POSITIONS[slug] ?? 'center top';
}
