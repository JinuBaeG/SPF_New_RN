import { gql, useMutation, useQuery } from "@apollo/client";
import { USER_FRAGMENT_NATIVE } from "../fragments";
import styled from "styled-components/native";
import { Alert, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const FIND_ACCOUNT_FROM_PHONENUMBER = gql`
  query findAccountFromPhoneNumber($phoneNumber: String) {
    findAccountFromPhoneNumber(phoneNumber: $phoneNumber) {
      ...UserFragmentNative
      googleConnect
      kakaoConnect
      appleConnect
      naverConnect
    }
  }
  ${USER_FRAGMENT_NATIVE}
`;

const CHNAGE_PASSWORD_MUTATION = gql`
  mutation changePassword($id: Int!, $password: String!) {
    changePassword(id: $id, password: $password) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  padding-top: 40px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 8px;
`;

const UserName = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const DefaultText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const PasswordInputContainer = styled.View`
  margin-top: 8px;
`;

const PasswordInput = styled.TextInput<{ isDark: Boolean }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.whiteColor};
  border: 1px solid ${(props) => props.theme.grayColor};
  margin-bottom: 4px;
`;

const PasswordChangeBtn = styled.TouchableOpacity<{ pwComplete: Boolean }>`
  padding: 8px;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grayColor};
  background-color: ${(props) => (props.pwComplete ? "#000000" : "#cccccc")}
  border-radius: 8px;1
`;

export default function ChangePassword({ navigation, route }: any) {
  const phoneNumber = route.params.phoneNumber;
  const isDark = useColorScheme() === "dark";
  const { data } = useQuery(FIND_ACCOUNT_FROM_PHONENUMBER, {
    variables: {
      phoneNumber,
    },
  });

  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [pwComplete, setPwComplete] = useState(false);

  const passwordCheck = () => {
    if (password.length > 0) {
      if (checkPassword.length > 0) {
        if (password === checkPassword) {
          setPwComplete(true);
          setValue("password", password);
        } else if (password !== checkPassword) {
          setPwComplete(false);
          setValue("password", "");
        }
      }
    }
  };

  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const onCompleted = (data: any) => {
    const {
      changePassword: { ok, error },
    } = data;

    if (ok) {
      if (route.params.previousScreen === "Welcome") {
        Alert.alert("변경 완료되었습니다.", "로그인 초기화면으로 이동합니다.");
        navigation.navigate("Welcome");
      } else if (route.params.previousScreen === "EditProfile") {
        Alert.alert("변경 완료되었습니다.", "정보 변경 화면으로 이동합니다.");
        navigation.navigate("EditProfile");
      }
    }
  };
  const [changePasswordMutation, { loading }] = useMutation(
    CHNAGE_PASSWORD_MUTATION,
    {
      onCompleted,
    }
  );

  const onValid = ({ id, password }: any) => {
    changePasswordMutation({
      variables: {
        id: parseInt(id),
        password,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: "비밀번호 변경",
    });
  }, []);

  useEffect(() => {
    passwordCheck();
  }, [password, checkPassword]);

  useEffect(() => {
    register("id");
    register("password");
  }, [register]);

  useEffect(() => {
    setValue("id", data?.findAccountFromPhoneNumber?.id);
  }, [data]);

  return (
    <Container>
      <UserContainer>
        <UserName>{data?.findAccountFromPhoneNumber?.username}</UserName>
        <DefaultText>님 안녕하세요!</DefaultText>
      </UserContainer>
      <DefaultText>아래에 변경하실 비밀번호를 입력해주세요!</DefaultText>
      <PasswordInputContainer>
        <PasswordInput
          secureTextEntry={true}
          placeholder="비밀번호"
          placeholderTextColor={isDark ? "rgba(0, 0, 0, 0.8)" : "#888888"}
          returnKeyType="done"
          isDark={isDark}
          onChangeText={(text: string) => setPassword(text)}
        />
        <PasswordInput
          secureTextEntry={true}
          placeholder="비밀번호 확인"
          placeholderTextColor={isDark ? "rgba(0, 0, 0, 0.8)" : "#888888"}
          returnKeyType="done"
          isDark={isDark}
          onChangeText={(text: string) => setCheckPassword(text)}
        />
        <PasswordChangeBtn
          onPress={handleSubmit(onValid)}
          pwComplete={pwComplete}
          disabled={!pwComplete}
        >
          {pwComplete ? (
            <DefaultText style={{ color: "white" }}>비밀번호 변경</DefaultText>
          ) : (
            <DefaultText style={{ color: "white" }}>
              비밀번호을 확인해주세요
            </DefaultText>
          )}
        </PasswordChangeBtn>
      </PasswordInputContainer>
    </Container>
  );
}
