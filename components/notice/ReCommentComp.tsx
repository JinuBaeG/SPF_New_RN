import React, { RefObject, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import { TouchableOpacity, useColorScheme } from "react-native";
import { dateTime } from "../shared/sharedFunction";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import EditReComment from "../noticeComments/EditReComment";

interface ICommentCompProps {
  id: number;
  noticeComment: {
    id: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  payload: string;
  isMine: boolean;
  createdAt: string;
  refresh: Function;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const DELETE_NOTICE_RECOMMENT_MUTATION = gql`
  mutation deleteNoticeReComment($id: Int!) {
    deleteNoticeReComment(id: $id) {
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
  margin-left: 48px;
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
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;

const UpdateTime = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;

const Dotted = styled.View`
  width: 2px;
  height: 2px;
  background-color: ${(props) => props.theme.grayColor};
  margin: 0px 4px;
  border-radius: 1px;
`;

const ActionWrapper = styled.View`
  margin: 8px 0 0 48px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Actions = styled.TouchableOpacity`
  margin-right: 8px;
`;

const Likes = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
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

export default function ReCommentComp({
  id,
  user,
  noticeComment,
  payload,
  isMine,
  createdAt,
  refresh,
}: ICommentCompProps) {
  // 답글 삭제
  const deleteToggle = (cache: any, result: any) => {
    const {
      data: {
        deleteNoticeReComment: { ok },
      },
    } = result;

    if (ok) {
      const noticeReCommentId = `NoticeReComment:${id}`;
      const noticeCommentId = `NoticeComment:${noticeComment.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: noticeReCommentId });
      cache.modify({
        id: noticeCommentId,
        fields: {
          noticeReCommentCount(prev: number) {
            return prev - 1;
          },
        },
      });
      refresh();
    }
  };

  const [deleteNoticeReCommentMutation] = useMutation(
    DELETE_NOTICE_RECOMMENT_MUTATION,
    {
      update: deleteToggle,
    }
  );

  const onDelete = () => {
    deleteNoticeReCommentMutation({
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

  const [commentEdit, setCommentEdit] = useState(false);
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
          <TouchableOpacity
            onPress={() => goToProfile()}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <Info>
            <UserLocation>임시</UserLocation>
            <Dotted />
            <UpdateTime>{dateTime(getDate)}</UpdateTime>
          </Info>
        </UserInfo>
      </Header>
      {commentEdit !== true ? (
        <CommentText>{payload}</CommentText>
      ) : (
        <EditReComment
          id={id}
          payload={payload}
          setCommentEdit={setCommentEdit}
          refresh={refresh}
        />
      )}

      <ActionWrapper>
        {isMine && commentEdit !== true ? (
          <Actions onPress={() => setCommentEdit(true)}>
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
    </CommentContainer>
  );
}
