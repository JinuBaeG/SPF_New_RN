import { Alert, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useIsFocused, useRoute } from "@react-navigation/native";

const HeaderNavContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${(props) => props.theme.baseMargin};
`;

const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

export default function HeaderFilter({ navigation }: any) {
  const isFocused = useIsFocused();
  const isDark = useColorScheme() === "dark";
  const route = useRoute();

  let [filterSports, setFilterSports] = useState<any>("");

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("filterSports");
      setFilterSports(value);
    })();
  }, [isFocused]);

  return (
    <HeaderNavContainer>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "베타 기간에는 모든 지역으로만 가능합니다.",
            "빠른 시일내에 사용할 수 있도록 하겠습니다."
          )
        }
      >
        <HeaderText>모든 지역</HeaderText>
      </TouchableOpacity>
      {route.name !== "TabHome" ? (
        <>
          <Ionicons
            name="chevron-forward"
            color={isDark ? "white" : "black"}
            size={20}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SportsFilter", { filterSports })
            }
          >
            {filterSports !== undefined && filterSports !== null ? (
              <HeaderText>{filterSports}</HeaderText>
            ) : (
              <HeaderText>모든 종목</HeaderText>
            )}
          </TouchableOpacity>
        </>
      ) : null}
    </HeaderNavContainer>
  );
}
