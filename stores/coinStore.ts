import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArbitrageOpportunity } from '@/types/arbitrage';

export interface TrackedCoin {
  id: string;
  symbol: string;
  name: string;
  addedAt: string;
}

interface CoinStore {
  trackedCoins: TrackedCoin[];
  opportunities: Record<string, ArbitrageOpportunity>;
  isLoading: Record<string, boolean>;
  errors: Record<string, string>;
  
  // Actions
  addCoin: (coin: TrackedCoin) => void;
  removeCoin: (coinId: string) => void;
  setOpportunity: (coinId: string, opportunity: ArbitrageOpportunity) => void;
  setLoading: (coinId: string, loading: boolean) => void;
  setError: (coinId: string, error: string | null) => void;
  clearError: (coinId: string) => void;
}

export const useCoinStore = create<CoinStore>()(
  persist(
    (set, get) => ({
      trackedCoins: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          addedAt: new Date().toISOString(),
        }
      ],
      opportunities: {},
      isLoading: {},
      errors: {},

      addCoin: (coin) => {
        const { trackedCoins } = get();
        if (!trackedCoins.find(c => c.id === coin.id)) {
          set((state) => ({
            trackedCoins: [...state.trackedCoins, coin],
          }));
        }
      },

      removeCoin: (coinId) => {
        set((state) => ({
          trackedCoins: state.trackedCoins.filter(coin => coin.id !== coinId),
          opportunities: Object.fromEntries(
            Object.entries(state.opportunities).filter(([id]) => id !== coinId)
          ),
          isLoading: Object.fromEntries(
            Object.entries(state.isLoading).filter(([id]) => id !== coinId)
          ),
          errors: Object.fromEntries(
            Object.entries(state.errors).filter(([id]) => id !== coinId)
          ),
        }));
      },

      setOpportunity: (coinId, opportunity) => {
        set((state) => ({
          opportunities: {
            ...state.opportunities,
            [coinId]: opportunity,
          },
        }));
      },

      setLoading: (coinId, loading) => {
        set((state) => ({
          isLoading: {
            ...state.isLoading,
            [coinId]: loading,
          },
        }));
      },

      setError: (coinId, error) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [coinId]: error || '',
          },
        }));
      },

      clearError: (coinId) => {
        set((state) => ({
          errors: Object.fromEntries(
            Object.entries(state.errors).filter(([id]) => id !== coinId)
          ),
        }));
      },
    }),
    {
      name: 'coin-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ trackedCoins: state.trackedCoins }),
    }
  )
);