import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { 
  ChevronLeft, 
  Settings, 
  Moon, 
  Globe, 
  Bell, 
  Fingerprint, 
  LogIn, 
  Check, 
  Lock, 
  Shield, 
  CreditCard 
} from "lucide-react-native";
import { AppSetting } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettingsStore } from "@/store/settingsStore";

export default function AppSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const { 
    appSettings, 
    fetchSettings, 
    updateAppSetting,
    isLoading 
  } = useSettingsStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<AppSetting | null>(null);
  
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleToggle = (id: string, value: boolean) => {
    updateAppSetting(id, value);
  };

  const openOptionsModal = (setting: AppSetting) => {
    setCurrentSetting(setting);
    setModalVisible(true);
  };

  const handleSelectOption = (value: string) => {
    if (currentSetting) {
      updateAppSetting(currentSetting.id, value);
    }
    setModalVisible(false);
  };

  const handleSettingPress = (setting: AppSetting) => {
    switch (setting.id) {
      case "change_password":
        router.push("/change-password");
        break;
      case "two_factor":
        router.push("/two-factor");
        break;
      case "payment_methods":
        router.push("/payment-methods");
        break;
      default:
        if (setting.options) {
          openOptionsModal(setting);
        }
        break;
    }
  };

  const getSettingIcon = (type: AppSetting["type"]) => {
    switch (type) {
      case "theme":
        return <Moon size={20} color="white" />;
      case "language":
        return <Globe size={20} color="white" />;
      case "notifications":
        return <Bell size={20} color="white" />;
      case "biometrics":
        return <Fingerprint size={20} color="white" />;
      case "autoLogin":
        return <LogIn size={20} color="white" />;
      case "security":
        return <Shield size={20} color="white" />;
      case "payment":
        return <CreditCard size={20} color="white" />;
      default:
        return <Settings size={20} color="white" />;
    }
  };

  const getIconBackgroundColor = (type: AppSetting["type"]) => {
    switch (type) {
      case "theme":
        return colors.primary;
      case "language":
        return colors.secondary;
      case "notifications":
        return colors.info;
      case "biometrics":
        return colors.warning;
      case "autoLogin":
        return colors.success;
      case "security":
        return colors.error;
      case "payment":
        return colors.purple;
      default:
        return colors.primary;
    }
  };

  const renderSettingValue = (setting: AppSetting) => {
    if (typeof setting.value === "boolean") {
      return (
        <Switch
          value={setting.value}
          onValueChange={(value) => handleToggle(setting.id, value)}
          trackColor={{ false: colors.border, true: `${colors.primary}80` }}
          thumbColor={setting.value ? colors.primary : "#f4f3f4"}
        />
      );
    }

    if (setting.options) {
      const selectedOption = setting.options.find(option => option.value === setting.value);
      return (
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => openOptionsModal(setting)}
        >
          <Text style={[styles.optionText, { color: colors.primary }]}>
            {selectedOption?.label || setting.value}
          </Text>
        </TouchableOpacity>
      );
    }

    return <Text style={[styles.settingValue, { color: colors.primary }]}>{String(setting.value)}</Text>;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("settings.title")}</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t("common.loading")}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {appSettings.map((setting: AppSetting) => (
            <TouchableOpacity
              key={setting.id}
              style={[styles.settingItem, { backgroundColor: colors.card }]}
              onPress={() => handleSettingPress(setting)}
            >
              <View style={styles.settingLeft}>
                <View 
                  style={[
                    styles.settingIcon, 
                    { backgroundColor: getIconBackgroundColor(setting.type) }
                  ]}
                >
                  {getSettingIcon(setting.type)}
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {t(`settings.${setting.id}`) || setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              {renderSettingValue(setting)}
            </TouchableOpacity>
          ))}

          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.textLight }]}>
              {t("settings.version")}: 1.0.0
            </Text>
            <Text style={[styles.versionText, { color: colors.textLight }]}>
              {t("settings.build")}: 2023.07.15
            </Text>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentSetting ? t(`settings.${currentSetting.id}`) || currentSetting.title : ""}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalCloseText, { color: colors.primary }]}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={currentSetting?.options || []}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.optionItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelectOption(item.value)}
                >
                  <Text style={[styles.optionItemText, { color: colors.text }]}>
                    {t(`settings.${currentSetting?.id}.${item.value}`) || item.label}
                  </Text>
                  {currentSetting?.value === item.value && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionsList: {
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  optionItemText: {
    fontSize: 16,
  },
});