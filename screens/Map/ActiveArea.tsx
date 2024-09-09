import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import axios from "axios";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { X_NCP_APIGW_API_KEY_ID, X_NCP_APIGW_API_KEY } from "@env";

interface ILocation {
  latitude: number;
  longitude: number;
}

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${(props) => props.theme.greenInactColor};
`;

const Text = styled.Text``;

const SearchBoxContainer = styled.View`
  padding: 8px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SearchBox = styled.TextInput`
  width: 90%;
  padding: 16px;
  background: ${(props) => props.theme.whiteColor};
  color: ${(props) => props.theme.greenActColor};
  font-size: 16px;
  border-radius: 8px;
`;

const SearchButton = styled.TouchableOpacity`
  margin-left: 12px;
`;

const ResultsBoxContainer = styled.View`
  padding: 8px;
  flex-direction: row;
  align-items: center;
`;

const ResultsBoxTextWrap = styled.TouchableOpacity`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
  overflow: hidden;
`;

const ResultsBoxPostWrap = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 4px;
`;

const ResultsBoxAreaname = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-right: 4px;
`;

const ResultsBoxPostcode = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.blackColor};
`;

const ResultsBoxText = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.blackColor};
`;

export default function ActiveArea({ navigation, route }: any) {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [response, setResponse] = useState<any>({});
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [results, setResults] = useState<any>([]);
  const didMount = useRef(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied ");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "활동 지역 설정",
    });
  }, []);

  const getAddress = async (location: any, search: string) => {
    console.log(search);
    setResults([]);
    const response: any = await axios.get(
      "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
      {
        params: {
          query: search,
          coordinate: `${location.longitude},${location.latitude}`,
        },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": `${X_NCP_APIGW_API_KEY_ID}`,
          "X-NCP-APIGW-API-KEY": `${X_NCP_APIGW_API_KEY}`,
        },
      }
    );
    setResponse(response);
    setSearch("");
  };

  const setSearchResults = () => {
    const addresses = response?.data?.addresses;
    let addrArr = [];
    for (let i = 0; i < addresses.length; i++) {
      let newResults = {
        id: route.params.id,
        sidoName: addresses[i].addressElements[0].shortName,
        gusiName: addresses[i].addressElements[1].shortName,
        dongEubMyunName: addresses[i].addressElements[2].shortName,
        riName: addresses[i].addressElements[3].shortName,
        roadName: addresses[i].addressElements[4].shortName,
        buildingNumber: addresses[i].addressElements[5].shortName,
        zipcode: addresses[i].addressElements[8].shortName,
        address: addresses[i].jibunAddress,
        addrRoad: addresses[i].roadAddress,
        longitude: addresses[i].x,
        latitude: addresses[i].y,
        merge: true,
      };
      addrArr.push(newResults);
    }
    setResults(addrArr);
  };

  useEffect(() => {
    if (didMount.current) {
      setSearchResults();
    } else {
      didMount.current = true;
    }
  }, [response]);

  const onSelect = (index: number) => {
    navigation.navigate(route.params.previousScreen, results[index]);
  };

  return (
    <Container>
      <SearchBoxContainer>
        <SearchBox
          placeholderTextColor="#01aa73"
          placeholder="주소를 입력하세요."
          autoCapitalize="none"
          returnKeyLabel="Search"
          returnKeyType="search"
          autoCorrect={false}
          onChangeText={(text) => {
            setSearch(text);
          }}
          onSubmitEditing={() => getAddress(location, search)}
          value={search}
        />
        <SearchButton onPress={() => getAddress(location, search)}>
          <Ionicons name="search" color={"rgba(1, 170, 115)"} size={20} />
        </SearchButton>
      </SearchBoxContainer>
      {results.length > 0
        ? results.map((addr: any, index: number) => (
            <ResultsBoxContainer key={index}>
              <ResultsBoxTextWrap
                onPress={() => {
                  onSelect(index);
                }}
              >
                <ResultsBoxPostWrap>
                  <ResultsBoxAreaname>
                    {addr.dongEubMyunName}
                  </ResultsBoxAreaname>
                  <ResultsBoxPostcode>({addr.zipcode})</ResultsBoxPostcode>
                </ResultsBoxPostWrap>
                <ResultsBoxText>도로명 주소 : {addr.addrRoad}</ResultsBoxText>
                <ResultsBoxText>지번 주소 : {addr.address}</ResultsBoxText>
              </ResultsBoxTextWrap>
            </ResultsBoxContainer>
          ))
        : null}
    </Container>
  );
}
