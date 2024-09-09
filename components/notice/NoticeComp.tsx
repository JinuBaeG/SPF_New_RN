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
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { gql, useMutation } from "@apollo/client";
import Swiper from "react-native-swiper";
import ContentsMenu from "../ContentsMenu";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

interface toggleLike_toggleLike {
  ok: boolean;
  error: string | undefined;
}

interface toggleLike {
  toggleLike: toggleLike_toggleLike;
}

interface toggleLikeVariables {
  id: number;
}

const NOTICE_TOGGLE_LIKE_MUTATION = gql`
  mutation noticeToggleLike($id: Int!) {
    noticeToggleLike(id: $id) {
      ok
      error
    }
  }
`;

const ListContainer = styled.View``;

const BoardWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  height: 44px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardTitle = styled.Text<{ deviceWidth: number }>`
  width: ${(props) => props.deviceWidth}px;
  padding: 0 4px;
  font-size: 16px;
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

export default function NoticeComp({
  id,
  user,
  title,
  discription,
  isLiked,
  likes,
  hits,
  noticeCommentCount,
  noticeComments,
  createdAt,
  sortation,
  isMine,
  refresh,
}: any) {
  const navigation = useNavigation<PhotoCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 3);
  const deviceWidth = Dimensions.get("window").width - 90;

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        noticeToggleLike: { ok },
      },
    } = result;
    if (ok) {
      const noticeId = `Notice:${id}`;
      cache.modify({
        id: noticeId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation<toggleLike, toggleLikeVariables>(
    NOTICE_TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id: user.id,
    });
  };
  const isDark = useColorScheme() === "dark";

  const getDate = new Date(parseInt(createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  return (
    <ListContainer>
      <BoardWrap
        onPress={() => {
          navigation.navigate("NoticeDetail", {
            id,
            user,
            title,
            discription,
            isLiked,
            likes,
            hits,
            noticeCommentCount,
            noticeComments,
            createdAt,
            sortation,
            isMine,
            refresh,
          });
        }}
      >
        <BoardTitle
          numberOfLines={1}
          ellipsizeMode="tail"
          deviceWidth={deviceWidth}
        >
          {title}
        </BoardTitle>
        <BoardDate>{year + "-" + month + "-" + date}</BoardDate>
      </BoardWrap>
      <BoardLine />
    </ListContainer>
  );
}
