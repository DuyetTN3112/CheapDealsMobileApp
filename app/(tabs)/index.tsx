import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { Bell, ChevronRight } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";
import { usePackagesStore } from "@/store/packagesStore";
import { UsageCard } from "@/components/UsageCard";
import { BillCard } from "@/components/BillCard";
import { OfferCard } from "@/components/OfferCard";
import { Button } from "@/components/Button";
import { useTheme } from '../../context/ThemeContext';
import { ChatBot } from '../../components/ChatBot';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    bills, 
    usageData, 
    specialOffers,
    fetchUserData,
    payBill,
    cancelPackage,
    userPackages
  } = useUserDataStore();
  const { allPackages, fetchPackages } = usePackagesStore();
  const { colors } = useTheme();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData(user?.id || "");
    }
    fetchPackages();
    
    // Remove console logging to prevent log spam
    // console.log("Current userPackages:", userPackages);
    // console.log("Active package:", userPackages.find(pkg => pkg.status === "active"));
  }, [isAuthenticated, refreshKey, forceUpdate]);

  // Function to refresh data - using useCallback to avoid dependency issues
  const refreshData = useCallback(() => {
    console.log("Manually refreshing home screen data...");
    if (isAuthenticated) {
      fetchUserData(user?.id || "");
    }
    fetchPackages();
    setForceUpdate(prev => prev + 1);
  }, [isAuthenticated, user?.id, fetchUserData, fetchPackages]);

  // Find the active package and always have a package to display
  const activePackage = userPackages.find(pkg => pkg.status === "active");
  // console.log("Rendering with active package:", activePackage);
  
  // Thay đổi cách lấy currentPackage để luôn có giá trị
  let currentPackage;
  let displayPackage; // Package to display on UI
  
  if (activePackage) {
    const packageId = activePackage.packageId;
    currentPackage = allPackages.find(pkg => pkg.id === packageId);
  }
  
  // Ensure we always have a package to display, even if no active package is found
  if (!currentPackage) {
    // Try to get any package from allPackages
    if (allPackages.length > 0) {
      currentPackage = allPackages[0];
      // console.log("Using first available package from catalog:", currentPackage);
    }
  }
  
  // Create a display package that combines UI data from both sources
  displayPackage = {
    name: activePackage?.name || currentPackage?.name || "Premium Package",
    price: activePackage?.price || currentPackage?.price || 29.99,
    image: currentPackage?.image || 'https://images.unsplash.com/photo-1585399000684-d2f72660f092',
    id: currentPackage?.id || activePackage?.packageId || 'mobile-premium'
  };
  
  // console.log("Display package:", displayPackage);

  const unpaidBill = bills.find(bill => !bill.isPaid);

  const handlePayBill = (billId: string) => {
    payBill(billId);
  };

  const handleOfferPress = (offerId: string) => {
    router.push(`/offers/${offerId}`);
  };

  const handleCancelPackage = () => {
    // Nếu không có activePackage, thử tìm gói đầu tiên để hủy
    const packageToCancel = activePackage || userPackages[0];
    
    if (!packageToCancel) {
      Alert.alert("Error", "No package found to cancel");
      return;
    }

    Alert.alert(
      "Cancel Current Package",
      "Are you sure you want to cancel your current package? Early termination fees may apply.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPackage(packageToCancel.id);
              
              // Chỉ làm mới dữ liệu một lần sau khi hủy, không dùng setForceUpdate
              if (isAuthenticated) {
                fetchUserData(user?.id || "");
              }
              
              Alert.alert(
                "Success", 
                "Your package has been cancelled. You can now subscribe to a new package.",
                [
                  {
                    text: "OK"
                    // Xóa callback và không gọi setRefreshKey
                  },
                  {
                    text: "Browse Packages",
                    onPress: () => {
                      router.push("/packages");
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert("Error", "There was an error cancelling your package. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleBrowsePackages = () => {
    router.push("/(tabs)/packages");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome
          </Text>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{user?.name || "Guest"}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayPackage ? (
            <View style={styles.currentPlanCard}>
              <View style={styles.currentPlanHeader}>
                <Text style={styles.currentPlanTitle}>Your Current Plan</Text>
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => router.push(`/packages/${displayPackage.id}`)}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.planInfo}>
                <View style={styles.planImageContainer}>
                  <Image 
                    source={{ uri: displayPackage.image }} 
                    style={styles.planImage} 
                  />
                </View>
                <View style={styles.planDetails}>
                  <Text style={styles.planName}>{displayPackage.name}</Text>
                  <Text style={styles.planPrice}>£{displayPackage.price.toFixed(2)}/month</Text>
                  <View style={styles.buttonContainer}>
                    <Button 
                      title="Change Plan" 
                      onPress={() => router.push("/packages")}
                      variant="outline"
                      size="small"
                      style={styles.packageButton}
                    />
                    <Button 
                      title="Cancel Plan" 
                      onPress={handleCancelPackage}
                      variant="destructive"
                      size="small"
                      style={styles.packageButton}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.noPlanCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.noPlanTitle, { color: colors.text }]}>No Active Plan</Text>
              <Text style={[styles.noPlanText, { color: colors.textSecondary }]}>
                You don't have any active packages. Browse our available packages to get started.
              </Text>
              <Button
                title="Browse Packages"
                onPress={handleBrowsePackages}
                style={styles.browseButton}
              />
            </View>
          )}

          {usageData && <UsageCard usageData={usageData} />}

          {unpaidBill && (
            <View style={styles.billSection}>
              <Text style={styles.sectionTitle}>Pending Bill</Text>
              <BillCard bill={unpaidBill} onPayNow={handlePayBill} />
            </View>
          )}

          <View style={styles.offersSection}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            {specialOffers.slice(0, 2).map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onPress={() => handleOfferPress(offer.id)} 
              />
            ))}
            
            {specialOffers.length > 2 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push("/offers")}
              >
                <Text style={styles.viewAllText}>View All Offers</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.chatSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Chat Assistant
            </Text>
            <ChatBot />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  currentPlanCard: {
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
  noPlanCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  noPlanTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noPlanText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  browseButton: {
    minWidth: 200,
  },
  currentPlanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  currentPlanTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  planInfo: {
    flexDirection: "row",
  },
  planImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  planImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  upgradeButton: {
    alignSelf: "flex-start",
  },
  billSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  offersSection: {
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginRight: 4,
  },
  chatSection: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  packageButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});