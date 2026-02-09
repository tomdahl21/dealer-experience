export const calculateDealScore = (vehicle) => {
  let score = 50;
  if (vehicle.daysOnLot > 60) score += 30;
  else if (vehicle.daysOnLot > 30) score += 15;
  if (vehicle.similarInInventory > 5) score += 20;
  else if (vehicle.similarInInventory > 2) score += 10;
  if (vehicle.incentives > 2000) score += 20;
  else if (vehicle.incentives > 1000) score += 10;
  if (vehicle.marketPosition < -5) score += 30;
  else if (vehicle.marketPosition < 0) score += 15;
  return Math.min(score, 100);
};

export const getDealFlexibility = (score) => {
  if (score >= 71) return { level: 'high', color: 'success' };
  if (score >= 41) return { level: 'medium', color: 'warning' };
  return { level: 'low', color: 'error' };
};
