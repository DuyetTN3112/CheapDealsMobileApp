import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Feedback } from "@/types";
import { mockFeedback } from "@/mocks/feedback";

interface FeedbackState {
  feedback: Feedback[];
  isLoading: boolean;
  error: string | null;
  
  fetchFeedback: () => Promise<void>;
  submitFeedback: (feedback: Omit<Feedback, "id" | "date">) => Promise<void>;
  getUserFeedback: (userId: string) => Feedback[];
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedback: [],
      isLoading: false,
      error: null,
      
      fetchFeedback: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 600));
          
          // Use mock data
          set({ 
            feedback: mockFeedback,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch feedback", 
            isLoading: false 
          });
        }
      },
      
      submitFeedback: async (feedbackData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const newFeedback: Feedback = {
            id: `feedback-${Date.now()}`,
            date: new Date().toISOString(),
            ...feedbackData,
          };
          
          set(state => ({ 
            feedback: [...state.feedback, newFeedback],
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to submit feedback", 
            isLoading: false 
          });
        }
      },
      
      getUserFeedback: (userId) => {
        return get().feedback.filter(f => f.userId === userId);
      },
    }),
    {
      name: "feedback-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);