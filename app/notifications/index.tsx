import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Bell, Info } from "lucide-react-native";
import colors from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { NotificationPreference } from "@/types";

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notificationPreferences, 
    fetchSettings, 
    updateNotificationPreference,
    isLoading 
  } = useSettingsStore();
  
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateNotificationPreference(id, enabled);
  };

  const getIconBackgroundColor = (type: NotificationPreference["type"]) => {
    switch (type) {
      case "bill":
        return colors.primary;
      case "offer":
        return colors.secondary;
      case "usage":
        return colors.info;
      case "news":
        return colors.warning;
      case "service":
        return colors.error;
      case "account":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notification settings...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoContainer}>
            <Info size={20} color={colors.info} />
            <Text style={styles.infoText}>
              Customize which notifications you want to receive. You can change these settings at any time.
            </Text>
          </View>

          {notificationPreferences.map((preference: NotificationPreference) => (
            <View key={preference.id} style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <View 
                  style={[
                    styles.preferenceIcon, 
                    { backgroundColor: getIconBackgroundColor(preference.type) }
                  ]}
                >
                  <Bell size={20} color="white" />
                </View>
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceTitle}>{preference.title}</Text>
                  <Text style={styles.preferenceDescription}>
                    {preference.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={preference.enabled}
                onValueChange={(value) => handleToggle(preference.id, value)}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={preference.enabled ? colors.primary : "#f4f3f4"}
              />
            </View>
          ))}

          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>Important Information</Text>
            <Text style={styles.noticeText}>
              Even if you disable all notifications, we may still send you important service-related notifications, such as security alerts or account verification.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(90, 200, 250, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  preferenceLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: 16,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.warning,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});