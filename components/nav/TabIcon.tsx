import React from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabIcon({ iconName, color, focused }: any) {
  return (
    <Text>
      <Ionicons
        name={focused ? iconName : `${iconName}-outline`}
        size={focused ? 24 : 20}
        color={color}
      />
    </Text>
  );
}
