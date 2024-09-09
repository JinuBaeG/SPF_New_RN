import { gql, useQuery } from "@apollo/client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useColorScheme, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import ScreenLayout from "../../components/ScreenLayout";
import RenderHTML from "react-native-render-html";

type BoardCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "BoardDetail"
>;

const SEE_BANNER_QUERY = gql`
  query seeBanner($id: Int) {
    seeBanner(id: $id) {
      title
      discription
      createdAt
    }
  }
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.whiteColor};
  width: 100%;
`;

const Header = styled.View`
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserInfoWrap = styled.View``;

const BoardInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CreateDate = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayInactColor};
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
`;

const Category = styled.View`
  flex-direction: row;
  padding: 16px 16px 4px;
`;

const CategoryText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.blackColor};
`;

export default function BoardDetail({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  // 게시글 정보 가져오기
  const {
    data: bannerData,
    loading: bannerLoading,
    refetch: bannerRefetch,
  } = useQuery(SEE_BANNER_QUERY, {
    variables: { id: route.params.id },
    fetchPolicy: "cache-and-network",
  });

  // 댓글 목록 가져오기
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await bannerRefetch();
    setRefreshing(false);
  };

  const isDark = useColorScheme() === "dark";

  const source = { html: bannerData?.seeBanner?.discription };
  const getDate = new Date(parseInt(bannerData?.seeBanner?.createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  useEffect(() => {
    navigation.setOptions({
      title:
        bannerData?.seeBanner?.title !== null
          ? bannerData?.seeBanner?.title.length > 14
            ? bannerData?.seeBanner?.title.substring(0, 13) + "..."
            : bannerData?.seeBanner?.title
          : "제목없음",
    });
  }, [bannerData]);

  return (
    <ScreenLayout loading={bannerLoading}>
      <Container>
        <Category>
          <CategoryText>{bannerData?.seeBanner?.title}</CategoryText>
        </Category>
        <Header>
          <UserInfoWrap>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        <Caption>
          <RenderHTML contentWidth={width} source={source} />
        </Caption>
      </Container>
    </ScreenLayout>
  );
}
