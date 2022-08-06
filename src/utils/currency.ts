export const currencyText = (value: string | number) => {
  const number = parseFloat(value + '');
  return Intl.NumberFormat('th', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const priceText = (value: string | number) => {
  const number = parseFloat(value + '');
  return Intl.NumberFormat('th', {
    style: 'decimal',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
