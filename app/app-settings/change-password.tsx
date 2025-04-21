import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Lock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = t("errors.required");
    }

    if (!newPassword) {
      newErrors.newPassword = t("errors.required");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("errors.passwordLength");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("errors.required");
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        t("common.success"),
        t("settings.passwordChanged"),
        [{ text: t("common.ok"), onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("settings.changePassword")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Lock size={24} color="white" />
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t("settings.changePasswordDescription")}
        </Text>

        <Input
          label={t("settings.currentPassword")}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={errors.currentPassword}
          containerStyle={styles.input}
        />

        <Input
          label={t("settings.newPassword")}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={errors.newPassword}
          containerStyle={styles.input}
        />

        <Input
          label={t("settings.confirmPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
          containerStyle={styles.input}
        />

        <Button
          title={t("settings.updatePassword")}
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
}); 