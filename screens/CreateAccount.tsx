import { gql, useMutation, useQuery } from "@apollo/client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import styled from "styled-components/native";
import axios from "axios";
import { LOCAL_URL, OPER_URL } from "@env";
import Modal from "react-native-modal";
import RenderHTML from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $phoneNumber: String!
    $username: String!
    $email: String!
    $password: String!
    $interlock: String
    $uid: String
    $privacyAccess: Boolean
    $usetermAccess: Boolean
  ) {
    createAccount(
      phoneNumber: $phoneNumber
      username: $username
      email: $email
      password: $password
      interlock: $interlock
      uid: $uid
      privacyAccess: $privacyAccess
      usetermAccess: $usetermAccess
    ) {
      ok
      error
    }
  }
`;

const PHONE_CHECK = gql`
  mutation checkPhone($phoneNumber: String) {
    checkPhone(phoneNumber: $phoneNumber) {
      ok
      error
    }
  }
`;

const EMAIL_CHECK = gql`
  mutation checkEmail($email: String) {
    checkEmail(email: $email) {
      ok
      error
    }
  }
`;

const SEE_CONFIG_QUERY = gql`
  query seeConfig {
    seeConfig {
      id
      privacyTerms
      gpsTerms
      useTerms
    }
  }
`;

const PhoneCheck = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const PhoneCheckBtn = styled.TouchableOpacity<{ certified: Boolean }>`
  padding: 16px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  width: 36%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  opacity: ${(props) => (props.certified ? "0.5" : "1")};
`;

const PhoneCheckText = styled.Text`
  text-align: center;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const AccessContainer = styled.View`
  flex: 0.5;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
`;

const AccessTextContainer = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.greenActColor};
`;

const AccessTextTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => props.theme.whiteColor};
`;

const AccessTextContents = styled.ScrollView`
  height: 25%;
  border-radius: 8px;
  padding: 8px;
  background-color: ${(props) => props.theme.whiteColor};
`;

const AccessButton = styled.TouchableOpacity`
  margin-top: 8px;
  flex-direction: row;
`;

const AccessButtonText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-weight: 600;
  margin-left: 4px;
`;

const AlertText = styled.Text`
  color: red;
  margin: 4px 0;
