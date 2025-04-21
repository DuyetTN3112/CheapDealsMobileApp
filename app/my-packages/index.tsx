import React, { useEffect, useState } from "react";
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
import { ChevronLeft, Check, AlertCircle, RefreshCw, X, ArrowUpRight, Plus } from "lucide-react-native";
import { useUserDataStore } from "@/store/userDataStore";
import { useAuthStore } from "@/store/authStore";
import { usePackagesStore } from "@/store/packagesStore";
import { Button } from "@/components/Button";
import { UserPackage } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

export default function MyPackagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const { isAuthenticated, user } = useAuthStore();
  const { userPackages, fetchUserData, cancelPackage, upgradePackage, isLoading } = useUserDataStore();
  const { allPackages, fetchPackages } = usePackagesStore();
  
  const [selectedPackage, setSelectedPackage] = useState<UserPackage | null>(null);
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData(user.id);
    } else {
      router.push("/auth/login");
    }
    
    fetchPackages();
  }, [isAuthenticated, user, refreshKey]);
  
  // Update selected package when userPackages changes
  useEffect(() => {
    if (selectedPackage) {
      const updatedPackage = userPackages.find(pkg => pkg.id === selectedPackage.id);
      if (updatedPackage) {
        setSelectedPackage(updatedPackage);
      } else {
        setSelectedPackage(null);
      }
    }
  }, [userPackages]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSelectPackage = (pkg: UserPackage) => {
    setSelectedPackage(pkg);
    setShowUpgradeOptions(false);
  };
  
  const handleCancelPackage = (packageId: string) => {
    Alert.alert(
      "Cancel Package",
      "Are you sure you want to cancel this package? Early termination fees may apply.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPackage(packageId);
              Alert.alert(
                "Success", 
                "Your package has been cancelled. You can get a new package now.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setSelectedPackage(null);
                      setRefreshKey(prev => prev + 1);
                    }
                  },
                  {
                    text: "Get New Package",
                    onPress: () => {
                      setRefreshKey(prev => prev + 1);
                      router.replace("/packages");
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
  
  const handleShowUpgradeOptions = () => {
    setShowUpgradeOptions(true);
  };
  
  const handleUpgradePackage = (newPackageId: string) => {
    if (!selectedPackage) return;
    
    Alert.alert(
      "Upgrade Package",
      "Are you sure you want to upgrade to this package?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Upgrade", 
          onPress: async () => {
            try {
              await upgradePackage(selectedPackage.id, newPackageId);
              Alert.alert(
                "Success", 
                "Your package has been upgraded.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setRefreshKey(prev => prev + 1);
                    }
                  }
                ]
              );
              setSelectedPackage(null);
              setShowUpgradeOptions(false);
            } catch (error) {
              Alert.alert("Error", "There was an error upgrading your package. Please try again.");
            }
          }
        }
      ]
    );
  };
  
  const handleRegisterNewPackage = () => {
    router.push("/packages");
  };
  
  const getUpgradeOptions = () => {
    if (!selectedPackage) return [];
    
    // Get the current package details
    const currentPackage = allPackages.find(p => p.id === selectedPackage.packageId);
    if (!currentPackage) return [];
    
    // Find packages of the same type with a higher price
    return allPackages.filter(p => 
      p.type === currentPackage.type && 
      p.price > currentPackage.price &&
      p.id !== currentPackage.id
    );
  };
  
  const activePackages = userPackages.filter(p => p.status === "active");
  const inactivePackages = userPackages.filter(p => p.status !== "active");
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Packages</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userPackages.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Packages</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You don't have any packages yet. Browse our available packages to get started.
            </Text>
            <Button
              title="Browse Packages"
              onPress={() => router.push("/packages")}
              style={styles.browseButton}
            />
          </View>
        ) : (
          <>
            {selectedPackage ? (
              <View style={styles.packageDetailContainer}>
                <TouchableOpacity 
                  style={[styles.backToList, { backgroundColor: colors.card }]}
                  onPress={() => setSelectedPackage(null)}
                >
                  <ChevronLeft size={18} color={colors.primary} />
                  <Text style={[styles.backToListText, { color: colors.primary }]}>
                    Back to all packages
                  </Text>
                </TouchableOpacity>
                
                <View style={[styles.packageDetailCard, { backgroundColor: colors.card }]}>
                  <View style={styles.packageDetailHeader}>
                    <Text style={[styles.packageDetailName, { color: colors.text }]}>
                      {selectedPackage.name}
                    </Text>
                    
                    <View style={[
                      styles.statusBadge, 
                      { 
                        backgroundColor: 
                          selectedPackage.status === "active" ? `${colors.success}30` : 
                          selectedPackage.status === "cancelled" ? `${colors.error}30` :
                          selectedPackage.status === "upgraded" ? `${colors.primary}30` :
                          `${colors.textSecondary}30`
                      }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        {
                          color: 
                            selectedPackage.status === "active" ? colors.success : 
                            selectedPackage.status === "cancelled" ? colors.error :
                            selectedPackage.status === "upgraded" ? colors.primary :
                            colors.textSecondary
                        }
                      ]}>
                        {selectedPackage.status === "active" ? "Active" : 
                         selectedPackage.status === "cancelled" ? "Cancelled" :
                         selectedPackage.status === "upgraded" ? "Upgraded" :
                         selectedPackage.status === "expired" ? "Expired" : "Pending"}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.packageDetailInfo}>
                    <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                      Monthly Price
                    </Text>
                    <Text style={[styles.priceValue, { color: colors.text }]}>
                      £{selectedPackage.price.toFixed(2)}
                    </Text>
                    
                    <View style={styles.dateRow}>
                      <View style={styles.dateItem}>
                        <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                          Start Date
                        </Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                          {new Date(selectedPackage.startDate).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <View style={styles.dateItem}>
                        <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                          End Date
                        </Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                          {new Date(selectedPackage.endDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.autoRenewRow}>
                      <Text style={[styles.autoRenewLabel, { color: colors.textSecondary }]}>
                        Auto Renew
                      </Text>
                      <Text style={[
                        styles.autoRenewValue, 
                        { color: selectedPackage.autoRenew ? colors.success : colors.error }
                      ]}>
                        {selectedPackage.autoRenew ? "On" : "Off"}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.featuresContainer}>
                    <Text style={[styles.featuresTitle, { color: colors.text }]}>
                      Features
                    </Text>
                    
                    {selectedPackage.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Check size={18} color={colors.primary} />
                        <Text style={[styles.featureText, { color: colors.text }]}>
                          <Text style={styles.featureName}>{feature.name}:</Text> {feature.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  {selectedPackage.status === "active" && (
                    <View style={styles.packageActions}>
                      {showUpgradeOptions ? (
                        <View style={styles.upgradeOptionsContainer}>
                          <Text style={[styles.upgradeTitle, { color: colors.text }]}>
                            Select a plan to upgrade to
                          </Text>
                          
                          {getUpgradeOptions().length === 0 ? (
                            <View style={styles.noUpgradeContainer}>
                              <AlertCircle size={24} color={colors.warning} />
                              <Text style={[styles.noUpgradeText, { color: colors.textSecondary }]}>
                                No upgrade options available. You already have the highest package in this category.
                              </Text>
                            </View>
                          ) : (
                            getUpgradeOptions().map(pkg => (
                              <TouchableOpacity
                                key={pkg.id}
                                style={[styles.upgradeOption, { backgroundColor: `${colors.primary}10` }]}
                                onPress={() => handleUpgradePackage(pkg.id)}
                              >
                                <View>
                                  <Text style={[styles.upgradeOptionName, { color: colors.text }]}>
                                    {pkg.name}
                                  </Text>
                                  <Text style={[styles.upgradeOptionPrice, { color: colors.primary }]}>
                                    £{pkg.price.toFixed(2)}/month
                                  </Text>
                                </View>
                                <ArrowUpRight size={20} color={colors.primary} />
                              </TouchableOpacity>
                            ))
                          )}
                          
                          <Button
                            title="Go Back"
                            onPress={() => setShowUpgradeOptions(false)}
                            variant="outline"
                            style={styles.backButton}
                          />
                        </View>
                      ) : (
                        <>
                          <Button
                            title="Upgrade Package"
                            onPress={handleShowUpgradeOptions}
                            style={styles.actionButton}
                            icon={<ArrowUpRight size={18} color="white" />}
                          />
                          <Button
                            title="Cancel Package"
                            onPress={() => handleCancelPackage(selectedPackage.id)}
                            variant="destructive"
                            style={[styles.actionButton, styles.cancelButton]}
                          />
                        </>
                      )}
                    </View>
                  )}

                  {selectedPackage.status === "cancelled" && (
                    <View style={styles.packageActions}>
                      <Text style={[styles.cancelledMessage, { color: colors.textSecondary, marginBottom: 16 }]}>
                        This package has been cancelled. You can get a new package at any time.
                      </Text>
                      <Button 
                        title="Get New Package" 
                        onPress={handleRegisterNewPackage}
                        style={styles.actionButton}
                        icon={<Plus size={18} color="white" />}
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Active Packages
                </Text>
                
                {activePackages.length === 0 ? (
                  <View style={[styles.noPackagesContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.noPackagesText, { color: colors.textSecondary }]}>
                      You don't have any active packages.
                    </Text>
                    <Button
                      title="Get New Package"
                      onPress={() => router.push("/packages")}
                      style={styles.registerButton}
                    />
                  </View>
                ) : (
                  activePackages.map((pkg) => (
                    <TouchableOpacity
                      key={pkg.id}
                      style={[styles.packageCard, { backgroundColor: colors.card }]}
                      onPress={() => handleSelectPackage(pkg)}
                    >
                      <View style={styles.packageCardContent}>
                        <View style={styles.packageNameContainer}>
                          <Text style={[styles.packageName, { color: colors.text }]}>
                            {pkg.name}
                          </Text>
                          <View style={[styles.statusBadgeSmall, { backgroundColor: `${colors.success}30` }]}>
                            <Text style={[styles.statusTextSmall, { color: colors.success }]}>
                              Active
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={[styles.packagePrice, { color: colors.primary }]}>
                          £{pkg.price.toFixed(2)}/month
                        </Text>
                        
                        <View style={styles.packageFeatures}>
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <View key={index} style={styles.packageFeatureItem}>
                              <Check size={14} color={colors.success} />
                              <Text style={[styles.packageFeatureText, { color: colors.textSecondary }]}>
                                {feature.name}: {feature.value}
                              </Text>
                            </View>
                          ))}
                        </View>
                        
                        <View style={styles.packageDates}>
                          <Text style={[styles.packageDateText, { color: colors.textSecondary }]}>
                            {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.packageCardActions}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: `${colors.primary}10` }]}
                          onPress={() => handleSelectPackage(pkg)}
                        >
                          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                            Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                
                {inactivePackages.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
                      Inactive Packages
                    </Text>
                    
                    {inactivePackages.map((pkg) => (
                      <TouchableOpacity
                        key={pkg.id}
                        style={[
                          styles.packageCard, 
                          { 
                            backgroundColor: colors.card,
                            opacity: 0.7
                          }
                        ]}
                        onPress={() => handleSelectPackage(pkg)}
                      >
                        <View style={styles.packageCardContent}>
                          <View style={styles.packageNameContainer}>
                            <Text style={[styles.packageName, { color: colors.text }]}>
                              {pkg.name}
                            </Text>
                            <View style={[
                              styles.statusBadgeSmall, 
                              { 
                                backgroundColor: 
                                  pkg.status === "cancelled" ? `${colors.error}30` :
                                  pkg.status === "upgraded" ? `${colors.primary}30` :
                                  `${colors.textSecondary}30`
                              }
                            ]}>
                              <Text style={[
                                styles.statusTextSmall,
                                {
                                  color: 
                                    pkg.status === "cancelled" ? colors.error :
                                    pkg.status === "upgraded" ? colors.primary :
                                    colors.textSecondary
                                }
                              ]}>
                                {pkg.status === "cancelled" ? "Cancelled" :
                                 pkg.status === "upgraded" ? "Upgraded" :
                                 pkg.status === "expired" ? "Expired" : "Pending"}
                              </Text>
                            </View>
                          </View>
                          
                          <Text style={[styles.packagePrice, { color: colors.textSecondary }]}>
                            £{pkg.price.toFixed(2)}/month
                          </Text>
                          
                          <View style={styles.packageFeatures}>
                            {pkg.features.slice(0, 2).map((feature, index) => (
                              <View key={index} style={styles.packageFeatureItem}>
                                <Check size={14} color={colors.textSecondary} />
                                <Text style={[styles.packageFeatureText, { color: colors.textSecondary }]}>
                                  {feature.name}: {feature.value}
                                </Text>
                              </View>
                            ))}
                          </View>
                          
                          <View style={styles.packageDates}>
                            <Text style={[styles.packageDateText, { color: colors.textSecondary }]}>
                              {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.packageCardActions}>
                          <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: `${colors.primary}10` }]}
                            onPress={() => handleSelectPackage(pkg)}
                          >
                            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                              Details
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    <View style={styles.browseMoreContainer}>
                      <Button
                        title="Get New Package"
                        onPress={() => router.push("/packages")}
                        variant="primary"
                        style={styles.browseMoreButton}
                      />
                    </View>
                  </>
                )}
                
                <View style={styles.browseMoreContainer}>
                  <Button
                    title="Browse More Packages"
                    onPress={() => router.push("/packages")}
                    variant="outline"
                    style={styles.browseMoreButton}
                  />
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
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
    paddingBottom: 32,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  browseButton: {
    minWidth: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  noPackagesText: {
    fontSize: 14,
    marginBottom: 16,
  },
  packageCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  packageCardContent: {
    padding: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  packageNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: "500",
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  packageFeatures: {
    marginBottom: 8,
  },
  packageFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  packageFeatureText: {
    fontSize: 13,
    marginLeft: 6,
  },
  moreFeatures: {
    fontSize: 13,
    marginTop: 4,
  },
  packageDates: {
    marginTop: 8,
  },
  packageDateText: {
    fontSize: 12,
  },
  packageCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  expiryText: {
    fontSize: 12,
  },
  packageCardButtons: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  browseMoreContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  browseMoreButton: {
    minWidth: 220,
  },
  packageDetailContainer: {
    marginBottom: 24,
  },
  backToList: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backToListText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  packageDetailCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  packageDetailHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageDetailName: {
    fontSize: 20,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  packageDetailInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuresContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  featureName: {
    fontWeight: "600",
  },
  packageActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  upgradeButton: {
    marginBottom: 12,
  },
  cancelButton: {
    borderColor: "rgba(255, 59, 48, 0.5)",
  },
  upgradeOptions: {
    marginBottom: 8,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  upgradeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  upgradeOptionName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  upgradeOptionPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  noUpgradesText: {
    fontSize: 14,
    marginBottom: 16,
  },
  cancelUpgradeButton: {
    marginTop: 8,
  },
  noUpgradeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  noUpgradeText: {
    fontSize: 14,
    marginLeft: 8,
  },
  upgradeOptionsContainer: {
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  autoRenewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  autoRenewLabel: {
    fontSize: 14,
  },
  autoRenewValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  noPackagesContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  registerButton: {
    minWidth: 200,
  },
  cancelledMessage: {
    fontSize: 14,
    marginBottom: 16,
  },
});