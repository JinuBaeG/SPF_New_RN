import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { BOARD_FRAGMENT_NATIVE } from "../../fragments";
import { isLoggedInVar } from "../../apollo";
import useMe from "../../hooks/useMe";
import { Alert, Dimensions } from "react-native";

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

type BoardNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Board"
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
  width: ${(props) => props.deviceWidth}px;
  padding: 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const BoardDate = styled.Text`
  padding: 0 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

export default function Board({ data, sortation }: any) {
  const navigation = useNavigation<BoardNavigationProps>();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const deviceWidth = Dimensions.get("window").width - 90;
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
    data: boardData,
    loading: boardLoading,
    refetch: boardRefetch,
  } = useQuery(SEE_BOARDS_QUERY, {
    variables: {
      id: data.id,
      sortation,
      offset: 0,
      blockUsers,
    },
    fetchPolicy: "cache-and-network",
  });

  const [boardRefreshing, setBoardRefreshing] = useState(false);
  const boardRefresh = async () => {
    setBoardRefreshing(true);
    await boardRefetch();
    setBoardRefreshing(false);
  };

  useEffect(() => {
    boardRefresh();
  }, []);

  return (
    <BoardContainer>
      <TitleWrap>
        <Title>게시판</Title>
        <DiscBtn
          onPress={() => {
            if (data.isJoin) {
              navigation.navigate("BoardList", {
                id: data.id,
                isJoin: data.isJoin,
                sortation,
              });
            } else if (sortation === "facility") {
              navigation.navigate("BoardList", {
                id: data.id,
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
      {boardData?.seeBoards.length > 0 ? (
        boardData?.seeBoards.map((item: any) => {
          const getDate = new Date(parseInt(item.createdAt));

          let date = getDate.getDate();
          let month = getDate.getMonth() + 1;
          let year = getDate.getFullYear();
          return (
            <ListContainer key={item.id}>
              <BoardWrap
                onPress={() => {
                  navigation.navigate("BoardDetail", {
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
          <EmptyText>게시글이 없네요!</EmptyText>
          <EmptyText>게시글을 작성해보세요!</EmptyText>
          {data.isJoin ? (
            <CreateGroupBtn
              onPress={() => {
                navigation.navigate("AddBoard", { id: data.id, sortation });
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
