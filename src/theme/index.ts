// warm neutrals rather than blue-greys, so cards read as raised against the
// page instead of everything being flat white
export const colors = {
  background: '#F6F5F2',
  card: '#FFFFFF',
  border: '#E7E4DE',
  imageTile: '#F1EFEA',

  textPrimary: '#1C1B19',
  textSecondary: '#6B6862',
  textMuted: '#A3A09A',

  accent: '#4F46E5',
  // text sitting on any solid fill (accent chip, discount badge)
  onFill: '#FFFFFF',

  discountBg: '#E8F5EC',
  discountText: '#137A42',

  ratingBg: '#FDF3E0',
  ratingText: '#A2680C',

  danger: '#C4362F',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

// search field and sort button share this so they line up in the row
export const CONTROL_HEIGHT = 44

export const radius = {
  sm: 6,
  md: 12,
  pill: 999,
} as const
