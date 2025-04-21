import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "@/constants/colors";
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === "bot";
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  return (
    <View style={[
      styles.container,
      isBot ? styles.botContainer : styles.userContainer
    ]}>
      <View style={[
        styles.bubble,
        isBot ? styles.botBubble : styles.userBubble
      ]}>
        <Text style={[
          styles.messageText,
          isBot ? styles.botText : styles.userText
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  botBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: colors.text,
  },
  userText: {
    color: "white",
  },
  timestamp: {
    fontSize: 11,
    color: colors.textLight,
    alignSelf: "flex-end",
  },
});