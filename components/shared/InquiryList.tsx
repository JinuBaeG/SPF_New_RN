import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";

type TutorInquiryCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TutorInquiryDetail"
>;

const InquiryContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

const InquiryTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  font-size: 16px;
  width: 80%;
`;

const InquiryDate = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  width: 20%;
`;

export default function InquiryList({
  id,
  user,
  inquiryTitle,
  createdAt,
}: any) {
  const getDate = new Date(parseInt(createdAt));
  const navigation = useNavigation<TutorInquiryCompNavigationProps>();

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  return (
    <InquiryContainer
      onPress={() => {
        navigation.navigate("TutorInquiryDetail", { id, userId: user.id });
      }}
    >
      <InquiryTitle>{inquiryTitle}</InquiryTitle>
      <InquiryDate>{year + "-" + month + "-" + date}</InquiryDate>
    </InquiryContainer>
  );
}
