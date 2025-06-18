import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ArrowRight, TrendingUp, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ArbitrageOpportunity } from '@/types/arbitrage';
import Colors from '@/constants/colors';

interface OpportunityCardProps {
  data: ArbitrageOpportunity;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function OpportunityCard({ 
  data, 
  onPress, 
  onRemove, 
  showRemoveButton = true 
}: OpportunityCardProps) {
  const formattedDate = new Date(data.lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const AnimatedView = Platform.OS !== 'web' ? Animated.View : View;
  const animationProps = Platform.OS !== 'web' ? {
    entering: FadeIn.duration(300),
    exiting: FadeOut.duration(200)
  } : {};

  return (
    <AnimatedView 
      style={styles.container}
      {...animationProps}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
        onPress={onPress}
      >
        {/* Remove Button */}
        {showRemoveButton && onRemove && (
          <Pressable 
            style={styles.removeButton}
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color={Colors.dark.textSecondary} />
          </Pressable>
        )}

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
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinName: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  coinSymbol: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  spreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  spreadIcon: {
    marginRight: 6,
  },
  spreadText: {
    color: Colors.dark.success,
    fontWeight: 'bold',
    fontSize: 15,
  },
  arbitrageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  exchangeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionLabel: {
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
  arrowContainer: {
    paddingHorizontal: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 16,
  },
  timestamp: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '500',
  },
});