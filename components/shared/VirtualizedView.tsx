import React from "react";
import { FlatList, useColorScheme } from "react-native";

export default function VirtualizedView(props: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <FlatList
      style={{ backgroundColor: isDark ? "#000000" : "#FFFFFF" }}
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
