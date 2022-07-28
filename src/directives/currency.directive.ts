import type { Action } from 'svelte/types/runtime/action';

export const currencyText: Action<HTMLElement, never> = (node) => {
  const value = parseFloat(node.textContent);
  if (!isNaN(value)) {
    const text = Intl.NumberFormat('th', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    node.textContent = text;
  }
  return {};
};
