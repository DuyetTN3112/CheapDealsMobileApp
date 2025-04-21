import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
  readonly = false,
}) => {
  const { colors } = useTheme();
  
  const handlePress = (selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };
  
  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(starValue)}
            disabled={readonly}
            style={styles.starContainer}
          >
            <Star
              size={size}
              color={isFilled ? colors.primary : colors.textSecondary}
              fill={isFilled ? colors.primary : "none"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starContainer: {
    padding: 2,
  },
});