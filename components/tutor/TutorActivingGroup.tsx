import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TrackingMode } from "react-native-nmap";

const TextWrap = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const TextInnerWrap = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const GroupList = styled.View`
  margin: 8px 0;
`;

const GroupTitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GroupTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 4px;
  margin-right: 8px;
`;

const GroupText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

export default function TutorActivingGroup({
  navigation,
  route,
  setValue,
  getValues,
}: any) {
  const [result, setResult] = useState<any>([]);

  useEffect(() => {
    setValue("group", route.params.selected);
    setResult(route.params.selected);
  }, [navigation, route]);

  return (
    <TextWrap>
      <TextInnerWrap>
        <TextLabel>활동 그룹</TextLabel>
        <AddButton
          onPress={() => {
            navigation.push("TutorGroup", {
              previousScreen: route.name,
            });
          }}
        >
          <UploadText>
            그룹 추가 <Ionicons name="add-circle" size={12} color={"#01aa73"} />
          </UploadText>
        </AddButton>
      </TextInnerWrap>
      {result !== undefined
        ? result.map((item: any) => (
            <GroupList>
              <GroupTitleWrap>
                <GroupTitle>{item.name}</GroupTitle>
                <GroupText>{item.sportsEvent}</GroupText>
              </GroupTitleWrap>
              <GroupText>{item.addrRoad}</GroupText>
            </GroupList>
          ))
        : null}
    </TextWrap>
  );
}
