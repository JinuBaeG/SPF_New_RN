import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components/native";
import { Alert, Dimensions, Platform, useColorScheme } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import RNRestart from "react-native-restart";
import DissmissKeyboard from "../../components/DismissKeyboard";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($password: String) {
    deleteUser(password: $password) {
      ok
      error
    }
  }
`;

const Container = styled.View`
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

const MenuList = styled.View<{ flexHeight: any }>`
  flex: ${(props) => props.flexHeight};
  background-color: ${(props) => props.theme.whiteColor};
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
  width: 100%;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 8px;
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export default function DeleteUser({ id }: any) {
  const isDark = useColorScheme() === "dark";
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const deviceWidth = Dimensions.get("window").width;
  const flexHeight = Platform.OS === "ios" ? "0.2" : "0.3";
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  const toggleModal = () => setOpen(!open);
  const navigation = useNavigation<PhotoCompNavigationProps>();

  const deleteUser = (cache: any, result: any) => {
    const {
      data: {
        deleteUser: { ok, error },
      },
    } = result;

    if (ok) {
      Alert.alert("탈퇴하였습니다.", "플인을 이용해 주셔서 감사합니다.", [
        {
          text: "확인",
          onPress: () => {
            const userId = `User:${id}`;
            // 삭제된 댓글 캐시에서 삭제
            cache.evict({ id: userId });
            cache.evict({ id: "ROOT_QUERY" });
            cache.modify({
              id: userId,
            });
            cache.gc();
            RNRestart.Restart();
          },
        },
      ]);
    } else {
      Alert.alert(error);
    }
  };

  const [deleteUserMutation, { data }] = useMutation(DELETE_USER_MUTATION, {
    update: deleteUser,
  });

  const DeleteAccount = (password: string) => {
    deleteUserMutation({
      variables: {
        password,
      },
    });
  };

  const DeleteCheck = () => {
    Alert.alert("정말로 삭제하시겠습니까?", "모든 데이터가 삭제됩니다.", [
      { text: "아니오", style: "cancel" },
      {
        text: "네",
        onPress: () => {
          setOpen(!open);
        },
      },
    ]);
  };

  return (
    <DissmissKeyboard>
      <Container>
        <Upload
          onPress={() => {
            DeleteCheck();
          }}
        >
          <TextLabel style={{ color: "red" }}>계정 삭제</TextLabel>
        </Upload>
        <Modal
          isVisible={open}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
        >
          <MenuList flexHeight={flexHeight}>
            <TextInput
              secureTextEntry
              placeholder="삭제 하시려면 비밀번호를 입력해 주세요."
              placeholderTextColor="rgba(0,0,0,0.2)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              maxLength={20}
            />
            <FeedMenu
              style={{ margin: 5 }}
              onPress={() => {
                DeleteAccount(password);
              }}
            >
              <FeedMenuText style={{ color: "red" }}>삭제하기</FeedMenuText>
            </FeedMenu>
            <FeedMenu style={{ margin: 5 }} onPress={toggleModal}>
              <FeedMenuText>닫기</FeedMenuText>
            </FeedMenu>
          </MenuList>
        </Modal>
      </Container>
    </DissmissKeyboard>
  );
}
