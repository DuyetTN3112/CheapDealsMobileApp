import { Enquiry, Order, UsageData, UserPackage, User } from "@/types";

export const mockUser: User = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+44 123 456 7890",
  address: "123 Main Street, London, UK"
};

export const mockUsageData: UsageData = {
  dataUsed: 5.2,
  dataTotal: 10,
  minutesUsed: 120,
  minutesTotal: 500,
  textsUsed: 45,
  textsTotal: 500,
  billingCycle: {
    start: "2023-07-01T00:00:00Z",
    end: "2023-07-31T23:59:59Z",
  },
};

export const mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-123",
    packageId: "mobile-standard",
    packageName: "Standard Mobile",
    date: "2023-06-15T10:30:00Z",
    status: "completed",
    totalAmount: 24.99,
    discountAmount: 3.75,
    finalAmount: 21.24,
  },
  {
    id: "order-2",
    userId: "user-123",
    packageId: "broadband-fast",
    packageName: "Fast Broadband",
    date: "2023-05-20T14:45:00Z",
    status: "completed",
    totalAmount: 35.99,
    discountAmount: 5.40,
    finalAmount: 30.59,
  },
];

export const mockEnquiries: Enquiry[] = [
  {
    id: "enquiry-1",
    userId: "user-123",
    subject: "Billing Question",
    message: "I have a question about my recent bill. There seems to be an extra charge that I don't recognize.",
    date: "2023-07-10T09:15:00Z",
    status: "open",
  },
  {
    id: "enquiry-2",
    userId: "user-123",
    subject: "Package Upgrade",
    message: "I'm interested in upgrading my current package. What options do I have?",
    date: "2023-06-25T16:20:00Z",
    status: "closed",
    responses: [
      {
        message: "Thank you for your enquiry. We have several upgrade options available for your current package. Could you please provide your account number so I can check the specific offers available to you?",
        date: "2023-06-25T17:30:00Z",
        isAgent: true,
      },
      {
        message: "My account number is 12345678. I'm particularly interested in getting more data.",
        date: "2023-06-26T10:15:00Z",
        isAgent: false,
      },
      {
        message: "Thank you for providing your account number. I can see that you're eligible for our Premium Mobile package which includes unlimited data for just £10 more per month. Would you like me to process this upgrade for you?",
        date: "2023-06-26T11:45:00Z",
        isAgent: true,
      },
      {
        message: "Yes, please go ahead with the upgrade.",
        date: "2023-06-26T14:20:00Z",
        isAgent: false,
      },
      {
        message: "Great! I've processed the upgrade for you. The changes will take effect from your next billing cycle. Is there anything else I can help you with?",
        date: "2023-06-26T15:10:00Z",
        isAgent: true,
      },
    ],
  },
];

export const mockUserPackages: UserPackage[] = [
  {
    id: "user-pkg-1",
    packageId: "mobile-standard",
    name: "Standard Mobile",
    startDate: "2023-06-15T00:00:00Z",
    endDate: "2024-06-14T23:59:59Z",
    status: "active",
    price: 21.24,
    autoRenew: true,
    features: [
      { name: "Data", value: "10GB" },
      { name: "Minutes", value: "500" },
      { name: "Texts", value: "500" },
      { name: "Contract", value: "12 months" }
    ]
  },
  {
    id: "user-pkg-2",
    packageId: "broadband-fast",
    name: "Fast Broadband",
    startDate: "2023-05-20T00:00:00Z",
    endDate: "2024-05-19T23:59:59Z",
    status: "active",
    price: 30.59,
    autoRenew: true,
    features: [
      { name: "Speed", value: "100Mbps" },
      { name: "Data", value: "Unlimited" },
      { name: "Router", value: "Included" },
      { name: "Contract", value: "12 months" }
    ]
  }
];