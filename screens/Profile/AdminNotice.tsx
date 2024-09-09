import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { useEffect, useState } from "react";

const SEE_ADMIN_NOTICES_QUERY = gql`
  query seeAdminNotices($offset: Int) {
    seeAdminNotices(offset: $offset) {
      id
      title
      createdAt
    }
  }
`;

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

const BoardTitle = styled.Text`
  width: 282px;
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

export default function AdminNotice({ navigation }: any) {
  const {
    data: noticeData,
    loading: noticeLoading,
    refetch: noticeRefetch,
    fetchMore: noticeFetchMore,
  } = useQuery(SEE_ADMIN_NOTICES_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderNoticeList = ({ item }: any) => {
    const getDate = new Date(parseInt(item.createdAt));

    let date = getDate.getDate();
    let month = getDate.getMonth() + 1;
    let year = getDate.getFullYear();

    return (
      <BoardWrap
        onPress={() => {
          navigation.navigate("AdminNoticeDetail", {
            id: item.id,
          });
        }}
      >
        <BoardPoint>
          <Ionicons name="caret-forward" size={16} color="#01aa73" />
        </BoardPoint>
        <BoardTitle numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </BoardTitle>
        <BoardDate>{year + "-" + month + "-" + date}</BoardDate>
      </BoardWrap>
    );
  };

  const [noticeRefreshing, setNoticeRefreshing] = useState(false);
  const noticeRefresh = async () => {
    setNoticeRefreshing(true);
    await noticeRefetch();
    setNoticeRefreshing(false);
  };

  useEffect(() => {
    noticeRefresh();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "공지사항",
    });
  });

  return (
    <ScreenLayout loading={noticeLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return noticeFetchMore({
            variables: {
              offset: noticeData?.seeAdminNotices?.length,
            },
          });
        }}
        onRefresh={noticeRefresh}
        refreshing={noticeRefreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={noticeData?.seeAdminNotices}
        renderItem={renderNoticeList}
      />
    </ScreenLayout>
  );
}
