import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Enquiry } from "@/types";
import colors from "@/constants/colors";
import { Clock, CheckCircle, HelpCircle } from "lucide-react-native";

interface EnquiryCardProps {
  enquiry: Enquiry;
}

export const EnquiryCard: React.FC<EnquiryCardProps> = ({ enquiry }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (enquiry.status) {
      case "open":
        return <HelpCircle size={16} color={colors.info} />;
      case "in-progress":
        return <Clock size={16} color={colors.warning} />;
      case "closed":
        return <CheckCircle size={16} color={colors.success} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (enquiry.status) {
      case "open":
        return "Open";
      case "in-progress":
        return "In Progress";
      case "closed":
        return "Closed";
      default:
        return "";
    }
  };

  const getStatusStyle = () => {
    switch (enquiry.status) {
      case "open":
        return styles.openStatus;
      case "in-progress":
        return styles.inProgressStatus;
      case "closed":
        return styles.resolvedStatus;
      default:
        return {};
    }
  };

  const getStatusTextStyle = () => {
    switch (enquiry.status) {
      case "open":
        return styles.openStatusText;
      case "in-progress":
        return styles.inProgressStatusText;
      case "closed":
        return styles.resolvedStatusText;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subject}>{enquiry.subject}</Text>
        <View style={[styles.statusBadge, getStatusStyle()]}>
          {getStatusIcon()}
          <Text style={[styles.statusText, getStatusTextStyle()]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.message} numberOfLines={3}>
        {enquiry.message}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.date}>Submitted on {formatDate(enquiry.date)}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subject: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  openStatus: {
    backgroundColor: "rgba(90, 200, 250, 0.1)",
  },
  inProgressStatus: {
    backgroundColor: "rgba(255, 204, 0, 0.1)",
  },
  resolvedStatus: {
    backgroundColor: "rgba(52, 199, 89, 0.1)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  openStatusText: {
    color: colors.info,
  },
  inProgressStatusText: {
    color: colors.warning,
  },
  resolvedStatusText: {
    color: colors.success,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
});