import type { Quote, NewsItem, MarketIndex, SectorPerformance, Candle } from '../types'

export const DEMO_INDICES: MarketIndex[] = [
  { symbol: 'SPY', name: 'S&P 500', price: 5278.54, change: 42.31, changePercent: 0.81 },
  { symbol: 'QQQ', name: 'NASDAQ 100', price: 18234.12, change: 187.45, changePercent: 1.04 },
  { symbol: 'DIA', name: 'Dow Jones', price: 39127.80, change: -123.44, changePercent: -0.31 },
  { symbol: 'IWM', name: 'Russell 2000', price: 2089.44, change: 15.67, changePercent: 0.76 },
  { symbol: 'VIX', name: 'VIX', price: 14.82, change: -0.93, changePercent: -5.91 },
]

export const DEMO_QUOTES: Quote[] = [
  // ── Technology ───────────────────────────────────────────────────────
  { symbol: 'AAPL',  name: 'Apple Inc.',                price: 228.87,   change:   3.21, changePercent:  1.42, open: 226.10,  high: 229.44,  low: 225.82,  prevClose: 225.66,  volume:  52_345_200, avgVolume:  58_000_000, marketCap: 3_480_000_000_000, pe:  31.4, eps:   6.08, week52High:  237.23, week52Low:  164.08, sector: 'Technology',              industry: 'Consumer Electronics' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',            price: 441.32,   change:   5.87, changePercent:  1.35, open: 437.20,  high: 442.80,  low: 436.10,  prevClose: 435.45,  volume:  18_234_100, avgVolume:  22_000_000, marketCap: 3_280_000_000_000, pe:  37.2, eps:  11.45, week52High:  468.35, week52Low:  309.45, sector: 'Technology',              industry: 'Software' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',               price: 136.45,   change:   4.32, changePercent:  3.27, open: 132.80,  high: 137.10,  low: 132.30,  prevClose: 132.13,  volume: 234_521_000, avgVolume: 280_000_000, marketCap: 3_340_000_000_000, pe:  66.8, eps:   2.42, week52High:  153.13, week52Low:   47.32, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',              price: 1642.30,  change:  22.45, changePercent:  1.39, open: 1625.00, high: 1648.90, low: 1620.10, prevClose: 1619.85, volume:   2_345_600, avgVolume:   3_000_000, marketCap:   762_000_000_000, pe:  41.2, eps:  39.86, week52High: 1977.58, week52Low:  742.21, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'ORCL',  name: 'Oracle Corp.',               price: 178.34,   change:   3.45, changePercent:  1.97, open: 175.50,  high: 179.10,  low: 175.20,  prevClose: 174.89,  volume:   7_654_300, avgVolume:   9_000_000, marketCap:   489_000_000_000, pe:  42.1, eps:   4.23, week52High:  198.31, week52Low:   99.26, sector: 'Technology',              industry: 'Software' },
  { symbol: 'AMD',   name: 'Advanced Micro Devices',     price: 162.44,   change:   4.87, changePercent:  3.09, open: 158.20,  high: 163.10,  low: 157.80,  prevClose: 157.57,  volume:  45_678_900, avgVolume:  50_000_000, marketCap:   263_000_000_000, pe:  44.8, eps:   3.62, week52High:  227.30, week52Low:   96.97, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'CRM',   name: 'Salesforce Inc.',            price: 312.45,   change:   4.12, changePercent:  1.34, open: 309.00,  high: 313.80,  low: 308.50,  prevClose: 308.33,  volume:   5_432_100, avgVolume:   7_000_000, marketCap:   301_000_000_000, pe:  56.3, eps:   5.55, week52High:  369.00, week52Low:  212.00, sector: 'Technology',              industry: 'Software' },
  { symbol: 'ADBE',  name: 'Adobe Inc.',                 price: 428.67,   change:   5.34, changePercent:  1.26, open: 424.00,  high: 430.10,  low: 423.50,  prevClose: 423.33,  volume:   3_234_500, avgVolume:   4_200_000, marketCap:   193_000_000_000, pe:  43.2, eps:   9.93, week52High:  587.12, week52Low:  353.97, sector: 'Technology',              industry: 'Software' },
  { symbol: 'NOW',   name: 'ServiceNow Inc.',            price: 1012.34,  change:  15.67, changePercent:  1.57, open: 998.00,  high: 1015.00, low: 996.00,  prevClose: 996.67,  volume:   1_234_500, avgVolume:   1_800_000, marketCap:   209_000_000_000, pe:  93.4, eps:  10.84, week52High: 1198.09, week52Low:  684.84, sector: 'Technology',              industry: 'Software' },
  { symbol: 'INTC',  name: 'Intel Corp.',                price:  22.34,   change:  -0.45, changePercent: -1.97, open:  22.80,  high:  22.95,  low:  22.20,  prevClose:  22.79,  volume:  45_678_900, avgVolume:  52_000_000, marketCap:    94_000_000_000, pe:   0.0, eps:  -1.42, week52High:   47.51, week52Low:   18.51, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'QCOM',  name: 'Qualcomm Inc.',              price: 178.56,   change:   2.34, changePercent:  1.33, open: 176.50,  high: 179.20,  low: 176.20,  prevClose: 176.22,  volume:   8_234_500, avgVolume:  10_000_000, marketCap:   200_000_000_000, pe:  17.8, eps:  10.03, week52High:  230.63, week52Low:  154.74, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'TXN',   name: 'Texas Instruments',         price: 198.45,   change:   1.23, changePercent:  0.62, open: 197.40,  high: 199.10,  low: 197.20,  prevClose: 197.22,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:   181_000_000_000, pe:  31.2, eps:   6.36, week52High:  220.39, week52Low:  158.47, sector: 'Technology',              industry: 'Semiconductors' },
  { symbol: 'PLTR',  name: 'Palantir Technologies',      price:  38.77,   change:   1.22, changePercent:  3.25, open:  37.80,  high:  39.10,  low:  37.50,  prevClose:  37.55,  volume:  78_234_500, avgVolume:  65_000_000, marketCap:    83_000_000_000, pe: 242.0, eps:   0.16, week52High:   49.99, week52Low:   12.76, sector: 'Technology',              industry: 'AI Analytics' },
  { symbol: 'CRWD',  name: 'CrowdStrike Holdings',       price: 378.90,   change:  -2.34, changePercent: -0.61, open: 381.50,  high: 382.20,  low: 377.10,  prevClose: 381.24,  volume:   3_456_700, avgVolume:   4_000_000, marketCap:    92_000_000_000, pe: 318.4, eps:   1.19, week52High:  398.33, week52Low:  131.04, sector: 'Technology',              industry: 'Cybersecurity' },
  { symbol: 'NET',   name: 'Cloudflare Inc.',            price:  98.45,   change:   2.34, changePercent:  2.44, open:  96.50,  high:  99.20,  low:  96.20,  prevClose:  96.11,  volume:   8_765_400, avgVolume:  10_000_000, marketCap:    31_000_000_000, pe:   0.0, eps:  -0.24, week52High:  130.46, week52Low:   49.30, sector: 'Technology',              industry: 'Cybersecurity' },
  { symbol: 'SNOW',  name: 'Snowflake Inc.',             price: 178.23,   change:   4.56, changePercent:  2.63, open: 174.50,  high: 179.10,  low: 174.00,  prevClose: 173.67,  volume:   5_432_100, avgVolume:   7_000_000, marketCap:    59_000_000_000, pe:   0.0, eps:  -0.88, week52High:  237.72, week52Low:  107.13, sector: 'Technology',              industry: 'Cloud Data' },
  { symbol: 'DDOG',  name: 'Datadog Inc.',               price: 142.67,   change:   3.45, changePercent:  2.48, open: 139.80,  high: 143.50,  low: 139.50,  prevClose: 139.22,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:    46_000_000_000, pe:   0.0, eps:  -0.02, week52High:  183.88, week52Low:   84.04, sector: 'Technology',              industry: 'Cloud Software' },
  { symbol: 'MSTR',  name: 'MicroStrategy Inc.',         price: 358.90,   change:  18.45, changePercent:  5.42, open: 341.00,  high: 362.00,  low: 340.50,  prevClose: 340.45,  volume:  12_345_600, avgVolume:  15_000_000, marketCap:    38_000_000_000, pe:   0.0, eps: -10.45, week52High:  543.00, week52Low:   73.29, sector: 'Technology',              industry: 'Bitcoin Treasury' },
  { symbol: 'APP',   name: 'Applovin Corp.',             price: 312.78,   change:   8.90, changePercent:  2.93, open: 304.50,  high: 314.20,  low: 303.80,  prevClose: 303.88,  volume:   6_789_000, avgVolume:   8_000_000, marketCap:   107_000_000_000, pe: 123.4, eps:   2.54, week52High:  500.00, week52Low:   45.04, sector: 'Technology',              industry: 'AdTech' },
  { symbol: 'HOOD',  name: 'Robinhood Markets',          price:  42.34,   change:   1.23, changePercent:  2.99, open:  41.20,  high:  42.80,  low:  41.00,  prevClose:  41.11,  volume:  18_234_500, avgVolume:  20_000_000, marketCap:    38_000_000_000, pe:  68.3, eps:   0.62, week52High:   66.22, week52Low:   11.20, sector: 'Technology',              industry: 'Fintech' },

  // ── Communication Services ───────────────────────────────────────────
  { symbol: 'GOOGL', name: 'Alphabet Inc.',              price: 193.21,   change:   2.44, changePercent:  1.28, open: 191.20,  high: 193.88,  low: 190.54,  prevClose: 190.77,  volume:  22_145_300, avgVolume:  24_000_000, marketCap: 2_370_000_000_000, pe:  25.4, eps:   7.60, week52High:  207.05, week52Low:  120.21, sector: 'Communication Services', industry: 'Internet Content' },
  { symbol: 'META',  name: 'Meta Platforms Inc.',        price: 587.22,   change:   8.43, changePercent:  1.46, open: 581.10,  high: 588.90,  low: 579.44,  prevClose: 578.79,  volume:  12_345_600, avgVolume:  15_000_000, marketCap: 1_490_000_000_000, pe:  28.7, eps:  20.46, week52High:  614.91, week52Low:  279.40, sector: 'Communication Services', industry: 'Social Media' },
  { symbol: 'NFLX',  name: 'Netflix Inc.',               price: 718.45,   change:   9.32, changePercent:  1.31, open: 712.00,  high: 720.10,  low: 710.50,  prevClose: 709.13,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:   308_000_000_000, pe:  48.3, eps:  14.87, week52High:  791.68, week52Low:  344.73, sector: 'Communication Services', industry: 'Streaming' },
  { symbol: 'SPOT',  name: 'Spotify Technology',         price: 452.34,   change:   7.89, changePercent:  1.78, open: 445.00,  high: 454.10,  low: 444.50,  prevClose: 444.45,  volume:   1_234_500, avgVolume:   1_800_000, marketCap:    87_000_000_000, pe:  98.3, eps:   4.60, week52High:  494.35, week52Low:  152.13, sector: 'Communication Services', industry: 'Streaming' },
  { symbol: 'DIS',   name: 'Walt Disney Co.',            price: 101.23,   change:  -0.87, changePercent: -0.85, open: 102.20,  high: 102.50,  low: 100.90,  prevClose: 102.10,  volume:  10_234_500, avgVolume:  13_000_000, marketCap:   183_000_000_000, pe:  32.1, eps:   3.15, week52High:  123.74, week52Low:   83.91, sector: 'Communication Services', industry: 'Entertainment' },
  { symbol: 'T',     name: 'AT&T Inc.',                  price:  22.45,   change:   0.12, changePercent:  0.54, open:  22.35,  high:  22.60,  low:  22.30,  prevClose:  22.33,  volume:  45_678_900, avgVolume:  55_000_000, marketCap:   160_000_000_000, pe:  10.2, eps:   2.20, week52High:   23.40, week52Low:   15.93, sector: 'Communication Services', industry: 'Telecom' },
  { symbol: 'VZ',    name: 'Verizon Communications',     price:  41.23,   change:   0.34, changePercent:  0.83, open:  40.90,  high:  41.45,  low:  40.85,  prevClose:  40.89,  volume:  18_765_400, avgVolume:  22_000_000, marketCap:   173_000_000_000, pe:   9.8, eps:   4.21, week52High:   44.73, week52Low:   37.12, sector: 'Communication Services', industry: 'Telecom' },

  // ── Consumer Discretionary ───────────────────────────────────────────
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',            price: 212.56,   change:   1.87, changePercent:  0.89, open: 211.00,  high: 213.22,  low: 210.44,  prevClose: 210.69,  volume:  38_452_100, avgVolume:  42_000_000, marketCap: 2_230_000_000_000, pe:  56.2, eps:   3.78, week52High:  230.37, week52Low:  118.35, sector: 'Consumer Discretionary', industry: 'Internet Retail' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',                 price: 248.50,   change:  -3.21, changePercent: -1.27, open: 252.30,  high: 253.10,  low: 247.80,  prevClose: 251.71,  volume:  87_654_300, avgVolume:  95_000_000, marketCap:   793_000_000_000, pe:  72.4, eps:   3.43, week52High:  299.29, week52Low:  138.80, sector: 'Consumer Discretionary', industry: 'Electric Vehicles' },
  { symbol: 'BKNG',  name: 'Booking Holdings',           price: 4234.56,  change:  45.67, changePercent:  1.09, open: 4190.00, high: 4240.00, low: 4185.00, prevClose: 4188.89, volume:     567_800, avgVolume:     700_000, marketCap:   171_000_000_000, pe:  26.4, eps: 160.40, week52High: 4717.93, week52Low: 2922.74, sector: 'Consumer Discretionary', industry: 'Travel & Lodging' },
  { symbol: 'UBER',  name: 'Uber Technologies',          price:  78.45,   change:   1.23, changePercent:  1.59, open:  77.50,  high:  79.10,  low:  77.20,  prevClose:  77.22,  volume:  18_765_400, avgVolume:  22_000_000, marketCap:   164_000_000_000, pe:  32.1, eps:   2.44, week52High:   86.74, week52Low:   54.82, sector: 'Consumer Discretionary', industry: 'Ride-Hailing' },
  { symbol: 'MCD',   name: "McDonald's Corp.",           price: 298.45,   change:   1.23, changePercent:  0.41, open: 297.50,  high: 299.80,  low: 297.00,  prevClose: 297.22,  volume:   3_456_700, avgVolume:   4_500_000, marketCap:   213_000_000_000, pe:  24.3, eps:  12.28, week52High:  317.90, week52Low:  243.52, sector: 'Consumer Discretionary', industry: 'Restaurants' },
  { symbol: 'NKE',   name: 'Nike Inc.',                  price:  68.34,   change:  -0.56, changePercent: -0.81, open:  68.90,  high:  69.20,  low:  68.10,  prevClose:  68.90,  volume:   9_876_500, avgVolume:  12_000_000, marketCap:    99_000_000_000, pe:  22.5, eps:   3.04, week52High:   94.75, week52Low:   62.48, sector: 'Consumer Discretionary', industry: 'Apparel' },
  { symbol: 'ABNB',  name: 'Airbnb Inc.',                price: 134.56,   change:   2.34, changePercent:  1.77, open: 132.80,  high: 135.20,  low: 132.50,  prevClose: 132.22,  volume:   4_567_800, avgVolume:   6_000_000, marketCap:    85_000_000_000, pe:  17.8, eps:   7.56, week52High:  173.57, week52Low:  110.36, sector: 'Consumer Discretionary', industry: 'Travel & Lodging' },
  { symbol: 'SBUX',  name: 'Starbucks Corp.',            price:  82.34,   change:  -0.45, changePercent: -0.54, open:  82.80,  high:  83.10,  low:  82.00,  prevClose:  82.79,  volume:   8_234_500, avgVolume:  10_000_000, marketCap:    93_000_000_000, pe:  29.4, eps:   2.80, week52High:  101.68, week52Low:   68.19, sector: 'Consumer Discretionary', industry: 'Restaurants' },
  { symbol: 'GM',    name: 'General Motors',             price:  48.23,   change:   0.67, changePercent:  1.41, open:  47.70,  high:  48.50,  low:  47.60,  prevClose:  47.56,  volume:  23_456_700, avgVolume:  28_000_000, marketCap:    54_000_000_000, pe:   5.2, eps:   9.27, week52High:   61.59, week52Low:   40.65, sector: 'Consumer Discretionary', industry: 'Automobiles' },
  { symbol: 'F',     name: 'Ford Motor Co.',             price:  10.45,   change:  -0.12, changePercent: -1.13, open:  10.58,  high:  10.63,  low:  10.38,  prevClose:  10.57,  volume:  67_890_100, avgVolume:  75_000_000, marketCap:    41_000_000_000, pe:  11.2, eps:   0.93, week52High:   14.85, week52Low:    9.49, sector: 'Consumer Discretionary', industry: 'Automobiles' },

  // ── Consumer Staples ─────────────────────────────────────────────────
  { symbol: 'WMT',   name: 'Walmart Inc.',               price:  87.45,   change:   0.32, changePercent:  0.37, open:  87.20,  high:  87.90,  low:  86.80,  prevClose:  87.13,  volume:   9_876_500, avgVolume:  12_000_000, marketCap:   703_000_000_000, pe:  35.4, eps:   2.47, week52High:   96.14, week52Low:   58.38, sector: 'Consumer Staples',      industry: 'Discount Stores' },
  { symbol: 'COST',  name: 'Costco Wholesale',           price: 912.34,   change:   8.90, changePercent:  0.98, open: 905.00,  high: 914.50,  low: 904.00,  prevClose: 903.44,  volume:   1_456_700, avgVolume:   2_000_000, marketCap:   404_000_000_000, pe:  57.2, eps:  15.95, week52High: 1011.33, week52Low:  638.73, sector: 'Consumer Staples',      industry: 'Discount Stores' },
  { symbol: 'PG',    name: 'Procter & Gamble',           price: 168.45,   change:   0.87, changePercent:  0.52, open: 167.80,  high: 169.10,  low: 167.50,  prevClose: 167.58,  volume:   6_234_500, avgVolume:   7_500_000, marketCap:   397_000_000_000, pe:  27.3, eps:   6.17, week52High:  180.36, week52Low:  152.20, sector: 'Consumer Staples',      industry: 'Household Products' },
  { symbol: 'KO',    name: 'Coca-Cola Co.',              price:  71.23,   change:   0.45, changePercent:  0.64, open:  70.90,  high:  71.50,  low:  70.80,  prevClose:  70.78,  volume:  14_567_800, avgVolume:  17_000_000, marketCap:   307_000_000_000, pe:  26.2, eps:   2.72, week52High:   73.53, week52Low:   57.57, sector: 'Consumer Staples',      industry: 'Beverages' },
  { symbol: 'PEP',   name: 'PepsiCo Inc.',               price: 156.78,   change:  -0.67, changePercent: -0.43, open: 157.50,  high: 157.80,  low: 156.20,  prevClose: 157.45,  volume:   7_654_300, avgVolume:   9_000_000, marketCap:   214_000_000_000, pe:  24.5, eps:   6.40, week52High:  183.41, week52Low:  139.79, sector: 'Consumer Staples',      industry: 'Beverages' },
  { symbol: 'PM',    name: 'Philip Morris Intl.',        price: 145.67,   change:   0.89, changePercent:  0.62, open: 144.90,  high: 146.10,  low: 144.70,  prevClose: 144.78,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:   226_000_000_000, pe:  18.3, eps:   7.96, week52High:  175.88, week52Low:  103.20, sector: 'Consumer Staples',      industry: 'Tobacco' },

  // ── Financials ───────────────────────────────────────────────────────
  { symbol: 'BRK.B', name: 'Berkshire Hathaway',         price: 456.78,   change:   0.54, changePercent:  0.12, open: 456.10,  high: 457.90,  low: 455.30,  prevClose: 456.24,  volume:   3_234_500, avgVolume:   4_000_000, marketCap:   996_000_000_000, pe:  23.1, eps:  19.77, week52High:  481.50, week52Low:  340.80, sector: 'Financials',             industry: 'Diversified' },
  { symbol: 'JPM',   name: 'JPMorgan Chase',             price: 234.67,   change:  -1.23, changePercent: -0.52, open: 236.10,  high: 236.80,  low: 233.90,  prevClose: 235.90,  volume:   9_876_500, avgVolume:  11_000_000, marketCap:   675_000_000_000, pe:  12.4, eps:  18.93, week52High:  260.10, week52Low:  172.20, sector: 'Financials',             industry: 'Banking' },
  { symbol: 'V',     name: 'Visa Inc.',                  price: 298.45,   change:   1.23, changePercent:  0.41, open: 297.50,  high: 299.80,  low: 296.90,  prevClose: 297.22,  volume:   6_234_500, avgVolume:   7_000_000, marketCap:   623_000_000_000, pe:  31.2, eps:   9.57, week52High:  313.25, week52Low:  220.20, sector: 'Financials',             industry: 'Payment Processing' },
  { symbol: 'MA',    name: 'Mastercard Inc.',            price: 498.67,   change:   2.11, changePercent:  0.42, open: 497.00,  high: 500.10,  low: 495.80,  prevClose: 496.56,  volume:   3_456_700, avgVolume:   4_200_000, marketCap:   463_000_000_000, pe:  37.5, eps:  13.29, week52High:  527.36, week52Low:  367.14, sector: 'Financials',             industry: 'Payment Processing' },
  { symbol: 'BAC',   name: 'Bank of America',            price:  44.67,   change:  -0.32, changePercent: -0.71, open:  45.00,  high:  45.20,  low:  44.50,  prevClose:  44.99,  volume:  34_567_800, avgVolume:  40_000_000, marketCap:   354_000_000_000, pe:  13.8, eps:   3.23, week52High:   47.62, week52Low:   30.20, sector: 'Financials',             industry: 'Banking' },
  { symbol: 'WFC',   name: 'Wells Fargo & Co.',          price:  67.34,   change:   0.45, changePercent:  0.67, open:  67.00,  high:  67.60,  low:  66.80,  prevClose:  66.89,  volume:  16_234_500, avgVolume:  19_000_000, marketCap:   244_000_000_000, pe:  13.1, eps:   5.14, week52High:   81.43, week52Low:   52.97, sector: 'Financials',             industry: 'Banking' },
  { symbol: 'GS',    name: 'Goldman Sachs',              price: 534.78,   change:   4.56, changePercent:  0.86, open: 531.20,  high: 536.10,  low: 530.80,  prevClose: 530.22,  volume:   2_345_600, avgVolume:   3_200_000, marketCap:   179_000_000_000, pe:  15.2, eps:  35.18, week52High:  582.28, week52Low:  368.67, sector: 'Financials',             industry: 'Investment Banking' },
  { symbol: 'MS',    name: 'Morgan Stanley',             price: 112.34,   change:   1.23, changePercent:  1.11, open: 111.30,  high: 112.80,  low: 111.00,  prevClose: 111.11,  volume:   7_654_300, avgVolume:   9_000_000, marketCap:   186_000_000_000, pe:  17.4, eps:   6.45, week52High:  128.00, week52Low:   83.27, sector: 'Financials',             industry: 'Investment Banking' },
  { symbol: 'COIN',  name: 'Coinbase Global',            price: 278.34,   change:  12.45, changePercent:  4.68, open: 266.50,  high: 280.20,  low: 265.80,  prevClose: 265.89,  volume:  14_567_200, avgVolume:  12_000_000, marketCap:    71_000_000_000, pe:  48.2, eps:   5.77, week52High:  349.75, week52Low:  115.19, sector: 'Financials',             industry: 'Crypto Exchange' },
  { symbol: 'PYPL',  name: 'PayPal Holdings',            price:  68.45,   change:   0.89, changePercent:  1.32, open:  67.80,  high:  68.90,  low:  67.60,  prevClose:  67.56,  volume:  12_345_600, avgVolume:  14_000_000, marketCap:    72_000_000_000, pe:  17.8, eps:   3.84, week52High:   90.87, week52Low:   57.48, sector: 'Financials',             industry: 'Fintech' },
  { symbol: 'SQ',    name: 'Block Inc.',                 price:  68.90,   change:   1.45, changePercent:  2.15, open:  67.80,  high:  69.50,  low:  67.50,  prevClose:  67.45,  volume:   8_765_400, avgVolume:  10_000_000, marketCap:    42_000_000_000, pe:   0.0, eps:  -0.23, week52High:   98.32, week52Low:   55.80, sector: 'Financials',             industry: 'Fintech' },
  { symbol: 'AXP',   name: 'American Express',           price: 278.34,   change:   2.12, changePercent:  0.77, open: 276.50,  high: 279.10,  low: 276.20,  prevClose: 276.22,  volume:   2_345_600, avgVolume:   3_000_000, marketCap:   198_000_000_000, pe:  20.4, eps:  13.64, week52High:  327.49, week52Low:  209.34, sector: 'Financials',             industry: 'Payment Processing' },
  { symbol: 'C',     name: 'Citigroup Inc.',             price:  72.34,   change:   0.45, changePercent:  0.63, open:  71.90,  high:  72.60,  low:  71.80,  prevClose:  71.89,  volume:  18_765_400, avgVolume:  22_000_000, marketCap:   138_000_000_000, pe:  13.2, eps:   5.48, week52High:   84.79, week52Low:   53.94, sector: 'Financials',             industry: 'Banking' },

  // ── Healthcare ───────────────────────────────────────────────────────
  { symbol: 'LLY',   name: 'Eli Lilly and Co.',          price: 812.34,   change:  -5.67, changePercent: -0.69, open: 818.50,  high: 820.10,  low: 810.20,  prevClose: 818.01,  volume:   2_345_600, avgVolume:   3_000_000, marketCap:   772_000_000_000, pe: 115.2, eps:   7.05, week52High:  972.53, week52Low:  640.24, sector: 'Healthcare',             industry: 'Pharmaceuticals' },
  { symbol: 'UNH',   name: 'UnitedHealth Group',         price: 523.44,   change:  -3.21, changePercent: -0.61, open: 527.10,  high: 528.00,  low: 521.80,  prevClose: 526.65,  volume:   3_123_400, avgVolume:   3_800_000, marketCap:   484_000_000_000, pe:  22.3, eps:  23.47, week52High:  600.99, week52Low:  440.12, sector: 'Healthcare',             industry: 'Managed Care' },
  { symbol: 'JNJ',   name: 'Johnson & Johnson',          price: 154.67,   change:   0.45, changePercent:  0.29, open: 154.30,  high: 155.10,  low: 154.00,  prevClose: 154.22,  volume:   7_234_500, avgVolume:   9_000_000, marketCap:   373_000_000_000, pe:  22.4, eps:   6.90, week52High:  168.85, week52Low:  143.13, sector: 'Healthcare',             industry: 'Diversified' },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',                price: 178.34,   change:   1.23, changePercent:  0.69, open: 177.20,  high: 179.00,  low: 177.00,  prevClose: 177.11,  volume:   5_432_100, avgVolume:   7_000_000, marketCap:   315_000_000_000, pe:  56.8, eps:   3.14, week52High:  200.44, week52Low:  143.56, sector: 'Healthcare',             industry: 'Pharmaceuticals' },
  { symbol: 'MRK',   name: 'Merck & Co.',                price: 108.34,   change:   0.87, changePercent:  0.81, open: 107.60,  high: 108.80,  low: 107.40,  prevClose: 107.47,  volume:  10_234_500, avgVolume:  12_000_000, marketCap:   273_000_000_000, pe:  14.6, eps:   7.42, week52High:  134.63, week52Low:  100.50, sector: 'Healthcare',             industry: 'Pharmaceuticals' },
  { symbol: 'PFE',   name: 'Pfizer Inc.',                price:  26.78,   change:  -0.23, changePercent: -0.85, open:  27.00,  high:  27.10,  low:  26.60,  prevClose:  27.01,  volume:  34_567_800, avgVolume:  40_000_000, marketCap:   151_000_000_000, pe:  12.3, eps:   2.18, week52High:   31.54, week52Low:   24.48, sector: 'Healthcare',             industry: 'Pharmaceuticals' },
  { symbol: 'TMO',   name: 'Thermo Fisher Scientific',   price: 456.78,   change:   3.45, changePercent:  0.76, open: 454.00,  high: 458.00,  low: 453.50,  prevClose: 453.33,  volume:   1_456_700, avgVolume:   2_000_000, marketCap:   175_000_000_000, pe:  28.4, eps:  16.08, week52High:  605.75, week52Low:  444.19, sector: 'Healthcare',             industry: 'Life Sciences Tools' },
  { symbol: 'ISRG',  name: 'Intuitive Surgical',         price: 512.34,   change:   6.78, changePercent:  1.34, open: 506.00,  high: 513.50,  low: 505.50,  prevClose: 505.56,  volume:   1_234_500, avgVolume:   1_600_000, marketCap:   181_000_000_000, pe:  78.2, eps:   6.55, week52High:  567.89, week52Low:  350.37, sector: 'Healthcare',             industry: 'Medical Devices' },
  { symbol: 'AMGN',  name: 'Amgen Inc.',                 price: 278.45,   change:   1.23, changePercent:  0.44, open: 277.40,  high: 279.10,  low: 277.20,  prevClose: 277.22,  volume:   3_234_500, avgVolume:   4_000_000, marketCap:   148_000_000_000, pe:  17.3, eps:  16.10, week52High:  345.48, week52Low:  255.65, sector: 'Healthcare',             industry: 'Biotechnology' },

  // ── Industrials ──────────────────────────────────────────────────────
  { symbol: 'CAT',   name: 'Caterpillar Inc.',           price: 378.45,   change:   2.34, changePercent:  0.62, open: 376.50,  high: 379.80,  low: 376.00,  prevClose: 376.11,  volume:   2_345_600, avgVolume:   3_000_000, marketCap:   183_000_000_000, pe:  17.8, eps:  21.26, week52High:  418.00, week52Low:  282.17, sector: 'Industrials',            industry: 'Heavy Machinery' },
  { symbol: 'GE',    name: 'GE Aerospace',               price: 198.34,   change:   2.45, changePercent:  1.25, open: 196.20,  high: 199.10,  low: 196.00,  prevClose: 195.89,  volume:   7_654_300, avgVolume:   9_000_000, marketCap:   215_000_000_000, pe:  38.4, eps:   5.17, week52High:  218.90, week52Low:  128.12, sector: 'Industrials',            industry: 'Aerospace & Defense' },
  { symbol: 'RTX',   name: 'RTX Corp.',                  price: 134.56,   change:   0.78, changePercent:  0.58, open: 133.90,  high: 134.90,  low: 133.70,  prevClose: 133.78,  volume:   6_234_500, avgVolume:   7_500_000, marketCap:   177_000_000_000, pe:  35.2, eps:   3.82, week52High:  138.43, week52Low:  102.72, sector: 'Industrials',            industry: 'Aerospace & Defense' },
  { symbol: 'HON',   name: 'Honeywell International',    price: 212.34,   change:   0.89, changePercent:  0.42, open: 211.60,  high: 212.80,  low: 211.40,  prevClose: 211.45,  volume:   3_456_700, avgVolume:   4_200_000, marketCap:   138_000_000_000, pe:  24.6, eps:   8.63, week52High:  231.31, week52Low:  189.94, sector: 'Industrials',            industry: 'Conglomerates' },
  { symbol: 'UPS',   name: 'United Parcel Service',      price: 112.45,   change:  -0.67, changePercent: -0.59, open: 113.20,  high: 113.50,  low: 112.10,  prevClose: 113.12,  volume:   5_432_100, avgVolume:   6_500_000, marketCap:    96_000_000_000, pe:  18.5, eps:   6.08, week52High:  160.25, week52Low:  103.47, sector: 'Industrials',            industry: 'Shipping & Logistics' },
  { symbol: 'BA',    name: 'Boeing Co.',                 price: 178.23,   change:   2.12, changePercent:  1.20, open: 176.50,  high: 179.00,  low: 176.20,  prevClose: 176.11,  volume:   8_765_400, avgVolume:  10_000_000, marketCap:   117_000_000_000, pe:   0.0, eps: -10.97, week52High:  220.25, week52Low:  137.15, sector: 'Industrials',            industry: 'Aerospace & Defense' },
  { symbol: 'LMT',   name: 'Lockheed Martin',            price: 456.78,   change:   3.45, changePercent:  0.76, open: 454.00,  high: 458.00,  low: 453.50,  prevClose: 453.33,  volume:   1_234_500, avgVolume:   1_600_000, marketCap:   110_000_000_000, pe:  17.4, eps:  26.25, week52High:  620.77, week52Low:  413.92, sector: 'Industrials',            industry: 'Aerospace & Defense' },

  // ── Energy ───────────────────────────────────────────────────────────
  { symbol: 'XOM',   name: 'Exxon Mobil Corp.',          price: 118.23,   change:   0.87, changePercent:  0.74, open: 117.60,  high: 118.90,  low: 117.20,  prevClose: 117.36,  volume:  14_567_800, avgVolume:  18_000_000, marketCap:   476_000_000_000, pe:  14.2, eps:   8.32, week52High:  126.34, week52Low:   95.77, sector: 'Energy',                 industry: 'Integrated Oil & Gas' },
  { symbol: 'CVX',   name: 'Chevron Corp.',              price: 148.23,   change:   1.12, changePercent:  0.76, open: 147.30,  high: 148.80,  low: 147.10,  prevClose: 147.11,  volume:   9_876_500, avgVolume:  12_000_000, marketCap:   269_000_000_000, pe:  14.8, eps:  10.02, week52High:  167.11, week52Low:  131.58, sector: 'Energy',                 industry: 'Integrated Oil & Gas' },
  { symbol: 'COP',   name: 'ConocoPhillips',             price:  98.34,   change:   0.67, changePercent:  0.69, open:  97.80,  high:  98.70,  low:  97.60,  prevClose:  97.67,  volume:   8_234_500, avgVolume:  10_000_000, marketCap:   126_000_000_000, pe:  12.4, eps:   7.93, week52High:  128.75, week52Low:   95.22, sector: 'Energy',                 industry: 'Oil & Gas E&P' },
  { symbol: 'OXY',   name: 'Occidental Petroleum',       price:  48.67,   change:   0.45, changePercent:  0.93, open:  48.30,  high:  48.90,  low:  48.10,  prevClose:  48.22,  volume:  12_345_600, avgVolume:  15_000_000, marketCap:    48_000_000_000, pe:  12.6, eps:   3.86, week52High:   73.11, week52Low:   43.58, sector: 'Energy',                 industry: 'Oil & Gas E&P' },

  // ── Real Estate ──────────────────────────────────────────────────────
  { symbol: 'AMT',   name: 'American Tower Corp.',       price: 178.45,   change:   1.34, changePercent:  0.76, open: 177.30,  high: 179.10,  low: 177.00,  prevClose: 177.11,  volume:   2_345_600, avgVolume:   3_000_000, marketCap:    83_000_000_000, pe:  42.1, eps:   4.24, week52High:  220.04, week52Low:  158.35, sector: 'Real Estate',            industry: 'Cell Towers' },
  { symbol: 'PLD',   name: 'Prologis Inc.',              price: 112.34,   change:   0.89, changePercent:  0.80, open: 111.60,  high: 112.80,  low: 111.40,  prevClose: 111.45,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:   105_000_000_000, pe:  34.5, eps:   3.26, week52High:  135.53, week52Low:   99.26, sector: 'Real Estate',            industry: 'Industrial REIT' },
  { symbol: 'EQIX',  name: 'Equinix Inc.',               price: 812.34,   change:   8.90, changePercent:  1.11, open: 804.00,  high: 814.50,  low: 803.00,  prevClose: 803.44,  volume:     567_800, avgVolume:     700_000, marketCap:    78_000_000_000, pe:  78.4, eps:  10.36, week52High:  931.94, week52Low:  714.18, sector: 'Real Estate',            industry: 'Data Center REIT' },

  // ── Utilities ────────────────────────────────────────────────────────
  { symbol: 'NEE',   name: 'NextEra Energy',             price:  72.34,   change:   0.45, changePercent:  0.63, open:  71.90,  high:  72.60,  low:  71.80,  prevClose:  71.89,  volume:   9_876_500, avgVolume:  12_000_000, marketCap:   147_000_000_000, pe:  20.4, eps:   3.55, week52High:   84.67, week52Low:   61.21, sector: 'Utilities',              industry: 'Electric Utilities' },
  { symbol: 'SO',    name: 'Southern Company',           price:  88.45,   change:   0.34, changePercent:  0.39, open:  88.20,  high:  88.70,  low:  88.00,  prevClose:  88.11,  volume:   6_234_500, avgVolume:   7_500_000, marketCap:    98_000_000_000, pe:  21.3, eps:   4.15, week52High:   94.19, week52Low:   68.07, sector: 'Utilities',              industry: 'Electric Utilities' },
  { symbol: 'DUK',   name: 'Duke Energy Corp.',          price:  98.23,   change:   0.34, changePercent:  0.35, open:  97.90,  high:  98.50,  low:  97.80,  prevClose:  97.89,  volume:   4_567_800, avgVolume:   5_500_000, marketCap:    75_000_000_000, pe:  19.8, eps:   4.96, week52High:  115.33, week52Low:   88.28, sector: 'Utilities',              industry: 'Electric Utilities' },

  // ── Materials ────────────────────────────────────────────────────────
  { symbol: 'LIN',   name: 'Linde PLC',                  price: 467.34,   change:   3.45, changePercent:  0.74, open: 464.20,  high: 468.50,  low: 463.90,  prevClose: 463.89,  volume:   1_456_700, avgVolume:   2_000_000, marketCap:   224_000_000_000, pe:  32.4, eps:  14.42, week52High:  487.40, week52Low:  393.91, sector: 'Materials',              industry: 'Specialty Chemicals' },
  { symbol: 'FCX',   name: 'Freeport-McMoRan',           price:  42.34,   change:   0.89, changePercent:  2.15, open:  41.60,  high:  42.60,  low:  41.50,  prevClose:  41.45,  volume:  23_456_700, avgVolume:  28_000_000, marketCap:    61_000_000_000, pe:  18.6, eps:   2.28, week52High:   55.21, week52Low:   33.32, sector: 'Materials',              industry: 'Copper Mining' },
  { symbol: 'NEM',   name: 'Newmont Corp.',              price:  42.78,   change:   0.56, changePercent:  1.33, open:  42.30,  high:  43.00,  low:  42.20,  prevClose:  42.22,  volume:  12_345_600, avgVolume:  15_000_000, marketCap:    54_000_000_000, pe:  24.5, eps:   1.75, week52High:   58.69, week52Low:   35.08, sector: 'Materials',              industry: 'Gold Mining' },
]

