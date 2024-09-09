import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { BOARD_FRAGMENT_NATIVE } from "../../fragments";
import BoardComp from "../../components/board/BoardComp";
import SharedWriteButton from "../../components/shared/SharedWriteButton";
import useMe from "../../hooks/useMe";
import { isLoggedInVar } from "../../apollo";

const SEE_BOARDS_QUERY = gql`
  query seeBoards(
    $id: Int
    $sortation: String
    $offset: Int
    $blockUsers: [BlockUsers]
  ) {
    seeBoards(
      id: $id
      sortation: $sortation
      offset: $offset
      blockUsers: $blockUsers
    ) {
      ...BoardFragmentNative
    }
  }
  ${BOARD_FRAGMENT_NATIVE}
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

export default function BoardList({ navigation, route }: any) {
  const id = route.params.id;
  const sortation = route.params.sortation;
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [blockUsers, setBlockUsers] = useState<any>([]);

  const me = useMe();

  const setBlockUserList = () => {
    if (isLoggedIn) {
      const blockUserList = me?.data.me.blockedBy;
      setBlockUsers([]);

      if (blockUserList !== undefined && blockUserList !== null) {
        blockUserList.map((item: any) => {
          let blockUserId = { blockId: item.blockedBy.id };
          setBlockUsers([blockUserId, ...blockUsers]);
        });
      }
    }
  };

  useEffect(() => {
    setBlockUserList();
  }, [me?.data?.me?.blockedBy]);

  const {
    data,
    loading: boardLoading,
    refetch: boardRefetch,
    fetchMore: boardFetchMore,
  } = useQuery(SEE_BOARDS_QUERY, {
    variables: {
      id,
      sortation,
      offset: 0,
      blockUsers,
    },
  });

  const renderBoardList = ({ item: board }: any) => {
    return <BoardComp {...board} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await boardRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "게시판 리스트",
    });
  }, []);

  return (
    <ScreenLayout loading={boardLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return boardFetchMore({
            variables: {
              offset: data?.seeBoards?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeBoards}
        renderItem={renderBoardList}
      />
      {route.params.isJoin ? (
        <WriteButtonContainer
          onPress={() => navigation.navigate("AddBoard", { id, sortation })}
        >
          <Ionicons name={"ios-add"} size={28} color="white" />
        </WriteButtonContainer>
      ) : null}
    </ScreenLayout>
  );
}
