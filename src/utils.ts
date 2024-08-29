
function generateUuid() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return random;
}

function handleMeasureNumericValue(value: string) {
  return parseInt(value.replace(/\D/g, ''));
}

function isSameMonth(date1: Date, date2: Date) {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth()
  );
}

export { generateUuid, handleMeasureNumericValue, isSameMonth };