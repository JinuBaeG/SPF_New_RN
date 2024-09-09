import { gql, useMutation } from "@apollo/client";
import { LOCAL_URL, OPER_URL } from "@env";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import styled from "styled-components/native";

const PHONE_CHECK = gql`
  mutation checkPhone($phoneNumber: String) {
    checkPhone(phoneNumber: $phoneNumber) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  padding-top: 40px;
`;

const InputContainer = styled.View``;

const InputTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const InputDesc = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const InputPhoneNumber = styled.TextInput<{ isDark: boolean }>`
  padding: 8px;
  background-color: ${(props) =>
    props.isDark ? props.theme.whiteColor : props.theme.blackColor};
  border-radius: 8px;
  margin: 8px 0;
`;

const PhoneCheck = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const PhoneCheckBtn = styled.TouchableOpacity<{ certified: Boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  opacity: ${(props) => (props.certified ? "0.5" : "1")};
  background-color: ${(props) => props.theme.mainBgColor};
`;

const PhoneCheckText = styled.Text`
  text-align: center;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

export default function FindAccount({ navigation, route: { params } }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberEditable, setPhoneNumberEditable] = useState(true);
  const [certified, setCertified] = useState(false);
  const [activeCertified, setActiveCertified] = useState(true);
  const [certifiedNumber, setCertifiedNumber] = useState("");
  const [makedCertifiedNumber, setMakedCertifiedNumber] = useState("");
  const [certifiedEditble, setCertifiedEditable] = useState(true);
  const [certifiedComplete, setCertifiedComplete] = useState(false);
  const isDark = useColorScheme() === "dark";

  const makeCertifedNumber = () => {
    const url =
      process.env.NODE_ENV === "development"
        ? `${LOCAL_URL}:4000/api/certified`
        : `${OPER_URL}:4000/api/certified`;
    const response: any = axios({
      method: "GET",
      url: url,
      params: {
        number: `${phoneNumber}`,
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

  const checkPhoneNumberLength = () => {
    if (phoneNumber.length === 11) {
      setActiveCertified(!activeCertified);
    } else {
      setActiveCertified(true);
    }
  };

  const onCheckPhoneCompleted = (data: any) => {
    const {
      checkPhone: { ok, error },
    } = data;

    if (ok) {
      Alert.alert(
        "가입되지 않은 번호입니다. ",
        "로그인 초기화면으로 돌아갑니다.",
        [
          {
            text: "예",
            onPress: () => {
              navigation.navigate("Welcome");
            },
          },
        ]
      );
    } else {
      navigation.navigate("ChangePassword", {
        phoneNumber,
        previousScreen: params.previousScreen,
      });
    }
  };

  const [checkPhoneMutation, { loading: checkPhoneLoading }] = useMutation(
    PHONE_CHECK,
    {
      onCompleted: onCheckPhoneCompleted,
    }
  );

  const checkJoinPhoneNumber = () => {
    checkPhoneMutation({
      variables: {
        phoneNumber,
      },
    });
  };

  const checkCertifedNumber = () => {
    if (makedCertifiedNumber === certifiedNumber) {
      checkJoinPhoneNumber();
    } else {
      Alert.alert("올바르지 않은 인증번호 입니다.");
      setCertifiedComplete(false);
      setCertifiedEditable(true);
    }
  };

  useEffect(() => {
    checkPhoneNumberLength();
  }, [phoneNumber]);

  useEffect(() => {
    navigation.setOptions({
      title: "비밀번호 변경",
    });
  }, []);

  return (
    <Container>
      <InputContainer>
        <InputTitle>{params.infoText}</InputTitle>
        <InputDesc>휴대전화번호는 안전하게 보관되어 있습니다.</InputDesc>
        <InputPhoneNumber
          keyboardType="number-pad"
          placeholder="휴대폰번호"
          placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
          returnKeyType="join"
          isDark={isDark}
          maxLength={11}
          onChangeText={(text: string) => {
            setPhoneNumber(text);
          }}
          editable={phoneNumberEditable}
        />
        <PhoneCheckBtn
          onPress={() => {
            makeCertifedNumber();
            setCertified(!certified);
            setActiveCertified(true);
          }}
          disabled={activeCertified}
          certified={activeCertified}
        >
          <PhoneCheckText>인증번호발송</PhoneCheckText>
        </PhoneCheckBtn>
        {certified ? (
          <>
            <InputPhoneNumber
              keyboardType="number-pad"
              placeholder="인증번호입력"
              placeholderTextColor={
                isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"
              }
              returnKeyType="join"
              isDark={isDark}
              onChangeText={(text: string) => {
                setCertifiedNumber(text);
              }}
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
          </>
        ) : null}
      </InputContainer>
    </Container>
  );
}
