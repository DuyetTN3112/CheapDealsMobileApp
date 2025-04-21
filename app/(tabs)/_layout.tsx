import React from "react";
import { Tabs } from "expo-router/tabs";
import { Home, Package, User, HelpCircle, Star } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0.1,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0.1,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <HelpCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: "Feedback",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Star size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}