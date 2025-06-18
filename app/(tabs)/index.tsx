import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArbitrageOpportunity } from '@/types/arbitrage';
import { fetchArbitrageOpportunities } from '@/services/arbitrageService';
import OpportunityCard from '@/components/OpportunityCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorView from '@/components/ErrorView';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchArbitrageOpportunities();
      setOpportunity(data);
    } catch (err) {
      setError('Failed to fetch arbitrage opportunities. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleCardPress = () => {
    if (opportunity) {
      router.push(`/details/${opportunity.symbol.toLowerCase()}`);
    }
  };

  if (isLoading && !refreshing) {
    return <LoadingIndicator message="Finding arbitrage opportunities..." />;
  }

  if (error && !opportunity) {
    return <ErrorView message={error} onRetry={fetchData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.dark.primary}
          colors={[Colors.dark.primary]}
        />
      }
    >
      <View style={styles.cardsContainer}>
        {opportunity ? (
          <OpportunityCard data={opportunity} onPress={handleCardPress} />
        ) : (
          <EmptyState message="No arbitrage opportunities found at the moment. Pull down to refresh." />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  cardsContainer: {
    flex: 1,
  },
});