import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Shield, QrCode } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function TwoFactorScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [errors, setErrors] = useState({
    verificationCode: "",
  });

  const validateForm = () => {
    const newErrors = {
      verificationCode: "",
    };

    if (!verificationCode) {
      newErrors.verificationCode = t("errors.required");
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = t("errors.invalidCode");
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleEnable = async () => {
    if (step === "setup") {
      setStep("verify");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(true);
      Alert.alert(
        t("common.success"),
        t("settings.twoFactorEnabled"),
        [{ text: t("common.ok"), onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(false);
      Alert.alert(
        t("common.success"),
        t("settings.twoFactorDisabled"),
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
          {t("settings.twoFactor")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Shield size={24} color="white" />
        </View>

        {step === "setup" ? (
          <>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {t("settings.twoFactorSetupDescription")}
            </Text>

            <View style={styles.qrContainer}>
              <QrCode size={200} color={colors.text} />
              <Text style={[styles.secretKey, { color: colors.textSecondary }]}>
                ABCDEFGHIJKLMNOP
              </Text>
            </View>

            <Text style={[styles.instructions, { color: colors.textSecondary }]}>
              {t("settings.twoFactorInstructions")}
            </Text>

            <Button
              title={t("settings.continue")}
              onPress={handleEnable}
              style={styles.button}
            />
          </>
        ) : (
          <>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {t("settings.twoFactorVerifyDescription")}
            </Text>

            <Input
              label={t("settings.verificationCode")}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              error={errors.verificationCode}
              containerStyle={styles.input}
            />

            <Button
              title={t("settings.enableTwoFactor")}
              onPress={handleEnable}
              loading={isLoading}
              style={styles.button}
            />
          </>
        )}
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
  qrContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  secretKey: {
    fontSize: 16,
    marginTop: 16,
    fontFamily: "monospace",
  },
  instructions: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
}); 