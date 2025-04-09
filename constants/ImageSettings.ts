export const ROOM_STYLE_KEYS = {
  Всекидневна: { id: 'living', name: 'Всекидневна' },
  Спалня: { id: 'bed', name: 'Спалня' },
  Кухня: { id: 'kitchen', name: 'Кухня' },
  Трапезария: { id: 'dining', name: 'Трапезария' },
  Баня: { id: 'bathroom', name: 'Баня' },
  'Домашен офис': { id: 'home_office', name: 'Домашен офис' },
  'На открито': { id: 'outdoor', name: 'На открито' },
  'Детска стая': { id: 'kids_room', name: 'Детска стая' },
} as const;

export const ROOMS_STYLES_VALUES = Object.values(ROOM_STYLE_KEYS).map(({ name, id }) => {
  return {
    name,
    id,
  };
});

export const FURNITURE_STYLE_KEYS = {
  Модерен: { id: 'modern', name: 'Модерен' },
  Скандинавски: { id: 'scandinavian', name: 'Скандинавски' },
  Индустриален: { id: 'industrial', name: 'Индустриален' },
  'Средата на века': { id: 'midcentury', name: 'Средата на века' },
  Луксозен: { id: 'luxury', name: 'Луксозен' },
  'Селска къща': { id: 'farmhouse', name: 'Селска къща' },
  Крайбрежен: { id: 'coastal', name: 'Крайбрежен' },
  Стандартен: { id: 'standard', name: 'Стандартен' },
} as const;

export const FURNITURE_STYLE_VALUES = Object.values(FURNITURE_STYLE_KEYS).map(({ name, id }) => {
  return {
    name,
    id,
  };
});

// ✅ Extract string literal types from keys
export type RoomType = keyof typeof ROOM_STYLE_KEYS;
export type FurnitureStyle = keyof typeof FURNITURE_STYLE_KEYS;
