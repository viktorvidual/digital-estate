export const ROOM_TYPES = [
  { value: 'living', label: 'Хол' },
  { value: 'bed', label: 'Спалня' },
  { value: 'kitchen', label: 'Кухня' },
  { value: 'dining', label: 'Трапезария' },
  { value: 'bathroom', label: 'Баня' },
  { value: 'home_office', label: 'Домашен офис' },
  { value: 'outdoor', label: 'На открито' },
  { value: 'kids_room', label: 'Детска стая' },
];

export const FURNITURE_STYLES = [
  { value: 'modern', label: 'Модерен' },
  { value: 'scandinavian', label: 'Скандинавски' },
  { value: 'midcentury', label: 'Модерно средновековие' },
  { value: 'luxury', label: 'Луксозен' },
  { value: 'farmhouse', label: 'Селска къща' },
  { value: 'coastal', label: 'Крайбрежен' },
  { value: 'standard', label: 'Стандартен' },
  { value: 'industrial', label: 'Индустриален' },
];

// ✅ Extract string literal types from keys
export type RoomType = (typeof ROOM_TYPES)[number];
export type FurnitureStyle = (typeof FURNITURE_STYLES)[number];
