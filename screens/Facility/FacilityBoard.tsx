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

export default function FacilityBoard({ navigation, route }: any) {
  const facilityData = route.params.data;

  return (
    <BoardContainer>
      <Notice data={facilityData} sortation={"facility"} />
      <BoardLine />
      <Board data={facilityData} sortation={"facility"} />
      <BoardLine />
    </BoardContainer>
  );
}
