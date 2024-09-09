import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Alert, Dimensions, Platform, useColorScheme } from "react-native";
import Modal from "react-native-modal";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../shared.types";
import { isLoggedInVar } from "../apollo";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

const DELETE_FEED_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
      error
    }
  }
`;

const DELETE_NOTICE_MUTATION = gql`
  mutation deleteNotice($id: Int!) {
    deleteNotice(id: $id) {
      ok
      error
    }
  }
`;

const DELETE_BOARD_MUTATION = gql`
  mutation deleteBoard($id: Int!) {
    deleteBoard(id: $id) {
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

export default function ContentsMenu({
  id,
  userId,
  isMine,
  screen,
  refresh,
}: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDark = useColorScheme() === "dark";
  const [open, setOpen] = useState(false);
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  const toggleModal = () => setOpen(!open);
  const navigation = useNavigation<PhotoCompNavigationProps>();

  // 사용자 차단
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

  // 피드 삭제
  const deleteFeed = (cache: any, result: any) => {
    const {
      data: {
        deletePhoto: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const photoId = `Photo:${id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: photoId });
      cache.modify({
        id: photoId,
      });
      if (screen === "Feed") {
        refresh();
      } else {
        navigation.goBack();
      }
    }
  };
  const [deleteFeedMutation] = useMutation(DELETE_FEED_MUTATION, {
    update: deleteFeed,
  });

  // 공지사항 삭제
  const deleteNotice = (cache: any, result: any) => {
    const {
      data: {
        deleteNotice: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const noticeId = `Notice:${id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: noticeId });
      cache.modify({
        id: noticeId,
      });
      if (screen === "Notice") {
        navigation.navigate("Tabs");
      } else {
        navigation.goBack();
      }
    }
  };

  const [deleteNoticeMuattion] = useMutation(DELETE_NOTICE_MUTATION, {
    update: deleteNotice,
  });

  // 게시판 삭제
  const deleteBoard = (cache: any, result: any) => {
    const {
      data: {
        deleteBoard: { ok, error },
      },
    } = result;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      const boardId = `Board:${id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: boardId });
      cache.modify({
        id: boardId,
      });
      if (screen === "Board") {
        navigation.navigate("Tabs");
      } else {
        navigation.goBack();
      }
    }
  };

  const [deleteBoardMuattion] = useMutation(DELETE_BOARD_MUTATION, {
    update: deleteBoard,
  });

  const DeleteItem = ({ id, screen }: any) => {
    Alert.alert("정말 삭제하시겠습니까?", "", [
      {
        text: "네",
        onPress: () => {
          if (screen === "Feed" || screen === "FeedDetail") {
            deleteFeedMutation({
              variables: {
                id,
              },
            });
          } else if (screen === "Notice" || screen === "NoticeDetail") {
            deleteNoticeMuattion({
              variables: {
                id,
              },
            });
          } else if (screen === "Board" || screen === "BoardDetail") {
            deleteBoardMuattion({
              variables: {
                id,
              },
            });
          }
        },
      },
      { text: "아니오", onPress: () => {} },
    ]),
      { cancelable: true };
  };

  return (
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
          {isMine ? (
            <FeedMenu
              style={{ margin: 5 }}
              onPress={() => {
                DeleteItem({ id, screen });
              }}
            >
              <FeedMenuText style={{ color: "red" }}>삭제하기</FeedMenuText>
            </FeedMenu>
          ) : null}
          {!isMine && isLoggedIn ? (
            <FeedMenu
              style={{ margin: 5 }}
              onPress={() => {
                toggleBlock(userId);
              }}
            >
              <FeedMenuText style={{ color: "red" }}>차단하기</FeedMenuText>
            </FeedMenu>
          ) : null}
          <FeedMenu
            style={{ margin: 5 }}
            onPress={() => {
              toggleModal();
              navigation.navigate("Report", { id, screen });
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
  );
}
