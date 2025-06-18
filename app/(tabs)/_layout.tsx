import React from "react";
import { Tabs } from "expo-router";
import { Home, LineChart, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";

function TabBarIcon(props: {
  name: React.ReactNode;
  color: string;
}) {
  return props.name;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
        },
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={<Home size={24} color={color} />} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: "Markets",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={<LineChart size={24} color={color} />} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={<Settings size={24} color={color} />} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}