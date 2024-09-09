import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { isLoggedInVar } from "../../apollo";
import useMe from "../../hooks/useMe";
import { Alert, Dimensions } from "react-native";
/**
 * Discription : 그룹 게시판의 공지사항
 *
 */
const SEE_NOTICES_QUERY = gql`
  query seeNotices($id: Int, $sortation: String) {
    seeNotices(id: $id, sortation: $sortation) {
      id
      user {
        id
      }
      title
      discription
      sortation
      createdAt
    }
  }
`;

type NoticeNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

const BoardContainer = styled.SafeAreaView`
  width: 100%;
  height: 274px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

const TitleWrap = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const DiscBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Disc = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.grayColor};
`;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
  height: 274px;
  margin-bottom: 1px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
`;

const CreateGroupBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  margin-top: 20px;
  border-radius: 8px;
  padding: 4px;
`;

const CreateGroupText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-weight: 600;
  padding: 4px;
`;

const ListContainer = styled.View``;

const BoardWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  height: 44px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardPoint = styled.View`
  padding: 0 4px;
`;

const BoardTitle = styled.Text<{ deviceWidth: number }>`
  width: ${(props) => props.deviceWidth};
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const BoardDate = styled.Text`
  padding: 0 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

export default function Notice({ data, sortation }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigation = useNavigation<NoticeNavigationProps>();
  const deviceWidth = Dimensions.get("window").width - 90;

  const {
    data: noticeData,
    loading: noticeLoading,
    refetch: noticeRefetch,
  } = useQuery(SEE_NOTICES_QUERY, {
    variables: {
      id: data.id,
      sortation,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const [noticeRefreshing, setNoticeRefreshing] = useState(false);
  const noticeRefresh = async () => {
    setNoticeRefreshing(true);
    await noticeRefetch();
    setNoticeRefreshing(false);
  };

  useEffect(() => {
    noticeRefresh();
  }, []);

  return (
    <BoardContainer>
      <TitleWrap>
        <Title>공지사항</Title>
        <DiscBtn
          onPress={() => {
            if (data.isJoin) {
              navigation.navigate("NoticeList", {
                id: data.id,
                isPresident: data.isPresident,
                sortation,
              });
            } else if (sortation === "facility") {
              navigation.navigate("NoticeList", {
                id: data.id,
                isPresident: data.isPresident,
                sortation,
              });
            } else {
              Alert.alert("그룹 또는 튜터 가입 후 사용할 수 있습니다.");
            }
          }}
        >
          <Disc>더보기 </Disc>
          <Ionicons name="caret-forward-circle" size={16} color="#01aa73" />
        </DiscBtn>
      </TitleWrap>
      <BoardLine />
      {noticeData?.seeNotices.length > 0 ? (
        noticeData?.seeNotices.map((item: any) => {
          const getDate = new Date(parseInt(item.createdAt));

          let date = getDate.getDate();
          let month = getDate.getMonth() + 1;
          let year = getDate.getFullYear();
          return (
            <ListContainer key={item.id}>
              <BoardWrap
                onPress={() => {
                  navigation.navigate("NoticeDetail", {
                    id: item.id,
                    user: item.user,
                    title: item.title,
                    discription: item.discription,
                    isLiked: item.isLiked,
                    likes: item.likes,
                    hits: item.hits,
                    boardCommentCount: item.boardCommentCount,
                    boardComments: item.boardComments,
                    createdAt: item.createdAt,
                    sortation: item.sortation,
                  });
                }}
              >
                <BoardTitle
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  deviceWidth={deviceWidth}
                >
                  {item.title}
                </BoardTitle>
                <BoardDate>{year + "-" + month + "-" + date}</BoardDate>
              </BoardWrap>
              <BoardLine />
            </ListContainer>
          );
        })
      ) : (
        <EmptyContainer>
          <EmptyText>공지사항이 없네요!</EmptyText>
          {data.isPresident ? (
            <CreateGroupBtn
              onPress={() => {
                navigation.navigate("AddNotice", { id: data.id, sortation });
              }}
            >
              <CreateGroupText>글 남기기</CreateGroupText>
            </CreateGroupBtn>
          ) : null}
        </EmptyContainer>
      )}
    </BoardContainer>
  );
}
