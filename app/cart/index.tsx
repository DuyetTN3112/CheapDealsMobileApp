import React from "react";
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
import { ChevronLeft, ShoppingCart, Trash2 } from "lucide-react-native";
import { usePackagesStore } from "@/store/packagesStore";
import { useUserDataStore } from "@/store/userDataStore";
import { Button } from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cart, addToCart } = usePackagesStore();
  const { placeOrder, isLoading } = useUserDataStore();
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.package.price * item.quantity);
  }, 0);
  
  const discount = subtotal * 0.15; // 15% app discount
  const total = subtotal - discount;
  
  const handleBack = () => {
    router.back();
  };
  
  const handleRemoveItem = (packageId: string) => {
    addToCart(packageId, true);
  };
  
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty. Add some packages before checking out.");
      return;
    }
    
    try {
      // Place order for the first item for simplicity
      // In a real app, you would handle multiple items
      await placeOrder(cart[0].packageId);
      
      Alert.alert(
        "Order Placed Successfully",
        "Your order has been placed successfully.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Clear cart and go to home
              cart.forEach(item => {
                addToCart(item.packageId, true);
              });
              router.replace("/");
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "There was an error placing your order. Please try again.");
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Cart</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <ShoppingCart size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyCartText, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptyCartSubtext, { color: colors.textSecondary }]}>
              Browse our packages and add something to your cart
            </Text>
            <Button
              title="Browse Packages"
              onPress={() => router.push("/packages")}
              style={styles.browseButton}
            />
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View 
                key={item.packageId}
                style={[styles.cartItem, { borderBottomColor: colors.border }]}
              >
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>
                    {item.package.name}
                  </Text>
                  <Text style={[styles.itemType, { color: colors.textSecondary }]}>
                    {item.package.type}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>
                    £{item.package.price.toFixed(2)}/month
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.packageId)}
                >
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>£{subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>App Discount (15%)</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>-£{discount.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>£{total.toFixed(2)}/month</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      
      {cart.length > 0 && (
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <Button
            title="Checkout"
            onPress={handleCheckout}
            loading={isLoading}
            style={styles.checkoutButton}
          />
        </View>
      )}
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
    padding: 16,
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyCartSubtext: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
  },
  browseButton: {
    marginTop: 24,
    width: "100%",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  checkoutButton: {
    width: "100%",
  },
}); 