import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SpecialOffer } from "@/types";
import colors from "@/constants/colors";
import { Calendar, Percent } from "lucide-react-native";

interface OfferCardProps {
  offer: SpecialOffer;
  onPress: (offer: SpecialOffer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(offer)}
      activeOpacity={0.7}
    >
      {offer.image && (
        <Image source={{ uri: offer.image }} style={styles.image} />
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{offer.title}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{offer.discountPercentage}% OFF</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {offer.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.codeContainer}>
            <Percent size={16} color={colors.primary} />
            <Text style={styles.codeText}>Code: <Text style={styles.code}>{offer.code}</Text></Text>
          </View>
          
          <View style={styles.validContainer}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.validText}>Valid until {formatDate(offer.validUntil)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  discountBadge: {
    backgroundColor: colors.discount,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    marginTop: 8,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  codeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  code: {
    fontWeight: "700",
    color: colors.primary,
  },
  validContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  validText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});