import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, User, Mail, Phone, MapPin, Edit2 } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Edit2 size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitials}>
            {user?.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <User size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Mail size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Phone size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user?.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={() => router.push("/profile/change-password")}
          >
            <Text style={styles.securityButtonText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={() => router.push("/profile/two-factor")}
          >
            <Text style={styles.securityButtonText}>Two-Factor Authentication</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileInitials: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 48,
    fontWeight: "600",
    color: "white",
  },
  infoSection: {
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  securitySection: {
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
  securityButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  securityButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
});