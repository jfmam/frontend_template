export const stringToMoney = (money: string) => {
  return money.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const convertToSecondWages = (
  salary: number,
  { workingDays, workingTime }: { workingDays: number; workingTime: number },
): number => {
  return +(salary / workingDays / workingTime / 3600).toFixed(1);
};
