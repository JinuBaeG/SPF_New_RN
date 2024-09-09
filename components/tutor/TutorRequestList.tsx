import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Image,
  Text,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { gql, useMutation } from "@apollo/client";
import Swiper from "react-native-swiper";
import ContentsMenu from "../ContentsMenu";

type CompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TutorRequestList"
>;

const Container = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;

const BoardWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  height: 44px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardPoint = styled.View`
  padding: 0 4px;
`;

const BoardTitle = styled.Text`
  width: 282px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const BoardDate = styled.Text`
  padding: 0 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

export default function TutorRequestList({
  id,
  title,
  discription,
  createdAt,
}: any) {
  const navigation = useNavigation<CompNavigationProps>();

  const isDark = useColorScheme() === "dark";

  const getDate = new Date(parseInt(createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  return (
    <Container>
      <BoardWrap
        onPress={() => {
          navigation.navigate("TutorRequestDetail", {
            id,
            title,
            discription,
            createdAt,
          });
        }}
      >
        <BoardPoint>
          <Ionicons name="caret-forward" size={16} color="#01aa73" />
        </BoardPoint>
        <BoardTitle numberOfLines={1} ellipsizeMode="tail">
          {title}
        </BoardTitle>
        <BoardDate>{year + "-" + month + "-" + date}</BoardDate>
      </BoardWrap>
      <BoardLine />
    </Container>
  );
}
