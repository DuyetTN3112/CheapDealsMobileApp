import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { Search, Filter, X } from "lucide-react-native";
import colors from "@/constants/colors";
import { usePackagesStore } from "@/store/packagesStore";
import { useUserDataStore } from "@/store/userDataStore";
import { PackageCard } from "@/components/PackageCard";
import { Package } from "@/types";

export default function PackagesScreen() {
  const router = useRouter();
  const { allPackages, filteredPackages, fetchPackages, filterPackages } = usePackagesStore();
  const { fetchUserData } = useUserDataStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<Package["type"] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Initial load
  useEffect(() => {
    console.log("Loading packages initial data");
    fetchPackages();
    fetchUserData("user-123");
  }, [refreshKey]);
  
  // Add effect to refresh packages periodically
  useEffect(() => {
    console.log("Setting up periodic refresh for packages");
    const interval = setInterval(() => {
      fetchPackages();
      fetchUserData("user-123");
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    filterPackages(selectedType || undefined, searchTerm);
  }, [selectedType, searchTerm, allPackages]);
  
  const handlePackagePress = (packageId: string) => {
    router.push(`/packages/${packageId}`);
  };
  
  const handleTypeSelect = (type: Package["type"] | null) => {
    setSelectedType(type === selectedType ? null : type);
  };
  
  const clearSearch = () => {
    setSearchTerm("");
  };
  
  const packageTypes: { label: string; value: Package["type"] | null }[] = [
    { label: "All", value: null },
    { label: "Mobile", value: "mobile" },
    { label: "Broadband", value: "broadband" },
    { label: "TV", value: "tv" },
    { label: "Bundle", value: "bundle" },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Packages</Text>
        <Text style={styles.subtitle}>Find the perfect package for your needs</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search packages..."
            placeholderTextColor={colors.textLight}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {packageTypes.map((type) => (
          <TouchableOpacity
            key={type.label}
            style={[
              styles.filterButton,
              selectedType === type.value && styles.filterButtonActive,
            ]}
            onPress={() => handleTypeSelect(type.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedType === type.value && styles.filterButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <FlatList
        data={filteredPackages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PackageCard package={item} onPress={handlePackagePress} />
        )}
        contentContainerStyle={styles.packagesContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No packages found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "white",
  },
  packagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});