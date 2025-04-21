import { create } from "zustand";
import { Package, CartItem } from "@/types";
import { packages, getPackageById, getPackagesByType } from "@/mocks/packages";

interface PackagesState {
  allPackages: Package[];
  filteredPackages: Package[];
  selectedPackage: Package | null;
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
  addToCart: (packageId: string, removeItem?: boolean) => void;
  
  fetchPackages: () => Promise<void>;
  filterPackages: (type?: Package["type"], searchTerm?: string) => void;
  selectPackage: (id: string) => void;
  clearSelectedPackage: () => void;
}

export const usePackagesStore = create<PackagesState>((set, get) => ({
  allPackages: [],
  filteredPackages: [],
  selectedPackage: null,
  isLoading: false,
  error: null,
  cart: [],
  
  fetchPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use mock data
      set({ 
        allPackages: packages, 
        filteredPackages: packages,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch packages", 
        isLoading: false 
      });
    }
  },
  
  filterPackages: (type, searchTerm = "") => {
    const { allPackages } = get();
    
    let filtered = [...allPackages];
    
    if (type) {
      filtered = filtered.filter(pkg => pkg.type === type);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(term) || 
        pkg.description.toLowerCase().includes(term)
      );
    }
    
    set({ filteredPackages: filtered });
  },
  
  selectPackage: (id) => {
    const pkg = getPackageById(id);
    set({ selectedPackage: pkg || null });
  },
  
  clearSelectedPackage: () => {
    set({ selectedPackage: null });
  },
  
  addToCart: (packageId: string, removeItem: boolean = false) => {
    const { cart, allPackages } = get();
    const existingItem = cart.find(item => item.packageId === packageId);
    const packageToAdd = allPackages.find(pkg => pkg.id === packageId);

    if (!packageToAdd) return;

    if (removeItem) {
      // Remove item from cart completely
      set({
        cart: cart.filter(item => item.packageId !== packageId)
      });
      return;
    }

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.packageId === packageId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        cart: [...cart, { packageId, quantity: 1, package: packageToAdd }]
      });
    }
  },
}));