import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchX } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No opportunities found" }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <SearchX size={48} color={Colors.dark.textSecondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});