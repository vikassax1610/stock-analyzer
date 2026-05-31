/**
 * stocks.js — Curated NSE stock list for search suggestions.
 */

export const NSE_STOCKS = [
  { symbol: 'RELIANCE',    name: 'Reliance Industries' },
  { symbol: 'TCS',         name: 'Tata Consultancy Services' },
  { symbol: 'INFY',        name: 'Infosys' },
  { symbol: 'HDFCBANK',    name: 'HDFC Bank' },
  { symbol: 'ICICIBANK',   name: 'ICICI Bank' },
  { symbol: 'HINDUNILVR',  name: 'Hindustan Unilever' },
  { symbol: 'SBIN',        name: 'State Bank of India' },
  { symbol: 'BHARTIARTL',  name: 'Bharti Airtel' },
  { symbol: 'KOTAKBANK',   name: 'Kotak Mahindra Bank' },
  { symbol: 'LT',          name: 'Larsen & Toubro' },
  { symbol: 'AXISBANK',    name: 'Axis Bank' },
  { symbol: 'BAJFINANCE',  name: 'Bajaj Finance' },
  { symbol: 'ASIANPAINT',  name: 'Asian Paints' },
  { symbol: 'MARUTI',      name: 'Maruti Suzuki' },
  { symbol: 'TITAN',       name: 'Titan Company' },
  { symbol: 'NESTLEIND',   name: 'Nestle India' },
  { symbol: 'WIPRO',       name: 'Wipro' },
  { symbol: 'ULTRACEMCO',  name: 'UltraTech Cement' },
  { symbol: 'POWERGRID',   name: 'Power Grid Corp' },
  { symbol: 'NTPC',        name: 'NTPC' },
  { symbol: 'SUNPHARMA',   name: 'Sun Pharmaceutical' },
  { symbol: 'TECHM',       name: 'Tech Mahindra' },
  { symbol: 'HCLTECH',     name: 'HCL Technologies' },
  { symbol: 'ONGC',        name: 'Oil and Natural Gas Corp' },
  { symbol: 'JSWSTEEL',    name: 'JSW Steel' },
  { symbol: 'TATASTEEL',   name: 'Tata Steel' },
  { symbol: 'ADANIENT',    name: 'Adani Enterprises' },
  { symbol: 'ADANIPORTS',  name: 'Adani Ports' },
  { symbol: 'COALINDIA',   name: 'Coal India' },
  { symbol: 'BAJAJFINSV',  name: 'Bajaj Finserv' },
  { symbol: 'DIVISLAB',    name: "Divi's Laboratories" },
  { symbol: 'DRREDDY',     name: "Dr. Reddy's Laboratories" },
  { symbol: 'CIPLA',       name: 'Cipla' },
  { symbol: 'EICHERMOT',   name: 'Eicher Motors' },
  { symbol: 'HEROMOTOCO',  name: 'Hero MotoCorp' },
  { symbol: 'BPCL',        name: 'Bharat Petroleum' },
  { symbol: 'GRASIM',      name: 'Grasim Industries' },
  { symbol: 'HINDALCO',    name: 'Hindalco Industries' },
  { symbol: 'INDUSINDBK',  name: 'IndusInd Bank' },
  { symbol: 'M&M',         name: 'Mahindra & Mahindra' },
  { symbol: 'NIFTY',       name: 'NIFTY 50 Index' },
  { symbol: 'BANKNIFTY',   name: 'Bank NIFTY Index' },
  { symbol: 'SENSEX',      name: 'BSE Sensex Index' },
  { symbol: 'IRCTC',       name: 'IRCTC' },
  { symbol: 'TATAPOWER',   name: 'Tata Power' },
  { symbol: 'TATAMOTORS',  name: 'Tata Motors' },
  { symbol: 'ZOMATO',      name: 'Zomato' },
  { symbol: 'PAYTM',       name: 'One97 Communications' },
  { symbol: 'PIDILITIND',  name: 'Pidilite Industries' },
  { symbol: 'HAVELLS',     name: 'Havells India' },
];

/**
 * Search stocks by query (symbol or name).
 */
export const searchStocks = (query) => {
  if (!query || query.length < 1) return [];
  const q = query.toUpperCase();
  return NSE_STOCKS.filter(
    s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
  ).slice(0, 8);
};
