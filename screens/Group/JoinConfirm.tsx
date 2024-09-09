import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, useColorScheme } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

const JOIN_GROUP_QUERY = gql`
  query seeJoin($groupId: Int!) {
    seeJoin(groupId: $groupId) {
      id
      user {
        id
        username
        avatar
      }
      group {
        id
      }
    }
  }
`;

const JOIN_DENIED_MUTATION = gql`
  mutation joinDenied(
    $id: Int!
    $userId: Int!
    $groupId: Int!
    $username: String
  ) {
    joinDenied(
      id: $id
      userId: $userId
      groupId: $groupId
      username: $username
    ) {
      ok
      error
    }
  }
`;

const JOIN_ACCESS_MUTATION = gql`
  mutation joinAccess(
    $id: Int!
    $userId: Int!
    $groupId: Int!
    $username: String
  ) {
    joinAccess(
      id: $id
      userId: $userId
      groupId: $groupId
      username: $username
    ) {
      ok
      error
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

export default function JoinConfirm({ navigation, route }: any) {
  // 화면 초기 설정
  useEffect(() => {
    refresh();
    navigation.setOptions({
      title: "가입신청자",
    });
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, refetch } = useQuery(JOIN_GROUP_QUERY, {
    variables: {
      groupId: route.params.id,
    },
    fetchPolicy: "cache-and-network",
  });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const isDark = useColorScheme() === "dark";

  const renderItem = ({ item: join }: any) => {
    return (
      <InfoContainer>
        <UserWrap
          onPress={() =>
            goToProfile({ username: join.user.username, id: join.user.id })
          }
        >
          <Avatar
            resizeMode="cover"
            source={
              join.user.avatar === null
                ? isDark
                  ? require(`../../assets/emptyAvatar_white.png`)
                  : require(`../../assets/emptyAvatar.png`)
                : { uri: join.user.avatar }
            }
          />
          <Username>{join.user.username}</Username>
        </UserWrap>
        <ButtonWrap>
          <AccessButton
            onPressIn={() =>
              pressAccess({
                id: join.id,
                userId: join.user.id,
                username: join.user.username,
                groupId: join.group.id,
              })
            }
            onPressOut={handleSubmit(onAccess)}
          >
            <Ionicons name="checkmark" size={16} color={"#01aa73"} />
          </AccessButton>
          <DeniedButton
            onPressIn={() =>
              pressDenied({
                id: join.id,
                userId: join.user.id,
                username: join.user.username,
                groupId: join.group.id,
              })
            }
            onPressOut={handleSubmit(onDenied)}
          >
            <Ionicons name="close" size={16} color={"#ff0000"} />
          </DeniedButton>
        </ButtonWrap>
      </InfoContainer>
    );
  };

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    refresh();
    register("id");
    register("userId");
    register("username");
    register("groupId");
  }, [register]);

  const [joinDeniedMutation, { loading: denideLoading }] = useMutation(
    JOIN_DENIED_MUTATION,
    { onCompleted: refresh }
  );

  const pressDenied = ({ id, userId, groupId, username }: any) => {
    setValue("id", parseInt(id));
    setValue("userId", parseInt(userId));
    setValue("username", username);
    setValue("groupId", groupId);
  };

  const onDenied = async ({ id, userId, groupId, username }: any) => {
    joinDeniedMutation({
      variables: {
        id,
        userId,
        groupId,
        username,
      },
    });
  };

  const [joinAccessMutation, { loading: accessLoading }] = useMutation(
    JOIN_ACCESS_MUTATION,
    { onCompleted: refresh }
  );

  const pressAccess = ({ id, userId, groupId, username }: any) => {
    setValue("id", parseInt(id));
    setValue("userId", parseInt(userId));
    setValue("username", username);
    setValue("groupId", groupId);
  };

  const onAccess = async ({ id, userId, groupId, username }: any) => {
    joinAccessMutation({
      variables: {
        id,
        userId,
        groupId,
        username,
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
    <ScreenLayout loading={loading}>
      <FlatList
        data={data?.seeJoin}
        keyExtractor={(join) => "" + join.id}
        refreshing={refreshing}
        onRefresh={refresh}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
