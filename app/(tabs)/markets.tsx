import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Mock data for markets
const MARKETS_DATA = [
  { exchange: 'Binance', btcPrice: 68250.75, ethPrice: 3450.25, trend: 'up' },
  { exchange: 'Coinbase', btcPrice: 68150.50, ethPrice: 3445.75, trend: 'down' },
  { exchange: 'Kraken', btcPrice: 68000.50, ethPrice: 3440.00, trend: 'down' },
  { exchange: 'KuCoin', btcPrice: 68200.25, ethPrice: 3452.50, trend: 'up' },
  { exchange: 'Bitstamp', btcPrice: 68100.00, ethPrice: 3442.25, trend: 'down' },
];

export default function MarketsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.exchangeCell]}>Exchange</Text>
        <Text style={[styles.headerCell, styles.priceCell]}>BTC</Text>
        <Text style={[styles.headerCell, styles.priceCell]}>ETH</Text>
        <Text style={[styles.headerCell, styles.trendCell]}>Trend</Text>
      </View>

      {MARKETS_DATA.map((market, index) => (
        <View 
          key={market.exchange} 
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}
        >
          <Text style={[styles.cell, styles.exchangeCell]}>{market.exchange}</Text>
          <Text style={[styles.cell, styles.priceCell]}>${market.btcPrice.toLocaleString()}</Text>
          <Text style={[styles.cell, styles.priceCell]}>${market.ethPrice.toLocaleString()}</Text>
          <View style={[styles.cell, styles.trendCell]}>
            {market.trend === 'up' ? (
              <TrendingUp size={20} color={Colors.dark.success} />
            ) : (
              <TrendingDown size={20} color={Colors.dark.danger} />
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    marginBottom: 8,
  },
  headerCell: {
    color: Colors.dark.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  cell: {
    color: Colors.dark.text,
    fontSize: 15,
  },
  exchangeCell: {
    flex: 2,
  },
  priceCell: {
    flex: 2,
    textAlign: 'right',
  },
  trendCell: {
    flex: 1,
    alignItems: 'flex-end',
  },
});