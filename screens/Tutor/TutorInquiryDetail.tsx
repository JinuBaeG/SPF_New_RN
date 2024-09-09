import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { cache } from "../../apollo";
import { colors } from "../../color";
import ScreenLayout from "../../components/ScreenLayout";
import TutorComment from "../../components/tutor/TutorComment";
import { TUTOR_INQUIRY_FRAGMENT_NATIVE } from "../../fragments";
import useUser from "../../hooks/useUser";

const SEE_INQUIRY_QUERY = gql`
  query seeInquiry($id: Int) {
    seeInquiry(id: $id) {
      ...TutorInquiryFragmentNative
    }
  }
  ${TUTOR_INQUIRY_FRAGMENT_NATIVE}
`;

// Styled-Component START
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const TitleContainer = styled.View``;

const Title = styled.TextInput`
  background-color: ${(props) => props.theme.grayInactColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const DiscContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;

const Disc = styled.TextInput`
  background-color: ${(props) => props.theme.grayInactColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const ResponseContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

const ResonseBtnWrap = styled.View`
  border-radius: 8px;
  background-color: ${(props) => props.theme.greenActColor};
`;

const ResponseBtn = styled.TouchableOpacity`
  width: 100%;
  border-radius: 8px;
  padding: 16px;
`;

const ResponseText = styled.Text`
  border-radius: 8px;
  color: ${(props) => props.theme.whiteColor};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;
// Styled-Component END

export default function TutorInquiryDetail({ navigation, route }: any) {
  const inquiry = route.params;

  const {
    data,
    loading: inquiryLoading,
    refetch: inquiryRefetch,
    fetchMore: inquiryFetchMore,
  } = useQuery(SEE_INQUIRY_QUERY, {
    variables: {
      id: inquiry.id,
    },
    fetchPolicy: "cache-and-network",
  });

  const user = useUser(inquiry.userId);

  useEffect(() => {
    navigation.setOptions({
      title: user !== undefined ? user.username + "님의 문의" : "문의보기",
    });
  }, [user]);

  const renderComment = ({ item: comment }: any) => {
    return (
      <TutorComment
        {...comment}
        userId={data?.seeInquiry?.user?.id}
        tutorId={data?.seeInquiry?.tutor?.id}
      />
    );
  };
  return (
    <ScreenLayout loading={inquiryLoading}>
      <Container>
        <TitleContainer>
          <Title
            placeholder="제목"
            placeholderTextColor="rgba(0,0,0,0.2)"
            value={data?.seeInquiry?.inquiryTitle}
          />
        </TitleContainer>
        <DiscContainer>
          <Disc
            placeholder="내용"
            placeholderTextColor="rgba(0,0,0,0.2)"
            value={data?.seeInquiry?.inquiryDiscription}
            style={{ flex: 1, textAlignVertical: "top" }}
            numberOfLines={10}
            maxLength={1000}
            multiline={true}
          />
        </DiscContainer>
        {data?.seeInquiry?.tutorInquiryComment !== undefined ? (
          <FlatList
            keyExtractor={(item: any) => item.id + ""}
            data={data?.seeInquiry?.tutorInquiryComment}
            renderItem={renderComment}
          />
        ) : null}
      </Container>
      {data?.seeInquiry?.inquiryResponse !== true ? (
        <ResponseContainer>
          <ResonseBtnWrap>
            <ResponseBtn
              onPress={() => {
                navigation.navigate("TutorInquiryResponse", {
                  data: data?.seeInquiry,
                });
              }}
            >
              <ResponseText>답변하기</ResponseText>
            </ResponseBtn>
          </ResonseBtnWrap>
        </ResponseContainer>
      ) : null}
    </ScreenLayout>
  );
}
