import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, Wallet, User, Phone, ChevronDown } from "lucide-react-native";
import colors from "@/constants/colors";
import { usePaymentStore } from "@/store/paymentStore";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function AddEWalletScreen() {
  const router = useRouter();
  const { addEWallet, isLoading, error } = usePaymentStore();

  const [provider, setProvider] = useState<"momo" | "zalopay" | "vnpay" | "other">("momo");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showProviderPicker, setShowProviderPicker] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [accountNameError, setAccountNameError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    let isValid = true;

    // Validate phone number
    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (!/^0\d{9}$/.test(phoneNumber)) {
      setPhoneNumberError("Invalid phone number (must start with 0 and have 10 digits)");
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    // Validate account name
    if (!accountName.trim()) {
      setAccountNameError("Account name is required");
      isValid = false;
    } else {
      setAccountNameError("");
    }

    return isValid;
  };

  const handleAddEWallet = async () => {
    if (!validateForm()) return;

    setIsValidating(true);
    
    try {
      const success = await addEWallet({
        provider,
        phoneNumber,
        accountName
      });
      
      if (success) {
        Alert.alert(
          "Successfull",
          "Your e-wallet was add successfully.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (err) {
      Alert.alert("Error", "Can't not add e-wallet. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const renderProviderName = (providerKey: "momo" | "zalopay" | "vnpay" | "other") => {
    switch (providerKey) {
      case "momo": return "MoMo";
      case "zalopay": return "ZaloPay";
      case "vnpay": return "VNPay";
      case "other": return "Khác";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add e-wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.walletIllustration}>
            <Wallet size={48} color={colors.primary} />
            <Text style={styles.walletIllustrationText}>Add new e-wallet</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Supplier</Text>
            <TouchableOpacity 
              style={styles.providerPicker}
              onPress={() => setShowProviderPicker(!showProviderPicker)}
            >
              <Wallet size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <Text style={styles.providerText}>{renderProviderName(provider)}</Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {showProviderPicker && (
              <View style={styles.providerOptions}>
                {["momo", "zalopay", "vnpay", "other"].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.providerOption,
                      provider === p && styles.selectedOption
                    ]}
                    onPress={() => {
                      setProvider(p as "momo" | "zalopay" | "vnpay" | "other");
                      setShowProviderPicker(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.providerOptionText,
                        provider === p && styles.selectedOptionText
                      ]}
                    >
                      {renderProviderName(p as "momo" | "zalopay" | "vnpay" | "other")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Input
            label="Phone-number"
            placeholder="0xxxxxxxxx"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (phoneNumberError) setPhoneNumberError("");
            }}
            error={phoneNumberError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
            maxLength={10}
          />

          <Input
            label="Account name"
            placeholder="Nguyễn Văn A"
            value={accountName}
            onChangeText={(text) => {
              setAccountName(text);
              if (accountNameError) setAccountNameError("");
            }}
            error={accountNameError}
            leftIcon={<User size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <View style={styles.buttonContainer}>
            {isValidating || isLoading ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <Button
                title="Add e-wallet"
                onPress={handleAddEWallet}
                fullWidth
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  walletIllustration: {
    alignItems: "center",
    marginVertical: 24,
  },
  walletIllustrationText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 12,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  providerPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 16,
  },
  providerText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  providerOptions: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}10`,
  },
  providerOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 24,
    height: 48,
    justifyContent: "center",
  },
}); 