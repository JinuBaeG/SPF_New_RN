import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: Int!, $payload: String!) {
    editComment(id: $id, payload: $payload) {
      ok
      error
    }
  }
`;

const MessageWrap = styled.View`
  align-items: flex-end;
`;

const MessageInput = styled.TextInput`
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  color: ${(props) => props.theme.textColor};
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.greenActColor};
`;

const ButtonWrap = styled.View`
  padding: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const EditButtonText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.whiteColor};
`;

const EditCancelText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.greenActColor};
`;

const EditButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.greenActColor};
  margin-right: 4px;
`;

const EditCancelButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.mainBgColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
`;

export default function EditComment({
  id,
  payload,
  setCommentEdit,
  refresh,
}: any) {
  const deviceWidth = Dimensions.get("window").width;
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const editCommentUpdate = (cache: any, result: any) => {
    const { editPayload } = getValues();
    setValue("payload", "");
    const {
      data: {
        editComment: { ok, id },
      },
    } = result;

    if (ok) {
      // 게시글에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `Comment:${id}`,
        fields: {
          payload() {
            return payload;
          },
        },
      });

      setCommentEdit(false);
      refresh();
    }
  };

  const [editCommentMutation, { loading: editCommentloading }] = useMutation(
    EDIT_COMMENT_MUTATION,
    {
      update: editCommentUpdate,
    }
  );
  const onValidEdit = (data: any) => {
    const { editPayload: payload } = data;

    if (editCommentloading) {
      return;
    }
    editCommentMutation({
      variables: {
        id,
        payload,
      },
    });
    refresh();
  };

  useEffect(() => {
    register("editPayload", {
      required: true,
      minLength: 3,
    });
  }, []);

  return (
    <MessageWrap>
      <MessageInput
        placeholderTextColor="rgba(0,0,0,0.5)"
        placeholder="내용을 입력해주세요."
        returnKeyLabel="Done"
        returnKeyType="done"
        multiline={true}
        onSubmitEditing={handleSubmit(onValidEdit)}
        onChangeText={(text) => setValue("editPayload", text)}
        value={watch("editPayload")}
        style={{ width: deviceWidth, height: 80 }}
      ></MessageInput>

      <ButtonWrap>
        <EditButton
          onPress={handleSubmit(onValidEdit)}
          disabled={!Boolean(watch("editPayload"))}
        >
          <EditButtonText>수정</EditButtonText>
        </EditButton>
        <EditCancelButton onPress={() => setCommentEdit(false)}>
          <EditCancelText>취소</EditCancelText>
        </EditCancelButton>
      </ButtonWrap>
    </MessageWrap>
  );
}
