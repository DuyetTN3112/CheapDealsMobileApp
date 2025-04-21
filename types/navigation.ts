// types/navigation.ts
type AppRoutes = 
  | "/"
  | "/(auth)/login"
  | "/(auth)/register"
  | "/(auth)/forgot-password";

declare module "expo-router" {
  interface Router {
    push: (route: AppRoutes) => void;
  }
}