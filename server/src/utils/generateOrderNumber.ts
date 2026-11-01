export const generateOrderNumber = (count: number): string => {
  const year = new Date().getFullYear();
  return `RD-${year}-${String(count + 1).padStart(6, "0")}`;
};
