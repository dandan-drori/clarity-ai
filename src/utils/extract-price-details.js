export function extractPriceDetails(priceText) {
  const currencyMap = {
    '$': 'USD',
    '€': 'EUR',
    '₪': 'ILS'
  };

  // The regex /[^\d.]/g removes everything that is NOT a digit or a period (including spaces)
  const numberString = priceText.replace(/[^\d.]/g, '');
  const numericValue = parseFloat(numberString);

  let currencyCode = 'NOT';
  for (const [symbol, code] of Object.entries(currencyMap)) {
    if (priceText.includes(symbol)) {
      currencyCode = code;
      break;
    }
  }

  return {
    priceValue: numericValue,
    currencyCode: currencyCode
  };
}