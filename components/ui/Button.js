import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator, View } from "react-native";
import { Colors } from "../../constants/colors";

export default function Button({ children, onPress, loading = false, disabled = false, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === "primary" ? Colors.primary50 : Colors.primary200} 
            style={styles.loader}
          />
        )}
        <Text style={[styles.text, styles[`${variant}Text`], (disabled || loading) && styles.disabledText]}>
          {loading ? "Loading..." : children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 200,
  },
  primary: {
    backgroundColor: Colors.accent500,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.accent500,
  },
  danger: {
    backgroundColor: Colors.primary50,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginRight: 8,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  primaryText: {
    color: Colors.primary200,
  },
  secondaryText: {
    color: Colors.accent500,
  },
  dangerText: {
    color: Colors.primary100,
  },
  disabledText: {
    opacity: 0.7,
  },
});