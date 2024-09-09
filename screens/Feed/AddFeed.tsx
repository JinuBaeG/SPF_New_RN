import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import DissmissKeyboard from "../../components/DismissKeyboard";
import {
  COMMENT_FRAGMENT_NATIVE,
  PHOTO_FRAGMENT_NATIVE,
} from "../../fragments";
import { FeedSportsComp } from "../../components/feed/FeedSportsComp";
import { FeedImageComp } from "../../components/feed/FeedImageComp";
import { FeedCategoryComp } from "../../components/feed/FeedCategoryComp";
import { FeedPublicComp } from "../../components/feed/FeedPublicComp";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto(
    $files: [Upload]
    $caption: String
    $sortation: String
    $publicLevel: String
    $sportsEvent: String
    $feedCategory: String
  ) {
    uploadPhoto(
      files: $files
      caption: $caption
      sortation: $sortation
      publicLevel: $publicLevel
      sportsEvent: $sportsEvent
      feedCategory: $feedCategory
    ) {
      ...PhotoFragmentNative
      user {
        id
        username
        avatar
      }
      caption
      publicLevel
      sportsEvent
      comments {
        ...CommentFragmentNative
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT_NATIVE}
  ${COMMENT_FRAGMENT_NATIVE}
`;

// Styled-Component START
const Container = styled.View`
  flex: 1;
  background: ${(props) => props.theme.greenInactColor};
  padding: 16px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: ${(props) => props.theme.size16};
  font-weight: 600;
  margin-right: 16px;
`;

const CaptionContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;

const Caption = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  font-size: ${(props) => props.theme.size16};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const AlertText = styled.Text`
  color: red;
  margin: 4px 0;
`;

// Styled-Component END
export default function AddFeed({ route, navigation }: any) {
  // 최상위 화면명
  const screenName = route.params.screenName;

  const updateUploadPhoto = (cache: any, result: any) => {
    const {
      data: { uploadPhoto },
    } = result;

    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev: any) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updateUploadPhoto,
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();
  useEffect(() => {
    register("caption", {
      required: "내용을 입력하세요.",
      minLength: { value: 2, message: "최소 두 글자 이상을 작성하세요." },
    });
    register("files");
    register("sportsEvent");
    register("feedCategory");
    register("publicLevel");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);
  const onValid = async ({
    caption,
    files,
    publicLevel,
    sportsEvent,
    feedCategory,
  }: any) => {
    uploadPhotoMutation({
      variables: {
        caption,
        files,
        publicLevel,
        sportsEvent,
        feedCategory,
        sortation: "Feed",
      },
    });
  };
  return (
    <DissmissKeyboard>
      <Container>
        {/*
        <FeedPublicComp
          setValue={setValue}
          id={undefined}
          publicLevel={undefined}
        />
        */}
        <FeedCategoryComp setValue={setValue} id={undefined} name={undefined} />
        <FeedSportsComp
          setValue={setValue}
          id={undefined}
          sportsEvent={undefined}
        />
        <FeedImageComp setValue={setValue} />
        <CaptionContainer>
          {errors.caption && <AlertText>{errors.caption.message}</AlertText>}
          <Caption
            placeholder="내용"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: string) => setValue("caption", text)}
            style={{ flex: 1, textAlignVertical: "top" }}
            numberOfLines={10}
            maxLength={1000}
            multiline={true}
          />
        </CaptionContainer>
      </Container>
    </DissmissKeyboard>
  );
}
