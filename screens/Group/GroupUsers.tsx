import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";

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
  color: ${(props) => props.theme.blackColor};
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

export function GroupUsers({ navigation, route }: any) {
  // 화면 초기 설정
  const [loading, setLoading] = useState(true);
  const [newPresident, setNewPresident] = useState<any | undefined>({});
  let groupPresident = route.params.groupPresident;
  const users = route.params.users;
  useEffect(() => {
    navigation.setOptions({
      title: "그룹 대표 변경",
    });
    setLoading(false);
  }, []);

  const goToProfile = ({ username, id }: any) => {
    navigation.navigate("Profile", {
      username: username,
      id: id,
    });
  };

  const changePresident = ({ username, id }: any) => {
    const newPresident = {
      id: groupPresident.id,
      user: {
        id: parseInt(id),
        username,
      },
    };
    setNewPresident(newPresident);
  };

  const goToEditGroup = () => {
    navigation.navigate(route.params.previousScreen, { newPresident });
  };

  const renderItem = ({ item: users }: any) => {
    return (
      <InfoContainer>
        <UserWrap
          onPress={() =>
            goToProfile({ username: users.username, id: users.id })
          }
        >
          <Avatar source={{ uri: users.avatar }} />
          <Username>{users.username}</Username>
        </UserWrap>
        {groupPresident.user.id !== parseInt(users.id) ? (
          <ButtonWrap>
            <AccessButton
              onPressIn={() =>
                changePresident({ username: users.username, id: users.id })
              }
              onPressOut={() => goToEditGroup()}
            >
              <Ionicons name="checkmark" size={16} color={"#01aa73"} />
            </AccessButton>
          </ButtonWrap>
        ) : null}
      </InfoContainer>
    );
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={users}
        keyExtractor={(users) => "" + users.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
