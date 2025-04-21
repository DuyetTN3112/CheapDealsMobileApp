import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Bill, Enquiry, Order, SpecialOffer, UsageData, UserPackage } from "@/types";
import { mockEnquiries, mockOrders, mockUsageData, mockUserPackages } from "@/mocks/userData";
import { mockBills } from "@/mocks/bills";
import { specialOffers } from "@/mocks/specialOffers";

interface UserDataState {
  userPackages: UserPackage[];
  bills: Bill[];
  orders: Order[];
  enquiries: Enquiry[];
  usageData: UsageData | null;
  specialOffers: SpecialOffer[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserData: (userId: string) => Promise<void>;
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "date" | "status">) => Promise<void>;
  payBill: (billId: string) => Promise<void>;
  placeOrder: (packageId: string, discountCode?: string) => Promise<void>;
  getBillDetails: (billId: string) => Bill | undefined;
  cancelPackage: (packageId: string) => Promise<void>;
  upgradePackage: (currentPackageId: string, newPackageId: string) => Promise<void>;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      userPackages: [],
      bills: [],
      orders: [],
      enquiries: [],
      usageData: null,
      specialOffers: [],
      isLoading: false,
      error: null,
      
      fetchUserData: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          // Luôn đảm bảo có ít nhất một gói active
          // Clone mockUserPackages và đảm bảo gói đầu tiên luôn là active
          const mockPackagesWithActive = [...mockUserPackages];
          if (mockPackagesWithActive.length > 0) {
            mockPackagesWithActive[0] = {
              ...mockPackagesWithActive[0],
              status: "active"
            };
          }
          
          // Check if userPackages already has data and contains at least one active package
          const currentPackages = get().userPackages;
          const hasActivePackage = currentPackages.some(pkg => pkg.status === "active");
          
          console.log("Has active package:", hasActivePackage);
          
