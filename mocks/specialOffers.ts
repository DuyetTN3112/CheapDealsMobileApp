import { SpecialOffer } from "@/types";

export const specialOffers: SpecialOffer[] = [
  {
    id: "summer-sale",
    code: "SUMMER25",
    title: "Summer Sale",
    description: "Get 25% off any package when you order through the app",
    discountPercentage: 25,
    validUntil: "2023-08-31",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "new-customer",
    code: "WELCOME20",
    title: "New Customer Offer",
    description: "20% discount for new customers on their first order",
    discountPercentage: 20,
    validUntil: "2023-12-31",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "loyalty-reward",
    code: "LOYAL15",
    title: "Loyalty Reward",
    description: "15% off for our loyal customers who have been with us for over a year",
    discountPercentage: 15,
    validUntil: "2023-10-15",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "upgrade-deal",
    code: "UPGRADE30",
    title: "Upgrade Special",
    description: "30% off when you upgrade to a higher tier package",
    discountPercentage: 30,
    validUntil: "2023-09-30",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];