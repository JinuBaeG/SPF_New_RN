import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { useForm } from "react-hook-form";
import {
  logUserIn,
  onAppleButtonPress,
  onPressGoogleBtn,
  signInWithKakao,
} from "../authService";
import { gql, useMutation } from "@apollo/client";
import {
  ConfigParam,
  getProfile,
  NaverLogin,
} from "@react-native-seoul/naver-login";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const LOG_IN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

const LOGIN_CHECK = gql`
  mutation loginCheck(
    $uid: String
    $token: String
    $email: String
    $interlock: String
  ) {
    loginCheck(uid: $uid, token: $token, email: $email, interlock: $interlock) {
      ok
      token
      uid
      email
      interlock
    }
  }
`;

const iosKeys = {
  consumerKey: `${process.env.NAVER_LOGIN_API_KEY}`,
  consumerSecret: `${process.env.NAVER_LOGIN_API_SECRET_KEY}`,
  appName: "플레이인어스",
  serviceUrlScheme: "com.funnyground.playinus.reactnative", // only for iOS
};

const androidKeys = {
  consumerKey: `${process.env.NAVER_LOGIN_API_KEY}`,
  consumerSecret: `${process.env.NAVER_LOGIN_API_SECRET_KEY}`,
  appName: "플레이인어스",
};

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

const LoginLink = styled.Text`
  color: ${(props: { theme: { textColor: any } }) => props.theme.textColor};
  font-weight: 600;
  text-align: center;
`;

const LoginLinkBtn = styled.TouchableOpacity`
  background-color: "#01aa73";
  padding: 12px 8px;
  border-radius: 4px;
  width: 100%;
  border: 1px solid #ccc;
`;

const FindAccountBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
`;

const FindAccountText = styled.Text`
  color: ${(props: { theme: { greenActColor: any } }) => props.theme.greenActColor};
  font-weight: 600;
  text-align: center;
  padding: 8px;
  text-align: left;
`;

export default function Welcome({ navigation, route }: any) {
  const goToCreateAccount = () => {
    navigation.navigate("CreateAccount");
  };
  const goToLogin = () => {
    navigation.navigate("Login");
  };
  const goToFindAccount = () => {
    navigation.navigate("FindAccount", {
      infoText: "계정을 찾기 위해 휴대전화번호를 입력해주세요.",
      previousScreen: route.name,
    });
  };

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: route.params?.password,
      email: route.params?.email,
    },
  });

  const passwordRef: React.MutableRefObject<null> = useRef(null);

  const onCompleted = async (data: any) => {
    const {
      login: { ok, token, error },
    } = data;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      await logUserIn(token);
      navigation.reset({ routes: [{ name: "Tabs" }] });
    }
  };

  const [loginMutation, { loading }] = useMutation(LOG_IN_MUTATION, {
    onCompleted,
  });

  const onLoginCheckCompleted = async (data: any) => {
    const {
      loginCheck: { ok, uid, email, token, interlock },
    } = data;

    if (ok) {
      await logUserIn(token);
      navigation.reset({ routes: [{ name: "Tabs" }] });
    } else {
      navigation.navigate("CreateAccount", { uid, email, interlock });
    }
  };

  const [loginCheckMutation] = useMutation(LOGIN_CHECK, {
    onCompleted: onLoginCheckCompleted,
  });

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  const onValid = (data: any) => {
    if (!loading) {
      loginMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  const [naverToken, setNaverToken] = useState<any | null>(null);

  const naverLogin = (props: any | undefined): Promise<any | null> => {
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, (err, token) => {
        if (err) {
          console.log("Naver Login Error:", err);
          reject(err);
          return;
        }
        console.log(`\n\n  Token is fetched  :: ${token?.accessToken} \n\n`);
        setNaverToken(token);
        resolve(token);
      });
    });
  };

  const naverLogout = () => {
    NaverLogin.logout();
    setNaverToken(null);
  };

  const getUserProfile = async () => {
    if (!naverToken) {
      Alert.alert("로그인 필요", "네이버 로그인이 필요합니다.");
      return;
    }

    const profileResult = await getProfile(naverToken.accessToken);
    if (profileResult.resultcode === "024") {
      Alert.alert("로그인 실패", profileResult.message);
      return;
    }
    console.log("profileResult", profileResult);
  };

  useEffect(() => {
    if (naverToken) {
      getUserProfile();
    }
  }, [naverToken]);

  const KakaoLogin = async () => {
    const { email, uid, token }: any = await signInWithKakao();

    loginCheckMutation({
      variables: {
        email,
        uid: uid.toString(),
        token,
        interlock: "kakao",
      },
    });
  };

  const GoogleLogin = async () => {
    const { email, uid, token }: any = await onPressGoogleBtn();

    loginCheckMutation({
      variables: {
        email,
        uid: uid.toString(),
        token,
        interlock: "google",
      },
    });
  };

  const AppleLogin = async () => {
    const { email, uid, token }: any = await onAppleButtonPress();

    loginCheckMutation({
      variables: {
        email,
        uid,
        token,
        interlock: "apple",
      },
    });
  };

  useEffect(() => {
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "126129061327-ee1846j62rtbip9ocbc7acnmmimdk0tm.apps.googleusercontent.com",
    });
  }, []);

  const isDark = useColorScheme() === "dark";

  const platform = Platform.OS;

  return (
    <AuthLayout>
      <AuthButton
        separate={"normal"}
        onPress={goToCreateAccount}
        disabled={false}
        text={"회원가입"}
      />
      <AuthButton
        text={"네이버로 가입"}
        loading={loading}
        onPress={() => naverLogin(initials)}
        style={{ width: "100%" }}
        separate={"naver"}
      />
      <AuthButton
        text={"카카오로 가입"}
        loading={loading}
        onPress={() => KakaoLogin()}
        separate={"kakao"}
      />
      {platform === "ios" ? (
        <AuthButton
          text={"애플로 가입"}
          loading={loading}
          onPress={() => {
            AppleLogin();
          }}
          separate={"apple"}
        />
      ) : null}

      <AuthButton
        text={"구글로 가입"}
        loading={loading}
        onPress={() => GoogleLogin()}
        style={{ width: "100%" }}
        separate={"google"}
      />
      <LoginLinkBtn onPress={goToLogin}>
        <LoginLink>로그인</LoginLink>
      </LoginLinkBtn>
      <FindAccountBtn onPress={goToFindAccount}>
        <FindAccountText>계정 찾기</FindAccountText>
      </FindAccountBtn>
    </AuthLayout>
  );
}
