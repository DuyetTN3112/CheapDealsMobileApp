import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, FileText, Download, ChevronRight, CheckCircle, AlertCircle } from "lucide-react-native";
import colors from "@/constants/colors";
import { useUserDataStore } from "@/store/userDataStore";
import { Bill } from "@/types";

export default function BillingHistoryScreen() {
  const router = useRouter();
  const { bills, fetchUserData } = useUserDataStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBills = async () => {
      try {
        await fetchUserData("user-123");
      } catch (error) {
        console.error("Failed to load bills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBills();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleViewBill = (billId: string) => {
    router.push(`/billing-history/${billId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderBillItem = ({ item }: { item: Bill }) => (
    <TouchableOpacity 
      style={styles.billItem}
      onPress={() => handleViewBill(item.id)}
    >
      <View style={styles.billHeader}>
        <View style={styles.billIconContainer}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billTitle}>
            Invoice #{item.invoiceNumber?.split("-").pop()}
          </Text>
          <Text style={styles.billDate}>
            Due: {formatDate(item.dueDate)}
          </Text>
        </View>
        <View style={styles.billStatus}>
          {item.isPaid ? (
            <View style={styles.paidStatus}>
              <CheckCircle size={14} color={colors.success} />
              <Text style={styles.paidText}>Paid</Text>
            </View>
          ) : (
            <View style={styles.unpaidStatus}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={styles.unpaidText}>Unpaid</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.billAmount}>
        <Text style={styles.amountLabel}>Amount:</Text>
        <Text style={styles.amount}>£{item.amount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.billFooter}>
        <Text style={styles.viewDetails}>View Details</Text>
        <ChevronRight size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing History</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading billing history...</Text>
        </View>
      ) : bills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>No billing history</Text>
          <Text style={styles.emptySubtext}>
            Your billing history will appear here once you have active subscriptions.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          renderItem={renderBillItem}
          contentContainerStyle={styles.billsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Showing {bills.length} {bills.length === 1 ? "bill" : "bills"}
              </Text>
            </View>
          }
        />
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
  },
  billsList: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  billItem: {
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
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  billIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  billDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  billStatus: {
    marginLeft: 8,
  },
  paidStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: "600",
    marginLeft: 4,
  },
  unpaidStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unpaidText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: "600",
    marginLeft: 4,
  },
  billAmount: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  billFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  viewDetails: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginRight: 4,
  },
});