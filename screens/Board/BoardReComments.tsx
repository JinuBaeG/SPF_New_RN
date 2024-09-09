import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import { Alert, Dimensions, Platform, useColorScheme } from "react-native";
import { dateTime } from "../../components/shared/sharedFunction";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  BOARD_COMMENT_FRAGMENT_NATIVE,
  BOARD_RECOMMENT_FRAGMENT_NATIVE,
} from "../../fragments";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import ScreenLayout from "../../components/ScreenLayout";
import ReCommentComp from "../../components/board/ReCommentComp";
import BoardReComment from "./BoardReComment";
import EditComment from "../../components/boardComments/EditComment";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

interface ICommentCompProps {
  id: number;
  boardComment: {
    id: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  payload: string;
  isMine: boolean;
  createdAt: string;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const BOARD_COMMENT_QUERY = gql`
  query seeBoardComment($id: Int!) {
    seeBoardComment(id: $id) {
      ...BoardCommentFragmentNative
    }
  }
  ${BOARD_COMMENT_FRAGMENT_NATIVE}
`;

const SEE_BOARD_RECOMMENTS_QUERY = gql`
  query seeBoardReComments($id: Int!, $offset: Int) {
    seeBoardReComments(id: $id, offset: $offset) {
      ...BoardReCommentFragmentNative
    }
  }
  ${BOARD_RECOMMENT_FRAGMENT_NATIVE}
`;

const DELETE_BOARD_COMMENT_MUTATION = gql`
  mutation deleteBoardComment($id: Int!) {
    deleteBoardComment(id: $id) {
      ok
      error
    }
  }
`;

const CommentContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const CommentText = styled.Text`
  padding: 16px;
  color: ${(props) => props.theme.textColor};
`;

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;
const UserInfoWrap = styled.View``;

const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const Info = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const UserLocation = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
`;

const UpdateTime = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
`;

const Dotted = styled.View`
  width: 2px;
  height: 2px;
  background-color: ${(props) => props.theme.grayInactColor};
  margin: 0px 4px;
  border-radius: 1px;
`;

const ActionWrapper = styled.View`
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ActionRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Actions = styled.TouchableOpacity`
  margin-right: 8px;
`;

const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const ActionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.grayInactColor};
  margin-left: 4px;
`;

const CommentEdit = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentDelete = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const FeedMenuWrap = styled.View`
  position: relative;
`;

const FeedMenu = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const FeedMenuText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const MenuList = styled.View`
  flex: 0.15;
  background-color: ${(props) => props.theme.whiteColor};
  align-items: center;
  justify-content: center;
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayLineColor};
`;

export default function BoardReComments({ navigation, route }: any) {
  const [open, setOpen] = useState(false);
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  const toggleModal = () => setOpen(!open);

  // 댓글 내용 가져오기
  const { data: commentData, refetch: commentRefetch } = useQuery(
    BOARD_COMMENT_QUERY,
    {
      variables: {
        id: route.params.id,
      },
    }
  );

  // 답글 리스트 가져오기
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: reCommentData,
    loading: reCommentLoading,
    refetch: reCommentRefetch,
    fetchMore: reCommentFetchMore,
  } = useQuery(SEE_BOARD_RECOMMENTS_QUERY, {
    variables: {
      id: commentData?.seeBoardComment?.id,
      offset: 0,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await commentRefetch();
    await reCommentRefetch();
    setRefreshing(false);
  };

  const deleteToggle = (cache: any, result: any) => {
    const {
      data: {
        deleteBoardComment: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const boardCommentId = `BoardComment:${reCommentData?.seeBoardReComments.id}`;
      const boardId = `Board:${commentData?.seeBoardComment?.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: boardCommentId });
      cache.modify({
        id: boardId,
        fields: {
          boardCommentCount(prev: number) {
            return prev - 1;
          },
        },
      });

      navigation.goBack();
    }
  };

  const [deleteBoardCommentMutation] = useMutation(
    DELETE_BOARD_COMMENT_MUTATION,
    {
      update: deleteToggle,
    }
  );

  const onDelete = () => {
    deleteBoardCommentMutation({
      variables: {
        id: route.params.id,
      },
    });
  };

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: commentData?.seeBoardComment?.user.username,
      id: commentData?.seeBoardComment?.user.id,
    });
  };

  const getDate = new Date(parseInt(commentData?.seeBoardComment?.createdAt));

  const [commentEdit, setCommentEdit] = useState(route.params.editComment);

  const reCommentList = ({ item: reComment }: any) => {
    return <ReCommentComp {...reComment} refresh={refresh} />;
  };

  const isDark = useColorScheme() === "dark";

  const ListHeader = () => {
    return (
      <CommentContainer>
        <Header>
          <UserInfo onPress={() => goToProfile()}>
            <UserAvatar
              resizeMode="cover"
              source={
                commentData?.seeBoardComment?.user.avatar === null
                  ? isDark
                    ? require(`../../assets/emptyAvatar_white.png`)
                    : require(`../../assets/emptyAvatar.png`)
                  : { uri: commentData?.seeBoardComment?.user.avatar }
              }
            />

            <UserInfoWrap>
              <Username>{commentData?.seeBoardComment?.user.username}</Username>
              <Info>
                <UpdateTime>{dateTime(getDate)}</UpdateTime>
              </Info>
            </UserInfoWrap>
          </UserInfo>

          <FeedMenuWrap>
            <FeedMenu
              onPress={() => {
                toggleModal();
              }}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={16}
                color={isDark ? "white" : "black"}
              />
            </FeedMenu>
            <Modal
              isVisible={open}
              deviceHeight={deviceHeight}
              deviceWidth={deviceWidth}
            >
              <MenuList>
                {commentData?.seeComment?.isMine ? (
                  <FeedMenu
                    style={{ margin: 5 }}
                    onPress={() => {
                      toggleModal();
                      onDelete();
                    }}
                  >
                    <FeedMenuText style={{ color: "red" }}>
                      삭제하기
                    </FeedMenuText>
                  </FeedMenu>
                ) : null}
                <FeedMenu
                  style={{ margin: 5 }}
                  onPress={() => {
                    toggleModal();
                    setCommentEdit(true);
                  }}
                >
                  <FeedMenuText>수정하기</FeedMenuText>
                </FeedMenu>
                <FeedMenu style={{ margin: 5 }} onPress={toggleModal}>
                  <FeedMenuText>닫기</FeedMenuText>
                </FeedMenu>
              </MenuList>
            </Modal>
          </FeedMenuWrap>
        </Header>
        {commentEdit !== true ? (
          <CommentText>{commentData?.seeBoardComment?.payload}</CommentText>
        ) : (
          <EditComment
            {...commentData?.seeBoardComment}
            setCommentEdit={setCommentEdit}
            refresh={refresh}
          />
        )}
        <BoardLine />
        <ActionWrapper>
          <Action>
            <Ionicons
              name="chatbubble-outline"
              color={isDark ? "#ffffff" : "rgba(136, 136, 136, 0.5)"}
              style={{ marginBottom: 2 }}
              size={16}
            />
            <ActionText>
              답글 {commentData?.seeComment?.reCommentCount}
            </ActionText>
          </Action>
        </ActionWrapper>
        <BoardLine />
        <BoardReComment
          id={commentData?.seeBoardComment?.id}
          boardReCommentCount={
            commentData?.seeBoardComment?.boardReCommentCount
          }
          refresh={refresh}
        />
        <BoardLine />
      </CommentContainer>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: "답글쓰기",
    });
  }, []);

  return (
    <ScreenLayout loading={reCommentLoading}>
      <KeyboardAwareFlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return reCommentFetchMore({
            variables: {
              id: commentData?.seeBoardComment?.id,
              offset: reCommentData?.seeBoardReComments?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        data={reCommentData?.seeBoardReComments}
        keyExtractor={(reComment) => "" + reComment.id}
        renderItem={reCommentList}
        ListHeaderComponent={ListHeader}
      />
    </ScreenLayout>
  );
}
