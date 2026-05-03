// Maps stock symbols to their related keywords for news correlation
export const STOCK_KEYWORDS: Record<string, string[]> = {
  AAPL: ['apple', 'iphone', 'ipad', 'mac', 'macbook', 'ios', 'app store', 'tim cook', 'apple watch', 'vision pro', 'airpods'],
  MSFT: ['microsoft', 'windows', 'azure', 'teams', 'xbox', 'copilot', 'satya nadella', 'office 365', 'github', 'openai', 'bing'],
  GOOGL: ['google', 'alphabet', 'youtube', 'android', 'chrome', 'gemini', 'sundar pichai', 'waymo', 'deepmind', 'search engine'],
  AMZN: ['amazon', 'aws', 'prime', 'alexa', 'andy jassy', 'whole foods', 'kindle', 'twitch', 'cloud computing'],
  META: ['meta', 'facebook', 'instagram', 'whatsapp', 'zuckerberg', 'metaverse', 'threads', 'oculus', 'vr headset', 'reality labs'],
  NVDA: ['nvidia', 'gpu', 'cuda', 'jensen huang', 'geforce', 'ai chip', 'data center', 'blackwell', 'h100', 'tensorrt', 'ai accelerator'],
  TSLA: ['tesla', 'elon musk', 'electric vehicle', 'ev', 'autopilot', 'cybertruck', 'model s', 'model 3', 'gigafactory', 'full self-driving', 'fsd'],
  NFLX: ['netflix', 'streaming', 'reed hastings', 'password sharing', 'content spend'],
  AMD: ['amd', 'ryzen', 'radeon', 'lisa su', 'epyc', 'instinct', 'mi300'],
  INTC: ['intel', 'core processor', 'pat gelsinger', 'foundry', 'gaudi'],
  JPM: ['jpmorgan', 'jp morgan', 'jamie dimon', 'chase bank', 'investment banking'],
  GS: ['goldman sachs', 'goldman', 'wall street'],
  BAC: ['bank of america', 'bofa'],
  WFC: ['wells fargo'],
  C: ['citigroup', 'citi bank'],
  BRK: ['berkshire hathaway', 'warren buffett', 'charlie munger'],
  JNJ: ['johnson & johnson', 'j&j', 'medical devices'],
  PFE: ['pfizer', 'vaccine', 'oncology drug'],
  MRNA: ['moderna', 'mrna', 'covid vaccine'],
  UNH: ['unitedhealth', 'united health', 'insurance'],
  XOM: ['exxon', 'exxonmobil', 'oil price', 'crude oil', 'lng'],
  CVX: ['chevron', 'oil company'],
  COP: ['conocophillips', 'shale oil'],
  SPY: ['s&p 500', 'sp500', 'market crash', 'bull market', 'bear market', 'federal reserve', 'fed rate', 'inflation cpi'],
  QQQ: ['nasdaq', 'tech stocks', 'growth stocks'],
  COIN: ['coinbase', 'crypto exchange', 'bitcoin exchange'],
  SQ: ['square', 'block', 'jack dorsey', 'cash app'],
  PYPL: ['paypal', 'venmo', 'fintech'],
  UBER: ['uber', 'ridesharing', 'food delivery'],
  LYFT: ['lyft', 'ride-hailing'],
  ABNB: ['airbnb', 'short-term rental', 'vacation rental'],
  SNAP: ['snapchat', 'snap', 'augmented reality'],
  DIS: ['disney', 'disney+', 'bob iger', 'marvel', 'star wars', 'pixar', 'espn', 'theme park'],
  BA: ['boeing', 'aircraft', '737 max', '787 dreamliner', 'aerospace'],
  LMT: ['lockheed martin', 'f-35', 'defense contract'],
  RTX: ['raytheon', 'utx', 'defense'],
  GM: ['general motors', 'gm', 'cadillac', 'chevy'],
  F: ['ford', 'f-150', 'mustang', 'ford ev'],
  WMT: ['walmart', "sam's club", 'retail giant'],
  TGT: ['target', 'bullseye'],
  COST: ['costco', 'warehouse club'],
  HD: ['home depot', 'home improvement'],
  LOW: ["lowe's", 'lowes'],
  MCD: ["mcdonald's", 'mcdonalds', 'big mac', 'fast food'],
  SBUX: ['starbucks', 'coffee chain'],
  NKE: ['nike', 'jordan brand', 'air max'],
  ADBE: ['adobe', 'photoshop', 'creative cloud', 'acrobat'],
  CRM: ['salesforce', 'marc benioff', 'crm software'],
  ORCL: ['oracle', 'larry ellison', 'database'],
  IBM: ['ibm', 'watson', 'hybrid cloud'],
  QCOM: ['qualcomm', '5g chip', 'snapdragon', 'modem'],
  AVGO: ['broadcom', 'vmware', 'network chip'],
  TSM: ['tsmc', 'taiwan semiconductor', 'chip foundry'],
  ASML: ['asml', 'euv', 'lithography machine'],
  V: ['visa', 'payment network'],
  MA: ['mastercard', 'payment network'],
  BKNG: ['booking.com', 'booking holdings', 'priceline', 'travel booking'],
  SNOW: ['snowflake', 'data cloud'],
  PLTR: ['palantir', 'ai analytics', 'gotham'],
  DDOG: ['datadog', 'observability'],
  ZS: ['zscaler', 'zero trust', 'cloud security'],
  CRWD: ['crowdstrike', 'endpoint security', 'falcon'],
  NET: ['cloudflare', 'edge network', 'zero trust'],
  SHOP: ['shopify', 'e-commerce platform'],
  MELI: ['mercadolibre', 'latin america ecommerce'],
  SE: ['sea limited', 'shopee', 'garena'],
  BIDU: ['baidu', 'china search engine', 'ernie bot'],
  BABA: ['alibaba', 'taobao', 'tmall', 'jack ma', 'china ecommerce'],
  JD: ['jd.com', 'china logistics'],
  PDD: ['pinduoduo', 'temu'],
  RIVN: ['rivian', 'electric truck', 'amazon van'],
  LCID: ['lucid motors', 'luxury ev'],
}

// Given news text, return likely related stock symbols
export function findRelatedStocks(text: string, maxResults = 5): string[] {
  const lower = text.toLowerCase()
  const scores: Record<string, number> = {}

  for (const [symbol, keywords] of Object.entries(STOCK_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[symbol] = (scores[symbol] || 0) + 1
      }
    }
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults)
    .map(([symbol]) => symbol)
}
