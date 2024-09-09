import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import {
  FEED_PHOTO_NATIVE,
  GROUP_FRAGMENT_NATIVE,
  TUTOR_FRAGMENT_NATIVE,
  USER_FRAGMENT_NATIVE,
} from "../../fragments";
import ScreenLayout from "../../components/ScreenLayout";
import ProfileFeed from "./ProfileFeed";
import ProfileCalendar from "./ProfileCalendar";
import ProfileInfo from "./ProfileInfo";
import ProfileHeader from "../../components/Profile/ProfileHeader";

const USER_INFO_QUERY = gql`
  query seeProfile($id: Int!) {
    seeProfile(id: $id) {
      ...UserFragmentNative
      photos {
        ...FeedPhoto
      }
      group {
        ...GroupFragmentNative
      }
      tutor {
        ...TutorFragmentNative
      }
    }
  }
  ${USER_FRAGMENT_NATIVE}
  ${FEED_PHOTO_NATIVE}
  ${TUTOR_FRAGMENT_NATIVE}
  ${GROUP_FRAGMENT_NATIVE}
`;

const Tab = createMaterialTopTabNavigator();

const GroupBottomContainer = styled.View`
  flex: 0.7;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 8px;
`;

export default function Profile({ navigation, route }: any) {
  const isDark = useColorScheme() === "dark";
  const id = parseInt(route.params.id);
  const username = route.params.username;
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(USER_INFO_QUERY, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
  });

  const profileNavRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
    navigation.setOptions({
      title: data?.seeProfile?.username,
    });
  }, [route.params, data]);

  return (
    <ScreenLayout loading={loading}>
      <ProfileHeader
        profileData={data?.seeProfile}
        navigation={navigation}
        refresh={profileNavRefresh}
      />
      <GroupBottomContainer>
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
            name="ProfieFeed"
            options={{
              title: "피드",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ id }}
            component={ProfileFeed}
          />
          {/*
          <Tab.Screen
            name="ProfieCalendar"
            options={{
              title: "캘린더",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={ProfileCalendar}
          />
          
          <Tab.Screen
            name="ProfieInfo"
            options={{
              title: "정보",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            initialParams={{ data: data?.seeProfile }}
            component={ProfileInfo}
          />
          */}
        </Tab.Navigator>
      </GroupBottomContainer>
    </ScreenLayout>
  );
}
