import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight, TrendingUp } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ArbitrageOpportunity } from '@/types/arbitrage';
import Colors from '@/constants/colors';

interface OpportunityCardProps {
  data: ArbitrageOpportunity;
  onPress?: () => void;
}

export default function OpportunityCard({ data, onPress }: OpportunityCardProps) {
  const formattedDate = new Date(data.lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
        onPress={onPress}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coinInfo}>
            <Text style={styles.coinName}>{data.coin}</Text>
            <Text style={styles.coinSymbol}>{data.symbol}</Text>
          </View>
          <View style={styles.spreadContainer}>
            <TrendingUp size={16} color={Colors.dark.success} style={styles.spreadIcon} />
            <Text style={styles.spreadText}>{data.spreadPercentage.toFixed(2)}%</Text>
          </View>
        </View>

        {/* Arbitrage Details */}
        <View style={styles.arbitrageContainer}>
          {/* Buy Side */}
          <View style={styles.exchangeContainer}>
            <Text style={styles.actionLabel}>BUY AT</Text>
            <Text style={styles.exchangeName}>{data.buyTarget.exchange}</Text>
            <Text style={styles.buyPrice}>${data.buyTarget.price.toLocaleString()}</Text>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <ArrowRight size={24} color={Colors.dark.primary} />
          </View>

          {/* Sell Side */}
          <View style={styles.exchangeContainer}>
            <Text style={styles.actionLabel}>SELL AT</Text>
            <Text style={styles.exchangeName}>{data.sellTarget.exchange}</Text>
            <Text style={styles.sellPrice}>${data.sellTarget.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>Last updated: {formattedDate}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinName: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  coinSymbol: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
  spreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spreadIcon: {
    marginRight: 4,
  },
  spreadText: {
    color: Colors.dark.success,
    fontWeight: 'bold',
    fontSize: 14,
  },
  arbitrageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exchangeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  exchangeName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
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
  arrowContainer: {
    paddingHorizontal: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
  },
  timestamp: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
});