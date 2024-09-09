import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import RenderHTML from "react-native-render-html";
import ScreenLayout from "../../components/ScreenLayout";
import { useWindowDimensions } from "react-native";

const SEE_ADMIN_NOTICE_QUERY = gql`
  query seeAdminNotice($id: Int) {
    seeAdminNotice(id: $id) {
      id
      title
      discription
      createdAt
    }
  }
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

const Hits = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 4px 16px 16px;
`;

const CaptionText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.textColor};
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

export default function AdminNoticeDetail({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  const { data: noticeData, loading: noticeLoading } = useQuery(
    SEE_ADMIN_NOTICE_QUERY,
    {
      variables: {
        id: route.params.id,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const source = { html: noticeData?.seeAdminNotice?.discription };
  const getDate = new Date(parseInt(noticeData?.seeAdminNotice?.createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  useEffect(() => {
    navigation.setOptions({
      title:
        noticeData?.seeAdminNotice?.title !== null
          ? noticeData?.seeAdminNotice?.title > 10
            ? noticeData?.seeAdminNotice?.title.substring(0, 9) + "..."
            : noticeData?.seeAdminNotice?.title
          : "제목없음",
    });
  });

  return (
    <ScreenLayout loading={noticeLoading}>
      <Container>
        <Header>
          <UserInfoWrap>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        <Category>
          <CategoryText>{noticeData?.seeAdminNotice?.title}</CategoryText>
        </Category>
        <Caption>
          <RenderHTML contentWidth={width} source={source} />
        </Caption>
      </Container>
    </ScreenLayout>
  );
}
