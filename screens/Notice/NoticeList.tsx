import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { NOTICE_FRAGMENT_NATIVE } from "../../fragments";
import { Ionicons } from "@expo/vector-icons";
import NoticeComp from "../../components/notice/NoticeComp";
import { useIsFocused } from "@react-navigation/native";

const SEE_NOTICES_QUERY = gql`
  query seeNotices($id: Int, $sortation: String, $offset: Int) {
    seeNotices(id: $id, sortation: $sortation, offset: $offset) {
      ...NoticeFragmentNative
    }
  }
  ${NOTICE_FRAGMENT_NATIVE}
`;

const WriteButtonContainer = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${(props) => props.theme.greenActColor};
  align-items: center;
  justify-content: center;
`;

export default function NoticeList({ navigation, route }: any) {
  const isFocused = useIsFocused();
  const id = route.params.id;
  const sortation = route.params.sortation;

  const {
    data,
    loading: noticeLoading,
    refetch: noticeRefetch,
    fetchMore: noticeFetchMore,
  } = useQuery(SEE_NOTICES_QUERY, {
    variables: {
      id,
      sortation,
      offset: 0,
    },
  });

  const renderNoticeList = ({ item: board }: any) => {
    return <NoticeComp {...board} refresh={refresh} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await noticeRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "공지사항 리스트",
    });
    refresh();
  }, [isFocused]);

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
              offset: data?.seeNotices?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeNotices}
        renderItem={renderNoticeList}
      />
      {route.params.isPresident ? (
        <WriteButtonContainer
          onPress={() => navigation.navigate("AddNotice", { id, sortation })}
        >
          <Ionicons name={"ios-add"} size={28} color="white" />
        </WriteButtonContainer>
      ) : null}
    </ScreenLayout>
  );
}
