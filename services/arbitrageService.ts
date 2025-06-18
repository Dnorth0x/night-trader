import { Platform } from 'react-native';
import { ArbitrageOpportunity } from '@/types/arbitrage';

// Mock data for development and web platform
const MOCK_OPPORTUNITY: ArbitrageOpportunity = {
  coin: "Bitcoin",
  symbol: "BTC",
  buyTarget: { exchange: "Kraken", price: 68000.50 },
  sellTarget: { exchange: "Binance", price: 68250.75 },
  spreadPercentage: 0.368,
  lastUpdated: new Date().toISOString()
};

// In a real app, this would be an environment variable
const API_URL = 'https://api.example.com/arbitrage-opportunities';

export async function fetchArbitrageOpportunities(): Promise<ArbitrageOpportunity> {
  // For demo purposes or when running on web, return mock data
  if (Platform.OS === 'web' || __DEV__) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return slightly different data each time to simulate updates
    return {
      ...MOCK_OPPORTUNITY,
      buyTarget: { 
        ...MOCK_OPPORTUNITY.buyTarget, 
        price: MOCK_OPPORTUNITY.buyTarget.price + (Math.random() * 100 - 50)
      },
      sellTarget: { 
        ...MOCK_OPPORTUNITY.sellTarget, 
        price: MOCK_OPPORTUNITY.sellTarget.price + (Math.random() * 100 - 50)
      },
      lastUpdated: new Date().toISOString()
    };
  }
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as ArbitrageOpportunity;
  } catch (error) {
    console.error('Error fetching arbitrage data:', error);
    throw error;
  }
}