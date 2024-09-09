import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { useColorScheme } from "react-native";

type FacilityCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "FacilityDetail"
>;

const FacilityListContainer = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

const FacilityListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 8px;
  border: 1px solid black;
`;

const FacilityListInfoWrap = styled.View`
  padding: 4px 16px;
  justify-content: flex-start;
  align-items: flex-start;
`;
const FacilityListTitleWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const FacilityListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const FacilityListEventWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FacilityListEvent = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
`;

const FacilityListPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
  margin: 4px;
`;

const FacilityListDisc = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
  margin: 4px 0;
`;

export default function FacilityList({
  id,
  name,
  facilitySports,
  activeArea,
  discription,
  facilityTag,
  facilityImage,
}: any) {
  const navigation = useNavigation<FacilityCompNavigationProps>();
  const isDark = useColorScheme() === "dark";

  return (
    <FacilityListContainer
      onPress={() => navigation.navigate("FacilityDetail", { id })}
    >
      <FacilityListImage source={{ uri: facilityImage[0].imagePath }} />
      <FacilityListInfoWrap>
        <FacilityListTitleWrap>
          <FacilityListTitle>{name}</FacilityListTitle>
          {facilitySports.map((item: any, index: number) => (
            <FacilityListEventWrap key={item.id}>
              <FacilityListEvent>{item.name}</FacilityListEvent>
              {facilitySports.length - 1 === index ? null : (
                <FacilityListPoint />
              )}
            </FacilityListEventWrap>
          ))}
        </FacilityListTitleWrap>
        <FacilityListDisc>{activeArea}</FacilityListDisc>
        <FacilityListDisc>{discription}</FacilityListDisc>
      </FacilityListInfoWrap>
    </FacilityListContainer>
  );
}
