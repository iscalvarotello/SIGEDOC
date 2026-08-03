export const LIST_BULLETS: Record<string, string> = {
  dot: '●',
  circle: '○',
  square: '■',
  arrowRight: '→',
  handRight: '👉',
  check: '✓',
  star: '★',
  dash: '-',
  diamond: '◆'
};

export type ListBulletKey = keyof typeof LIST_BULLETS;
