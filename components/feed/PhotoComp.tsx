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
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import Swiper from "react-native-swiper";
import { isLoggedInVar } from "../../apollo";
import ContentsMenu from "../ContentsMenu";
import { dateTime } from "../shared/sharedFunction";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Feed"
>;

interface IPhotoCompProps {
  id: number;
  user: {
    id: number;
    avatar: string;
    username: string;
  };
  caption: string;
  sportsEvent: string;
  feedUpload: {
    map: any;
    id: number;
    fileUrl: string;
    length: number;
  };
  feedCategory: string;
  isLiked: boolean;
  isMine: boolean;
  likes: number;
  commentCount: number;
  comments: {
    id: number;
    user: {
      id: number;
      username: string;
      avatar: string;
    };
    payload: string;
    isMine: boolean;
    createdAt: string;
  };
  refresh: any;
  createdAt: string;
}

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

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 4px;
`;
const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;

const NameWrap = styled.View``;
const NameWrapBottom = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const SportsName = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const CreateDate = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const ActionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.grayInactColor};
  margin-left: 4px;
`;
const Caption = styled.View`
  flex-direction: row;
  padding: 4px;
`;
const CaptionText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.textColor};
`;
const Category = styled.View`
  flex-direction: row;
  padding: 4px;
`;
const CategoryText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.greenActColor};
`;
const Likes = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
`;

const CommentNumber = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
`;

const ExtraContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`;

const NumberContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 8px;
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayLineColor};
`;

export default function PhotoComp({
  id,
  user,
  caption,
  feedUpload,
  feedCategory,
  isLiked,
  likes,
  isMine,
  commentCount,
  comments,
  sportsEvent,
  refresh,
  createdAt,
}: IPhotoCompProps) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigation = useNavigation<PhotoCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 3);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok, error },
      },
    } = result;

    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
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
    TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    if (isLoggedIn) {
      navigation.navigate("Profile", {
        username: user.username,
        id: user.id,
      });
    } else {
      navigation.navigate("LoggedOutNav");
    }
  };
  const isDark = useColorScheme() === "dark";

  const getDate = new Date(parseInt(createdAt));

  return (
    <Container>
      <Header>
        <UserInfo onPress={goToProfile}>
          <UserAvatar
            resizeMode="cover"
            source={
              user.avatar === null
                ? isDark
                  ? require(`../../assets/emptyAvatar_white.png`)
                  : require(`../../assets/emptyAvatar.png`)
                : { uri: user.avatar }
            }
          />
          <NameWrap>
            <Username>{user.username}</Username>
            <NameWrapBottom>
              <SportsName>{sportsEvent}</SportsName>
              <Ionicons
                name="ellipse"
                size={4}
                color={isDark ? "white" : "black"}
                style={{ marginHorizontal: 4 }}
              />
              <CreateDate>{dateTime(getDate)}</CreateDate>
            </NameWrapBottom>
          </NameWrap>
        </UserInfo>
        <ContentsMenu
          id={id}
          userId={user.id}
          isMine={isMine}
          screen="Feed"
          refresh={refresh}
        />
      </Header>
      <TouchableOpacity
        style={{ position: "relative", zIndex: 1 }}
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate("PhotoDetail", { id: id });
          } else {
            navigation.navigate("LoggedOutNav");
          }
        }}
      >
        {feedCategory !== null ? (
          <Category>
            <CategoryText>{feedCategory}</CategoryText>
          </Category>
        ) : null}
        <Caption>
          <CaptionText>
            {caption !== null
              ? caption.length > 150
                ? caption.substring(0, 149) + "..."
                : caption
              : null}
          </CaptionText>
        </Caption>
      </TouchableOpacity>
      {feedUpload.length > 0 ? (
        <>
          <Swiper
            loop
            horizontal
            showsButtons={false}
            showsPagination={true}
            autoplay={false}
            autoplayTimeout={3.5}
            containerStyle={{
              paddingBottom: 20,
              marginBottom: 30,
              width: "100%",
              height: height / 3,
              zIndex: 1,
            }}
            paginationStyle={{
              position: "absolute",
              bottom: 0,
            }}
            style={{ position: "relative", zIndex: 1 }}
          >
            {feedUpload.map((file: any, index: any) => (
              <File
                resizeMode="cover"
                style={{
                  width,
                  height: imageHeight,
                  zIndex: 1,
                }}
                source={{ uri: file.imagePath }}
                key={index}
              />
            ))}
          </Swiper>
        </>
      ) : null}
      <TouchableOpacity
        style={{ position: "relative", zIndex: 1 }}
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate("PhotoDetail", { id: id });
          } else {
            navigation.navigate("LoggedOutNav");
          }
        }}
      >
        <NumberContainer>
          <Likes>좋아요 {likes}</Likes>
          <CommentNumber>댓글 {commentCount}</CommentNumber>
        </NumberContainer>
      </TouchableOpacity>
      <BoardLine />
      <ExtraContainer>
        <Actions>
          <Action
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("PhotoDetail", { id: id });
              } else {
                navigation.navigate("LoggedOutNav");
              }
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              color={isDark ? "#ffffff" : "rgba(136, 136, 136, 0.5)"}
              style={{ marginBottom: 2 }}
              size={16}
            />
            <ActionText>댓글 달기</ActionText>
          </Action>
          <Action
            onPress={() => {
              if (isLoggedIn) {
                toggleLikeMutation();
              } else {
                navigation.navigate("LoggedOutNav");
              }
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={
                isLiked
                  ? "tomato"
                  : isDark
                  ? "#ffffff"
                  : "rgba(136, 136, 136, 0.4)"
              }
              size={18}
            />
            <ActionText>좋아요</ActionText>
          </Action>
        </Actions>
      </ExtraContainer>
    </Container>
  );
}
