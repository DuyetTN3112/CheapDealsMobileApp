import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text" | 'solid' | "destructive";
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  leftIcon,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};

    // Variant styles
    switch (variant) {
      case "primary":
        buttonStyle = styles.primaryButton;
        break;
      case "secondary":
        buttonStyle = styles.secondaryButton;
        break;
      case "outline":
        buttonStyle = styles.outlineButton;
        break;
      case "text":
        buttonStyle = styles.textButton;
        break;
      case "destructive":
        buttonStyle = styles.destructiveButton;
        break;
    }

    // Size styles
    switch (size) {
      case "small":
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case "medium":
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case "large":
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }

    // Full width
    if (fullWidth) {
      buttonStyle = { ...buttonStyle, ...styles.fullWidth };
    }

    // Disabled state
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleVar: TextStyle = {};

    // Variant text styles
    switch (variant) {
      case "primary":
        textStyleVar = styles.primaryText;
        break;
      case "secondary":
        textStyleVar = styles.secondaryText;
        break;
      case "outline":
        textStyleVar = styles.outlineText;
        break;
      case "text":
        textStyleVar = styles.textButtonText;
        break;
      case "destructive":
        textStyleVar = styles.destructiveText;
        break;
    }

    // Size text styles
    switch (size) {
      case "small":
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case "medium":
        textStyleVar = { ...textStyleVar, ...styles.mediumText };
        break;
      case "large":
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
    }

    // Disabled text
    if (disabled) {
      textStyleVar = { ...textStyleVar, ...styles.disabledText };
    }

    return textStyleVar;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "text" ? colors.primary : "white"}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  destructiveButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Size styles
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  // Text styles
  primaryText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryText: {
    color: "white",
    fontWeight: "600",
  },
  outlineText: {
    color: colors.primary,
    fontWeight: "600",
  },
  textButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  destructiveText: {
    color: "white",
    fontWeight: "600",
  },

  // Text size styles
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },

  // Disabled styles
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },

  // Width styles
  fullWidth: {
    width: "100%",
  },
});