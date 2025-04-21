import { create } from "zustand";

interface AppSetting {
  id: string;
  value: string | boolean | number;
  label: string;
  type: "theme" | "language" | "notifications" | string;
}

interface NotificationPreference {
  id: string;
  type: "bill" | "offer" | "usage" | "news" | "service" | "account";
  title: string;
  description: string;
  enabled: boolean;
}

interface PrivacySetting {
  id: string;
  type: "dataSharing" | "marketing" | "analytics" | "thirdParty" | "location";
  title: string;
  description: string;
  enabled: boolean;
}

interface SettingsState {
  appSettings: AppSetting[];
  notificationPreferences: NotificationPreference[];
  privacySettings: PrivacySetting[];
  isLoading: boolean;
  updateAppSetting: (id: string, value: string | boolean | number) => void;
  fetchSettings: () => Promise<void>;
  updateNotificationPreference: (id: string, enabled: boolean) => void;
  updatePrivacySetting: (id: string, enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  appSettings: [
    {
      id: "theme",
      value: "system",
      label: "Theme",
      type: "theme"
    },
    {
      id: "language",
      value: "en",
      label: "Language",
      type: "language"
    },
    {
      id: "notifications",
      value: true,
      label: "Notifications",
      type: "notifications"
    }
  ],
  notificationPreferences: [
    {
      id: "bill_notifications",
      type: "bill",
      title: "Bill Notifications",
      description: "Get notified about your upcoming bills",
      enabled: true
    },
    {
      id: "offer_notifications",
      type: "offer",
      title: "Special Offers",
      description: "Receive notifications about special deals",
      enabled: true
    },
    {
      id: "usage_notifications",
      type: "usage",
      title: "Usage Alerts",
      description: "Get alerts about your usage",
      enabled: true
    }
  ],
  privacySettings: [
    {
      id: "data_sharing",
      type: "dataSharing",
      title: "Data Sharing",
      description: "Allow sharing of your data with trusted partners",
      enabled: true
    },
    {
      id: "marketing_emails",
      type: "marketing",
      title: "Marketing Emails",
      description: "Receive marketing communications",
      enabled: true
    },
    {
      id: "analytics_tracking",
      type: "analytics",
      title: "Analytics Tracking",
      description: "Allow tracking of app usage for improvements",
      enabled: true
    },
    {
      id: "third_party_access",
      type: "thirdParty",
      title: "Third Party Access",
      description: "Allow third-party services to access your data",
      enabled: false
    },
    {
      id: "location_tracking",
      type: "location",
      title: "Location Tracking",
      description: "Allow tracking of your location for better services",
      enabled: false
    }
  ],
  isLoading: false,

  updateAppSetting: (id, value) => set((state) => ({
    appSettings: state.appSettings.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    )
  })),

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch settings:', error);
    }
  },

  updateNotificationPreference: (id, enabled) => set((state) => ({
    notificationPreferences: state.notificationPreferences.map(pref =>
      pref.id === id ? { ...pref, enabled } : pref
    )
  })),

  updatePrivacySetting: (id, enabled) => set((state) => ({
    privacySettings: state.privacySettings.map(setting =>
      setting.id === id ? { ...setting, enabled } : setting
    )
  })),
}));