import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Shield, Lock, AlertTriangle } from "lucide-react-native";
import colors from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { PrivacySetting } from "@/types";
import { Button } from "@/components/Button";

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { 
    privacySettings, 
    fetchSettings, 
    updatePrivacySetting,
    isLoading 
  } = useSettingsStore();
  
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updatePrivacySetting(id, enabled);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            Alert.alert(
              "Account Deletion Request",
              "Your account deletion request has been submitted. Our team will process your request within 30 days."
            );
          },
          style: "destructive" 
        }
      ]
    );
  };

  const getIconBackgroundColor = (type: PrivacySetting["type"]) => {
    switch (type) {
      case "dataSharing":
        return colors.primary;
      case "marketing":
        return colors.secondary;
      case "analytics":
        return colors.info;
      case "thirdParty":
        return colors.warning;
      case "location":
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
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading privacy settings...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <Text style={styles.sectionDescription}>
              Control how your data is used and shared
            </Text>

            {privacySettings.map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View 
                    style={[
                      styles.settingIcon, 
                      { backgroundColor: getIconBackgroundColor(setting.type) }
                    ]}
                  >
                    <Shield size={20} color="white" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>
                      {setting.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={(value) => handleToggle(setting.id, value)}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={setting.enabled ? colors.primary : "#f4f3f4"}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <Text style={styles.sectionDescription}>
              Manage your account security settings
            </Text>

            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => router.push("/profile/change-password")}
            >
              <View style={styles.securityLeft}>
                <View style={[styles.securityIcon, { backgroundColor: colors.primary }]}>
                  <Lock size={20} color="white" />
                </View>
                <View style={styles.securityContent}>
                  <Text style={styles.securityTitle}>Change Password</Text>
                  <Text style={styles.securityDescription}>
                    Update your account password
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => router.push("/profile/two-factor")}
            >
              <View style={styles.securityLeft}>
                <View style={[styles.securityIcon, { backgroundColor: colors.secondary }]}>
                  <Shield size={20} color="white" />
                </View>
                <View style={styles.securityContent}>
                  <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.securityDescription}>
                    Add an extra layer of security to your account
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <View style={styles.dangerContent}>
              <View style={styles.dangerHeader}>
                <AlertTriangle size={20} color={colors.error} />
                <Text style={styles.dangerHeaderText}>Delete Account</Text>
              </View>
              <Text style={styles.dangerDescription}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Text>
              <Button
                title="Delete Account"
                onPress={handleDeleteAccount}
                variant="outline"
                style={styles.deleteButton}
                textStyle={{ color: colors.error }}
              />
            </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  securityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  securityLeft: {
    flexDirection: "row",
    flex: 1,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  dangerSection: {
    marginTop: 16,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.error,
    marginBottom: 12,
  },
  dangerContent: {
    backgroundColor: "rgba(255, 59, 48, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
    borderRadius: 12,
    padding: 16,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dangerHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});