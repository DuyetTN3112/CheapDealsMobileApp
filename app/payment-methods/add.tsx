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
import { ChevronLeft, CreditCard, User, Calendar, Lock } from "lucide-react-native";
import colors from "@/constants/colors";
import { usePaymentStore } from "@/store/paymentStore";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const { addPaymentMethod, isLoading, error } = usePaymentStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const [cardNumberError, setCardNumberError] = useState("");
  const [cardholderNameError, setCardholderNameError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [cvvError, setCvvError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const validateForm = () => {
    let isValid = true;

    // Validate card number
    const cardDigits = cardNumber.replace(/\s/g, "");
    if (!cardDigits) {
      setCardNumberError("Card number is required");
      isValid = false;
    } else if (cardDigits.length !== 16) {
      setCardNumberError("Card number must be 16 digits");
      isValid = false;
    } else {
      setCardNumberError("");
    }

    // Validate cardholder name
    if (!cardholderName.trim()) {
      setCardholderNameError("Cardholder name is required");
      isValid = false;
    } else {
      setCardholderNameError("");
    }

    // Validate expiry date
    if (!expiryDate) {
      setExpiryDateError("Expiry date is required");
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setExpiryDateError("Expiry date must be in MM/YY format");
      isValid = false;
    } else {
      const [month, year] = expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        setExpiryDateError("Invalid month");
        isValid = false;
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        setExpiryDateError("Card has expired");
        isValid = false;
      } else {
        setExpiryDateError("");
      }
    }

    // Validate CVV
    if (!cvv) {
      setCvvError("CVV is required");
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
      setCvvError("CVV must be 3 or 4 digits");
      isValid = false;
    } else {
      setCvvError("");
    }

    return isValid;
  };

  const handleAddCard = async () => {
    if (!validateForm()) return;

    setIsValidating(true);
    
    try {
      const [expiryMonth, expiryYear] = expiryDate.split("/");
      
      const success = await addPaymentMethod({
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardholderName,
        expiryMonth,
        expiryYear,
        brand: "visa", // You might want to detect the card brand based on the card number
      });
      
      if (success) {
        Alert.alert(
          "Success",
          "Your card has been added successfully",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to add card. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
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
          <View style={styles.cardIllustration}>
            <CreditCard size={48} color={colors.primary} />
            <Text style={styles.cardIllustrationText}>Add a new card</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChangeText={(text) => {
              const formatted = formatCardNumber(text);
              setCardNumber(formatted);
              if (cardNumberError) setCardNumberError("");
            }}
            error={cardNumberError}
            keyboardType="number-pad"
            leftIcon={<CreditCard size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
            maxLength={19}
          />

          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={cardholderName}
            onChangeText={(text) => {
              setCardholderName(text);
              if (cardholderNameError) setCardholderNameError("");
            }}
            error={cardholderNameError}
            leftIcon={<User size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <View style={styles.rowContainer}>
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={(text) => {
                const formatted = formatExpiryDate(text);
                setExpiryDate(formatted);
                if (expiryDateError) setExpiryDateError("");
              }}
              error={expiryDateError}
              keyboardType="number-pad"
              leftIcon={<Calendar size={20} color={colors.textSecondary} />}
              containerStyle={styles.leftInput}
              maxLength={5}
            />

            <Input
              label="CVV"
              placeholder="123"
              value={cvv}
              onChangeText={(text) => {
                setCvv(text.replace(/\D/g, "").slice(0, 4));
                if (cvvError) setCvvError("");
              }}
              error={cvvError}
              keyboardType="number-pad"
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
              containerStyle={styles.rightInput}
              maxLength={4}
            />
          </View>

          <View style={styles.visaCheckContainer}>
            <Text style={styles.visaCheckTitle}>Secure Payment Processing</Text>
            <Text style={styles.visaCheckText}>
              Your card details will be securely validated with VisaCheck before being saved.
            </Text>
            {isValidating && (
              <View style={styles.validatingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.validatingText}>Validating with VisaCheck...</Text>
              </View>
            )}
          </View>

          <Button
            title="Add Card"
            onPress={handleAddCard}
            loading={isLoading}
            style={styles.addButton}
            fullWidth
          />

          <Text style={styles.securityNote}>
            Your payment information is securely stored and encrypted. We never store your full card details on our servers.
          </Text>
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
    padding: 24,
    paddingBottom: 40,
  },
  cardIllustration: {
    alignItems: "center",
    marginBottom: 24,
  },
  cardIllustrationText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 12,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftInput: {
    flex: 1,
    marginRight: 8,
  },
  rightInput: {
    flex: 1,
    marginLeft: 8,
  },
  visaCheckContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  visaCheckTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  visaCheckText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  validatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  validatingText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  addButton: {
    marginBottom: 24,
  },
  securityNote: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});