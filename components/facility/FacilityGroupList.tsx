import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { TouchableOpacity } from "react-native";
import { colors } from "../../color";

type GroupCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "GroupDetail"
>;

const GroupListContainer = styled.TouchableOpacity`
  padding: 16px;
  flex-direction: row;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const GroupListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 8px;
  border: 1px solid black;
`;

const GroupListInfoWrap = styled.View`
  padding: 4px 16px;
  justify-content: flex-start;
  align-items: flex-start;
`;
const GroupListTitleWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const GroupListTitle = styled.Text`
  color: ${(props) => props.theme.blackColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const GroupListEvent = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupListPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
  margin: 4px;
`;

const GroupListMember = styled.View`
  flex-direction: row;
`;

const GroupListUserCount = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupListDisc = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
  margin: 8px 0;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

export default function FacilityGroupList({
  navigation,
  route,
  id,
  name,
  sportsEvent,
  discription,
  userCount,
  maxMember,
  groupTag,
  sidoName,
  gusiName,
  dongEubMyunName,
  riName,
  roadName,
  buildingNumber,
  address,
  addrRoad,
  activeArea,
  areaLatitude,
  areaLongitude,
  zipcode,
  groupImage,
  selected,
  setSelected,
}: any) {
  const pressSelected = (id: number, name: string) => {
    const check = selected.find((e: any) => e.id === id);
    if (check === undefined) {
      setSelected([
        { id: id, name: name, addrRoad: addrRoad, sportsEvent: sportsEvent },
        ...selected,
      ]);
    } else {
      const inSelected = selected.filter((item: any) => item.id !== id);
      setSelected(inSelected);
    }
  };

  const TutorGroupHeaderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(route.params.previousScreen, {
            selected,
            merge: true,
          });
        }}
      >
        <HeaderRightText>완료</HeaderRightText>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: "그룹 리스트",
      headerRight: TutorGroupHeaderRight,
      param: {
        selected,
        merge: true,
      },
    });
  }, [selected]);

  return (
    <GroupListContainer
      onPress={() => {
        pressSelected(id, name);
      }}
      style={{
        backgroundColor:
          selected.find((e: any) => e.id === id) !== undefined
            ? "#01aa73"
            : "#ffffff",
      }}
    >
      <GroupListImage source={{ uri: groupImage }} />
      <GroupListInfoWrap>
        <GroupListTitleWrap>
          <GroupListTitle
            style={{
              color:
                selected.find((e: any) => e.id === id) !== undefined
                  ? "#ffffff"
                  : undefined,
            }}
          >
            {name}
          </GroupListTitle>
          <GroupListEvent
            style={{
              color:
                selected.find((e: any) => e.id === id) !== undefined
                  ? "#ffffff"
                  : undefined,
            }}
          >
            {sportsEvent}
          </GroupListEvent>
          <GroupListPoint />
          <GroupListMember>
            <Ionicons name="people-outline" size={12} />
            <GroupListUserCount
              style={{
                color:
                  selected.find((e: any) => e.id === id) !== undefined
                    ? "#ffffff"
                    : undefined,
              }}
            >
              {userCount} / {maxMember}
            </GroupListUserCount>
          </GroupListMember>
        </GroupListTitleWrap>
        <GroupListDisc
          style={{
            color:
              selected.find((e: any) => e.id === id) !== undefined
                ? "#ffffff"
                : undefined,
          }}
        >
          {discription}
        </GroupListDisc>
      </GroupListInfoWrap>
    </GroupListContainer>
  );
}
