import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, Percent } from 'lucide-react-native';
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
  const symbol = typeof id === 'string' ? id.toUpperCase() : 'BTC';
  
  // In a real app, we would fetch detailed data for this specific opportunity
  const currentPrice = 68150.25;
  const dayChange = 1.25;
  const dayVolume = 2.5; // in billions
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${currentPrice.toLocaleString()}</Text>
          <View style={[styles.changeContainer, dayChange >= 0 ? styles.positive : styles.negative]}>
            {dayChange >= 0 ? (
              <ArrowUpRight size={16} color={Colors.dark.success} />
            ) : (
              <ArrowDownRight size={16} color={Colors.dark.danger} />
            )}
            <Text style={[styles.changeText, dayChange >= 0 ? styles.positiveText : styles.negativeText]}>
              {Math.abs(dayChange)}%
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
          <Text style={styles.statLabel}>Best Spread</Text>
          <Text style={styles.statValue}>0.412%</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={16} color={Colors.dark.textSecondary} />
          <Text style={styles.statLabel}>Updates</Text>
          <Text style={styles.statValue}>5</Text>
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
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Set Alert</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  symbol: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  positive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  negative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  positiveText: {
    color: Colors.dark.success,
  },
  negativeText: {
    color: Colors.dark.danger,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
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
    marginTop: 4,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  tableContainer: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    color: Colors.dark.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
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
  },
  actionContainer: {
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});