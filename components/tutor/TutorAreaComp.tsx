import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

interface IAddress {
  id: number | undefined;
  navigation: any | undefined;
  route: any | undefined;
  setValue: Function;
  getValues: Function;
  addrRoad: string | undefined;
  address: string | undefined;
  buildingNumber: string | undefined;
  sidoName: string | undefined;
  gusiName: string | undefined;
  dongEubMyunName: string | undefined;
  riName: string | undefined;
  roadName: string | undefined;
  zipcode: string | undefined;
  activeArea: string | undefined;
  areaLatitude: string | undefined;
  areaLongitude: string | undefined;
}

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

export function TutorAreaComp({
  setValue,
  getValues,
  id,
  sidoName,
  gusiName,
  dongEubMyunName,
  riName,
  roadName,
  buildingNumber,
  address,
  addrRoad,
  activeArea,
  areaLatitude,
  areaLongitude,
  zipcode,
  route,
}: IAddress) {
  // 활동 지역 - 시작
  const navigation = useNavigation<any>();
  useEffect(() => {
    setValue(
      "sidoName",
      route.params.sidoName !== undefined
        ? route.params.sidoName
        : sidoName !== undefined
        ? sidoName
        : getValues("sidoName")
    );
    setValue(
      "gusiName",
      route.params.gusiName !== undefined
        ? route.params.gusiName
        : gusiName !== undefined
        ? gusiName
        : getValues("gusiName")
    );
    setValue(
      "dongEubMyunName",
      route.params.dongEubMyunName !== undefined
        ? route.params.dongEubMyunName
        : dongEubMyunName !== undefined
        ? dongEubMyunName
        : getValues("dongEubMyunName")
    );
    setValue(
      "riName",
      route.params.riName !== undefined
        ? route.params.riName
        : riName !== undefined
        ? riName
        : getValues("riName")
    );
    setValue(
      "roadName",
      route.params.roadName !== undefined
        ? route.params.roadName
        : roadName !== undefined
        ? roadName
        : getValues("roadName")
    );
    setValue(
      "buildingNumber",
      route.params.buildingNumber !== undefined
        ? route.params.buildingNumber
        : buildingNumber !== undefined
        ? buildingNumber
        : getValues("buildingNumber")
    );
    setValue(
      "address",
      route.params.address !== undefined
        ? route.params.address
        : address !== undefined
        ? address
        : getValues("address")
    );
    setValue(
      "addrRoad",
      route.params.addrRoad !== undefined
        ? route.params.addrRoad
        : addrRoad !== undefined
        ? addrRoad
        : getValues("addrRoad")
    );
    setValue(
      "activeArea",
      route.params.activeArea !== undefined
        ? route.params.dongEubMyunName
        : activeArea !== undefined
        ? activeArea
        : getValues("activeArea")
    );
    setValue(
      "areaLatitude",
      route.params.latitude !== undefined
        ? route.params.latitude
        : areaLatitude !== undefined
        ? areaLatitude
        : getValues("areaLatitude")
    );
    setValue(
      "areaLongitude",
      route.params.longitude !== undefined
        ? route.params.longitude
        : areaLongitude !== undefined
        ? areaLongitude
        : getValues("areaLongitude")
    );
    setValue(
      "zipcode",
      route.params.zipcode !== undefined
        ? route.params.zipcode
        : zipcode !== undefined
        ? zipcode
        : getValues("zipcode")
    );
  }, [navigation, route]);
  // 활동 지역 - 끝

  return (
    <Upload
      onPress={() => {
        navigation.navigate("ActiveArea", {
          previousScreen: route.name,
          id,
          merge: true,
        });
      }}
    >
      {route.params.dongEubMyunName !== undefined &&
      route.params.dongEubMyunName !== null ? (
        <TextLabel>{route.params.dongEubMyunName}</TextLabel>
      ) : dongEubMyunName !== null && dongEubMyunName !== undefined ? (
        <TextLabel>{getValues("dongEubMyunName")}</TextLabel>
      ) : (
        <TextLabel>활동지역</TextLabel>
      )}

      {route.params.addrRoad !== undefined ? (
        <UploadText>{route.params.addrRoad} </UploadText>
      ) : addrRoad !== null ? (
        <UploadText>{getValues("addrRoad")} </UploadText>
      ) : null}
    </Upload>
  );
}
