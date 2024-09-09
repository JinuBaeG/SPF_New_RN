import React from "react";
import styled from "styled-components/native";
import Board from "../../components/board/Board";
import Notice from "../../components/notice/Notice";

const BoardContainer = styled.ScrollView`
  background-color: ${(props) => props.theme.grayInactColor};
`;

const BoardLine = styled.View`
  height: 4px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

export default function TutorBoard({ navigation, route }: any) {
  const tutorData = route.params.data;
  const sortation = "group";
  return (
    <BoardContainer>
      <Notice data={tutorData} sortation={"tutor"} />
      <BoardLine />
      <Board data={tutorData} sortation={"tutor"} />
      <BoardLine />
    </BoardContainer>
  );
}
