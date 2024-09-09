import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import CommentComp from "../../components/feed/CommentComp";
import ScreenLayout from "../../components/ScreenLayout";
import useMe from "../../hooks/useMe";
import {
  createComment,
  createCommentVariables,
} from "../../__generated__/createComment";
import { seeFeed_seeFeed_comments } from "../../__generated__/seeFeed";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
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

export default function Comments({ id, commentCount, refresh }: any) {
  const deviceWidth = Dimensions.get("window").width;
  const photoId = parseInt(id);
  const commentsRef: React.MutableRefObject<null> = useRef(null);
  const isDark = useColorScheme() === "dark";

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 댓글달기
  const { data: userData } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<createCommentVariables>();
  const createCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      // 새로 작성한 댓글을 캐시에 저장(작성)
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment newComment on Comment {
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
      // 피드에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `Photo:${id}`,
        fields: {
          newComments(prev: seeFeed_seeFeed_comments[]) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev: number) {
            return prev + 1;
          },
        },
      });
      refresh();
      onFocusNext(commentsRef);
    }
  };

  const [createCommentMutation, { loading: newCommentloading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, { update: createCommentUpdate });
  const onValid: SubmitHandler<createCommentVariables> = (data) => {
    const { payload } = data;
    if (newCommentloading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
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
          ref={commentsRef}
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
