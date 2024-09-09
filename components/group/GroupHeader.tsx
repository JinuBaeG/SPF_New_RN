import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Platform, useColorScheme } from "react-native";

const JOIN_GROUP_MUTATION = gql`
  mutation joinGroup($id: Int!) {
    joinGroup(id: $id) {
      ok
      error
    }
  }
`;

const WITHDRAW_GROUP_MUTATION = gql`
  mutation withdrawGroup($id: Int!) {
    withdrawGroup(id: $id) {
      ok
      error
    }
  }
`;

const GroupHeaderContainer = styled.View`
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const GroupHeaderWrap = styled.View`
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.blackColor};
  position: relative;
`;

const GroupHeaderImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid black;
  position: absolute;
  top: 80px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const GroupHeaderInfoContainer = styled.View`
  height: 150px;
  padding: 16px;
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const GroupHeaderInfoWrap = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
`;

const GroupHeaderInfoTitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const GroupHeaderTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const GroupHeaderEvent = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupHeaderPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.textColor};
  margin: 4px;
`;

const GroupHeaderMember = styled.View`
  flex-direction: row;
`;

const GroupHeaderUserCount = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupHeaderActiveArea = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const GroupHeaderDisc = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const GroupHeaderTagWrap = styled.View`
  flex-direction: row;
`;

const GroupHeaderButtonWrap = styled.View``;

const GroupHeaderButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const GroupHeaderButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.whiteColor};
`;

const GroupHeaderEditButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.whiteColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const GroupHeaderEditButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.greenActColor};
`;

export default function GroupHeader({ navigation, refresh, groupData }: any) {
  const updateJoinGroup = (cache: any, result: any) => {
    const {
      data: {
        joinGroup: { ok },
      },
    } = result;
    if (ok) {
      const joinId = `Group:${groupData.id}`;
      cache.modify({
        id: joinId,
        fields: {
          isJoining(prev: boolean) {
            return !prev;
          },
        },
      });
    }
  };

  const [joinGroupMutation, { loading }] = useMutation(JOIN_GROUP_MUTATION, {
    update: updateJoinGroup,
  });

  const { handleSubmit } = useForm();

  const onValid = async () => {
    joinGroupMutation({
      variables: {
        id: groupData.id,
      },
    });
  };

  const [withdrawGroupMutation, { loading: withdrawLoading }] = useMutation(
    WITHDRAW_GROUP_MUTATION,
    {
      onCompleted: refresh,
    }
  );

  const onWithdraw = async () => {
    withdrawGroupMutation({
      variables: {
        id: groupData.id,
      },
    });
  };

  const ContainerFlex = Platform.OS === "ios" ? 0.5 : 0.75;
  const isDark = useColorScheme() === "dark";

  return (
    <GroupHeaderContainer style={{ flex: 0.5 }}>
      <GroupHeaderWrap>
        <GroupHeaderImage
          source={
            groupData.groupImage !== null
              ? { uri: groupData.groupImage.imagePath }
              : {}
          }
        />
      </GroupHeaderWrap>
      <GroupHeaderInfoContainer>
        <GroupHeaderInfoWrap>
          <GroupHeaderInfoTitleWrap>
            <GroupHeaderTitle>{groupData.name}</GroupHeaderTitle>
            <GroupHeaderEvent>{groupData.sportsEvent}</GroupHeaderEvent>
            <GroupHeaderPoint />
            <GroupHeaderMember>
              <Ionicons
                name="people-outline"
                size={12}
                color={isDark ? "white" : "black"}
              />
              <GroupHeaderUserCount>
                {groupData.userCount} / {groupData.maxMember}
              </GroupHeaderUserCount>
            </GroupHeaderMember>
          </GroupHeaderInfoTitleWrap>
          <GroupHeaderActiveArea>{groupData.activeArea}</GroupHeaderActiveArea>
          <GroupHeaderDisc>{groupData.discription}</GroupHeaderDisc>
          <GroupHeaderTagWrap></GroupHeaderTagWrap>
        </GroupHeaderInfoWrap>
        {loading ? (
          <GroupHeaderButton>
            <ActivityIndicator color="white" />
          </GroupHeaderButton>
        ) : groupData.isPresident ? (
          <GroupHeaderButtonWrap>
            <GroupHeaderEditButton
              onPress={() => navigation.push("EditGroup", { groupData })}
            >
              <GroupHeaderEditButtonText>정보수정</GroupHeaderEditButtonText>
            </GroupHeaderEditButton>
            <GroupHeaderButton
              onPress={() =>
                navigation.push("JoinConfirm", { id: groupData.id })
              }
            >
              <GroupHeaderButtonText>신청확인</GroupHeaderButtonText>
            </GroupHeaderButton>
          </GroupHeaderButtonWrap>
        ) : groupData.isJoin ? (
          <GroupHeaderButton onPress={handleSubmit(onWithdraw)}>
            <GroupHeaderButtonText>탈퇴하기</GroupHeaderButtonText>
          </GroupHeaderButton>
        ) : groupData.isJoining ? (
          <GroupHeaderButton onPress={handleSubmit(onValid)}>
            <GroupHeaderButtonText>가입취소</GroupHeaderButtonText>
          </GroupHeaderButton>
        ) : (
          <GroupHeaderButton onPress={handleSubmit(onValid)}>
            <GroupHeaderButtonText>가입하기</GroupHeaderButtonText>
          </GroupHeaderButton>
        )}
      </GroupHeaderInfoContainer>
    </GroupHeaderContainer>
  );
}
