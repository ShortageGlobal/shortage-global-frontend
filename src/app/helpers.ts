export function formatPrice(value) {
  return isNaN(value)
    ? value
    : Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2,
      });
}
