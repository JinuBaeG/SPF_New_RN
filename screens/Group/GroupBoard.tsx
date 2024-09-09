import React from "react";
import styled from "styled-components/native";
import Board from "../../components/board/Board";
import Notice from "../../components/notice/Notice";

const BoardContainer = styled.ScrollView`
  background-color: ${(props) => props.theme.grayBackground};
`;

const BoardLine = styled.View`
  height: 4px;
  background-color: ${(props) => props.theme.grayLineColor};
`;

export default function GroupBoard({ navigation, route }: any) {
  const groupData = route.params.data;
  const sortation = "group";
  return (
    <BoardContainer>
      <Notice data={groupData} sortation={"group"} />
      <BoardLine />
      <Board data={groupData} sortation={"group"} />
      <BoardLine />
    </BoardContainer>
  );
}
