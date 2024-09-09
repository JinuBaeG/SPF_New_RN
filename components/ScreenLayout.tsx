import React from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import styled from "styled-components/native";

const ScreenLayoutContiner = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

export default function ScreenLayout({ loading, children }: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <ScreenLayoutContiner>
      {loading ? (
        <ActivityIndicator color={isDark ? "white" : "black"} />
      ) : (
        children
      )}
    </ScreenLayoutContiner>
  );
}
