import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../../apollo";

type UploadCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "SharedWriteButton"
>;

const WriteButtonContainer = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${(props) => props.theme.greenActColor};
  align-items: center;
  justify-content: center;
`;

export default function SharedWriteButton({ route: nRoute }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const route = useRoute();
  const navigation = useNavigation<UploadCompNavigationProps>();
  const screenName = route.name;

  const onPress = () => {
    if (!isLoggedIn) {
      navigation.navigate("LoggedOutNav");
    } else {
      if (screenName === "TabFeed") {
        return navigation.navigate("AddFeed", { screenName });
      } else if (screenName === "TabGroup") {
        return navigation.navigate("AddGroup", { screenName });
      } else if (screenName === "TabTutor") {
        return navigation.navigate("AddTutor", { screenName });
      }
    }
  };

  return (
    <WriteButtonContainer onPress={() => onPress()}>
      <Ionicons name={"ios-add"} size={28} color="white" />
    </WriteButtonContainer>
  );
}
