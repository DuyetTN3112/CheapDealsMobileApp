import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { ChevronLeft, User, Mail, Phone, MapPin, Save } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUserProfile, isLoading } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateUserProfile({
        id: user?.id || "",
        name,
        email,
        phone,
        address,
      });
      
      Alert.alert(
        "Success",
        "Your profile has been updated successfully.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {name.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
            </Text>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError("");
            }}
            error={nameError}
            leftIcon={<User size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) setPhoneError("");
            }}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (addressError) setAddressError("");
            }}
            error={addressError}
            leftIcon={<MapPin size={20} color={colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
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
    marginBottom: 24,
  },
  profileInitials: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingVertical: 8,
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});