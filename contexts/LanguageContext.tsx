import React, { createContext, useContext } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import translations from "@/constants/translations";

export type Language = "en" | "vi" | "fr" | "es" | "de";

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  t: (key) => key,
  setLanguage: () => {},
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error("useLanguage must be used within a LanguageProvider");
    // Return a default value instead of throwing an error
    return {
      language: "en",
      t: (key: string) => key,
      setLanguage: () => {},
    };
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appSettings, updateAppSetting } = useSettingsStore();
  
  // Find the language setting from app settings
  const languageSetting = appSettings.find(setting => setting.id === "language");
  const currentLanguage = (languageSetting?.value as Language) || "en";
  
  const setLanguage = (newLanguage: Language) => {
    updateAppSetting("language", newLanguage);
  };
  
  const translate = (key: string): string => {
    const languageTranslations = translations[currentLanguage] || translations.en;
    return languageTranslations[key] || translations.en[key] || key;
  };
  
  const value = {
    language: currentLanguage,
    t: translate,
    setLanguage,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};