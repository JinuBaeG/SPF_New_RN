import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { colors } from "../../color";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import useMe from "../../hooks/useMe";
import { TutorSportsComp } from "../../components/tutor/TutorSportsComp";
import { TutorImageComp } from "../../components/tutor/TutorImageComp";
import { TutorTagComp } from "../../components/tutor/TutorTagComp";
import { TutorActInfoComp } from "../../components/tutor/TutorActInfoComp";
import { TutorAreaComp } from "../../components/tutor/TutorAreaComp";
import TutorActivingGroup from "../../components/tutor/TutorActivingGroup";

const CREATE_TUTOR_MUTATION = gql`
  mutation createTutor(
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
    $tutorSportsEvent: [TutorSportsEventInput]
    $file: [Upload]
    $tutorInfo: [TutorInfoInput]
    $tutorTag: [TutorTagInput]
    $group: [GroupInput]
  ) {
    createTutor(
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
      tutorSportsEvent: $tutorSportsEvent
      file: $file
      tutorInfo: $tutorInfo
      tutorTag: $tutorTag
      group: $group
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
  color: ${colors.blue};
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

export default function AddFacility({ navigation, route }: any) {
  // 그룹 등록 화면 기본 - 시작
  const me: any = useMe();
  const onCompleted = (data: any) => {
    const {
      createTutor: { ok, error },
    } = data;

    if (ok) {
      navigation.navigate("Tabs");
    }

    if (error) {
      alert(error);
    }
  };
  const [CreateTutorMutation, { loading: addLoading, data }] = useMutation(
    CREATE_TUTOR_MUTATION,
    { onCompleted }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
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
    tutorSportsEvent,
    file,
    tutorInfo,
    tutorTag,
    group,
  }: any) => {
    CreateTutorMutation({
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
        tutorSportsEvent,
        file,
        tutorInfo,
        tutorTag,
        group,
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
      headerRight: addLoading ? HeaderRightLoading : HeaderRight,
      ...(addLoading && { headerLeft: () => null }),
      param: {
        merge: true,
      },
    });
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    register("userId");
    register("name");
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
    register("tutorSportsEvent");
    register("file");
    register("tutorInfo");
    register("tutorTag");
    register("group");
  }, [register]);
  // 그룹 등록 화면 기본 - 끝

  return (
    <Container>
      <TextWrap>
        <TextLabel>
          튜터명<ImportantData>*</ImportantData>
        </TextLabel>
        <TextInput
          placeholder="튜터명"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("name", text)}
          maxLength={20}
        />
      </TextWrap>
      <TextWrap>
        <TextLabel>튜터소개</TextLabel>
        <TextInput
          placeholder="그룹소개"
          placeholderTextColor="rgba(0,0,0,0.2)"
          onChangeText={(text) => setValue("discription", text)}
          maxLength={20}
        />
      </TextWrap>
      <TutorSportsComp
        setValue={setValue}
        id={undefined}
        sportsEvent={undefined}
      />
      <TutorImageComp setValue={setValue} />
      <TutorTagComp setValue={setValue} id={undefined} groupTag={undefined} />
      <TutorActInfoComp
        setValue={setValue}
        id={undefined}
        groupInfo={undefined}
      />
      <TutorAreaComp
        navigation={navigation}
        route={route}
        setValue={setValue}
        getValues={getValues}
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
      <TutorActivingGroup
        navigation={navigation}
        route={route}
        setValue={setValue}
        getValues={getValues}
      />
      {/* 
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
      */}
      <MarginBottom />
    </Container>
  );
}
