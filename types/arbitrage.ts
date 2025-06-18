export interface ExchangePrice {
  exchange: string;
  price: number;
}

export interface ArbitrageOpportunity {
  coin: string;
  symbol: string;
  buyTarget: ExchangePrice;
  sellTarget: ExchangePrice;
  spreadPercentage: number;
  lastUpdated: string;
}