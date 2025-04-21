import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { UsageData } from "@/types";
import colors from "@/constants/colors";
import { Wifi, Phone, MessageSquare } from "lucide-react-native";

interface UsageCardProps {
  usageData: UsageData;
}

export const UsageCard: React.FC<UsageCardProps> = ({ usageData }) => {
  const renderProgressBar = (used: number, total: number) => {
    const percentage = Math.min((used / total) * 100, 100);
    let barColor = colors.primary;
    
    if (percentage > 90) {
      barColor = colors.error;
    } else if (percentage > 70) {
      barColor = colors.warning;
    }
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Usage</Text>
      
      <View style={styles.usageItem}>
        <View style={styles.usageHeader}>
          <View style={styles.iconContainer}>
            <Wifi size={18} color="white" />
          </View>
          <Text style={styles.usageType}>Data</Text>
        </View>
        
        {renderProgressBar(usageData.dataUsed, usageData.dataTotal)}
        
        <View style={styles.usageDetails}>
          <Text style={styles.usageText}>
            {usageData.dataUsed} GB used
          </Text>
          <Text style={styles.usageText}>
            {usageData.dataTotal - usageData.dataUsed} GB remaining
          </Text>
        </View>
      </View>
      
      <View style={styles.usageItem}>
        <View style={styles.usageHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
            <Phone size={18} color="white" />
          </View>
          <Text style={styles.usageType}>Calls</Text>
        </View>
        
        {renderProgressBar(usageData.minutesUsed, usageData.minutesTotal)}
        
        <View style={styles.usageDetails}>
          <Text style={styles.usageText}>
            {usageData.minutesUsed} minutes used
          </Text>
          <Text style={styles.usageText}>
            {usageData.minutesTotal - usageData.minutesUsed} minutes remaining
          </Text>
        </View>
      </View>
      
      <View style={styles.usageItem}>
        <View style={styles.usageHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.info }]}>
            <MessageSquare size={18} color="white" />
          </View>
          <Text style={styles.usageType}>Texts</Text>
        </View>
        
        {renderProgressBar(usageData.textsUsed, usageData.textsTotal)}
        
        <View style={styles.usageDetails}>
          <Text style={styles.usageText}>
            {usageData.textsUsed} texts used
          </Text>
          <Text style={styles.usageText}>
            {usageData.textsTotal - usageData.textsUsed} texts remaining
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  usageType: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  usageDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  usageText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});