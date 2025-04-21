import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router/";
import { Star, MessageSquare, Send } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";
import { useFeedbackStore } from "@/store/feedbackStore";
import { usePackagesStore } from "@/store/packagesStore";
import { useUserDataStore } from "@/store/userDataStore";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FeedbackScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuthStore();
  const { feedback, submitFeedback, fetchFeedback, isLoading } = useFeedbackStore();
  const { allPackages, fetchPackages } = usePackagesStore();
  const { userPackages, fetchUserData } = useUserDataStore();
  
  const [serviceRating, setServiceRating] = useState(0);
  const [appRating, setAppRating] = useState(0);
  const [packageRating, setPackageRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [commentError, setCommentError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  
  useEffect(() => {
    fetchFeedback();
    fetchPackages();
    if (isAuthenticated && user) {
      fetchUserData(user.id);
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    if (userPackages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(userPackages[0].packageId);
    }
  }, [userPackages]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (serviceRating === 0 && appRating === 0 && (selectedPackageId ? packageRating === 0 : true)) {
      Alert.alert("Error", "Please provide at least one rating");
      isValid = false;
    }
    
    if (!comment.trim()) {
      setCommentError("Please provide some feedback");
      isValid = false;
    } else {
      setCommentError("");
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please log in to submit feedback",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log In", onPress: () => router.push("/auth/login") }
        ]
      );
      return;
    }
    
    try {
      await submitFeedback({
        userId: user?.id || "guest",
        packageId: selectedPackageId || undefined,
        serviceRating,
        appRating,
        packageRating: selectedPackageId ? packageRating : 0,
        comment,
      });
      
      setServiceRating(0);
      setAppRating(0);
      setPackageRating(0);
      setComment("");
      setShowThankYou(true);
      
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      Alert.alert("Error", "There was an error submitting your feedback. Please try again.");
    }
  };
  
  const getPackageName = (packageId: string) => {
    const pkg = allPackages.find(p => p.id === packageId);
    return pkg ? pkg.name : "Unknown Package";
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t("feedback.title")}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t("feedback.subtitle")}
          </Text>
        </View>
        
        {showThankYou ? (
          <View style={[styles.thankYouContainer, { backgroundColor: colors.card }]}>
            <Star size={48} color={colors.secondary} fill={colors.secondary} />
            <Text style={[styles.thankYouText, { color: colors.text }]}>
              {t("feedback.thankYou")}
            </Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.ratingTitle, { color: colors.text }]}>
                {t("feedback.serviceRating")}
              </Text>
              <StarRating
                rating={serviceRating}
                onRatingChange={setServiceRating}
                size={32}
              />
            </View>
            
            <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.ratingTitle, { color: colors.text }]}>
                {t("feedback.appRating")}
              </Text>
              <StarRating
                rating={appRating}
                onRatingChange={setAppRating}
                size={32}
              />
            </View>
            
            {userPackages.length > 0 && (
              <>
                <View style={[styles.packageSelector, { backgroundColor: colors.card }]}>
                  <Text style={[styles.packageSelectorTitle, { color: colors.text }]}>
                    Rate your package
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.packageList}
                  >
                    {userPackages.map((pkg) => (
                      <TouchableOpacity
                        key={pkg.id}
                        style={[
                          styles.packageItem,
                          selectedPackageId === pkg.packageId && { 
                            backgroundColor: `${colors.primary}20`,
                            borderColor: colors.primary 
                          }
                        ]}
                        onPress={() => setSelectedPackageId(pkg.packageId)}
                      >
                        <Text 
                          style={[
                            styles.packageItemText,
                            { color: selectedPackageId === pkg.packageId ? colors.primary : colors.text }
                          ]}
                        >
                          {getPackageName(pkg.packageId)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                {selectedPackageId && (
                  <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
                    <Text style={[styles.ratingTitle, { color: colors.text }]}>
                      {t("feedback.packageRating")}
                    </Text>
                    <StarRating
                      rating={packageRating}
                      onRatingChange={setPackageRating}
                      size={32}
                    />
                  </View>
                )}
              </>
            )}
            
            <View style={[styles.commentSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.commentTitle, { color: colors.text }]}>
                {t("feedback.comment")}
              </Text>
              <TextInput
                style={[
                  styles.commentInput,
                  { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: commentError ? colors.error : colors.border 
                  }
                ]}
                placeholder="Tell us what you think..."
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={comment}
                onChangeText={(text) => {
                  setComment(text);
                  if (text.trim()) setCommentError("");
                }}
              />
              {commentError ? (
                <Text style={[styles.errorText, { color: colors.error }]}>{commentError}</Text>
              ) : null}
            </View>
            
            <Button
              title={t("feedback.submitFeedback")}
              onPress={handleSubmit}
              loading={isLoading}
              icon={<Send size={18} color="white" />}
              fullWidth
              style={styles.submitButton}
            />
          </View>
        )}
        
        {isAuthenticated && feedback.length > 0 && (
          <View style={styles.previousFeedback}>
            <Text style={[styles.previousFeedbackTitle, { color: colors.text }]}>
              Your Previous Feedback
            </Text>
            
            {feedback
              .filter(f => f.userId === user?.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
                <View key={item.id} style={[styles.feedbackItem, { backgroundColor: colors.card }]}>
                  <View style={styles.feedbackHeader}>
                    <View style={styles.feedbackRatings}>
                      <View style={styles.ratingItem}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                          Service
                        </Text>
                        <StarRating rating={item.serviceRating} size={16} readonly />
                      </View>
                      
                      <View style={styles.ratingItem}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                          App
                        </Text>
                        <StarRating rating={item.appRating} size={16} readonly />
                      </View>
                      
                      {(item.packageRating ?? 0) > 0 && (
                        <View style={styles.ratingItem}>
                          <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                            Package
                          </Text>
                          <StarRating rating={item.packageRating ?? 0} size={16} readonly />
                        </View>
                      )}
                    </View>
                    
                    <Text style={[styles.feedbackDate, { color: colors.textLight }]}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.feedbackComment}>
                    <MessageSquare size={16} color={colors.textSecondary} />
                    <Text style={[styles.commentText, { color: colors.text }]}>
                      {item.comment}
                    </Text>
                  </View>
                  
                  {item.packageId && (
                    <Text style={[styles.packageName, { color: colors.textSecondary }]}>
                      Package: {getPackageName(item.packageId)}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 32,
  },
  ratingSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  packageSelector: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  packageSelectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  packageList: {
    paddingVertical: 8,
  },
  packageItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  packageItemText: {
    fontWeight: "500",
  },
  commentSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  thankYouContainer: {
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  previousFeedback: {
    marginBottom: 16,
  },
  previousFeedbackTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  feedbackItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  feedbackRatings: {
    flex: 1,
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 12,
    marginRight: 8,
    width: 60,
  },
  feedbackDate: {
    fontSize: 12,
  },
  feedbackComment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  packageName: {
    fontSize: 12,
    marginTop: 8,
  },
});