import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Bill } from "@/types";
import colors from "@/constants/colors";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react-native";
import { Button } from "./Button";

interface BillCardProps {
  bill: Bill;
  onPayNow: (billId: string) => void;
}

export const BillCard: React.FC<BillCardProps> = ({ bill, onPayNow }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    
    // Set time to midnight for accurate date comparison
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Calculate days difference
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilDue = isDueDate(bill.dueDate);
  const isOverdue = daysUntilDue < 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bill #{bill.id.split("-")[1]}</Text>
        {bill.isPaid ? (
          <View style={styles.paidBadge}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.paidText}>Paid</Text>
          </View>
        ) : isOverdue ? (
          <View style={styles.overdueBadge}>
            <AlertCircle size={14} color={colors.error} />
            <Text style={styles.overdueText}>Overdue</Text>
          </View>
        ) : (
          <View style={styles.pendingBadge}>
            <AlertCircle size={14} color={colors.warning} />
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        )}
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount Due:</Text>
        <Text style={styles.amount}>£{bill.amount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            Due Date: {formatDate(bill.dueDate)}
          </Text>
        </View>
        
        {bill.isPaid && bill.paidDate && (
          <View style={styles.dateItem}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={styles.dateText}>
              Paid on: {formatDate(bill.paidDate)}
            </Text>
          </View>
        )}
      </View>
      
      {!bill.isPaid && (
        <View style={styles.actionContainer}>
          <Button
            title="Pay Now"
            onPress={() => onPayNow(bill.id)}
            variant="primary"
            size="medium"
            fullWidth
          />
        </View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  overdueBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overdueText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  actionContainer: {
    marginTop: 8,
  },
});