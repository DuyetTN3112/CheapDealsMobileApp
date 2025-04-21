import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatMessage } from "@/types";
import { generateBotResponse } from "@/utils/chatbot";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: "welcome-msg",
          text: "Hello! I'm the CheapDeals virtual assistant. How can I help you today? You can ask me about our packages, billing, or technical support.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ],
      isTyping: false,
      
      sendMessage: (message) => {
        // Add user message
        set((state) => ({
          messages: [...state.messages, message],
          isTyping: true,
        }));
        
        // Simulate bot thinking and typing
        setTimeout(() => {
          const botResponse = generateBotResponse(message.text);
          
          set((state) => ({
            messages: [
              ...state.messages,
              {
                id: `bot-${Date.now()}`,
                text: botResponse,
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            ],
            isTyping: false,
          }));
        }, 1500);
      },
      
      clearChat: () => {
        set({
          messages: [
            {
              id: "welcome-msg",
              text: "Hello! I'm the CheapDeals virtual assistant. How can I help you today? You can ask me about our packages, billing, or technical support.",
              sender: "bot",
              timestamp: new Date().toISOString(),
            },
          ],
        });
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);