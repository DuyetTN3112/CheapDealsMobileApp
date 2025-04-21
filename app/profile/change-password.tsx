import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react-native";
import { Button } from "@/components/Button";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword, isLoading } = useAuthStore();
  const { t } = useLanguage();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = t("password.currentRequired");
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = t("password.newRequired");
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t("password.length");
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("password.confirmRequired");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t("password.match");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;
    
    try {
      // Call the updatePassword method from authStore
      await updatePassword(currentPassword, newPassword);
      
      Alert.alert(
        t("common.success"), 
        t("password.success"),
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t("common.error"), error instanceof Error ? error.message : t("password.error"));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("password.change")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          {t("password.description")}
        </Text>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("password.current")}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.currentPassword ? (
            <Text style={styles.errorText}>{errors.currentPassword}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("password.new")}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.newPassword ? (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("password.confirm")}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <Button
          title={t("password.submit")}
          onPress={handleChangePassword}
          loading={isLoading}
          fullWidth
          style={styles.button}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
    height: 56,
  },
  inputIconContainer: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  eyeIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 12,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
  },
}); 