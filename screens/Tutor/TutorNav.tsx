import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import TutorBoard from "./TutorBoard";
import TutorCalendar from "./TutorCalendar";
import TutorInfo from "./TutorInfo";
import { gql, useQuery } from "@apollo/client";
import { TUTOR_FRAGMENT_NATIVE } from "../../fragments";
import ScreenLayout from "../../components/ScreenLayout";
import TutorHeader from "../../components/tutor/TutorHeader";
import { useIsFocused } from "@react-navigation/native";

const TUTOR_INFO_QUERY = gql`
  query seeTutor($id: Int!) {
    seeTutor(id: $id) {
      ...TutorFragmentNative
    }
  }
  ${TUTOR_FRAGMENT_NATIVE}
`;

const Tab = createMaterialTopTabNavigator();

const TutorBottomContainer = styled.View`
  flex: 0.7;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 8px;
`;

export default function TutorNav({ navigation, route }: any) {
  const isFocused = useIsFocused();
  const isDark = useColorScheme() === "dark";
  const id = parseInt(route.params.id);
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading,
    refetch: tutorNavRefetch,
  } = useQuery(TUTOR_INFO_QUERY, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
  });

  const tutorNavRefresh = async () => {
    setRefreshing(true);
    await tutorNavRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    tutorNavRefresh();
    navigation.setOptions({
      title: data?.seeTutor?.name,
    });
  }, [route.params, data, isFocused]);
  return (
    <ScreenLayout loading={loading}>
      <TutorHeader
        tutorData={data?.seeTutor}
        navigation={navigation}
        refresh={tutorNavRefresh}
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
          <Tab.Screen
            name="TutorBoard"
            options={{
              title: "게시판",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeTutor }}
            component={TutorBoard}
          />
          {/* 
          <Tab.Screen
            name="TutorCalendar"
            options={{
              title: "캘린더",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={TutorCalendar}
          />
          */}
          <Tab.Screen
            name="TutorInfo"
            options={{
              title: "정보",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeTutor }}
            component={TutorInfo}
          />
        </Tab.Navigator>
      </TutorBottomContainer>
    </ScreenLayout>
  );
}
