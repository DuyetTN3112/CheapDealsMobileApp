import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Alert } from "react-native";
import { User } from "@/types";
import { mockUser } from "@/mocks/userData";

// Mật khẩu mặc định cho tài khoản Google
const DEFAULT_GOOGLE_PASSWORD = "Duyet@31122004";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUserProfile: (userData: User) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll accept any email/password and use mock data
          if (email && password) {
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate Google authentication
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          // Mock successful Google login
          const googleUser: User = {
            ...mockUser,
            id: `google-${Date.now()}`,
            name: "Google User",
            email: "google.user@gmail.com"
          };
          
          // Lưu trữ thông tin đăng nhập bằng Google với mật khẩu mặc định
          Alert.alert(
            "Thông tin mật khẩu mặc định",
            `Tài khoản Google của bạn đã được thiết lập với mật khẩu mặc định: ${DEFAULT_GOOGLE_PASSWORD}`,
            [{ text: "OK" }]
          );
          
          set({ user: googleUser, isAuthenticated: true, isLoading: false });
          
          // Trong trường hợp thực tế, bạn có thể lưu mật khẩu mặc định vào một trường riêng
          // Ví dụ: lưu vào AsyncStorage hoặc một trường ẩn trong đối tượng user
          // Tuy nhiên, đây không phải là cách bảo mật, chỉ để mô phỏng chức năng
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Google login failed", 
            isLoading: false 
          });
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Kiểm tra xem đây có phải là đăng ký bằng Google hay không
          const isGoogleSignup = userData.email && userData.email.includes("@gmail.com") && !userData.password;
          
          // For demo purposes, create a user with the provided data
          const newUser: User = {
            id: isGoogleSignup ? `google-${Date.now()}` : `user-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          };
          
          // Nếu đăng ký qua Google, hiển thị thông báo về mật khẩu mặc định
          if (isGoogleSignup) {
            Alert.alert(
              "Thông tin mật khẩu mặc định",
              `Tài khoản Google của bạn đã được thiết lập với mật khẩu mặc định: ${DEFAULT_GOOGLE_PASSWORD}`,
              [{ text: "OK" }]
            );
            // Trong một ứng dụng thực tế, bạn có thể lưu trữ mật khẩu mặc định ở đâu đó an toàn hơn
          }
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUserProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          set({ user: userData, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to update profile", 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updatePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1200));
          
          // Đối với người dùng đăng nhập bằng Google, kiểm tra mật khẩu mặc định
          const user = get().user;
          const isGoogleUser = user && user.id && user.id.startsWith('google-');
          
          // Nếu là người dùng Google và nhập mật khẩu hiện tại là mật khẩu mặc định
          if (isGoogleUser && currentPassword !== DEFAULT_GOOGLE_PASSWORD) {
            throw new Error("Incorrect current password");
          }
          
          // Cho người dùng thông thường
          if (!isGoogleUser && !currentPassword) {
            throw new Error("Current password is required");
          }
          
          if (!newPassword) {
            throw new Error("New password is required");
          }
          
          // Mọi thứ đều hợp lệ
          set({ isLoading: false });
          return;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to update password", 
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);