          // Use mock data if no existing packages or no active packages
          set({ 
            bills: mockBills,
            orders: mockOrders,
            enquiries: mockEnquiries,
            usageData: mockUsageData,
            specialOffers: specialOffers,
            // Use mock data if there are no packages or no active packages
            userPackages: currentPackages.length > 0 && hasActivePackage 
              ? currentPackages 
              : mockPackagesWithActive,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch user data", 
            isLoading: false 
          });
        }
      },
      
      addEnquiry: async (enquiryData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const newEnquiry: Enquiry = {
            id: `enquiry-${Date.now()}`,
            date: new Date().toISOString(),
            status: "open",
            ...enquiryData,
          };
          
          set(state => ({ 
            enquiries: [...state.enquiries, newEnquiry],
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to submit enquiry", 
            isLoading: false 
          });
        }
      },
      
      payBill: async (billId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set(state => ({
            bills: state.bills.map(bill => 
              bill.id === billId 
                ? { ...bill, isPaid: true, paidDate: new Date().toISOString() } 
                : bill
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Payment failed", 
            isLoading: false 
          });
        }
      },
      
      placeOrder: async (packageId, discountCode) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1200));
          
          // In a real app, this would be fetched from the API
          // Here, we'll import the real package details from the packages store
          const packagesStore = await import('./packagesStore');
          const { getState } = packagesStore.usePackagesStore;
          const allPackages = getState().allPackages;
          const packageDetails = allPackages.find(pkg => pkg.id === packageId);
          
          if (!packageDetails) {
            throw new Error("Package not found");
          }
          
          // REMOVE the check for existing active packages of the same type
          // Log user packages for debugging
          console.log("All user packages:", get().userPackages);
          console.log("Selected package to add:", packageDetails);
          
          // Calculate discount (15% app discount + any promo code)
          let discountPercentage = 15; // Default app discount
          
          if (discountCode) {
            const offer = specialOffers.find(o => o.code === discountCode);
            if (offer) {
              discountPercentage += offer.discountPercentage;
            }
          }
          
          const discountAmount = (packageDetails.price * discountPercentage) / 100;
          const finalAmount = packageDetails.price - discountAmount;
          
          const newOrder: Order = {
            id: `order-${Date.now()}`,
            userId: "user-123", // In a real app, this would be the actual user ID
            packageId,
            packageName: packageDetails.name,
            date: new Date().toISOString(),
            status: "processing",
            totalAmount: packageDetails.price,
            discountAmount,
            finalAmount,
          };
          
          // Create a new user package
          const newUserPackage: UserPackage = {
            id: `pkg-${Date.now()}`,
            packageId,
            name: packageDetails.name,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            status: "active",
            price: finalAmount,
            autoRenew: true,
            features: packageDetails.features || [
              { name: "Data", value: "10GB" },
              { name: "Minutes", value: "Unlimited" },
              { name: "Texts", value: "Unlimited" }
            ]
          };
          
          // Create a new state with the order added and packages updated
          // 1. First mark any existing packages of the same type as cancelled
          // 2. Then add the new package
          set(state => {
            const newPackageType = packageDetails.type;
            
            // Process existing packages - Set all similar packages to cancelled regardless of status
            const processedPackages = state.userPackages.map(pkg => {
              // Find the details of this package
              const pkgDetails = allPackages.find(p => p.id === pkg.packageId);
              
              // Nếu gói này cùng loại với gói mới, đánh dấu là cancelled bất kể status hiện tại là gì
              if (pkgDetails && pkgDetails.type === newPackageType) {
                return { ...pkg, status: "cancelled" as const };
              }
              
              // Otherwise keep it as is
              return pkg;
            });
            
            console.log("Existing packages after processing:", processedPackages);
            console.log("New package being added:", newUserPackage);
            
            // Add the new package and return the state
            return { 
              orders: [...state.orders, newOrder],
              userPackages: [...processedPackages, newUserPackage],
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to place order", 
            isLoading: false 
          });
          throw error;
        }
      },

      getBillDetails: (billId) => {
        return get().bills.find(bill => bill.id === billId);
      },
      
      cancelPackage: async (packageId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          // Get the package to be cancelled
          const packageToCancel = get().userPackages.find(pkg => pkg.id === packageId);
          if (!packageToCancel) {
            throw new Error("Package not found");
          }
          
          console.log("Cancelling package:", packageId);
          console.log("Before cancel:", get().userPackages);
          
          // Update package status instead of removing it completely
          set(state => {
            const updatedPackages = state.userPackages.map(pkg => 
              pkg.id === packageId 
                ? { ...pkg, status: "cancelled" as const }
                : pkg
            );
            
            console.log("After cancel:", updatedPackages);
            
            return {
              userPackages: updatedPackages,
              isLoading: false
            };
          });
          
          return true; // Return success
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to cancel package", 
            isLoading: false 
          });
          throw error; // Re-throw the error to be caught by the caller
        }
      },
      
      upgradePackage: async (currentPackageId, newPackageId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Get the current package
          const currentPackage = get().userPackages.find(pkg => pkg.id === currentPackageId);
          
          if (!currentPackage) {
            throw new Error("Current package not found");
          }
          
          // Create a new upgraded package
          const upgradedPackage: UserPackage = {
            id: `pkg-${Date.now()}`,
            packageId: newPackageId,
            name: "Premium Mobile", // This would come from the packages store in a real app
            startDate: new Date().toISOString(),
            endDate: currentPackage.endDate, // Keep the same end date
            status: "active",
            price: 34.99, // This would come from the packages store in a real app
            autoRenew: currentPackage.autoRenew,
            features: [
              { name: "Data", value: "Unlimited" },
              { name: "Minutes", value: "Unlimited" },
              { name: "Texts", value: "Unlimited" },
              { name: "International", value: "100 minutes" }
            ]
          };
          
          set((state) => ({
            ...state,
            userPackages: [
              ...state.userPackages.map(pkg => 
                pkg.id === currentPackageId 
                  ? { ...pkg, status: "upgraded" as const } 
                  : pkg
              ),
              upgradedPackage
            ],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to upgrade package", 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: "user-data-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);