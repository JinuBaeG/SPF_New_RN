import React, { RefObject, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { dateTime } from "../shared/sharedFunction";
import { gql, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

interface ICommentCompProps {
  id: number;
  board: {
    id: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  boardReCommentCount: number;
  payload: string;
  isMine: boolean;
  createdAt: string;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const DELETE_BOARD_COMMENT_MUTATION = gql`
  mutation deleteBoardComment($id: Int!) {
    deleteBoardComment(id: $id) {
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
  board,
  boardReCommentCount,
  payload,
  isMine,
  createdAt,
}: ICommentCompProps) {
  const boardReCommentsRef: React.MutableRefObject<null> = useRef(null);
  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 댓글 삭제
  const deleteToggle = (cache: any, result: any) => {
    const {
      data: {
        deleteBoardComment: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const boardCommentId = `BoardComment:${id}`;
      const boardId = `Board:${board.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: boardCommentId });
      cache.modify({
        id: boardId,
        fields: {
          boardCommentCount(prev: number) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteBoardCommentMutation] = useMutation(
    DELETE_BOARD_COMMENT_MUTATION,
    {
      update: deleteToggle,
    }
  );

  const onDelete = () => {
    deleteBoardCommentMutation({
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

  return (
    <CommentContainer>
      <Header>
        <TouchableOpacity onPress={() => goToProfile()}>
          <UserAvatar
            resizeMode="cover"
            source={
              user.avatar === null
                ? require(`../../assets/emptyAvatar.png`)
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
            navigation.navigate("BoardReComments", {
              id,
              editComment: false,
            });
          }}
        >
          <ReComment>답글쓰기</ReComment>
        </Actions>
        {isMine ? (
          <Actions
            onPress={() => {
              navigation.navigate("BoardReComments", {
                id,
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
        {boardReCommentCount > 0 ? (
          <Actions
            onPress={() => {
              navigation.navigate("BoardReComments", {
                id,
                editComment: false,
              });
            }}
          >
            <ReComment style={{ color: "#01aa73" }}>
              답글 {boardReCommentCount} 개
            </ReComment>
          </Actions>
        ) : null}
      </ReCommentWrap>
    </CommentContainer>
  );
}
