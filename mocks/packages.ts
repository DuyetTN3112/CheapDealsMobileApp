import { Package } from "@/types";

export const packages: Package[] = [
  {
    id: "mobile-basic",
    name: "Basic Mobile",
    type: "mobile",
    description: "Essential mobile plan with unlimited texts and calls",
    price: 15.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Data", value: "5GB" },
      { name: "Calls", value: "Unlimited" },
      { name: "Texts", value: "Unlimited" },
      { name: "Contract", value: "12 months" },
    ],
  },
  {
    id: "mobile-standard",
    name: "Standard Mobile",
    type: "mobile",
    description: "Our most popular mobile plan with plenty of data",
    price: 24.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Data", value: "20GB" },
      { name: "Calls", value: "Unlimited" },
      { name: "Texts", value: "Unlimited" },
      { name: "Contract", value: "12 months" },
    ],
  },
  {
    id: "mobile-premium",
    name: "Premium Mobile",
    type: "mobile",
    description: "Ultimate mobile experience with unlimited everything",
    price: 34.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Data", value: "Unlimited" },
      { name: "Calls", value: "Unlimited" },
      { name: "Texts", value: "Unlimited" },
      { name: "Contract", value: "12 months" },
      { name: "International", value: "50 countries" },
    ],
  },
  {
    id: "broadband-basic",
    name: "Basic Broadband",
    type: "broadband",
    description: "Reliable broadband for everyday browsing",
    price: 19.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Speed", value: "30 Mbps" },
      { name: "Data", value: "Unlimited" },
      { name: "Contract", value: "12 months" },
      { name: "Setup", value: "Free" },
    ],
  },
  {
    id: "broadband-fiber",
    name: "Fiber Broadband",
    type: "broadband",
    description: "High-speed fiber connection for streaming and gaming",
    price: 29.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1563770557319-3e5f9a28a699?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Speed", value: "100 Mbps" },
      { name: "Data", value: "Unlimited" },
      { name: "Contract", value: "12 months" },
      { name: "Setup", value: "Free" },
      { name: "Router", value: "Premium" },
    ],
  },
  {
    id: "tablet-basic",
    name: "Basic Tablet",
    type: "mobile",
    description: "Essential data plan for your tablet",
    price: 12.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Data", value: "10GB" },
      { name: "Contract", value: "12 months" },
      { name: "Device", value: "Not included" },
    ],
  },
  {
    id: "double-mobile-broadband",
    name: "Mobile + Broadband",
    type: "bundle",
    description: "Combined package with mobile and broadband services",
    price: 39.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Mobile Data", value: "20GB" },
      { name: "Calls", value: "Unlimited" },
      { name: "Texts", value: "Unlimited" },
      { name: "Broadband", value: "50 Mbps" },
      { name: "Contract", value: "18 months" },
      { name: "Discount", value: "15% off" },
    ],
  },
  {
    id: "triple-all",
    name: "Complete Package",
    type: "bundle",
    description: "Our best value with mobile, broadband and tablet data",
    price: 49.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    features: [
      { name: "Mobile Data", value: "Unlimited" },
      { name: "Calls", value: "Unlimited" },
      { name: "Texts", value: "Unlimited" },
      { name: "Broadband", value: "100 Mbps" },
      { name: "Tablet Data", value: "10GB" },
      { name: "Contract", value: "24 months" },
      { name: "Discount", value: "25% off" },
    ],
  },
];

export const getPackagesByType = (type: Package["type"]) => {
  return packages.filter(pkg => pkg.type === type);
};

export const getPackageById = (id: string) => {
  return packages.find(pkg => pkg.id === id);
};