import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import lightColors from "@/constants/colors";
import darkColors from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof lightColors & { purple: string };
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// Add purple color to both themes
const lightWithPurple = {
  ...lightColors,
  purple: '#5856D6'
};

const darkWithPurple = {
  ...darkColors,
  purple: '#5E5CE6'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  colors: lightWithPurple,
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { appSettings, updateAppSetting } = useSettingsStore();
  
  // Find the theme setting from app settings
  const themeSetting = appSettings.find(setting => setting.id === "theme");
  const currentTheme = themeSetting?.value as ThemeType || "system";
  
  // Determine if we should use dark mode based on theme setting and system preference
  const shouldUseDarkMode = 
    currentTheme === "dark" || 
    (currentTheme === "system" && systemColorScheme === "dark");
  
  const [isDark, setIsDark] = useState(shouldUseDarkMode);
  
  useEffect(() => {
    setIsDark(
      currentTheme === "dark" || 
      (currentTheme === "system" && systemColorScheme === "dark")
    );
  }, [currentTheme, systemColorScheme]);
  
  const setTheme = (newTheme: ThemeType) => {
    updateAppSetting("theme", newTheme);
  };
  
  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    updateAppSetting("theme", newTheme);
  };
  
  const value = {
    theme: currentTheme,
    colors: isDark ? darkWithPurple : lightWithPurple,
    isDark,
    setTheme,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};