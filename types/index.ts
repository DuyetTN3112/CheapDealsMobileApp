// Package Types
export interface PackageFeature {
  name: string;
  value: string;
}

export interface Package {
  id: string;
  name: string;
  type: "mobile" | "broadband" | "tv" | "bundle";
  description: string;
  price: number;
  features: PackageFeature[];
  popular?: boolean;
  image: string;
}

export interface UserPackage {
  id: string;
  packageId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "cancelled" | "expired" | "upgraded";
  price: number;
  autoRenew: boolean;
  features: PackageFeature[];
}

// User Data Types
export interface UsageData {
  dataUsed: number;
  dataTotal: number;
  minutesUsed: number;
  minutesTotal: number;
  textsUsed: number;
  textsTotal: number;
  billingCycle: {
    start: string;
    end: string;
  };
}

export interface Bill {
  id: string;
  userId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  items: {
    name: string;
    amount: number;
  }[];
  invoiceNumber: string;
}

export interface Order {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  date: string;
  status: "processing" | "completed" | "cancelled";
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface Enquiry {
  id: string;
  userId: string;
  subject: string;
  message: string;
  date: string;
  status: "open" | "closed" | "in-progress";
  responses?: {
    message: string;
    date: string;
    isAgent: boolean;
  }[];
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercentage: number;
  validUntil: string;
  image: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: "card" | "paypal" | "bank" | "ewallet";
  isDefault: boolean;
  details: CardDetails | PayPalDetails | BankDetails | EWalletDetails;
}

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | "other";
}

export interface PayPalDetails {
  email: string;
}

export interface BankDetails {
  accountNumber: string;
  sortCode: string;
  accountName: string;
}

export interface EWalletDetails {
  provider: "momo" | "zalopay" | "vnpay" | "other";
  phoneNumber: string;
  accountName: string;
}

// Settings Types
export interface NotificationPreference {
  id: string;
  type: "bill" | "offer" | "usage" | "news" | "service" | "account";
  title: string;
  description: string;
  enabled: boolean;
}

export interface PrivacySetting {
  id: string;
  type: "dataSharing" | "marketing" | "analytics" | "thirdParty" | "location";
  title: string;
  description: string;
  enabled: boolean;
}

export interface AppSetting {
  id: string;
  value: string | boolean;
  label: string;
  type: "theme" | "language" | "notifications" | "biometrics" | "autoLogin" | "other" | "security" | "payment";
  title: string;
  description: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}


// Feedback Types
export interface Feedback {
  id: string;
  userId: string;
  packageId?: string;
  serviceRating: number;
  appRating: number;
  packageRating?: number;
  comment: string;
  date: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  packageId: string;
  quantity: number;
  package: Package;
}