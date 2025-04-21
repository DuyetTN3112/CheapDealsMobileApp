import { NotificationPreference, PrivacySetting, AppSetting } from "@/types";

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    id: "notification-bills",
    title: "Bill Reminders",
    description: "Receive notifications when a new bill is available or when payment is due",
    enabled: true,
    type: "bill"
  },
  {
    id: "notification-usage",
    title: "Usage Alerts",
    description: "Get notified when you're approaching your data, minutes, or texts limit",
    enabled: true,
    type: "bill"
  },
  {
    id: "notification-offers",
    title: "Special Offers",
    description: "Receive notifications about special offers and promotions",
    enabled: false,
    type: "bill"
  },
  {
    id: "notification-updates",
    title: "App Updates",
    description: "Get notified when there are updates to the app",
    enabled: true,
    type: "bill"
  },
  {
    id: "notification-service",
    title: "Service Updates",
    description: "Receive notifications about service maintenance or outages",
    enabled: true,
    type: "bill"
  },
];

export const mockPrivacySettings: PrivacySetting[] = [
  {
    id: "privacy-data-collection",
    title: "Data Collection",
    description: "Allow us to collect usage data to improve our services",
    enabled: true,
    type: "dataSharing"
  },
  {
    id: "privacy-location",
    title: "Location Services",
    description: "Allow the app to access your location for better service",
    enabled: false,
    type: "dataSharing"
  },
  {
    id: "privacy-marketing",
    title: "Marketing Communications",
    description: "Receive marketing communications from us",
    enabled: false,
    type: "dataSharing"
  },
  {
    id: "privacy-third-party",
    title: "Third-Party Sharing",
    description: "Allow sharing of anonymized data with trusted third parties",
    enabled: false,
    type: "dataSharing"
  },
  {
    id: "privacy-analytics",
    title: "Analytics",
    description: "Allow us to collect analytics data to improve the app experience",
    enabled: true,
    type: "dataSharing"
  },
];

export const mockAppSettings: AppSetting[] = [
  {
    id: "theme",
    title: "Theme",
    description: "Choose between light, dark, or system default theme",
    type: "theme",
    value: "system",
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System Default", value: "system" },
    ],
    label: ""
  },
  {
    id: "language",
    title: "Language",
    description: "Select your preferred language",
    type: "language",
    value: "en",
    options: [
      { label: "English", value: "en" },
      { label: "Vietnamese", value: "vi" },
      { label: "French", value: "fr" },
      { label: "Spanish", value: "es" },
      { label: "German", value: "de" },
    ],
    label: ""
  },
  {
    id: "notifications-enabled",
    title: "Notifications",
    description: "Enable or disable all notifications",
    type: "notifications",
    value: true,
    label: ""
  },
  {
    id: "biometrics-login",
    title: "Biometric Login",
    description: "Use fingerprint or face recognition to log in",
    type: "biometrics",
    value: true,
    label: ""
  },
  {
    id: "auto-login",
    title: "Auto Login",
    description: "Stay logged in when you close the app",
    type: "autoLogin",
    value: true,
    label: ""
  },
];