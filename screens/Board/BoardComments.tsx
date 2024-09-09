import { gql, useMutation } from "@apollo/client";
import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { cache } from "../../apollo";
import { useIsFocused } from "@react-navigation/native";

const CREATE_BOARD_COMMENT_MUTATION = gql`
  mutation createBoardComment($boardId: Int!, $payload: String!) {
    createBoardComment(boardId: $boardId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const InputContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const MessageWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MessageInput = styled.TextInput`
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  color: ${(props) => props.theme.textColor};
  margin-right: 8px;
`;

const SendButton = styled.TouchableOpacity``;

export default function BoardComments({ id, boardCommentCount, refresh }: any) {
  const boardCommentsRef: React.MutableRefObject<null> = useRef(null);
  const deviceWidth = Dimensions.get("window").width;
  const isDark = useColorScheme() === "dark";

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 댓글달기
  const { data: userData } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const createBoardCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createBoardComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newBoardComment = {
        __typename: "BoardComment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      // 새로 작성한 댓글을 캐시에 저장(작성)
      const newCacheBoardComment = cache.writeFragment({
        data: newBoardComment,
        fragment: gql`
          fragment newBoardComment on BoardComment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });
      // 게시글에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `Board:${id}`,
        fields: {
          boardComments(prev: any) {
            return [...prev, newCacheBoardComment];
          },
          boardCommentCount(prev: number) {
            return prev + 1;
          },
        },
      });
      refresh();
      onFocusNext(boardCommentsRef);
    }
  };

  const [createBoardCommentMutation, { loading: newCommentloading }] =
    useMutation(CREATE_BOARD_COMMENT_MUTATION, {
      update: createBoardCommentUpdate,
    });
  const onValid = (data: any) => {
    const { payload } = data;
    if (newCommentloading) {
      return;
    }
    createBoardCommentMutation({
      variables: {
        boardId: parseInt(id),
        payload,
      },
    });
  };

  useEffect(() => {
    register("payload", {
      required: true,
      minLength: 3,
    });
  }, []);

  return (
    <InputContainer>
      <MessageWrap>
        <MessageInput
          ref={boardCommentsRef}
          placeholderTextColor="rgba(136, 136, 136, 0.4)"
          placeholder="내용을 입력해주세요."
          returnKeyLabel="Done"
          returnKeyType="done"
          multiline={true}
          onSubmitEditing={handleSubmit(onValid)}
          onChangeText={(text) => setValue("payload", text)}
          value={watch("payload")}
          style={{ width: deviceWidth - 40, height: 80 }}
        />
        <SendButton
          onPress={handleSubmit(onValid)}
          disabled={!Boolean(watch("payload"))}
        >
          <Ionicons
            name="send"
            color={
              !Boolean(watch("payload"))
                ? "rgba(136, 136, 136, 0.4)"
                : isDark
                ? "white"
                : "black"
            }
            size={20}
          />
        </SendButton>
      </MessageWrap>
    </InputContainer>
  );
}
