import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MenuWrap = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
`;
const MenuTextWrap = styled.View``;

const MenuTitle = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

const MenuDisc = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
  margin-top: 4px;
`;

export default function ProfileMenu({ title, disc, navi, params }: any) {
  const navigation = useNavigation<any>();

  return (
    <MenuWrap onPress={() => navigation.navigate(navi, params)}>
      <MenuTextWrap>
        <MenuTitle>{title}</MenuTitle>
        {disc !== undefined ? <MenuDisc>{disc}</MenuDisc> : null}
      </MenuTextWrap>
      <Ionicons name="chevron-forward" size={20} />
    </MenuWrap>
  );
}
