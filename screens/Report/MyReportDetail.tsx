import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import RenderHTML from "react-native-render-html";
import ScreenLayout from "../../components/ScreenLayout";
import { useWindowDimensions } from "react-native";
import {
  BOARD_FRAGMENT_NATIVE,
  NOTICE_FRAGMENT_NATIVE,
  PHOTO_FRAGMENT_NATIVE,
} from "../../fragments";

const SEE_REPORT_DETAIL_QUERY = gql`
  query seeReportDetail($id: Int) {
    seeReportDetail(id: $id) {
      id
      photo {
        ...PhotoFragmentNative
      }
      board {
        ...BoardFragmentNative
      }
      notice {
        ...NoticeFragmentNative
      }
      reportDiscription
      reportSortation
      createdAt
    }
  }
  ${PHOTO_FRAGMENT_NATIVE}
  ${BOARD_FRAGMENT_NATIVE}
  ${NOTICE_FRAGMENT_NATIVE}
`;

const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.mainBgColor};
  width: 100%;
`;

const Header = styled.TouchableOpacity`
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

const UserInfoWrap = styled.View``;

const BoardInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CreateDate = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  margin-right: 8px;
`;

const Category = styled.View`
  flex-direction: row;
  padding: 16px 16px 4px;
`;

const CategoryText = styled.Text`
  margin-left: 10px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const ReportBtn = styled.TouchableOpacity`
  padding: 8px;
  margin: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export default function MyReportDetail({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  const { data: reportData, loading: reportLoading } = useQuery(
    SEE_REPORT_DETAIL_QUERY,
    {
      variables: {
        id: route.params.id,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const getDate = new Date(parseInt(reportData?.seeReportDetail?.createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  useEffect(() => {
    navigation.setOptions({
      title: "신고사유",
    });
  });

  return (
    <ScreenLayout loading={reportLoading}>
      <Container>
        <Header>
          <UserInfoWrap>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        <Category>
          <CategoryText>
            {reportData?.seeReportDetail?.reportDiscription}
          </CategoryText>
        </Category>
        {reportData?.seeReportDetail?.photo !== null ? (
          <ReportBtn
            onPress={() => {
              navigation.navigate("PhotoDetail", {
                id: reportData?.seeReportDetail?.photo.id,
              });
            }}
          >
            <CategoryText>신고한 피드 내용 확인</CategoryText>
          </ReportBtn>
        ) : reportData?.seeReportDetail?.board !== null ? (
          <ReportBtn
            onPress={() => {
              navigation.navigate("BoardDetail", {
                id: reportData?.seeReportDetail?.board.id,
              });
            }}
          >
            <CategoryText>신고한 게시물 내용 확인</CategoryText>
          </ReportBtn>
        ) : (
          <ReportBtn
            onPress={() => {
              navigation.navigate("NoticeDetail", {
                id: reportData?.seeReportDetail?.notice.id,
              });
            }}
          >
            <CategoryText>신고한 공지사항 내용 확인</CategoryText>
          </ReportBtn>
        )}
      </Container>
    </ScreenLayout>
  );
}
