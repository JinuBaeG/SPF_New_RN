import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

interface IAddress {
  id: number | undefined;
  navigation: any | undefined;
  route: any | undefined;
  setValue: Function;
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

export function GroupAreaComp({
  navigation,
  route,
  setValue,
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
}: IAddress) {
  // 활동 지역 - 시작
  useEffect(() => {
    setValue(
      "sidoName",
      route.params.sidoName !== undefined ? route.params.sidoName : sidoName
    );
    setValue(
      "gusiName",
      route.params.gusiName !== undefined ? route.params.gusiName : gusiName
    );
    setValue(
      "dongEubMyunName",
      route.params.dongEubMyunName !== undefined
        ? route.params.dongEubMyunName
        : dongEubMyunName
    );
    setValue(
      "riName",
      route.params.riName !== undefined ? route.params.riName : riName
    );
    setValue(
      "roadName",
      route.params.roadName !== undefined ? route.params.roadName : roadName
    );
    setValue(
      "buildingNumber",
      route.params.buildingNumber !== undefined
        ? route.params.buildingNumber
        : buildingNumber
    );
    setValue(
      "address",
      route.params.address !== undefined ? route.params.address : address
    );
    setValue(
      "addrRoad",
      route.params.addrRoad !== undefined ? route.params.addrRoad : addrRoad
    );
    setValue(
      "activeArea",
      route.params.activeArea !== undefined
        ? route.params.dongEubMyunName
        : dongEubMyunName
    );
    setValue(
      "areaLatitude",
      route.params.latitude !== undefined ? route.params.latitude : areaLatitude
    );
    setValue(
      "areaLongitude",
      route.params.longitude !== undefined
        ? route.params.longitude
        : areaLongitude
    );
    setValue(
      "zipcode",
      route.params.zipcode !== undefined ? route.params.zipcode : zipcode
    );
  }, [navigation, route]);
  // 활동 지역 - 끝

  return (
    <Upload
      onPress={() => {
        navigation.navigate("ActiveArea", {
          previousScreen: route.name,
          id,
        });
      }}
    >
      {route.params.dongEubMyunName !== undefined &&
      route.params.dongEubMyunName !== null ? (
        <TextLabel>{route.params.dongEubMyunName}</TextLabel>
      ) : dongEubMyunName !== null && dongEubMyunName !== undefined ? (
        <TextLabel>{dongEubMyunName}</TextLabel>
      ) : (
        <TextLabel>활동지역</TextLabel>
      )}

      {route.params.addrRoad !== undefined ? (
        <UploadText>{route.params.addrRoad} </UploadText>
      ) : addrRoad !== null ? (
        <UploadText>{addrRoad} </UploadText>
      ) : null}
    </Upload>
  );
}
