export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
  NL: "EUR", BE: "EUR", AT: "EUR", CH: "CHF", SE: "SEK", NO: "NOK",
  DK: "DKK", FI: "EUR", PL: "PLN", CZ: "CZK", PT: "EUR", IE: "EUR",
  HU: "HUF", RO: "RON", GR: "EUR", SK: "EUR", BG: "BGN",   HR: "HRK",
  LT: "EUR", SI: "EUR", LV: "EUR", EE: "EUR", CY: "EUR", MT: "EUR",
  LU: "EUR", CA: "CAD", AU: "AUD", NZ: "NZD", JP: "JPY", KR: "KRW",
  BR: "BRL", MX: "MXN", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN",
  ZA: "ZAR", TR: "TRY", RU: "RUB", IN: "INR", ID: "IDR", MY: "MYR",
  PH: "PHP", SG: "SGD", TH: "THB", VN: "VND", CN: "CNY", TW: "TWD",
  HK: "HKD", IL: "ILS", SA: "SAR", AE: "AED", QA: "QAR", KW: "KWD",
  OM: "OMR", BH: "BHD", JO: "JOD", LB: "LBP", EG: "EGP", MA: "MAD",
  TN: "TND", DZ: "DZD", IS: "ISK", RS: "RSD", UA: "UAH",
  BY: "BYN", KZ: "KZT", AZ: "AZN", GE: "GEL", AM: "AMD", AL: "ALL",
  BA: "BAM", MK: "MKD", MD: "MDL", XK: "EUR", ME: "EUR",
  NG: "NGN", KE: "KES", GH: "GHS", TZ: "TZS", UG: "UGX", ET: "ETB",
  CI: "XOF", SN: "XOF", CM: "XAF", CD: "CDF", ZM: "ZMW",
  PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR", MM: "MMK", KH: "KHR",
  LA: "LAK", MN: "MNT", MV: "MVR",
  UY: "UYU", PY: "PYG", BO: "BOB", CR: "CRC", PA: "PAB", GT: "GTQ",
  SV: "SVC", HN: "HNL", NI: "NIO", DO: "DOP", PR: "USD", CU: "CUP",
  VE: "VES",
}

export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] ?? "USD"
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", GBP: "£", EUR: "€", CHF: "CHF", SEK: "kr", NOK: "kr",
  DKK: "kr", PLN: "zł", CZK: "Kč", HUF: "Ft", RON: "lei", BGN: "лв",
  HRK: "kn", CAD: "C$", AUD: "A$", NZD: "NZ$", JPY: "¥", KRW: "₩",
  BRL: "R$", MXN: "MX$", ARS: "AR$", CLP: "CL$", COP: "CO$", PEN: "S/",
  ZAR: "R", TRY: "₺", RUB: "₽", INR: "₹", IDR: "Rp", MYR: "RM",
  PHP: "₱", SGD: "S$", THB: "฿", VNĐ: "₫", CNY: "¥", TWD: "NT$",
  HKD: "HK$", ILS: "₪", SAR: "SAR", AED: "AED", QAR: "QAR", KWD: "KD",
  OMR: "OMR", BHD: "BD", JOD: "JD", LBP: "L£", EGP: "E£", MAD: "MAD",
  TND: "DT", DZD: "DA",
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency
}
