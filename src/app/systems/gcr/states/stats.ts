export const STAT_NAMES = ['筋力', '反射', '感覚', '知力', '精神', '共感'] as const;
export type StatName = (typeof STAT_NAMES)[number];