export const DEMO_SECTORS: SectorPerformance[] = [
  { sector: 'Technology', etf: 'XLK', change: 2.31, changePercent: 2.31, topStock: 'NVDA' },
  { sector: 'Communication Services', etf: 'XLC', change: 1.54, changePercent: 1.54, topStock: 'META' },
  { sector: 'Consumer Discretionary', etf: 'XLY', change: 0.87, changePercent: 0.87, topStock: 'AMZN' },
  { sector: 'Financials', etf: 'XLF', change: 0.32, changePercent: 0.32, topStock: 'GS' },
  { sector: 'Healthcare', etf: 'XLV', change: -0.12, changePercent: -0.12, topStock: 'LLY' },
  { sector: 'Industrials', etf: 'XLI', change: -0.44, changePercent: -0.44, topStock: 'CAT' },
  { sector: 'Energy', etf: 'XLE', change: -0.88, changePercent: -0.88, topStock: 'XOM' },
  { sector: 'Utilities', etf: 'XLU', change: -1.23, changePercent: -1.23, topStock: 'NEE' },
  { sector: 'Real Estate', etf: 'XLRE', change: -0.67, changePercent: -0.67, topStock: 'AMT' },
  { sector: 'Materials', etf: 'XLB', change: 0.19, changePercent: 0.19, topStock: 'LIN' },
  { sector: 'Consumer Staples', etf: 'XLP', change: 0.05, changePercent: 0.05, topStock: 'PG' },
]

