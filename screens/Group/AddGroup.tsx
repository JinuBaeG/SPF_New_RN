import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { colors } from "../../color";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import useMe from "../../hooks/useMe";
import { GroupImageComp } from "../../components/group/GroupImageComp";
import { GroupActInfoComp } from "../../components/group/GroupActInfoComp";
import { GroupSportsComp } from "../../components/group/GroupSportsComp";
import { GroupTagComp } from "../../components/group/GroupTagComp";
import { GroupAreaComp } from "../../components/group/GroupAreaComp";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import { error } from "console";

const CREATE_GROUP_MUTATION = gql`
  mutation createGroup(
    $name: String!
    $discription: String
    $sidoName: String
    $gusiName: String
    $dongEubMyunName: String
    $riName: String
    $roadName: String
    $buildingNumber: String
    $zipcode: String
    $activeArea: String
    $address: String
    $addrRoad: String
    $areaLatitude: String
    $areaLongitude: String
    $sportsEvent: String
    $file: [Upload]
    $maxMember: String
    $groupInfo: [GroupInfoInput]
    $groupTag: [GroupTagInput]
  ) {
    createGroup(
      name: $name
      discription: $discription
      sidoName: $sidoName
      gusiName: $gusiName
      dongEubMyunName: $dongEubMyunName
      riName: $riName
      roadName: $roadName
      buildingNumber: $buildingNumber
      zipcode: $zipcode
      activeArea: $activeArea
      address: $address
      addrRoad: $addrRoad
      areaLatitude: $areaLatitude
      areaLongitude: $areaLongitude
      sportsEvent: $sportsEvent
      file: $file
      maxMember: $maxMember
      groupInfo: $groupInfo
      groupTag: $groupTag
    ) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
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

const AlertText = styled.Text`
  color: red;
  margin: 4px 0;
`;

export default function AddGroup({ navigation, route }: any) {
  // 그룹 등록 화면 기본 - 시작
  const me: any = useMe();
  const updateGroups = (cache: any, result: any) => {
    const {
      data: { createGroup },
    } = result;

    if (createGroup.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeMyGroup(prev: any) {
            return [createGroup, ...prev];
          },
          seeGroups(prev: any) {
            return [createGroup, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const [CreateGroupMutation, { loading: addLoading, data }] = useMutation(
    CREATE_GROUP_MUTATION,
    { update: updateGroups }
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty, errors, isSubmitting },
  } = useForm();
  const onValid = async ({
    name,
    discription,
    sidoName,
    gusiName,
    dongEubMyunName,
    riName,
    roadName,
    buildingNumber,
    zipcode,
    activeArea,
    address,
    addrRoad,
    areaLatitude,
    areaLongitude,
    sportsEvent,
    file,
    maxMember,
    groupInfo,
    groupTag,
  }: any) => {
    CreateGroupMutation({
      variables: {
        name,
        discription,
        sidoName,
        gusiName,
        dongEubMyunName,
        riName,
        roadName,
        buildingNumber,
        zipcode,
        activeArea,
        address,
        addrRoad,
        areaLatitude,
        areaLongitude,
        sportsEvent,
        file,
        maxMember: maxMember.toString(),
        groupInfo,
        groupTag,
      },
    });
  };
  const HeaderRight = () => {
    return (
      <TouchableOpacity onPress={handleSubmit(onValid)} disabled={isSubmitting}>
        <HeaderRightText>완료</HeaderRightText>
      </TouchableOpacity>
    );
  };

  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  useEffect(() => {
    navigation.setOptions({
      title: "그룹 만들기",
      headerRight: addLoading ? HeaderRightLoading : HeaderRight,
      ...(addLoading && { headerLeft: () => null }),
    });
  }, []);

  useEffect(() => {
    register("userId");
    register("discription");
    register("sidoName");
    register("gusiName");
    register("dongEubMyunName");
    register("riName");
    register("roadName");
    register("buildingNumber");
    register("zipcode");
    register("activeArea");
    register("address");
    register("addrRoad");
    register("areaLatitude");
    register("areaLongitude");
    register("sportsEvent", { required: "종목은 필수 입력입니다." });
    register("file");
    register("groupInfo");
    register("groupTag");
    register("gropuPresident");
  }, [register]);
  // 그룹 등록 화면 기본 - 끝
  return (
    <Container>
      <TextWrap>
        <TextLabel>
          그룹명<ImportantData>*</ImportantData>
        </TextLabel>
        <TextInput
          {...register("name", {
            required: "그룹명은 필수 입력입니다.",
            minLength: {
              value: 2,
              message: "그룹명은 두 글자 이상 작성하세요.",
            },
          })}
          placeholder="그룹명"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("name", text)}
          maxLength={20}
          aria-invalid={!isDirty ? undefined : errors.name ? true : false}
        />
        {errors.name && <AlertText>{errors.name.message}</AlertText>}
      </TextWrap>
      <TextWrap>
        <TextLabel>그룹소개</TextLabel>
        <TextInput
          placeholder="그룹소개"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("discription", text)}
          maxLength={20}
        />
      </TextWrap>
      <GroupSportsComp
        setValue={setValue}
        id={undefined}
        sportsEvent={undefined}
      />
      {errors.sportsEvent && (
        <AlertText>{errors.sportsEvent.message}</AlertText>
      )}
      <GroupImageComp setValue={setValue} />
      <TextWrap>
        <TextLabel>
          최대 인원 수<ImportantData>*</ImportantData>
        </TextLabel>
        <TextInput
          {...register("maxMember", {
            required: "최대 인원수를 입력해주세요.",
            minLength: {
              value: 1,
              message: "최대 인원수는 최소 1명이상 입니다.",
            },
          })}
          placeholder="최대 인원 수"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("maxMember", text)}
          maxLength={3}
          aria-invalid={!isDirty ? undefined : errors.maxMember ? true : false}
        />
        {errors.maxMember && <AlertText>{errors.maxMember.message}</AlertText>}
      </TextWrap>
      <GroupTagComp setValue={setValue} id={undefined} groupTag={undefined} />
      <GroupActInfoComp
        setValue={setValue}
        id={undefined}
        groupInfo={undefined}
      />
      <GroupAreaComp
        navigation={navigation}
        route={route}
        setValue={setValue}
        id={undefined}
        addrRoad={undefined}
        address={undefined}
        buildingNumber={undefined}
        sidoName={undefined}
        gusiName={undefined}
        dongEubMyunName={undefined}
        riName={undefined}
        roadName={undefined}
        zipcode={undefined}
        areaLatitude={undefined}
        areaLongitude={undefined}
        activeArea={undefined}
      />
      <TextWrap>
        <TextInnerWrap>
          <TextLabel>자주 찾는 시설</TextLabel>
          <AddButton onPress={() => {}}>
            <UploadText>
              시설 추가{" "}
              <Ionicons name="add-circle" size={12} color={"#01aa73"} />
            </UploadText>
          </AddButton>
        </TextInnerWrap>
      </TextWrap>
      <MarginBottom />
    </Container>
  );
}
