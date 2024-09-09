import React, { RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../components/auth/AuthShared";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
  logUserIn,
  onAppleButtonPress,
  onPressGoogleBtn,
  signInWithKakao,
} from "../apollo";
import { Alert, Platform, useColorScheme } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from "@react-native-seoul/naver-login";

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

export default function Login({ navigation, route: { params } }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: params?.password,
      email: params?.email,
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

  const [naverAuth, setNaverAuth] = useState(false);
  const [naverProfile, setNaverProfile] = useState(false);

  const [success, setSuccessResponse] =
    useState<NaverLoginResponse["successResponse"]>();
  const [failure, setFailureResponse] =
    useState<NaverLoginResponse["failureResponse"]>();
  const [getProfileRes, setGetProfileRes] = useState<GetProfileResponse>();

  const onNaverLogin = async () => {
    const { failureResponse, successResponse } = await NaverLogin.login(
      initials
    );

    setSuccessResponse(successResponse);
    setFailureResponse(failureResponse);
    setNaverAuth(!naverAuth);
  };

  const getNaverProfile = async () => {
    try {
      const profileResult = await NaverLogin.getProfile(success!.accessToken);
      setGetProfileRes(profileResult);
    } catch (e) {
      setGetProfileRes(undefined);
    }
    setNaverProfile(!naverProfile);
  };

  useEffect(() => {
    if (naverAuth) {
      getNaverProfile();
    }
  }, [naverAuth]);

  useEffect(() => {
    if (naverProfile) {
      naverLogin();
    }
  }, [naverProfile]);

  const naverLogin = () => {
    let email, uid, token;
    email = getProfileRes?.response.email;
    uid = getProfileRes?.response.id;

    loginCheckMutation({
      variables: {
        email,
        uid,
        interlock: "naver",
      },
    });
  };

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
      <TextInput
        value={watch("email")}
        placeholder="이메일"
        placeholderTextColor={
          isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        }
        isDark={isDark}
        keyboardType="email-address"
        returnKeyType="next"
        lastOne={false}
        autoCapitalize="none"
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("email", text)}
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor={
          isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        }
        isDark={isDark}
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <AuthButton
        text={"로그인"}
        disabled={!watch("email") || !watch("password")}
        loading={loading}
        onPress={handleSubmit(onValid)}
        separate={"normal"}
      />
      <AuthButton
        text={"네이버로 로그인"}
        loading={loading}
        onPress={() => onNaverLogin()}
        style={{ width: "100%" }}
        separate={"naver"}
      />
      <AuthButton
        text={"카카오로 로그인"}
        loading={loading}
        onPress={() => KakaoLogin()}
        separate={"kakao"}
      />
      {platform === "ios" ? (
        <AuthButton
          text={"애플로 로그인"}
          loading={loading}
          onPress={() => {
            AppleLogin();
          }}
          separate={"apple"}
        />
      ) : null}

      <AuthButton
        text={"구글로 로그인"}
        loading={loading}
        onPress={() => GoogleLogin()}
        style={{ width: "100%" }}
        separate={"google"}
      />
    </AuthLayout>
  );
}
