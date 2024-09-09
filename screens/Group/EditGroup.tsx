import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { colors } from "../../color";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { GroupImageComp } from "../../components/group/GroupImageComp";
import { GroupActInfoComp } from "../../components/group/GroupActInfoComp";
import { GroupSportsComp } from "../../components/group/GroupSportsComp";
import { GroupTagComp } from "../../components/group/GroupTagComp";
import { GroupAreaComp } from "../../components/group/GroupAreaComp";
import ScreenLayout from "../../components/ScreenLayout";
import { GroupPresidentComp } from "../../components/group/GroupPresidentComp";
import ScreenLayoutSec from "../../components/ScreenLayoutSec";

const EDIT_GROUP_MUTATION = gql`
  mutation editGroup(
    $id: Int!
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
    $groupPresident: GroupPresidentInput
  ) {
    editGroup(
      id: $id
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
      groupPresident: $groupPresident
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
  color: ${(props) => props.theme.grayColor};
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
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

export default function EditGroup({ navigation, route }: any) {
  const groupData = route.params.groupData;
  const [groupLoading, setGroupLoading] = useState(true);
  const onCompleted = (data: any) => {
    const {
      editGroup: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("GroupDetail", { id: getValues("id") });
    }

    if (error) {
      alert(error);
    }
  };

  const [editGroupMutation, { loading: editLoading }] = useMutation(
    EDIT_GROUP_MUTATION,
    { onCompleted }
  );
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const onValid = async ({
    id,
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
    groupPresident,
  }: any) => {
    editGroupMutation({
      variables: {
        id,
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
        groupPresident,
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
      title: "그룹 정보 수정",
      headerRight: editLoading ? HeaderRightLoading : HeaderRight,
      ...(editLoading && { headerLeft: () => null }),
    });
  }, []);

  useEffect(() => {
    register("id");
    register("name", {
      required: "그룹명은 필수 입력입니다.",
      minLength: {
        value: 2,
        message: "그룹명은 두 글자 이상 작성하세요.",
      },
    });
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
    register("maxMember", {
      required: "최대 인원수를 입력해주세요.",
      minLength: {
        value: 1,
        message: "최대 인원수는 최소 1명이상 입니다.",
      },
    });
    register("groupInfo");
    register("groupTag");
    register("groupPresident");
  }, [register]);

  useEffect(() => {
    setValue("id", groupData.id);
    setValue("name", groupData.name);
    setValue("discription", groupData.discription);
    setValue("sidoName", groupData.sidoName);
    setValue("gusiName", groupData.gusiName);
    setValue("dongEubMyunName", groupData.dongEubMyunName);
    setValue("riName", groupData.riName);
    setValue("roadName", groupData.roadName);
    setValue("buildingNumber", groupData.buildingNumber);
    setValue("zipcode", groupData.zipcode);
    setValue("activeArea", groupData.activeArea);
    setValue("address", groupData.address);
    setValue("addrRoad", groupData.addrRoad);
    setValue("areaLatitude", groupData.areaLatitude);
    setValue("areaLongitude", groupData.areaLongitude);
    setValue("sportsEvent", groupData.sportsEvent);
    setValue("file", groupData.imagePath);
    setValue("maxMember", groupData.maxMember);
    setValue("users", groupData.users);
    setValue("groupInfo", groupData.groupInfo);
    setValue("groupTag", groupData.groupTag);
    setValue("groupPresident", groupData.groupPresident);
    setGroupLoading(false);
  }, [setValue]);
  // 자주 찾는 시설 - 시작
  // 자주 찾는 시설 - 끝
  return (
    <ScreenLayoutSec loading={groupLoading}>
      <Container>
        {errors?.name && <AlertText>{errors?.name?.message}</AlertText>}
        <TextWrap>
          <TextLabel>
            그룹명<ImportantData>*</ImportantData>
          </TextLabel>
          <TextInput
            placeholder="그룹명"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onChangeText={(text) => setValue("name", text)}
            maxLength={20}
          >
            {getValues("name")}
          </TextInput>
        </TextWrap>
        <TextWrap>
          <TextLabel>그룹소개</TextLabel>
          <TextInput
            placeholder="그룹소개"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onChangeText={(text) => setValue("discription", text)}
            maxLength={20}
          >
            {getValues("discription")}
          </TextInput>
        </TextWrap>
        <GroupPresidentComp
          navigation={navigation}
          route={route}
          setValue={setValue}
          groupPresident={getValues("groupPresident")}
          users={getValues("users")}
        />
        <GroupSportsComp
          setValue={setValue}
          sportsEvent={getValues("sportsEvent")}
          id={getValues("id")}
        />
        {errors?.sportsEvent && (
          <AlertText>{errors?.sportsEvent?.message}</AlertText>
        )}
        <GroupImageComp
          setValue={setValue}
          imagePath={getValues("file")}
          id={getValues("id")}
        />
        {errors?.maxMember && (
          <AlertText>{errors?.maxMember?.message}</AlertText>
        )}
        <TextWrap>
          <TextLabel>
            최대 인원 수<ImportantData>*</ImportantData>
          </TextLabel>
          <TextInput
            placeholder="최대 인원 수"
            placeholderTextColor="rgba(0,0,0,0.2)"
            onChangeText={(text) => setValue("maxMember", text)}
            maxLength={3}
          >
            {getValues("maxMember")}
          </TextInput>
        </TextWrap>
        <GroupTagComp
          setValue={setValue}
          groupTag={getValues("groupTag")}
          id={getValues("id")}
        />
        <GroupActInfoComp
          setValue={setValue}
          groupInfo={getValues("groupInfo")}
          id={getValues("id")}
        />
        <GroupAreaComp
          navigation={navigation}
          route={route}
          setValue={setValue}
          id={getValues("id")}
          sidoName={getValues("sidoName")}
          gusiName={getValues("gusiName")}
          dongEubMyunName={getValues("dongEubMyunName")}
          riName={getValues("riName")}
          roadName={getValues("roadName")}
          buildingNumber={getValues("buildingNumber")}
          zipcode={getValues("zipcode")}
          activeArea={getValues("activeArea")}
          address={getValues("address")}
          addrRoad={getValues("addrRoad")}
          areaLatitude={getValues("areaLatitude")}
          areaLongitude={getValues("areaLongitude")}
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
    </ScreenLayoutSec>
  );
}
