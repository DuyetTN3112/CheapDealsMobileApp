import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { MessageCircle, Phone, Mail, HelpCircle, X, Send } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";
import { EnquiryCard } from "@/components/EnquiryCard";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useChatStore } from "@/store/chatStore";
import { ChatMessage } from "@/components/ChatMessage";

export default function SupportScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { enquiries, addEnquiry, isLoading } = useUserDataStore();
  const { messages, sendMessage, isTyping } = useChatStore();
  
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  const chatBubbleAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate chat bubble when not showing chatbot
    if (!showChatbot) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(chatBubbleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(chatBubbleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      chatBubbleAnim.setValue(0);
    }
  }, [showChatbot]);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current && showChatbot) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, showChatbot]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!subject.trim()) {
      setSubjectError("Subject is required");
      isValid = false;
    } else {
      setSubjectError("");
    }
    
    if (!message.trim()) {
      setMessageError("Message is required");
      isValid = false;
    } else {
      setMessageError("");
    }
    
    return isValid;
  };
  
  const handleSubmitEnquiry = async () => {
    if (!validateForm()) return;
    
    await addEnquiry({
      userId: user?.id || "guest",
      subject,
      message,
    });
    
    setSubject("");
    setMessage("");
    setShowEnquiryForm(false);
  };
  
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    sendMessage({
      id: `msg-${Date.now()}`,
      text: chatInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    });
    
    setChatInput("");
  };
  
  const renderChatbot = () => {
    return (
      <View style={styles.chatbotContainer}>
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderContent}>
            <View style={styles.chatAvatarContainer}>
              <Text style={styles.chatAvatarText}>CD</Text>
            </View>
            <View>
              <Text style={styles.chatHeaderTitle}>CheapDeals Assistant</Text>
              <Text style={styles.chatHeaderSubtitle}>
                {isTyping ? "Typing..." : "Online"}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowChatbot(false)}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatMessages}
          contentContainerStyle={styles.chatMessagesContent}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <View style={[styles.typingIndicator, styles.botMessage]}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          )}
        </ScrollView>
        
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatTextInput}
            placeholder="Type your message..."
            value={chatInput}
            onChangeText={setChatInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendChatMessage}
            disabled={!chatInput.trim()}
          >
            <Send 
              size={20} 
              color={chatInput.trim() ? colors.primary : colors.textLight} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        {showChatbot ? (
          renderChatbot()
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Customer Support</Text>
              <Text style={styles.subtitle}>How can we help you today?</Text>
            </View>
            
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactOption} onPress={() => setShowEnquiryForm(true)}>
                <View style={[styles.contactIconContainer, { backgroundColor: colors.primary }]}>
                  <MessageCircle size={24} color="white" />
                </View>
                <Text style={styles.contactLabel}>Send Enquiry</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={[styles.contactIconContainer, { backgroundColor: colors.secondary }]}>
                  <Phone size={24} color="white" />
                </View>
                <Text style={styles.contactLabel}>Call Us</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={[styles.contactIconContainer, { backgroundColor: colors.info }]}>
                  <Mail size={24} color="white" />
                </View>
                <Text style={styles.contactLabel}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={[styles.contactIconContainer, { backgroundColor: colors.success }]}>
                  <HelpCircle size={24} color="white" />
                </View>
                <Text style={styles.contactLabel}>FAQ</Text>
              </TouchableOpacity>
            </View>
            
            {showEnquiryForm ? (
              <View style={styles.enquiryForm}>
                <Text style={styles.formTitle}>Submit an Enquiry</Text>
                
                <Input
                  label="Subject"
                  placeholder="Enter the subject of your enquiry"
                  value={subject}
                  onChangeText={setSubject}
                  error={subjectError}
                  containerStyle={styles.inputContainer}
                />
                
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[
                    styles.messageInput,
                    messageError ? styles.inputError : null,
                  ]}
                  placeholder="Describe your issue or question in detail..."
                  placeholderTextColor={colors.textLight}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                />
                {messageError ? (
                  <Text style={styles.errorText}>{messageError}</Text>
                ) : null}
                
                <View style={styles.formActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowEnquiryForm(false)}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                  <Button
                    title="Submit"
                    onPress={handleSubmitEnquiry}
                    loading={isLoading}
                    style={styles.submitButton}
                  />
                </View>
              </View>
            ) : (
              <>
                {isAuthenticated && enquiries.length > 0 && (
                  <View style={styles.enquiriesSection}>
                    <Text style={styles.sectionTitle}>Your Enquiries</Text>
                    {enquiries.map((enquiry) => (
                      <EnquiryCard key={enquiry.id} enquiry={enquiry} />
                    ))}
                  </View>
                )}
                
                <View style={styles.faqSection}>
                  <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                  
                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How do I upgrade my package?</Text>
                    <Text style={styles.faqAnswer}>
                      You can upgrade your package through the app by going to the Packages tab, selecting your desired package, and following the checkout process.
                    </Text>
                  </View>
                  
                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>When will I be billed?</Text>
                    <Text style={styles.faqAnswer}>
                      Billing occurs on the same day each month, based on your subscription start date. You can view your upcoming bills in the Account section.
                    </Text>
                  </View>
                  
                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How do I check my data usage?</Text>
                    <Text style={styles.faqAnswer}>
                      Your current data usage is displayed on the Home screen. You can see detailed usage statistics in the Account section.
                    </Text>
                  </View>
                  
                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Can I customize my package?</Text>
                    <Text style={styles.faqAnswer}>
                      Yes, we offer customizable packages. Contact our customer support team to discuss your specific requirements.
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        )}
        
        {!showChatbot && !showEnquiryForm && (
          <Animated.View 
            style={[
              styles.chatBubble,
              {
                transform: [
                  {
                    scale: chatBubbleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.chatBubbleButton}
              onPress={() => setShowChatbot(true)}
            >
              <MessageCircle size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  contactOption: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  enquiryForm: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "white",
    minHeight: 120,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  submitButton: {
    minWidth: 100,
  },
  enquiriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  chatBubble: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chatBubbleButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  chatbotContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "white",
  },
  chatHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatAvatarText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: colors.success,
  },
  closeButton: {
    padding: 8,
  },
  chatMessages: {
    flex: 1,
    backgroundColor: colors.card,
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  typingIndicator: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    maxWidth: "70%",
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  botMessage: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textLight,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  chatInputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "white",
    alignItems: "center",
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: colors.card,
  },
  sendButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
  },
});