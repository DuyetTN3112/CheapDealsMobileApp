import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router/";
import { ChevronLeft, Download, Share2, CheckCircle, AlertCircle, Calendar, CreditCard } from "lucide-react-native";
import colors from "@/constants/colors";
import { useUserDataStore } from "@/store/userDataStore";
import { Bill } from "@/types";
import { Button } from "@/components/Button";

export default function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBillDetails, payBill, isLoading } = useUserDataStore();
  const [bill, setBill] = useState<Bill | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const billDetails = getBillDetails(id);
      setBill(billDetails);
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `CheapDeals Invoice #${bill?.invoiceNumber?.split("-").pop()} for £${bill?.amount.toFixed(2)}`,
        title: "Share Invoice",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share invoice");
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the PDF
    Alert.alert("Download", "Invoice PDF downloaded successfully");
  };

  const handlePayNow = async () => {
    if (!bill) return;
    
    try {
      await payBill(bill.id);
      // Refresh bill details
      const updatedBill = getBillDetails(bill.id);
      setBill(updatedBill);
      
      Alert.alert("Success", "Payment processed successfully");
    } catch (error) {
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bill details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.invoiceTitle}>
              Invoice #{bill.invoiceNumber?.split("-").pop()}
            </Text>
            <Text style={styles.invoiceDate}>
              Issued: {formatDate(bill.dueDate)}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            {bill.isPaid ? (
              <View style={styles.paidStatus}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.paidText}>Paid</Text>
              </View>
            ) : (
              <View style={styles.unpaidStatus}>
                <AlertCircle size={16} color={colors.error} />
                <Text style={styles.unpaidText}>Unpaid</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Due Date</Text>
              <Text style={styles.summaryValue}>{formatDate(bill.dueDate)}</Text>
            </View>
          </View>
          {bill.isPaid && bill.paidDate && (
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <CheckCircle size={20} color={colors.success} />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Paid Date</Text>
                <Text style={styles.summaryValue}>{formatDate(bill.paidDate)}</Text>
              </View>
            </View>
          )}
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Payment Method</Text>
              <Text style={styles.summaryValue}>
                {bill.isPaid ? "Visa ending in 4242" : "Not paid yet"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.itemsContainer}>
            <View style={styles.itemsHeader}>
              <Text style={styles.itemsHeaderText}>Description</Text>
              <Text style={styles.itemsHeaderText}>Amount</Text>
            </View>
            {bill.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemDescription}>{item.name}</Text>
                <Text style={styles.itemAmount}>£{item.amount.toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>£{bill.amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Download size={20} color={colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!bill.isPaid && (
        <View style={styles.footer}>
          <Button
            title="Pay Now"
            onPress={handlePayNow}
            loading={isLoading}
            fullWidth
          />
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  paidStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  paidText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "600",
    marginLeft: 6,
  },
  unpaidStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  unpaidText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  itemsContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemsHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  itemAmount: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});