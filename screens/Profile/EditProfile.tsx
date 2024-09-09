import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { USER_FULL_FRAGMENT_NATIVE } from "../../fragments";
import { useForm } from "react-hook-form";
import { ProfileImageComp } from "../../components/Profile/ProfileImageComp";
import { ProfileGenderComp } from "../../components/Profile/ProfileGenderComp";
import ScreenLayout from "../../components/ScreenLayout";
import { emailMasking, phoneNumberMasking } from "../../shared.types";
import ScreenLayoutSec from "../../components/ScreenLayoutSec";
import DeleteUser from "./DeleteUser";

const SEE_MYPROFILE_QUERY = gql`
  query seeProfile($id: Int!) {
    seeProfile(id: $id) {
      ...UserFullFragmentNative
    }
  }
  ${USER_FULL_FRAGMENT_NATIVE}
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $id: Int!
    $username: String
    $avatar: Upload
    $gender: String
  ) {
    editProfile(
      id: $id
      username: $username
      avatar: $avatar
      gender: $gender
    ) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  flex: 1;
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.greenInactColor};
`;

const TextWrap = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const HeaderRightText = styled.Text`
  color: ${(props) => props.theme.greenActColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const TextInnerWrap = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const MarginBottom = styled.View`
  margin-bottom: 100px;
`;

const ImportantData = styled.Text`
  font-size: 8px;
  color: red;
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export default function EditProfile({ navigation, route }: any) {
  // 그룹 등록 화면 기본 - 시작
  const me: any = useMe();

  const { data: myProfileData, loading: profileLoading } = useQuery(
    SEE_MYPROFILE_QUERY,
    {
      variables: {
        id: parseInt(me.data.me.id),
      },
      fetchPolicy: "network-only",
    }
  );

  const { register, handleSubmit, setValue, getValues } = useForm();

  const updateEditProfile = (cache: any, result: any) => {
    const {
      data: {
        editProfile: { ok, id },
      },
    } = result;

    if (ok) {
      navigation.reset({ routes: [{ name: "MyProfile" }] });
    }
  };
  const [EditProfileMutation, { loading: addLoading, data }] = useMutation(
    EDIT_PROFILE_MUTATION,
    { update: updateEditProfile }
  );

  const onValid = async (data: any) => {
    EditProfileMutation({
      variables: {
        ...data,
      },
    });
  };
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
      title: "내 정보 수정",
      headerRight: addLoading ? HeaderRightLoading : HeaderRight,
      ...(addLoading && { headerLeft: () => null }),
    });
  }, []);

  useEffect(() => {
    register("id");
    register("username");
    register("email");
    register("avatar");
    register("gender");
    register("phoneNumber");
  }, [register]);

  useEffect(() => {
    setValue("id", parseInt(myProfileData?.seeProfile?.id));
    setValue("username", myProfileData?.seeProfile?.username);
    setValue("email", myProfileData?.seeProfile?.email);
    setValue("avatar", myProfileData?.seeProfile?.avatar);
    setValue("gender", myProfileData?.seeProfile?.gender);
    setValue("phoneNumber", myProfileData?.seeProfile?.phoneNumber);
  }, [myProfileData]);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<any>("");

  useEffect(() => {
    setUsername(myProfileData?.seeProfile?.username);
    setEmail(myProfileData?.seeProfile?.email);
    setGender(myProfileData?.seeProfile?.gender);
    setPhoneNumber(myProfileData?.seeProfile?.phoneNumber);
  }, [myProfileData]);

  const goToFindAccount = () => {
    navigation.navigate("FindAccount", {
      infoText: "비밀번호 변경을 위해 휴대전화번호를 입력해주세요.",
      previousScreen: route.name,
    });
  };

  return (
    <ScreenLayoutSec loading={profileLoading}>
      <Container>
        <TextWrap>
          <TextLabel>
            이름<ImportantData>*</ImportantData>
          </TextLabel>
          <TextInput
            {...register("username", { required: true })}
            placeholder="이름"
            placeholderTextColor="rgba(0,0,0,0.2)"
            value={username}
            onChangeText={(text) => {
              setValue("username", text);
              setUsername(text);
            }}
            maxLength={20}
          />
        </TextWrap>
        <ProfileImageComp setValue={setValue} />
        <ProfileGenderComp setValue={setValue} gender={gender} />
        <Upload>
          <TextLabel>
            이메일<ImportantData>*</ImportantData>
          </TextLabel>
          <TextInput
            {...register("email", { required: true })}
            placeholder="이메일"
            keyboardType="email-address"
            placeholderTextColor="rgba(0,0,0,0.2)"
            value={emailMasking(email)}
            onChangeText={(text) => {
              setValue("email", text);
              setEmail(text);
            }}
            maxLength={20}
            editable={false}
          />
        </Upload>
        <Upload>
          <TextLabel>
            휴대전화번호<ImportantData>*</ImportantData>
          </TextLabel>
          <TextInput
            {...register("phoneNumber", { required: true })}
            placeholder="이름"
            placeholderTextColor="rgba(0,0,0,0.2)"
            value={phoneNumberMasking(phoneNumber)}
            onChangeText={(text) => {
              setValue("phoneNumber", text);
              setPhoneNumber(text);
            }}
            maxLength={11}
            editable={false}
          />
        </Upload>
        <Upload onPress={() => goToFindAccount()}>
          <TextLabel>비밀번호 변경</TextLabel>
        </Upload>
        <DeleteUser id={me.data.me.id} />
        <MarginBottom />
      </Container>
    </ScreenLayoutSec>
  );
}
