import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";

const EDIT_BOARD_RECOMMENT_MUTATION = gql`
  mutation editBoardReComment($id: Int!, $payload: String!) {
    editBoardReComment(id: $id, payload: $payload) {
      ok
      error
    }
  }
`;

const MessageWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0 0 48px;
`;

const MessageInput = styled.TextInput`
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 8px 12px;
  color: ${(props) => props.theme.textColor};
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.greenActColor};
  margin-right: 8px;
`;

const ButtonWrap = styled.View`
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
  margin-bottom: 8px;
`;

const EditCancelButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.mainBgColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
`;

export default function EditReComment({
  id,
  payload,
  setCommentEdit,
  refresh,
}: any) {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const editReCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        editBoardReComment: { ok, id },
      },
    } = result;

    if (ok) {
      // 게시글에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `ReBoardComment:${id}`,
        fields: {
          payload() {
            return payload;
          },
        },
      });

      setCommentEdit(false);
    }
  };

  const [editBoardReCommentMutation, { loading: editCommentloading }] =
    useMutation(EDIT_BOARD_RECOMMENT_MUTATION, {
      update: editReCommentUpdate,
    });
  const onValidEdit = (data: any) => {
    const { editPayload: payload } = data;

    if (editCommentloading) {
      return;
    }
    editBoardReCommentMutation({
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
        style={{ width: 280, height: 80 }}
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
