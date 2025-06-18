import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Search, Plus, TrendingUp } from 'lucide-react-native';
import { POPULAR_COINS, PopularCoin } from '@/constants/popularCoins';
import { useCoinStore, TrackedCoin } from '@/stores/coinStore';
import Colors from '@/constants/colors';

interface CoinSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onCoinAdded: (coin: TrackedCoin) => void;
}

export default function CoinSearchModal({ 
  visible, 
  onClose, 
  onCoinAdded 
}: CoinSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PopularCoin[]>([]);
  const { trackedCoins } = useCoinStore();

  const filteredPopularCoins = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_COINS;
    
    return POPULAR_COINS.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // In a real app, this would search the CoinGecko API
      // For now, we'll simulate a search with popular coins
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = POPULAR_COINS.filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCoin = (coin: PopularCoin) => {
    const newCoin: TrackedCoin = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      addedAt: new Date().toISOString(),
    };
    
    onCoinAdded(newCoin);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const isAlreadyTracked = (coinId: string) => {
    return trackedCoins.some(coin => coin.id === coinId);
  };

  const coinsToShow = searchQuery.trim().length >= 2 ? searchResults : filteredPopularCoins;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Cryptocurrency</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.dark.text} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cryptocurrencies..."
            placeholderTextColor={Colors.dark.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <ActivityIndicator size="small" color={Colors.dark.primary} />
          )}
        </View>

        {/* Popular/Search Results */}
        <View style={styles.sectionHeader}>
          <TrendingUp size={16} color={Colors.dark.primary} />
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? 'Search Results' : 'Popular Cryptocurrencies'}
          </Text>
        </View>

        <ScrollView style={styles.coinsList} showsVerticalScrollIndicator={false}>
          {coinsToShow.map((coin) => {
            const isTracked = isAlreadyTracked(coin.id);
            
            return (
              <Pressable
                key={coin.id}
                style={({ pressed }) => [
                  styles.coinItem,
                  pressed && styles.coinItemPressed,
                  isTracked && styles.coinItemDisabled,
                ]}
                onPress={() => !isTracked && handleAddCoin(coin)}
                disabled={isTracked}
              >
                <View style={styles.coinInfo}>
                  <Text style={styles.coinName}>{coin.name}</Text>
                  <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                </View>
                
                <View style={styles.coinAction}>
                  {isTracked ? (
                    <Text style={styles.trackedText}>Added</Text>
                  ) : (
                    <View style={styles.addButton}>
                      <Plus size={16} color={Colors.dark.primary} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
          
          {coinsToShow.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No cryptocurrencies found for "{searchQuery}"
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  coinsList: {
    flex: 1,
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  coinItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  coinItemDisabled: {
    opacity: 0.5,
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  coinSymbol: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  coinAction: {
    alignItems: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  trackedText: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '500',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});