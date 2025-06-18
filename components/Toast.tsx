import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { AlertCircle, CheckCircle, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type, 
  visible, 
  onHide, 
  duration = 3000 
}: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onHide)();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={Colors.dark.success} />;
      case 'error':
        return <AlertCircle size={20} color={Colors.dark.danger} />;
      default:
        return <AlertCircle size={20} color={Colors.dark.primary} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.9)';
      case 'error':
        return 'rgba(239, 68, 68, 0.9)';
      default:
        return 'rgba(99, 102, 241, 0.9)';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.toast, { backgroundColor: getBackgroundColor() }]}>
        {getIcon()}
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});