import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, CreditCard, Plus, Trash2, Wallet } from "lucide-react-native";
import colors from "@/constants/colors";
import { usePaymentStore } from "@/store/paymentStore";
import { Button } from "@/components/Button";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, fetchPaymentMethods, removePaymentMethod, setDefaultPaymentMethod } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethodType, setPaymentMethodType] = useState<"all" | "card" | "ewallet">("all");

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        await fetchPaymentMethods();
      } catch (error) {
        Alert.alert("Error", "Failed to load payment methods");
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      "Select payment method",
      "Which payment method do you want to add?",
      [
        { 
          text: "Credit/debit card", 
          onPress: () => router.push("/payment-methods/add")
        },
        { 
          text: "E-wallet", 
          onPress: () => router.push("/payment-methods/add-ewallet")
        },
        { 
          text: "Cancel", 
          style: "cancel" 
        }
      ]
    );
  };

  const handleRemovePaymentMethod = (id: string) => {
    Alert.alert(
      "Remove payment method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => removePaymentMethod(id),
          style: "destructive"
        }
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
  };

  const renderCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "MasterCard";
    if (firstDigit === "3") return "American Express";
    if (firstDigit === "6") return "Discover";
    return "Card";
  };

  const renderEWalletProviderName = (provider: string) => {
    switch (provider) {
      case "momo": return "MoMo";
      case "zalopay": return "ZaloPay";
      case "vnpay": return "VNPay";
      default: return "Ví điện tử";
    }
  };

  const filteredPaymentMethods = paymentMethods.filter(method => {
    if (paymentMethodType === "all") return true;
    if (paymentMethodType === "card") return "cardNumber" in method;
    if (paymentMethodType === "ewallet") return "provider" in method;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment method</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, paymentMethodType === "all" && styles.activeFilterTab]}
          onPress={() => setPaymentMethodType("all")}
        >
          <Text style={[styles.filterTabText, paymentMethodType === "all" && styles.activeFilterTabText]}>
            AllAll
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, paymentMethodType === "card" && styles.activeFilterTab]}
          onPress={() => setPaymentMethodType("card")}
        >
          <Text style={[styles.filterTabText, paymentMethodType === "card" && styles.activeFilterTabText]}>
            Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, paymentMethodType === "ewallet" && styles.activeFilterTab]}
          onPress={() => setPaymentMethodType("ewallet")}
        >
          <Text style={[styles.filterTabText, paymentMethodType === "ewallet" && styles.activeFilterTabText]}>
            E-wallet
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading payment methods...</Text>
          </View>
        ) : filteredPaymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            {paymentMethodType === "ewallet" ? (
              <>
                <Wallet size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>There are no e-wallets yet</Text>
                <Text style={styles.emptySubtext}>
                Add an e-wallet for easier payments
                </Text>
              </>
            ) : (
              <>
                <CreditCard size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>There is no payment method yet</Text>
                <Text style={styles.emptySubtext}>
                Add a card or e-wallet for easier payments
                </Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {filteredPaymentMethods.map((method) => (
              "cardNumber" in method ? (
                <View key={method.id} style={styles.cardItem}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTypeContainer}>
                      <CreditCard size={20} color={colors.primary} />
                      <Text style={styles.cardType}>{renderCardType(method.cardNumber)}</Text>
                    </View>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {method.cardNumber.slice(-4)}
                  </Text>
                  
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardName}>{method.cardholderName}</Text>
                    <Text style={styles.cardExpiry}>Expired {method.expiryMonth}/{method.expiryYear}</Text>
                  </View>

                  <View style={styles.cardActions}>
                    {!method.isDefault && (
                      <TouchableOpacity 
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={styles.setDefaultText}>Set default</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemovePaymentMethod(method.id)}
                    >
                      <Trash2 size={16} color={colors.error} />
                      <Text style={styles.removeText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View key={method.id} style={styles.walletItem}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTypeContainer}>
                      <Wallet size={20} color={colors.primary} />
                      <Text style={styles.cardType}>{renderEWalletProviderName(method.provider)}</Text>
                    </View>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.walletAccount}>{method.accountName}</Text>
                  <Text style={styles.walletPhone}>{method.phoneNumber}</Text>

                  <View style={styles.cardActions}>
                    {!method.isDefault && (
                      <TouchableOpacity 
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={styles.setDefaultText}>Set default</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemovePaymentMethod(method.id)}
                    >
                      <Trash2 size={16} color={colors.error} />
                      <Text style={styles.removeText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add payment method"
          onPress={handleAddPaymentMethod}
          fullWidth
          leftIcon={<Plus size={20} color="white" />}
        />
      </View>
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
  filterTabs: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  activeFilterTabText: {
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
  cardsContainer: {
    marginBottom: 16,
  },
  cardItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  walletItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  cardNumber: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  walletAccount: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
    fontWeight: "500",
  },
  walletPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardExpiry: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  setDefaultButton: {
    paddingVertical: 8,
  },
  setDefaultText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});