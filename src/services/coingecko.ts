import { CryptoCoin, CoinDetail } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchMarketData = async (page = 1, perPage = 10): Promise<CryptoCoin[]> => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  
  return response.json();
};

export const fetchCoinDetail = async (coinId: string): Promise<CoinDetail> => {
  const response = await fetch(
    `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch coin details');
  }
  
  return response.json();
};

export const searchCoins = async (query: string): Promise<CryptoCoin[]> => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search coins');
  }
  
  const data: CryptoCoin[] = await response.json();
  return data.filter(
    coin =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
};
