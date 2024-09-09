import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import FacilityBoard from "./FacilityBoard";
import FacilityCalendar from "./FacilityCalendar";
import FacilityInfo from "./FacilityInfo";
import { gql, useQuery } from "@apollo/client";
import { FACILITY_FRAGMENT_NATIVE } from "../../fragments";
import ScreenLayout from "../../components/ScreenLayout";
import { useIsFocused } from "@react-navigation/native";
import FacilityHeader from "../../components/facility/FacilityHeader";

const FACILITY_INFO_QUERY = gql`
  query seeFacility($id: Int!) {
    seeFacility(id: $id) {
      ...FacilityFragmentNative
    }
  }
  ${FACILITY_FRAGMENT_NATIVE}
`;

const Tab = createMaterialTopTabNavigator();

const TutorBottomContainer = styled.View`
  flex: 0.7;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 8px;
`;

export default function FacilityNav({ navigation, route }: any) {
  const isFocused = useIsFocused();
  const isDark = useColorScheme() === "dark";
  const id = parseInt(route.params.id);
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading,
    refetch: facilityNavRefetch,
  } = useQuery(FACILITY_INFO_QUERY, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
  });

  const facilityNavRefresh = async () => {
    setRefreshing(true);
    await facilityNavRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    facilityNavRefresh();
    navigation.setOptions({
      title: data?.seeFacility?.name,
    });
  }, [route.params, data, isFocused]);

  return (
    <ScreenLayout loading={loading}>
      <FacilityHeader
        facilityData={data?.seeFacility}
        navigation={navigation}
        refresh={facilityNavRefresh}
      />
      <TutorBottomContainer>
        <Tab.Navigator
          tabBarPosition="top"
          screenOptions={{
            tabBarStyle: {
              backgroundColor: isDark ? "#1e272e" : "#ffffff",
            },
            tabBarActiveTintColor: isDark ? "#ffffff" : "#1e272e",
            tabBarIndicatorStyle: {
              backgroundColor: "#01aa73",
            },
          }}
        >
          {/* 
          <Tab.Screen
            name="FacilityBoard"
            options={{
              title: "게시판",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeFacility }}
            component={FacilityBoard}
          />

          <Tab.Screen
            name="FacilityCalendar"
            options={{
              title: "캘린더",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={FacilityCalendar}
          />
          */}
          <Tab.Screen
            name="FacilityInfo"
            options={{
              title: "정보",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeFacility }}
            component={FacilityInfo}
          />
        </Tab.Navigator>
      </TutorBottomContainer>
    </ScreenLayout>
  );
}
