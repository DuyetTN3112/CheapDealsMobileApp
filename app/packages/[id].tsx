import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router/";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Check, AlertCircle, Percent, ShoppingCart } from "lucide-react-native";
import { usePackagesStore } from "@/store/packagesStore";
import { useUserDataStore } from "@/store/userDataStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const { 
    selectPackage, 
    selectedPackage, 
    clearSelectedPackage, 
    addToCart,
    cart 
  } = usePackagesStore();
  
  const { placeOrder, isLoading } = useUserDataStore();
  const { isAuthenticated } = useAuthStore();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeSuccess, setPromoCodeSuccess] = useState("");
  
  const isInCart = cart.some(item => item.packageId === id);
  
  useEffect(() => {
    if (id) {
      selectPackage(id);
    }
    
    return () => {
      clearSelectedPackage();
    };
  }, [id]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoCodeError("Please enter a promo code");
      return;
    }
    
    // In a real app, this would validate against actual promo codes
    if (promoCode.toUpperCase() === "SUMMER25" || promoCode.toUpperCase() === "WELCOME20") {
      setPromoCodeSuccess(`Promo code ${promoCode.toUpperCase()} applied successfully!`);
      setPromoCodeError("");
    } else {
      setPromoCodeError("Invalid promo code");
      setPromoCodeSuccess("");
    }
  };
  
  const handleOrder = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please log in or create an account to order this package.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Log In", 
            onPress: () => router.push("/auth/login")
          }
        ]
      );
      return;
    }
    
    if (!selectedPackage) return;
    
    try {
      await placeOrder(selectedPackage.id, promoCodeSuccess ? promoCode : undefined);
      
      Alert.alert(
        "Order Placed Successfully",
        "Your order has been placed with a 15% app discount. You can view your package details on the home screen.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Force clear the cart for this package
              if (isInCart) {
                addToCart(selectedPackage.id, true);
              }
              
              // Gọi trực tiếp hàm fetchUserData để làm mới dữ liệu
              useUserDataStore.getState().fetchUserData("user-123");
              
              // Đợi dữ liệu được cập nhật xong rồi mới chuyển hướng về trang chủ
              setTimeout(() => {
                // Navigate to home page to see the new package
                // Use replace to ensure back button doesn't take us back to this page
                router.replace("/(tabs)");
              }, 500);
            }
          }
        ]
      );
    } catch (error) {
      // Show the specific error message from the store
      Alert.alert(
        "Error", 
        error instanceof Error ? error.message : "There was an error placing your order. Please try again."
      );
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedPackage) return;
    
    addToCart(selectedPackage.id);
    Alert.alert(
      "Added to Cart",
      `${selectedPackage.name} has been added to your cart.`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { 
          text: "View Cart", 
          onPress: () => router.push("/cart")
        }
      ]
    );
  };
  
  if (!selectedPackage) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("packages.details")}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedPackage.image }} style={styles.image} />
          {selectedPackage.popular && (
            <View style={[styles.popularBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.popularText}>{t("packages.popular")}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.packageInfo}>
          <Text style={[styles.packageName, { color: colors.text }]}>{selectedPackage.name}</Text>
          <Text style={[styles.packageType, { color: colors.textSecondary }]}>{selectedPackage.type}</Text>
          <Text style={[styles.packageDescription, { color: colors.text }]}>{selectedPackage.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>£{selectedPackage.price.toFixed(2)}</Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>/month</Text>
          </View>
          
          <View style={[styles.discountContainer, { backgroundColor: "rgba(255, 107, 107, 0.1)" }]}>
            <Percent size={16} color={colors.discount} />
            <Text style={[styles.discountText, { color: colors.discount }]}>
              15% discount when ordering through the app
            </Text>
          </View>
        </View>
        
        <View style={[styles.featuresContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>{t("packages.features")}</Text>
          
          {selectedPackage.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={18} color={colors.primary} />
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureText, { color: colors.text }]}>
                  <Text style={styles.featureName}>{feature.name}:</Text> {feature.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={[styles.promoContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.promoTitle, { color: colors.text }]}>{t("packages.promo")}</Text>
          
          <View style={styles.promoInputContainer}>
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={(text) => {
                setPromoCode(text);
                setPromoCodeError("");
                setPromoCodeSuccess("");
              }}
              error={promoCodeError}
              containerStyle={styles.promoInput}
            />
            <Button
              title={t("packages.apply")}
              onPress={handleApplyPromoCode}
              variant="secondary"
              size="medium"
              style={styles.applyButton}
            />
          </View>
          
          {promoCodeSuccess ? (
            <View style={[styles.promoSuccessContainer, { backgroundColor: "rgba(52, 199, 89, 0.1)" }]}>
              <Check size={16} color={colors.success} />
              <Text style={[styles.promoSuccessText, { color: colors.success }]}>{promoCodeSuccess}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={[styles.infoContainer, { borderTopColor: colors.border }]}>
          <View style={styles.infoItem}>
            <AlertCircle size={18} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              All packages are subject to a 12-month minimum term unless otherwise stated.
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <AlertCircle size={18} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Early termination fees may apply if you cancel before the minimum term.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <View style={styles.footerButtons}>
          <Button
            title={isInCart ? "In Cart" : t("packages.addToCart")}
            onPress={handleAddToCart}
            variant="outline"
            disabled={isInCart}
            icon={<ShoppingCart size={18} color={isInCart ? colors.textLight : colors.primary} />}
            style={styles.cartButton}
          />
          <Button
            title={t("packages.order")}
            onPress={handleOrder}
            loading={isLoading}
            style={styles.orderButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: 32,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  popularBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  packageInfo: {
    padding: 16,
  },
  packageName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  packageType: {
    fontSize: 14,
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  featuresContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureText: {
    fontSize: 16,
  },
  featureName: {
    fontWeight: "600",
  },
  promoContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  promoInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  promoInput: {
    flex: 1,
    marginRight: 12,
  },
  applyButton: {
    marginTop: 24,
  },
  promoSuccessContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  promoSuccessText: {
    fontSize: 14,
    marginLeft: 8,
  },
  infoContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
  },
  orderButton: {
    flex: 1,
    marginLeft: 8,
  },
});