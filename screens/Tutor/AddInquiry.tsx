import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-select-bottom-list";
import styled from "styled-components/native";
import { colors } from "../../color";
import DissmissKeyboard from "../../components/DismissKeyboard";
import { TUTOR_INQUIRY_FRAGMENT_NATIVE } from "../../fragments";

const UPLOAD_INQUIRY_MUTATION = gql`
  mutation addInquiry($tutorId: Int, $title: String, $discription: String) {
    addInquiry(tutorId: $tutorId, title: $title, discription: $discription) {
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

export default function AddInquiry({ navigation, route }: any) {
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    register("tutorId");
    register("discription");
    register("title");
  }, [register]);

  const updateInquiry = (cache: any, result: any) => {
    const {
      data: { addInquiry },
    } = result;

    if (addInquiry.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeInquiries(prev: any) {
            return [addInquiry, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };

  const [addInquriyMutation, { loading }] = useMutation(
    UPLOAD_INQUIRY_MUTATION,
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
    setValue("tutorId", route.params.id);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name + "에게 문의하기",
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = async ({ tutorId, title, discription }: any) => {
    addInquriyMutation({
      variables: {
        tutorId,
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
          />
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
