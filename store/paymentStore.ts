import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CardDetails, EWalletDetails } from "@/types";

interface StoredCardDetails extends CardDetails {
  id: string;
  isDefault: boolean;
}

interface StoredEWalletDetails extends EWalletDetails {
  id: string;
  isDefault: boolean;
  type: "ewallet";
}

type StoredPaymentMethod = StoredCardDetails | StoredEWalletDetails;

// Mock data for payment methods
const mockPaymentMethods: StoredPaymentMethod[] = [
  {
    id: "card-1",
    cardNumber: "4242424242424242",
    cardholderName: "John Doe",
    expiryMonth: "12",
    expiryYear: "24",
    brand: "visa",
    isDefault: true
  },
  {
    id: "card-2",
    cardNumber: "5555555555554444",
    cardholderName: "John Doe",
    expiryMonth: "06",
    expiryYear: "25",
    brand: "mastercard",
    isDefault: false
  },
];

// Mock VisaCheck service
const visaCheckService = {
  validateCard: async (cardNumber: string, expiryDate: string, cvv: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation logic (in a real app, this would call an actual payment processor)
    const isValidCardNumber = /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(expiryDate);
    const isValidCvv = /^\d{3,4}$/.test(cvv);
    
    return isValidCardNumber && isValidExpiry && isValidCvv;
  }
};

interface PaymentState {
  paymentMethods: StoredPaymentMethod[];
  isLoading: boolean;
  error: string | null;
  
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (card: CardDetails) => Promise<boolean>;
  addEWallet: (wallet: EWalletDetails) => Promise<boolean>;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  validateCardWithVisaCheck: (cardNumber: string, expiryMonth: string, expiryYear: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      isLoading: false,
      error: null,
      
      fetchPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Use mock data
          set({ 
            paymentMethods: mockPaymentMethods,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch payment methods", 
            isLoading: false 
          });
        }
      },
      
      addPaymentMethod: async (card) => {
        set({ isLoading: true, error: null });
        try {
          // Validate card with VisaCheck
          const isValid = await get().validateCardWithVisaCheck(
            card.cardNumber,
            card.expiryMonth,
            card.expiryYear
          );
          
          if (!isValid) {
            set({ 
              error: "Card validation failed. Please check your card details.", 
              isLoading: false 
            });
            return false;
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newCard: StoredCardDetails = {
            id: `card-${Date.now()}`,
            ...card,
            isDefault: get().paymentMethods.length === 0 // Make default if it's the first card
          };
          
          set(state => ({ 
            paymentMethods: [...state.paymentMethods, newCard],
            isLoading: false 
          }));
          
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to add payment method", 
            isLoading: false 
          });
          return false;
        }
      },
      
      addEWallet: async (wallet) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newWallet: StoredEWalletDetails = {
            id: `ewallet-${Date.now()}`,
            ...wallet,
            isDefault: get().paymentMethods.length === 0, // Make default if it's the first wallet
            type: "ewallet"
          };
          
          set(state => ({ 
            paymentMethods: [...state.paymentMethods, newWallet],
            isLoading: false 
          }));
          
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to add wallet", 
            isLoading: false 
          });
          return false;
        }
      },
      
      removePaymentMethod: (id) => {
        set(state => {
          const updatedMethods = state.paymentMethods.filter(method => method.id !== id);
          
          // If we removed the default card and there are other cards, make the first one default
          if (state.paymentMethods.find(m => m.id === id)?.isDefault && updatedMethods.length > 0) {
            updatedMethods[0].isDefault = true;
          }
          
          return { paymentMethods: updatedMethods };
        });
      },
      
      setDefaultPaymentMethod: (id) => {
        set(state => ({
          paymentMethods: state.paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
          }))
        }));
      },
      
      validateCardWithVisaCheck: async (cardNumber, expiryMonth, expiryYear) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simple validation logic
          const isValidCardNumber = /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
          const isValidExpiryMonth = /^\d{2}$/.test(expiryMonth) && parseInt(expiryMonth) <= 12;
          const isValidExpiryYear = /^\d{2}$/.test(expiryYear);
          
          return isValidCardNumber && isValidExpiryMonth && isValidExpiryYear;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Card validation failed", 
          });
          return false;
        }
      }
    }),
    {
      name: "payment-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);