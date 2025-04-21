import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Package } from "@/types";
import { ChevronRight, Check } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface PackageCardProps {
  package: Package;
  onPress: (packageId: string) => void;
  compact?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onPress,
  compact = false,
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        compact && styles.compactContainer,
        { backgroundColor: colors.card }
      ]}
      onPress={() => onPress(pkg.id)}
      activeOpacity={0.7}
    >
      {pkg.popular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: pkg.image }} style={styles.image} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{pkg.name}</Text>
        
        {!compact && (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {pkg.description}
          </Text>
        )}
        
        {!compact && (
          <View style={styles.featuresContainer}>
            {pkg.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check size={14} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {feature.name}: {feature.value}
                </Text>
              </View>
            ))}
            {pkg.features.length > 3 && (
              <Text style={[styles.moreFeatures, { color: colors.primary }]}>
                +{pkg.features.length - 3} more
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>£{pkg.price.toFixed(2)}</Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>/month</Text>
          </View>
          
          {!compact && (
            <View style={styles.viewDetailsContainer}>
              <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
              <ChevronRight size={16} color={colors.primary} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  compactContainer: {
    flexDirection: "row",
    height: 100,
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  imageContainer: {
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    marginLeft: 6,
  },
  moreFeatures: {
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  period: {
    fontSize: 14,
    marginLeft: 2,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 2,
  },
});