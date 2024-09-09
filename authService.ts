import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, logout, getProfile, KakaoProfile } from "@react-native-seoul/kakao-login";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { appleAuth, AppleRequestResponse } from "@invertase/react-native-apple-authentication";
import { isLoggedInVar, tokenVar } from "./apollo";

const TOKEN = "token";
const PLATFORM = "platform";

export const onAppleButtonPress = async (): Promise<{ uid: string; token: string | null } | undefined> => {
  const appleAuthRequestResponse: AppleRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

  if (credentialState === appleAuth.State.AUTHORIZED) {
    const { user: uid, identityToken: token } = appleAuthRequestResponse;
    return { uid, token };
  }
};

export const onPressGoogleBtn = async (): Promise<{ email: string | null; uid: string | null; token: string | null }> => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken: token = null } = await GoogleSignin.signIn();

  const googleCredential = auth.GoogleAuthProvider.credential(token!);
  const res = await auth().signInWithCredential(googleCredential);
  const { email, uid } = res.user;

  return { email, uid, token };
};

export const signInWithKakao = async (): Promise<{ email: string | null; uid: string; token: string } | undefined> => {
  try {
    const kakaoToken = await login();
    const kakaoProfile: KakaoProfile = await getProfile();
    const token = kakaoToken.accessToken;
    const { email, id } = kakaoProfile;
    const uid = id.toString(); // 숫자를 문자열로 변환

    return { email, uid, token };
  } catch (err) {
    console.error("login err", err);
  }
};

export const signOutWithKakao = async (): Promise<void> => {
  try {
    await logout();
    await AsyncStorage.removeItem(TOKEN);
    await AsyncStorage.removeItem(PLATFORM);
    isLoggedInVar(false);
    tokenVar(null);
  } catch (err) {
    console.error("signOut error", err);
  }
};

export const logUserIn = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};
