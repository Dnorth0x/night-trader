import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, Percent, Bell } from 'lucide-react-native';
import { useCoinStore } from '@/stores/coinStore';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import Colors from '@/constants/colors';

// Mock historical data for the detail view
const HISTORICAL_DATA = [
  { timestamp: '10:00 AM', buyExchange: 'Kraken', sellExchange: 'Binance', spread: 0.368 },
  { timestamp: '09:45 AM', buyExchange: 'Kraken', sellExchange: 'KuCoin', spread: 0.412 },
  { timestamp: '09:30 AM', buyExchange: 'Bitstamp', sellExchange: 'Binance', spread: 0.325 },
  { timestamp: '09:15 AM', buyExchange: 'Coinbase', sellExchange: 'KuCoin', spread: 0.289 },
  { timestamp: '09:00 AM', buyExchange: 'Kraken', sellExchange: 'Binance', spread: 0.375 },
];

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const coinId = typeof id === 'string' ? id : 'bitcoin';
  const { opportunities, trackedCoins } = useCoinStore();
  const { toast, showToast, hideToast } = useToast();
  
  const opportunity = opportunities[coinId];
  const coin = trackedCoins.find(c => c.id === coinId);
  
  // Mock additional data
  const [currentPrice, setCurrentPrice] = useState(68150.25);
  const [dayChange, setDayChange] = useState(1.25);
  const dayVolume = 2.5; // in billions

  useEffect(() => {
    if (opportunity) {
      // Use the average of buy and sell prices as current price
      const avgPrice = (opportunity.buyTarget.price + opportunity.sellTarget.price) / 2;
      setCurrentPrice(avgPrice);
      
      // Simulate day change
      setDayChange(Math.random() * 10 - 5);
    }
  }, [opportunity]);

  const handleSetAlert = () => {
    showToast(`Alert set for ${coin?.name || 'this cryptocurrency'}`, 'success');
  };

  if (!opportunity || !coin) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Opportunity data not available</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.symbol}>{opportunity.symbol}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${currentPrice.toLocaleString()}</Text>
            <View style={[styles.changeContainer, dayChange >= 0 ? styles.positive : styles.negative]}>
              {dayChange >= 0 ? (
                <ArrowUpRight size={16} color={Colors.dark.success} />
              ) : (
                <ArrowDownRight size={16} color={Colors.dark.danger} />
              )}
              <Text style={[styles.changeText, dayChange >= 0 ? styles.positiveText : styles.negativeText]}>
                {Math.abs(dayChange).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <DollarSign size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.statLabel}>24h Volume</Text>
            <Text style={styles.statValue}>${dayVolume}B</Text>
          </View>
          <View style={styles.statItem}>
            <Percent size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.statLabel}>Current Spread</Text>
            <Text style={styles.statValue}>{opportunity.spreadPercentage.toFixed(3)}%</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.statLabel}>Last Update</Text>
            <Text style={styles.statValue}>
              {new Date(opportunity.lastUpdated).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Current Opportunity */}
        <View style={styles.currentOpportunity}>
          <Text style={styles.sectionTitle}>Current Best Opportunity</Text>
          <View style={styles.opportunityCard}>
            <View style={styles.exchangeRow}>
              <View style={styles.exchangeInfo}>
                <Text style={styles.exchangeLabel}>BUY AT</Text>
                <Text style={styles.exchangeName}>{opportunity.buyTarget.exchange}</Text>
                <Text style={styles.buyPrice}>${opportunity.buyTarget.price.toLocaleString()}</Text>
              </View>
              <View style={styles.exchangeInfo}>
                <Text style={styles.exchangeLabel}>SELL AT</Text>
                <Text style={styles.exchangeName}>{opportunity.sellTarget.exchange}</Text>
                <Text style={styles.sellPrice}>${opportunity.sellTarget.price.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.profitInfo}>
              <Text style={styles.profitLabel}>Potential Profit</Text>
              <Text style={styles.profitValue}>
                ${(opportunity.sellTarget.price - opportunity.buyTarget.price).toFixed(2)} 
                ({opportunity.spreadPercentage.toFixed(3)}%)
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Recent Opportunities</Text>
        
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 2 }]}>Time</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Buy At</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Sell At</Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>Spread</Text>
          </View>
          
          {HISTORICAL_DATA.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.cell, { flex: 2 }]}>{item.timestamp}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.buyExchange}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.sellExchange}</Text>
              <Text style={[styles.cell, { flex: 1, textAlign: 'right', color: Colors.dark.success }]}>
                {item.spread.toFixed(3)}%
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionContainer}>
          <Pressable 
            style={styles.actionButton}
            onPress={handleSetAlert}
          >
            <Bell size={20} color={Colors.dark.text} style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Set Price Alert</Text>
          </Pressable>
        </View>
      </ScrollView>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  symbol: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 16,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  positive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  negative: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  changeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  positiveText: {
    color: Colors.dark.success,
  },
  negativeText: {
    color: Colors.dark.danger,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currentOpportunity: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  opportunityCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exchangeInfo: {
    flex: 1,
    alignItems: 'center',
  },
  exchangeLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  exchangeName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  buyPrice: {
    color: Colors.dark.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellPrice: {
    color: Colors.dark.danger,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profitInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  profitLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  profitValue: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerCell: {
    color: Colors.dark.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  cell: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 20,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});