export const DEMO_NEWS: NewsItem[] = [
  {
    id: '1',
    headline: 'NVIDIA Crushes Q1 Estimates with $26B Revenue, AI Demand Remains Insatiable',
    summary: 'NVIDIA reported first-quarter revenue of $26 billion, surpassing analyst estimates by 8%, as demand for its H100 and Blackwell AI chips continues to surge across hyperscalers and enterprise customers.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 3600,
    source: 'Reuters',
    sentiment: 'positive',
    sentimentScore: 0.82,
    relatedStocks: ['NVDA', 'AMD', 'TSM', 'MSFT', 'GOOGL'],
    category: 'earnings',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  },
  {
    id: '2',
    headline: 'Federal Reserve Signals Potential Rate Cut as Inflation Cools to 2.4%',
    summary: 'Fed Chair Jerome Powell indicated the central bank may be approaching the threshold for interest rate reductions after the latest CPI data showed inflation falling to 2.4%, closer to the 2% target.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 7200,
    source: 'Bloomberg',
    sentiment: 'positive',
    sentimentScore: 0.65,
    relatedStocks: ['SPY', 'QQQ', 'JPM', 'BAC', 'GS'],
    category: 'macro',
  },
  {
    id: '3',
    headline: 'Tesla Faces New Competition as Chinese EV Maker BYD Enters US Market',
    summary: 'BYD announced plans to begin selling electric vehicles in the United States by 2026, intensifying competition for Tesla as the Chinese automaker now outsells Tesla globally.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 10800,
    source: 'Wall Street Journal',
    sentiment: 'negative',
    sentimentScore: -0.55,
    relatedStocks: ['TSLA', 'GM', 'F', 'RIVN'],
    category: 'industry',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    id: '4',
    headline: 'Apple Unveils iOS 19 with On-Device AI Features Powered by Custom Neural Engine',
    summary: 'Apple announced iOS 19 featuring advanced on-device AI capabilities including intelligent writing assistance, real-time language translation, and predictive photo editing, all processed locally on Apple Silicon.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 14400,
    source: 'TechCrunch',
    sentiment: 'positive',
    sentimentScore: 0.71,
    relatedStocks: ['AAPL', 'QCOM', 'NVDA'],
    category: 'product',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
  },
  {
    id: '5',
    headline: 'Amazon AWS Revenue Grows 22% as Enterprise Cloud Migration Accelerates',
    summary: 'Amazon Web Services posted revenue of $25.1 billion in Q1, a 22% year-over-year increase, as enterprises accelerate migration to the cloud and adoption of AI services like Bedrock.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 18000,
    source: 'CNBC',
    sentiment: 'positive',
    sentimentScore: 0.74,
    relatedStocks: ['AMZN', 'MSFT', 'GOOGL', 'SNOW'],
    category: 'earnings',
  },
  {
    id: '6',
    headline: 'Coinbase Surges as Bitcoin Hits $72,000 on ETF Inflow Momentum',
    summary: 'Coinbase shares rallied 12% after Bitcoin climbed to $72,000, driven by record inflows into spot Bitcoin ETFs. Analysts raise price targets citing increased institutional adoption.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 21600,
    source: 'CoinDesk',
    sentiment: 'positive',
    sentimentScore: 0.78,
    relatedStocks: ['COIN', 'MSTR', 'HOOD', 'SQ'],
    category: 'crypto',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400',
  },
  {
    id: '7',
    headline: 'Meta AI Studio Attracts 500M Users in 30 Days, Challenging OpenAI',
    summary: 'Meta announced its AI Studio platform has reached 500 million monthly active users within its first month, powered by the Llama 3 model, directly challenging OpenAI and Google in the consumer AI market.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 25200,
    source: 'The Verge',
    sentiment: 'positive',
    sentimentScore: 0.69,
    relatedStocks: ['META', 'GOOGL', 'MSFT', 'NVDA'],
    category: 'ai',
  },
  {
    id: '8',
    headline: 'Oil Prices Drop 3% on Supply Glut Fears as OPEC+ Considers Output Hike',
    summary: 'WTI crude oil fell below $74 per barrel after sources indicated OPEC+ is considering increasing oil production by 400,000 barrels per day starting June, raising fears of a supply surplus.',
    url: 'https://finnhub.io',
    datetime: Math.floor(Date.now() / 1000) - 28800,
    source: 'Reuters',
    sentiment: 'negative',
    sentimentScore: -0.62,
    relatedStocks: ['XOM', 'CVX', 'COP', 'OXY'],
    category: 'commodities',
  },
]

// Generate realistic candle data for demo
export function generateDemoCandles(days = 90, basePrice = 150): Candle[] {
  const candles: Candle[] = []
  let price = basePrice
  const now = Date.now()

  for (let i = days; i >= 0; i--) {
    const time = now - i * 86400_000
    const change = (Math.random() - 0.48) * price * 0.025
    const open = price
    price = Math.max(1, price + change)
    const high = Math.max(open, price) * (1 + Math.random() * 0.01)
    const low = Math.min(open, price) * (1 - Math.random() * 0.01)
    candles.push({
      time,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +price.toFixed(2),
      volume: Math.floor(Math.random() * 50_000_000 + 10_000_000),
    })
  }
  return candles
}
