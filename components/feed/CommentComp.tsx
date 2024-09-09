import React, { RefObject, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { dateTime } from "../shared/sharedFunction";
import { gql, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

interface ICommentCompProps {
  id: number;
  photo: {
    id: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  reCommentCount: number;
  payload: string;
  isMine: boolean;
  createdAt: string;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const CommentContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: flex-start;
  padding: 8px 0;
`;

const CommentText = styled.Text`
  margin-left: 50px;
  color: ${(props) => props.theme.textColor};
`;

const Header = styled.View`
  width: 100%;
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;

const UserInfo = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
`;

const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const Info = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const UserLocation = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
`;

const UpdateTime = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
`;

const Dotted = styled.View`
  width: 2px;
  height: 2px;
  background-color: ${(props) => props.theme.grayInactColor};
  margin: 0px 4px;
  border-radius: 1px;
`;

const ActionWrapper = styled.View`
  margin: 8px 0 0 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Actions = styled.TouchableOpacity`
  margin-right: 8px;
`;

const ReComment = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentEdit = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentDelete = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const ReCommentWrap = styled.View`
  margin: 16px 0 0 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export default function CommentComp({
  id,
  user,
  photo,
  reCommentCount,
  payload,
  isMine,
  createdAt,
}: ICommentCompProps) {
  const noticeReCommentsRef: React.MutableRefObject<null> = useRef(null);
  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 댓글 삭제
  const deleteToggle = (cache: any, result: any) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;

    if (ok) {
      const CommentId = `Comment:${id}`;
      const photoId = `Photo:${photo.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: CommentId });
      cache.modify({
        id: photoId,
        fields: {
          commentCount(prev: number) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: deleteToggle,
  });

  const onDelete = () => {
    deleteCommentMutation({
      variables: {
        id,
      },
    });
  };

  const navigation = useNavigation<CommentCompNavigationProps>();

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id: user.id,
    });
  };

  const getDate = new Date(parseInt(createdAt));
  const isDark = useColorScheme() === "dark";

  return (
    <CommentContainer>
      <Header>
        <TouchableOpacity onPress={() => goToProfile()}>
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
        </TouchableOpacity>
        <UserInfo>
          <TouchableOpacity onPress={() => goToProfile()}>
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <Info>
            <UpdateTime>{dateTime(getDate)}</UpdateTime>
          </Info>
        </UserInfo>
      </Header>
      <CommentText>{payload}</CommentText>
      <ActionWrapper>
        <Actions
          onPress={() => {
            navigation.navigate("ReComments", {
              id,
              photo,
              editComment: false,
            });
          }}
        >
          <ReComment>답글쓰기</ReComment>
        </Actions>
        {isMine ? (
          <Actions
            onPress={() => {
              navigation.navigate("ReComments", {
                id,
                photo,
                editComment: true,
              });
            }}
          >
            <CommentEdit>수정하기</CommentEdit>
          </Actions>
        ) : null}
        {isMine ? (
          <Actions
            onPress={() => {
              onDelete();
            }}
          >
            <CommentDelete>삭제하기</CommentDelete>
          </Actions>
        ) : null}
      </ActionWrapper>
      <ReCommentWrap>
        {reCommentCount > 0 ? (
          <Actions
            onPress={() => {
              navigation.navigate("ReComments", {
                id,
                editComment: false,
              });
            }}
          >
            <ReComment style={{ color: "#01aa73" }}>
              답글 {reCommentCount} 개
            </ReComment>
          </Actions>
        ) : null}
      </ReCommentWrap>
    </CommentContainer>
  );
}
