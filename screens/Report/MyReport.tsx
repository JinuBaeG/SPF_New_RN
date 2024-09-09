import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { useEffect, useState } from "react";

const SEE_MY_REPORT_QUERY = gql`
  query seeMyReports($offset: Int) {
    seeMyReports(offset: $offset) {
      id
      reportDiscription
      reportSortation
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

export default function MyReport({ navigation }: any) {
  const {
    data: reportData,
    loading: reportLoading,
    refetch: reportRefetch,
    fetchMore: reportFetchMore,
  } = useQuery(SEE_MY_REPORT_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderReportList = ({ item }: any) => {
    const getDate = new Date(parseInt(item.createdAt));

    let date = getDate.getDate();
    let month = getDate.getMonth() + 1;
    let year = getDate.getFullYear();

    let sortation;
    if (item.reportSortation === "Feed") {
      sortation = "피드";
    } else if (item.reportSortation === "Board") {
      sortation = "게시판";
    } else if (item.reportSortation === "Notice") {
      sortation = "공지사항";
    }

    return (
      <BoardWrap
        onPress={() => {
          navigation.navigate("MyReportDetail", {
            id: item.id,
          });
        }}
      >
        <BoardPoint>
          <Ionicons name="caret-forward" size={16} color="#01aa73" />
        </BoardPoint>
        <BoardTitle numberOfLines={1} ellipsizeMode="tail">
          <BoardDate>
            {year + "-" + month + "-" + date} {sortation} 신고 건
          </BoardDate>
        </BoardTitle>
      </BoardWrap>
    );
  };

  const [reportRefreshing, setReportRefreshing] = useState(false);
  const reportRefresh = async () => {
    setReportRefreshing(true);
    await reportRefetch();
    setReportRefreshing(false);
  };

  useEffect(() => {
    reportRefresh();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "내 신고내역",
    });
  });

  return (
    <ScreenLayout loading={reportLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return reportFetchMore({
            variables: {
              offset: reportData?.seeMyReports?.length,
            },
          });
        }}
        onRefresh={reportRefresh}
        refreshing={reportRefreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={reportData?.seeMyReports}
        renderItem={renderReportList}
      />
    </ScreenLayout>
  );
}
