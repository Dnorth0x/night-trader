import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Bell, Clock, RefreshCw, Moon, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const refreshIntervals = ['30 seconds', '1 minute', '5 minutes', '15 minutes'];
  const [selectedInterval, setSelectedInterval] = useState(1); // Default to 1 minute

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      {/* Settings Items */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Bell size={20} color={Colors.dark.text} style={styles.settingIcon} />
          <Text style={styles.settingText}>Notifications</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#3e3e3e', true: Colors.dark.primary }}
          thumbColor={notifications ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Moon size={20} color={Colors.dark.text} style={styles.settingIcon} />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#3e3e3e', true: Colors.dark.primary }}
          thumbColor={darkMode ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <RefreshCw size={20} color={Colors.dark.text} style={styles.settingIcon} />
          <Text style={styles.settingText}>Auto Refresh</Text>
        </View>
        <Switch
          value={autoRefresh}
          onValueChange={setAutoRefresh}
          trackColor={{ false: '#3e3e3e', true: Colors.dark.primary }}
          thumbColor={autoRefresh ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      
      {autoRefresh && (
        <View style={styles.intervalContainer}>
          <Text style={styles.intervalLabel}>Refresh Interval:</Text>
          <View style={styles.intervalOptions}>
            {refreshIntervals.map((interval, index) => (
              <Pressable
                key={interval}
                style={[
                  styles.intervalOption,
                  selectedInterval === index && styles.selectedInterval
                ]}
                onPress={() => setSelectedInterval(index)}
              >
                <Text 
                  style={[
                    styles.intervalText,
                    selectedInterval === index && styles.selectedIntervalText
                  ]}
                >
                  {interval}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>About</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Info size={20} color={Colors.dark.text} style={styles.settingIcon} />
          <Text style={styles.settingText}>Version</Text>
        </View>
        <Text style={styles.versionText}>1.0.0</Text>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Clock size={20} color={Colors.dark.text} style={styles.settingIcon} />
          <Text style={styles.settingText}>Last Updated</Text>
        </View>
        <Text style={styles.versionText}>{new Date().toLocaleDateString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  versionText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  intervalContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 32,
  },
  intervalLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  intervalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  selectedInterval: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  intervalText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  selectedIntervalText: {
    color: Colors.dark.text,
    fontWeight: '500',
  },
});