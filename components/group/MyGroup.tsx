import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../../apollo";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

type GroupCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "GroupDetail"
>;

const GroupListContainer = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
`;

const GroupListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 16px;
`;

const GroupListTitleWrap = styled.View`
  padding: 16px 0;
  flex-direction: row;
`;

const GroupListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
`;

const GroupDetailBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default function MyGroup({ id, name, groupImage }: any) {
  const navigation = useNavigation<GroupCompNavigationProps>();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDark = useColorScheme() === "dark";
  return (
    <GroupListContainer>
      <GroupDetailBtn
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate("GroupDetail", {
              id,
            });
          } else {
            navigation.navigate("LoggedOutNav");
          }
        }}
      >
        <GroupListImage
          resizeMode="contain"
          source={
            groupImage !== null
              ? { uri: groupImage.imagePath }
              : isDark
              ? require("../../assets/emptyGroup_white.png")
              : require("../../assets/emptyGroup.png")
          }
        />
        <GroupListTitleWrap>
          <GroupListTitle>{name}</GroupListTitle>
        </GroupListTitleWrap>
      </GroupDetailBtn>
    </GroupListContainer>
  );
}
