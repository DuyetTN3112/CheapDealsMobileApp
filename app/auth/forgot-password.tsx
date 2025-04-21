import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import colors from "@/constants/colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    // Logic gửi email khôi phục mật khẩu ở đây
    console.log("Reset password for:", email);
    // Sau khi gửi email, có thể quay lại màn hình đăng nhập
    router.push("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Khôi phục mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </Text>

        <Input
          label="Email"
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
        />

        <Button
          title="Gửi liên kết"
          onPress={handleResetPassword}
          style={styles.button}
          fullWidth
        />

        <Button
          title="Quay lại đăng nhập"
          onPress={() => router.push("/auth/login")}
          variant="outline"
          style={styles.button}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
});