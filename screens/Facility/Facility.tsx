import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from "react-native-nmap";
import { FACILITY_FRAGMENT_NATIVE } from "../../fragments";
import styled from "styled-components/native";
import { useIsFocused } from "@react-navigation/native";
import ScreenLayout from "../../components/ScreenLayout";
import FacilityList from "../../components/facility/FacilityList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AroundDistance } from "../../shared.types";
import { isLoggedInVar } from "../../apollo";

const FACILTIES_QUERY = gql`
  query seeFacilities(
    $offset: Int!
    $sportsEvent: String
    $maxX: Float
    $maxY: Float
    $minX: Float
    $minY: Float
  ) {
    seeFacilities(
      offset: $offset
      sportsEvent: $sportsEvent
      maxX: $maxX
      maxY: $maxY
      minX: $minX
      minY: $minY
    ) {
      ...FacilityFragmentNative
    }
  }
  ${FACILITY_FRAGMENT_NATIVE}
`;

const FilterContainer = styled.View`
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterSmallContainer = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterSmallTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterBtnContainer = styled.View``;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
  height: 168px;
  margin-bottom: 1px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
`;

const CreateGroupBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  margin-top: 40px;
  border-radius: 8px;
`;

const CreateGroupText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 12px;
  font-weight: 600;
  padding: 8px;
`;

const CreateGroupSmallBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 8px;
`;

const CreateGroupSmallText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 12px;
  font-weight: 600;
  padding: 8px;
`;

export default function Facility({ navigation }: any) {
  const isFocused = useIsFocused();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [sportsEvent, setSportsEvent] = useState<any>(undefined);
  const [curLocation, setcurLocation] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("filterSports");
      const latitude = await AsyncStorage.getItem("latitude");
      const longitude = await AsyncStorage.getItem("longitude");
      setSportsEvent(value);
      setcurLocation({ latitude, longitude });
    })();
  }, [isFocused]);

  const {
    data: facilityData,
    loading: facilityLoading,
    refetch: facilityRefetch,
    fetchMore: facilityFetchMore,
  } = useQuery(FACILTIES_QUERY, {
    variables: {
      offset: 0,
      sportsEvent,
      maxX: searchLocation?.maxX,
      maxY: searchLocation?.maxY,
      minX: searchLocation?.minX,
      minY: searchLocation?.minY,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderFacilityList = ({ item: facility }: any) => {
    return <FacilityList {...facility} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await facilityRefetch();
    setRefreshing(false);
  };

  const [location, setLocation] = useState<any>([]);

  useEffect(() => {
    if (curLocation !== null) {
      setLocation([
        ...location,
        {
          latitude: parseFloat(curLocation.latitude),
          longitude: parseFloat(curLocation.longitude),
        },
      ]);
      setSearchLocation(AroundDistance(curLocation, 500));
    }
  }, [curLocation]);

  return (
    <ScreenLayout loading={facilityLoading}>
      {/*
      <NaverMapView
        style={{ width: "100%", height: "100%", flex: 0.5 }}
        showsMyLocationButton={true}
        center={{ ...location[0], zoom: 14 }}
        onCameraChange={(e) =>
          console.warn("onCameraChange", JSON.stringify(e))
        }
        onMapClick={(e) => console.warn("onMapClick", JSON.stringify(e))}
      >
        <Marker coordinate={location[0]} />
        {facilityData?.seeFacilities !== undefined
          ? facilityData?.seeFacilities.map((item: any) => {
              return (
                <Marker
                  coordinate={{
                    latitude: parseFloat(item.areaLatitude),
                    longitude: parseFloat(item.areaLongitude),
                  }}
                />
              );
            })
          : null}
        <Circle
          coordinate={location[0]}
          color={"rgba(255,0,0,0.3)"}
          radius={500}
        />
      </NaverMapView>
      */}
      <FilterSmallContainer>
        <FilterSmallTitle>우리동네 시설</FilterSmallTitle>
        <FilterBtnContainer>
          <CreateGroupSmallBtn
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("RequestAddFacility");
              } else {
                navigation.navigate("LoggedOutNav");
              }
            }}
          >
            <CreateGroupSmallText>시설 등록하기</CreateGroupSmallText>
          </CreateGroupSmallBtn>
        </FilterBtnContainer>
      </FilterSmallContainer>
      {facilityData?.seeFacilities?.length > 0 ? (
        <FlatList
          style={{
            flex: 1,
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            return facilityFetchMore({
              variables: {
                offset: facilityData?.seeFacilities?.length,
              },
            });
          }}
          onRefresh={refresh}
          refreshing={refreshing}
          keyExtractor={(item) => item.id + ""}
          data={facilityData?.seeFacilities}
          renderItem={renderFacilityList}
        />
      ) : (
        <>
          <EmptyContainer>
            <EmptyText>우리 지역에 아직 시설이 없네요!</EmptyText>
            <EmptyText>시설 등록을 신청해보세요!</EmptyText>
            <CreateGroupBtn
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate("RequestAddFacility");
                } else {
                  navigation.navigate("LoggedOutNav");
                }
              }}
            >
              <CreateGroupText>시설 등록하기</CreateGroupText>
            </CreateGroupBtn>
          </EmptyContainer>
        </>
      )}
    </ScreenLayout>
  );
}
