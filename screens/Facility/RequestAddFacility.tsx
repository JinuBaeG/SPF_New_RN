import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import DissmissKeyboard from "../../components/DismissKeyboard";

const ADD_REQUST_FACILITY_MUTATION = gql`
  mutation requestAddFacility($title: String!, $discription: String!) {
    requestAddFacility(title: $title, discription: $discription) {
      ok
      error
    }
  }
`;

// Styled-Component START
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.greenInactColor};
  padding: 16px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const TitleContainer = styled.View``;

const Title = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const DiscContainer = styled.ScrollView`
  height: 150px;
  margin-top: 16px;
  height: 100%;
`;

const Disc = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
  height: 100%;
`;
// Styled-Component END

export default function RequestAddFacility({ navigation, route }: any) {
  const { register, handleSubmit, setValue } = useForm();

  const onCompleted = (data: any) => {
    const {
      requestAddTutor: { ok, error },
    } = data;

    if (ok) {
      navigation.goBack();
    }
  };

  const [requestAddFacilityMutation, { loading }] = useMutation(
    ADD_REQUST_FACILITY_MUTATION,
    {
      onCompleted,
    }
  );

  const HeaderRight = () => {
    return (
      <TouchableOpacity onPress={handleSubmit(onValid)}>
        <HeaderRightText>완료</HeaderRightText>
      </TouchableOpacity>
    );
  };
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  useEffect(() => {
    register("discription");
    register("title");
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      title: "튜터 신청하기",
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
    setDiscription(requestInfo);
  }, [loading]);

  const onValid = async ({ title, discription }: any) => {
    requestAddFacilityMutation({
      variables: {
        title,
        discription,
      },
    });
  };
  const [discription, setDiscription] = useState("");

  let requestInfo = `🙂 시설 신청 안내 \n\n⚠️ 신청시 작성한 휴대전화번호 및 이메일은 \n 당사 및 본인만 확인 가능합니다. \n \n`;
  requestInfo +=
    "⚠️ 당사는 신청자가 작성한 내용을 확인 후 작성해주신 연락처로 연락을 드려 상세 안내를 해드립니다. \n \n";
  requestInfo +=
    "⚠️ 안내 이후엔 본 작성 내용은 삭제처리가 되니 참고해주시길 바랍니다. 감사합니다\n \n \n \n";
  requestInfo += "1. 신청자 : \n \n";
  requestInfo += "2. 휴대전화번호 : \n \n";
  requestInfo += "3. 이메일 : \n \n";

  return (
    <DissmissKeyboard>
      <Container>
        <TitleContainer>
          <Title
            {...register("title", { required: true })}
            placeholder="제목"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onChangeText={(text: string) => setValue("title", text)}
          />
        </TitleContainer>
        <DiscContainer>
          <Disc
            {...register("discription", { required: true })}
            placeholder={"내용"}
            placeholderTextColor="rgba(0,0,0,0.2)"
            onSubmitEditing={handleSubmit(onValid)}
            value={discription}
            onChangeText={(text: string) => {
              setValue("discription", text);
              setDiscription(text);
            }}
            style={{ textAlignVertical: "top" }}
            numberOfLines={10}
            maxLength={2000}
            multiline={true}
          />
        </DiscContainer>
      </Container>
    </DissmissKeyboard>
  );
}
