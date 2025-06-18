import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCoinStore } from '@/stores/coinStore';
import { fetchArbitrageOpportunity, ArbitrageError } from '@/services/arbitrageService';
import OpportunityCard from '@/components/OpportunityCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';
import EmptyState from '@/components/EmptyState';
import CoinSearchModal from '@/components/CoinSearchModal';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  
  const {
    trackedCoins,
    opportunities,
    isLoading,
    errors,
    addCoin,
    removeCoin,
    setOpportunity,
    setLoading,
    setError,
    clearError,
  } = useCoinStore();

  const fetchDataForCoin = useCallback(async (coinId: string) => {
    try {
      setLoading(coinId, true);
      clearError(coinId);
      
      const opportunity = await fetchArbitrageOpportunity(coinId);
      setOpportunity(coinId, opportunity);
    } catch (error) {
      console.error(`Error fetching data for ${coinId}:`, error);
      
      if (error instanceof ArbitrageError) {
        setError(coinId, error.message);
      } else {
        setError(coinId, 'Failed to fetch arbitrage data. Please try again.');
      }
    } finally {
      setLoading(coinId, false);
    }
  }, [setLoading, clearError, setOpportunity, setError]);

  const fetchAllData = useCallback(async () => {
    const promises = trackedCoins.map(coin => fetchDataForCoin(coin.id));
    await Promise.allSettled(promises);
  }, [trackedCoins, fetchDataForCoin]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();

    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  const handleCardPress = (coinId: string) => {
    router.push(`/details/${coinId}`);
  };

  const handleRemoveCoin = (coinId: string) => {
    const coin = trackedCoins.find(c => c.id === coinId);
    removeCoin(coinId);
    showToast(`${coin?.name || 'Coin'} removed from dashboard`, 'success');
  };

  const handleAddCoin = (coin: any) => {
    addCoin(coin);
    showToast(`${coin.name} added to dashboard`, 'success');
    // Fetch data for the new coin
    fetchDataForCoin(coin.id);
  };

  const isInitialLoading = trackedCoins.length > 0 && 
    trackedCoins.every(coin => isLoading[coin.id] && !opportunities[coin.id]);

  if (isInitialLoading && !refreshing) {
    return <LoadingIndicator message="Loading arbitrage opportunities..." />;
  }

  if (trackedCoins.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState message="No cryptocurrencies tracked. Add some to get started!" />
        <View style={styles.emptyActions}>
          <Pressable 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color={Colors.dark.text} />
          </Pressable>
        </View>
        
        <CoinSearchModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCoinAdded={handleAddCoin}
        />
        
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {trackedCoins.map((coin) => {
          const opportunity = opportunities[coin.id];
          const loading = isLoading[coin.id];
          const error = errors[coin.id];

          if (loading && !opportunity) {
            return (
              <View key={coin.id} style={styles.cardContainer}>
                <LoadingIndicator message={`Loading ${coin.name}...`} />
              </View>
            );
          }

          if (error && !opportunity) {
            return (
              <View key={coin.id} style={styles.cardContainer}>
                <ErrorView 
                  message={error} 
                  onRetry={() => fetchDataForCoin(coin.id)} 
                />
              </View>
            );
          }

          if (opportunity) {
            return (
              <OpportunityCard
                key={coin.id}
                data={opportunity}
                onPress={() => handleCardPress(coin.id)}
                onRemove={() => handleRemoveCoin(coin.id)}
                showRemoveButton={trackedCoins.length > 1}
              />
            );
          }

          return null;
        })}
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable 
        style={styles.floatingAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color={Colors.dark.text} />
      </Pressable>

      <CoinSearchModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCoinAdded={handleAddCoin}
      />
      
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 100, // Space for floating button
  },
  cardContainer: {
    minHeight: 200,
    marginVertical: 8,
  },
  emptyActions: {
    alignItems: 'center',
    marginTop: 24,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});