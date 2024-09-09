import React from "react";
import styled from "styled-components/native";

const MyCounter = styled.View`
  align-items: center;
  justify-content: center;
  padding: 16px 16px 0;
`;

const MyCountName = styled.Text`
  text-algin: center;
  font-size: 16px;
  color: ${(props) => props.theme.grayColor};
`;

const MyCountBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
  padding: 16px;
`;

const MyCount = styled.Text`
  font-size: 28px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const GTFUnitText = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.textColor};
`;

export default function MyProfileCount({ name, count }: any) {
  return (
    <MyCounter>
      <MyCountName>{name}</MyCountName>
      <MyCountBtn>
        <MyCount>{count > 0 ? count : 0}</MyCount>
        <GTFUnitText>개</GTFUnitText>
      </MyCountBtn>
    </MyCounter>
  );
}
