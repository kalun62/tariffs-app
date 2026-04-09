export const getDiscount = (price: number, full: number) => {
  return Math.round((1 - price / full) * 100);
};