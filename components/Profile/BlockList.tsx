import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { Ionicons } from "@expo/vector-icons";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const UNBLOCK_MUTATION = gql`
  mutation unBlock($id: Int) {
    unBlock(id: $id) {
      ok
    }
  }
`;

const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const UserWrap = styled.TouchableOpacity`
  flex-direction: row;
  padding: 4px 0;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid black;
  margin-right: 16px;
`;

const Username = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const ButtonWrap = styled.View`
  flex-direction: row;
  padding: 4px 0;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const AccessButton = styled.TouchableOpacity`
  margin: 4px;
  padding: 4px;
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
`;

const DeniedButton = styled.TouchableOpacity`
  margin: 4px;
  padding: 4px;
  border: 1px solid #ff0000;
  border-radius: 8px;
`;

export default function BlockList(block: any) {
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation<PhotoCompNavigationProps>();

  const updateUnblock = (cache: any, result: any) => {
    const {
      data: {
        unBlock: { ok },
      },
    } = result;

    if (ok) {
      const blockId = `BlockUser:${block.id}`;

      cache.evict({ id: blockId });
      cache.gc();
    }
  };

  const [unBlockMutation] = useMutation(UNBLOCK_MUTATION, {
    update: updateUnblock,
  });

  const unBlock = (id: any) => {
    unBlockMutation({
      variables: {
        id,
      },
    });
  };

  const goToProfile = ({ username, id }: any) => {
    navigation.navigate("Profile", {
      username: username,
      id: id,
    });
  };

  return (
    <InfoContainer>
      <UserWrap
        onPress={() =>
          goToProfile({
            username: block.blockedBy.username,
            id: block.blockedBy.id,
          })
        }
      >
        <Avatar
          resizeMode="cover"
          source={
            block.blockedBy.avatar === null
              ? isDark
                ? require(`../../assets/emptyAvatar_white.png`)
                : require(`../../assets/emptyAvatar.png`)
              : { uri: block.blockedBy.avatar }
          }
        />
        <Username>{block.blockedBy.username}</Username>
      </UserWrap>
      <ButtonWrap>
        <DeniedButton
          onPress={() => {
            unBlock(block.id);
          }}
        >
          <Ionicons name="close" size={16} color={"#ff0000"} />
        </DeniedButton>
      </ButtonWrap>
    </InfoContainer>
  );
}
