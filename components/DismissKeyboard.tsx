import React from "react";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

export default function DissmissKeyboard({ children }: any) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
