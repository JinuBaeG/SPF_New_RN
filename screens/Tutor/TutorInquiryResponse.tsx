import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-select-bottom-list";
import styled from "styled-components/native";
import { colors } from "../../color";
import DissmissKeyboard from "../../components/DismissKeyboard";
import { TUTOR_INQUIRY_FRAGMENT_NATIVE } from "../../fragments";
import useUser from "../../hooks/useUser";

const RESPONSE_INQUIRY_MUTATION = gql`
  mutation responseInquiry(
    $id: Int
    $tutorId: Int
    $userId: Int
    $title: String
    $discription: String
  ) {
    responseInquiry(
      id: $id
      tutorId: $tutorId
      userId: $userId
      title: $title
      discription: $discription
    ) {
      ...TutorInquiryFragmentNative
    }
  }
  ${TUTOR_INQUIRY_FRAGMENT_NATIVE}
`;

// Styled-Component START
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
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
  background-color: ${(props) => props.theme.grayInactColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const DiscContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;

const Disc = styled.TextInput`
  background-color: ${(props) => props.theme.grayInactColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;
// Styled-Component END

export default function TutorInquiryResponse({ navigation, route }: any) {
  const inquiryData = route.params.data;
  const user = useUser(inquiryData.user.id);

  const { register, handleSubmit, setValue, getValues } = useForm();
  useEffect(() => {
    register("id");
    register("userId");
    register("tutorId");
    register("discription");
    register("title");
  }, [register]);

  useEffect(() => {
    setValue("id", inquiryData.id);
    setValue("userId", inquiryData.user.id);
    setValue("tutorId", inquiryData.tutor.id);
    setValue("title", "[Re]:" + inquiryData.inquiryTitle);
  }, []);

  const updateInquiry = (cache: any, result: any) => {
    const {
      data: { responseInquiry },
    } = result;

    if (responseInquiry.id) {
      cache.evict({ id: "TutorInquiry:" + `${responseInquiry.id}` });
      cache.modify({
        id: "TutorInquiry:" + `${responseInquiry.id}`,
        fields: {
          seeInquiries(prev: any) {
            return [responseInquiry, ...prev];
          },
        },
      });
      navigation.navigate("TutorInquiryDetail", {
        id: inquiryData.id,
        userId: inquiryData.user.id,
      });
    }
  };

  const [addInquriyMutation, { loading }] = useMutation(
    RESPONSE_INQUIRY_MUTATION,
    { update: updateInquiry }
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
    navigation.setOptions({
      title: user.username + "에게 답변하기",
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = async ({ id, tutorId, userId, title, discription }: any) => {
    addInquriyMutation({
      variables: {
        id: parseInt(id),
        tutorId: parseInt(tutorId),
        userId: parseInt(userId),
        title,
        discription,
      },
    });
  };

  return (
    <DissmissKeyboard>
      <Container>
        <TitleContainer>
          <Title
            placeholder="제목"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onChangeText={(text: string) => setValue("title", text)}
          >
            {"[Re]:" + inquiryData.inquiryTitle}
          </Title>
        </TitleContainer>
        <DiscContainer>
          <Disc
            placeholder="내용"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: string) => setValue("discription", text)}
            style={{ flex: 1, textAlignVertical: "top" }}
            numberOfLines={10}
            maxLength={1000}
            multiline={true}
          />
        </DiscContainer>
      </Container>
    </DissmissKeyboard>
  );
}
