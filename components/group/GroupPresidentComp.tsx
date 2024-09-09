import React from "react";
import styled from "styled-components/native";

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

export function GroupPresidentComp({
  navigation,
  route,
  setValue,
  groupPresident,
  users,
}: any) {
  if (route.params.newPresident) {
    setValue("groupPresident", route.params.newPresident);
  } else {
    groupPresident = {
      id: parseInt(groupPresident.id),
      user: {
        id: parseInt(groupPresident.user.id),
        username: groupPresident.user.username,
      },
    };
    setValue("groupPresident", groupPresident);
  }

  return (
    <Upload
      onPress={() => {
        navigation.navigate("GroupUsers", {
          previousScreen: route.name,
          users: users,
          groupPresident: groupPresident,
        });
      }}
    >
      <TextLabel>그룹대표</TextLabel>
      <UploadText>
        {route.params.newPresident !== undefined
          ? route.params.newPresident.user.username
          : groupPresident !== undefined
          ? groupPresident.user.username
          : null}
      </UploadText>
    </Upload>
  );
}
