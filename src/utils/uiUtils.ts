// utils/uiUtils.ts
export const darken = (color: string, amount: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.floor((num >> 16) * (1 - amount));
  const g = Math.floor(((num >> 8) & 0x00FF) * (1 - amount));
  const b = Math.floor((num & 0x0000FF) * (1 - amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

export const getButtonStyles = (isSelected: boolean, color: string) => ({
  backgroundColor: isSelected ? color : 'transparent',
  color: isSelected ? 'white' : color,
  borderColor: color,
  '&:hover': {
    backgroundColor: isSelected ? darken(color, 0.1) : `${color}10`,
  }
});
