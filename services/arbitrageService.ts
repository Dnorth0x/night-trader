import { Platform } from 'react-native';
import { ArbitrageOpportunity } from '@/types/arbitrage';

// Mock data for development and web platform
const MOCK_OPPORTUNITIES: Record<string, ArbitrageOpportunity> = {
  bitcoin: {
    coin: "Bitcoin",
    symbol: "BTC",
    buyTarget: { exchange: "Kraken", price: 68000.50 },
    sellTarget: { exchange: "Binance", price: 68250.75 },
    spreadPercentage: 0.368,
    lastUpdated: new Date().toISOString()
  },
  ethereum: {
    coin: "Ethereum",
    symbol: "ETH",
    buyTarget: { exchange: "Coinbase", price: 3440.25 },
    sellTarget: { exchange: "KuCoin", price: 3455.80 },
    spreadPercentage: 0.452,
    lastUpdated: new Date().toISOString()
  },
  binancecoin: {
    coin: "BNB",
    symbol: "BNB",
    buyTarget: { exchange: "Bitstamp", price: 635.40 },
    sellTarget: { exchange: "Binance", price: 638.90 },
    spreadPercentage: 0.551,
    lastUpdated: new Date().toISOString()
  },
  solana: {
    coin: "Solana",
    symbol: "SOL",
    buyTarget: { exchange: "Kraken", price: 245.60 },
    sellTarget: { exchange: "KuCoin", price: 247.20 },
    spreadPercentage: 0.651,
    lastUpdated: new Date().toISOString()
  },
};

// Supported exchanges for filtering
const SUPPORTED_EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Bitstamp'];

export class ArbitrageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ArbitrageError';
  }
}

export async function fetchArbitrageOpportunity(coinId: string): Promise<ArbitrageOpportunity> {
  // For demo purposes or when running on web, return mock data
  if (Platform.OS === 'web' || __DEV__) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new ArbitrageError(
        `Failed to fetch data for ${coinId}. Please try again.`,
        'FETCH_ERROR'
      );
    }
    
    const mockData = MOCK_OPPORTUNITIES[coinId];
    if (!mockData) {
      throw new ArbitrageError(
        `No arbitrage data available for ${coinId}`,
        'NO_DATA'
      );
    }
    
    // Return slightly different data each time to simulate updates
    return {
      ...mockData,
      buyTarget: { 
        ...mockData.buyTarget, 
        price: mockData.buyTarget.price + (Math.random() * 100 - 50)
      },
      sellTarget: { 
        ...mockData.sellTarget, 
        price: mockData.sellTarget.price + (Math.random() * 100 - 50)
      },
      spreadPercentage: Math.random() * 1.5 + 0.1,
      lastUpdated: new Date().toISOString()
    };
  }
  
  try {
    // In production, this would call the CoinGecko API
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/tickers`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ArbitrageError(
          `Cryptocurrency "${coinId}" not found`,
          'COIN_NOT_FOUND'
        );
      }
      throw new ArbitrageError(
        `API error: ${response.status}`,
        'API_ERROR'
      );
    }
    
    const data = await response.json();
    
    if (!data.tickers || data.tickers.length === 0) {
      throw new ArbitrageError(
        `No trading data available for ${coinId}`,
        'NO_TRADING_DATA'
      );
    }
    
    // Filter for supported exchanges
    const supportedTickers = data.tickers.filter((ticker: any) => 
      SUPPORTED_EXCHANGES.includes(ticker.market?.name)
    );
    
    if (supportedTickers.length < 2) {
      throw new ArbitrageError(
        `Insufficient exchange data for arbitrage analysis`,
        'INSUFFICIENT_DATA'
      );
    }
    
    // Find best buy and sell opportunities
    const prices = supportedTickers.map((ticker: any) => ({
      exchange: ticker.market.name,
      price: ticker.last || ticker.converted_last?.usd || 0
    })).filter(p => p.price > 0);
    
    if (prices.length < 2) {
      throw new ArbitrageError(
        `Unable to find valid price data`,
        'INVALID_PRICE_DATA'
      );
    }
    
    const sortedPrices = prices.sort((a, b) => a.price - b.price);
    const buyTarget = sortedPrices[0];
    const sellTarget = sortedPrices[sortedPrices.length - 1];
    
    const spreadPercentage = ((sellTarget.price - buyTarget.price) / buyTarget.price) * 100;
    
    return {
      coin: data.name,
      symbol: data.symbol?.toUpperCase() || coinId.toUpperCase(),
      buyTarget,
      sellTarget,
      spreadPercentage,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    if (error instanceof ArbitrageError) {
      throw error;
    }
    
    console.error('Error fetching arbitrage data:', error);
    throw new ArbitrageError(
      'Network error. Please check your connection and try again.',
      'NETWORK_ERROR'
    );
  }
}

// Legacy function for backward compatibility
export async function fetchArbitrageOpportunities(): Promise<ArbitrageOpportunity> {
  return fetchArbitrageOpportunity('bitcoin');
}