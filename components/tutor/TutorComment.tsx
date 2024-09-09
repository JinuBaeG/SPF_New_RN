import { gql, useMutation } from "@apollo/client";
import React from "react";
import styled from "styled-components/native";
import { cache } from "../../apollo";
import useTutor from "../../hooks/useTutor";
import useUser from "../../hooks/useUser";

const TOGGLE_OK_MUTATION = gql`
  mutation toggleOk($id: Int!) {
    toggleOk(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-top: 16px;
`;

const TutorInfo = styled.View`
  padding: 4px 0;
`;

const TextBold = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.whiteColor};
`;

const Response = styled.View``;

const TextDisc = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.whiteColor};
`;

const Answer = styled.View`
  width: 100%;
  margin-top: 4px;
  align-items: flex-end;
`;

const AnswerBtn = styled.TouchableOpacity`
  width: 100px;
  padding: 4px;
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: 8px;
`;

const AnswerText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.greenActColor};
  text-align: center;
`;

export default function TutorComment({
  id,
  responseTitle,
  responseDiscription,
  answerOk,
  userId,
  tutorId,
}: any) {
  const tutor = useTutor(tutorId);
  const user = useUser(userId);
  const updateToggleOk = (cache: any, result: any) => {
    const {
      data: {
        toggleOk: { ok },
      },
    } = result;

    if (ok) {
      const responseId = `TutorInquiryComment:${id}`;
      cache.modify({
        id: responseId,
        fields: {
          answerOk(prev: boolean) {
            return !prev;
          },
        },
      });
    }
  };

  const [toggleOkMutation] = useMutation(TOGGLE_OK_MUTATION, {
    variables: {
      id: parseInt(id),
    },
    update: updateToggleOk,
  });

  return (
    <Container>
      <TutorInfo>
        <TextBold>{tutor.name + "님의 답변"}</TextBold>
      </TutorInfo>
      <Response>
        <TextDisc>{responseDiscription}</TextDisc>
      </Response>
      {answerOk !== true ? (
        <Answer>
          <AnswerBtn
            onPress={() => {
              toggleOkMutation();
            }}
          >
            <AnswerText>답변확인</AnswerText>
          </AnswerBtn>
        </Answer>
      ) : (
        <Answer>
          <AnswerBtn disabled={true}>
            <AnswerText>답변완료</AnswerText>
          </AnswerBtn>
        </Answer>
      )}
    </Container>
  );
}
