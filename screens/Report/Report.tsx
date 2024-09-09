import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import DissmissKeyboard from "../../components/DismissKeyboard";
import { colors } from "../../color";

const CREATE_REPORT_MUTATION = gql`
  mutation createReport(
    $photoId: Int
    $boardId: Int
    $noticeId: Int
    $reportDiscription: String
    $reportSortation: String
  ) {
    createReport(
      photoId: $photoId
      boardId: $boardId
      noticeId: $noticeId
      reportDiscription: $reportDiscription
      reportSortation: $reportSortation
    ) {
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

const DiscContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;

const Disc = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;
// Styled-Component END

export default function Report({ navigation, route }: any) {
  const { register, handleSubmit, setValue } = useForm();

  const onCompleted = (data: any) => {
    const {
      createReport: { ok, error },
    } = data;

    if (ok) {
      Alert.alert("신고접수가 되었습니다.", "관리자가 확인 후 조치하겠습니다.");
      navigation.goBack();
    }
  };

  const [createReportMutation, { loading }] = useMutation(
    CREATE_REPORT_MUTATION,
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
    register("photoId");
    register("boardId");
    register("noticeId");
    register("reportDiscription");
    register("reportSortation");
  }, [register]);

  useEffect(() => {
    if (route.params.screen === "Feed") {
      setValue("photoId", route.params.id);
    } else if (route.params.screen === "Board") {
      setValue("boardId", route.params.id);
    }
    if (route.params.screen === "Notice") {
      setValue("noticeId", route.params.id);
    }
    setValue("reportSortation", route.params.screen);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "신고하기",
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = async ({
    photoId,
    boardId,
    noticeId,
    reportDiscription,
    reportSortation,
  }: any) => {
    createReportMutation({
      variables: {
        photoId,
        boardId,
        noticeId,
        reportDiscription,
        reportSortation,
      },
    });
  };

  return (
    <DissmissKeyboard>
      <Container>
        <DiscContainer>
          <Disc
            placeholder="신고사유"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: string) => setValue("reportDiscription", text)}
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