`;

export default function CreateAccount({ navigation, route: { params } }: any) {
  // 회원가입 완료 후 처리
  const onCompleted = (data: any) => {
    const {
      createAccount: { ok, error },
    } = data;
    const { email, password } = getValues();

    if (ok) {
      navigation.navigate("Login", { email, password });
    }

    if (error) {
      alert(error);
    }
  };

  // 회원가입을 위한 기본 정보 입력 세팅
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: params?.email,
      phoneNumber: "",
      interlock: "",
      uid: "",
      privacyAccess: false,
      usetermAccess: false,
    },
  });

  // 회원가입 처리
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );

  // 가입한 휴대전화번호인지 체크
  const onCheckPhoneCompleted = (data: any) => {
    const {
      checkPhone: { ok, error },
    } = data;
    console.log(ok, error);
    if (ok) {
      makeCertifedNumber();
      setCertified(!certified);
      setActiveCertified(true);
    } else {
      Alert.alert(error);
    }
  };

  // 휴대전화번호 체크 처리
  const [checkPhoneMutation, { loading: checkPhoneLoading }] = useMutation(
    PHONE_CHECK,
    {
      onCompleted: onCheckPhoneCompleted,
    }
  );
  const phoneNumberRef: React.MutableRefObject<any> = useRef(null);
  const emailRef: React.MutableRefObject<any> = useRef(null);
  const passwordRef: React.MutableRefObject<any> = useRef(null);

  // 기기에서 완료 또는 다음 버튼을 눌렀을 경우 다음 탭으로 이동
  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 회원가입 완료처리를 위한 호출
  const onValid = (data: any) => {
    toggleModal();
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  // 회원가입 정보 폼 세팅
  useEffect(() => {
    register("phoneNumber", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", {
      required: true,
      maxLength: { value: 16, message: "비밀번호는 최소 2 ~ 16자리 입니다." },
      minLength: { value: 2, message: "비밀번호는 최소 2 ~ 16자리 입니다." },
    });
    register("interlock");
    register("uid");
    register("privacyAccess");
    register("usetermAccess");
    setValue("interlock", params?.interlock);
    setValue("uid", params?.uid);
  }, [register]);

  // 테마 체크 ( 다크모드 / 화이트 모드[기본])
  const isDark = useColorScheme() === "dark";
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  // 휴대전화번호 인증을 위한 useState 세팅
  const [phoneNumberEditable, setPhoneNumberEditable] = useState(true);
  const [certified, setCertified] = useState(false);
  const [activeCertified, setActiveCertified] = useState(true);
  const [certifiedNumber, setCertifiedNumber] = useState("");
  const [makedCertifiedNumber, setMakedCertifiedNumber] = useState("");
  const [certifiedEditble, setCertifiedEditable] = useState(true);
  const [certifiedComplete, setCertifiedComplete] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  // 회원가입 절차 중 약관 모달창 토글
  const toggleModal = () => setVisibleModal(!visibleModal);

  // 휴대전화번호 길이 체크 (11자리)
  const checkPhoneNumberLength = () => {
    if (getValues("phoneNumber").length === 11) {
      setActiveCertified(!activeCertified);
    } else {
      setActiveCertified(true);
    }
  };

  // 인증번호 생성을 위한 API 호출
  const makeCertifedNumber = () => {
    const url =
      process.env.NODE_ENV === "development"
        ? `${LOCAL_URL}:4000/api/certified`
        : `${OPER_URL}:4000/api/certified`;
    const response: any = axios({
      method: "GET",
      url: url,
      params: {
        number: `${getValues("phoneNumber")}`,
      },
    })
      .then((res) => {
        setMakedCertifiedNumber(res.data.crtNumber);
        setPhoneNumberEditable(false);
        setActiveCertified(true);
        setCertified(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 인증번호 확인 처리
  const checkCertifedNumber = () => {
    if (makedCertifiedNumber === certifiedNumber) {
      Alert.alert("인증완료 되었습니다.");
    } else {
      Alert.alert("올바르지 않은 인증번호 입니다.");
      setCertifiedComplete(false);
    }
  };

  // 가입된 휴대전화번호 체크 호출
  const checkJoinPhoneNumber = (phoneNumber: any) => {
    checkPhoneMutation({
      variables: {
        phoneNumber,
      },
    });
  };

  const onCheckEmailCompleted = (data: any) => {
    const {
      checkEmail: { ok, error },
    } = data;

    if (!ok) {
      Alert.alert(error);
      return;
    } else {
      toggleModal();
    }
  };

  // 이메일 체크
  const [emailCheckMutation] = useMutation(EMAIL_CHECK, {
    onCompleted: onCheckEmailCompleted,
  });

  const emailExistCheck = () => {
    emailCheckMutation({
      variables: {
        email: getValues("email"),
      },
    });
  };

  // 약관 정보 가져오기
  const { data: termsData } = useQuery(SEE_CONFIG_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const { width } = useWindowDimensions();
  const useTermsContents = { html: termsData?.seeConfig.useTerms };
  const privacyTermsContents = { html: termsData?.seeConfig.privacyTerms };

  const [useTermsAccess, setUseTermsAccess] = useState(false);
  const [privacyTermsAccess, setPrivacyTermsAccess] = useState(false);
  const [allTermsAccess, setAllTermsAccess] = useState(false);

  const useTermToggle = () => {
    setUseTermsAccess(!useTermsAccess);
    setValue("usetermAccess", !useTermsAccess);
  };

  const privacyTermToggle = () => {
    setPrivacyTermsAccess(!privacyTermsAccess);
    setValue("privacyAccess", !privacyTermsAccess);
  };

  const allTermToggle = () => {
    setUseTermsAccess(!useTermsAccess);
    setValue("usetermAccess", !useTermsAccess);
    setPrivacyTermsAccess(!privacyTermsAccess);
    setValue("privacyAccess", !privacyTermsAccess);
    setAllTermsAccess(!allTermsAccess);
  };

  useEffect(() => {
    if (useTermsAccess && privacyTermsAccess) {
      setAllTermsAccess(true);
    } else {
      setAllTermsAccess(false);
    }
  }, [useTermsAccess, privacyTermsAccess]);

  const checkEmailRegEx = () => {
    let regEx = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    let check = regEx.test(getValues("email"));

    if (!check) {
      Alert.alert("올바르지 않은 이메일 형식입니다.");
      emailRef.current?.focus();
    }
  };

  return (
    <AuthLayout>
      <TextInput
        placeholder="이름 또는 닉네임"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(emailRef)}
        onChangeText={(text: string) => setValue("username", text)}
      />
      <TextInput
        value={watch("email")}
        ref={emailRef}
        placeholder="이메일"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        keyboardType="email-address"
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("email", text)}
        onBlur={() => checkEmailRegEx()}
      />
      <TextInput
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        secureTextEntry
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(phoneNumberRef)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      {errors?.password && <AlertText>{errors?.password?.message}</AlertText>}
      <PhoneCheck>
        <TextInput
          ref={phoneNumberRef}
          keyboardType="number-pad"
          placeholder="휴대폰번호"
          placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
          returnKeyType="join"
          lastOne={false}
          isDark={isDark}
          maxLength={11}
          onChangeText={(text: string) => {
            setValue("phoneNumber", text);
            checkPhoneNumberLength();
          }}
          style={{ width: "62%" }}
          editable={phoneNumberEditable}
        />
        <PhoneCheckBtn
          onPress={() => {
            checkJoinPhoneNumber(getValues("phoneNumber"));
          }}
          disabled={activeCertified}
          certified={activeCertified}
        >
          <PhoneCheckText>휴대폰문자인증</PhoneCheckText>
        </PhoneCheckBtn>
      </PhoneCheck>
      {certified ? (
        <PhoneCheck>
          <TextInput
            ref={phoneNumberRef}
            keyboardType="number-pad"
            placeholder="인증번호입력"
            placeholderTextColor={
              isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"
            }
            returnKeyType="join"
            lastOne={false}
            isDark={isDark}
            onChangeText={(text: string) => {
              setCertifiedNumber(text);
            }}
            style={{ width: "62%" }}
            editable={certifiedEditble}
          />
          <PhoneCheckBtn
            onPress={() => {
              setCertifiedComplete(!certifiedComplete);
              checkCertifedNumber();
              setCertifiedEditable(!certifiedEditble);
            }}
            disabled={certifiedComplete}
            certified={certifiedComplete}
          >
            <PhoneCheckText>인증완료</PhoneCheckText>
          </PhoneCheckBtn>
        </PhoneCheck>
      ) : null}
      <AuthButton
        onPress={() => emailExistCheck()}
        text={"회원가입"}
        loading={loading}
        disabled={
          !watch("phoneNumber") ||
          !watch("username") ||
          !watch("email") ||
          !watch("password") ||
          !certifiedComplete
        }
      />
      <AccessContainer>
        <Modal
          isVisible={visibleModal}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
          onBackdropPress={() => setVisibleModal(!visibleModal)}
        >
          <AccessTextContainer>
            <AccessTextTitle>플레이인어스 이용약관</AccessTextTitle>
            <AccessTextContents showsVerticalScrollIndicator={true}>
              <RenderHTML contentWidth={width} source={useTermsContents} />
            </AccessTextContents>
            <AccessButton
              onPress={() => {
                useTermToggle();
              }}
            >
              <Ionicons
                name={useTermsAccess ? "checkbox-outline" : "square-outline"}
                color={"white"}
                size={16}
              />
              <AccessButtonText>
                플레이인어스 이용약관 내용에 동의합니다.
              </AccessButtonText>
            </AccessButton>
          </AccessTextContainer>
          <AccessTextContainer>
            <AccessTextTitle>개인정보처리방침 약관</AccessTextTitle>
            <AccessTextContents showsVerticalScrollIndicator={true}>
              <RenderHTML contentWidth={width} source={privacyTermsContents} />
            </AccessTextContents>
            <AccessButton
              onPress={() => {
                privacyTermToggle();
              }}
            >
              <Ionicons
                name={
                  privacyTermsAccess ? "checkbox-outline" : "square-outline"
                }
                size={16}
                color={"white"}
              />
              <AccessButtonText>
                플레이인어스 개인정보처리방침 내용에 동의합니다.
              </AccessButtonText>
            </AccessButton>
            <AccessButton
              onPress={() => {
                allTermToggle();
              }}
            >
              <Ionicons
                name={allTermsAccess ? "checkbox-outline" : "square-outline"}
                size={16}
                color={"white"}
              />
              <AccessButtonText>전체 내용에 동의합니다.</AccessButtonText>
            </AccessButton>
          </AccessTextContainer>
          <AuthButton
            onPress={handleSubmit(onValid)}
            text={"확인"}
            disabled={!watch("privacyAccess") || !watch("usetermAccess")}
          />
        </Modal>
      </AccessContainer>
    </AuthLayout>
  );
}
