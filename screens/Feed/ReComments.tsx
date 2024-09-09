import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import {
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { dateTime } from "../../components/shared/sharedFunction";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
  COMMENT_FRAGMENT_NATIVE,
  RECOMMENT_FRAGMENT_NATIVE,
} from "../../fragments";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import ScreenLayout from "../../components/ScreenLayout";
import ReCommentComp from "../../components/feed/ReCommentComp";
import EditComment from "../../components/boardComments/EditComment";
import ReComment from "./ReComment";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { isLoggedInVar } from "../../apollo";

interface ICommentCompProps {
  id: number;
  comment: {
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

const SEE_COMMENT_QUERY = gql`
  query seeComment($id: Int!) {
    seeComment(id: $id) {
      ...CommentFragmentNative
    }
  }
  ${COMMENT_FRAGMENT_NATIVE}
`;

const SEE_RECOMMENTS_QUERY = gql`
  query seeReComments($id: Int!, $offset: Int) {
    seeReComments(id: $id, offset: $offset) {
      ...ReCommentFragmentNative
    }
  }
  ${RECOMMENT_FRAGMENT_NATIVE}
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const TOGGLE_BLOCK_MUTATION = gql`
  mutation blockUser($id: Int!) {
    blockUser(id: $id) {
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

export default function ReComments({ navigation, route }: any) {
  const [open, setOpen] = useState(false);
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  const toggleModal = () => setOpen(!open);

  // 사용자 차단
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const blockCompleted = (data: any) => {
    const {
      blockUser: { ok, error },
    } = data;

    if (ok) {
      navigation.reset({ routes: [{ name: "Tabs" }] });
    }
  };
  const [blockUserMutation] = useMutation(TOGGLE_BLOCK_MUTATION, {
    onCompleted: blockCompleted,
  });

  const toggleBlock = (id: any) => {
    blockUserMutation({
      variables: {
        id: parseInt(id),
      },
    });
  };

  // 댓글 내용 가져오기
  const { data: commentData, refetch: commentRefetch } = useQuery(
    SEE_COMMENT_QUERY,
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
  } = useQuery(SEE_RECOMMENTS_QUERY, {
    variables: {
      id: route.params.id,
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
        deleteComment: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const CommentId = `Comment:${commentData?.seeComment.id}`;
      const photoId = `Photo:${route.params.photo.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: CommentId });
      cache.modify({
        id: photoId,
        fields: {
          commentCount(prev: number) {
            return prev - 1;
          },
        },
      });
      navigation.goBack();
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: deleteToggle,
  });

  const onDelete = () => {
    deleteCommentMutation({
      variables: {
        id: route.params.id,
      },
    });
  };

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: commentData?.seeComment?.user.username,
      id: commentData?.seeComment?.user.id,
    });
  };

  const getDate = new Date(parseInt(commentData?.seeComment?.createdAt));

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
                commentData?.seeComment?.user.avatar === null
                  ? isDark
                    ? require(`../../assets/emptyAvatar_white.png`)
                    : require(`../../assets/emptyAvatar.png`)
                  : { uri: commentData?.seeComment?.user.avatar }
              }
            />

            <UserInfoWrap>
              <Username>{commentData?.seeComment?.user.username}</Username>
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
                  <>
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

                    <FeedMenu
                      style={{ margin: 5 }}
                      onPress={() => {
                        toggleModal();
                        setCommentEdit(true);
                      }}
                    >
                      <FeedMenuText>수정하기</FeedMenuText>
                    </FeedMenu>
                  </>
                ) : null}
                {!commentData?.seeComment?.isMine && isLoggedIn ? (
                  <FeedMenu
                    style={{ margin: 5 }}
                    onPress={() => {
                      toggleBlock(commentData?.seeComment?.user.id);
                    }}
                  >
                    <FeedMenuText style={{ color: "red" }}>
                      차단하기
                    </FeedMenuText>
                  </FeedMenu>
                ) : null}
                <FeedMenu
                  style={{ margin: 5 }}
                  onPress={() => {
                    toggleModal();
                    navigation.navigate("Report", {
                      id: commentData?.seeComment?.id,
                      screen,
                    });
                  }}
                >
                  <FeedMenuText>신고하기</FeedMenuText>
                </FeedMenu>
                <FeedMenu style={{ margin: 5 }} onPress={toggleModal}>
                  <FeedMenuText>닫기</FeedMenuText>
                </FeedMenu>
              </MenuList>
            </Modal>
          </FeedMenuWrap>
        </Header>
        {commentEdit !== true ? (
          <CommentText>{commentData?.seeComment?.payload}</CommentText>
        ) : (
          <EditComment
            {...commentData?.seeComment}
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
        <ReComment
          id={commentData?.seeComment?.id}
          boardReCommentCount={commentData?.seeComment?.reCommentCount}
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
              id: commentData?.seeComment?.id,
              offset: reCommentData?.seeReComments?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        data={reCommentData?.seeReComments}
        keyExtractor={(reComment) => "" + reComment.id}
        renderItem={reCommentList}
        ListHeaderComponent={ListHeader}
      />
    </ScreenLayout>
  );
}
