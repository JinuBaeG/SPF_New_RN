import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import GroupBoard from "./GroupBoard";
import GroupCalendar from "./GroupCalendar";
import GroupInfo from "./GroupInfo";
import { gql, useQuery } from "@apollo/client";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import GroupHeader from "../../components/group/GroupHeader";
import ScreenLayout from "../../components/ScreenLayout";

const GROUP_INFO_QUERY = gql`
  query seeGroup($id: Int!) {
    seeGroup(id: $id) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const Tab = createMaterialTopTabNavigator();

const GroupBottomContainer = styled.View`
  flex: 0.7;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 1px;
`;

export default function GroupNav({ navigation, route }: any) {
  const isDark = useColorScheme() === "dark";
  const id = parseInt(route.params.id);

  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading,
    refetch: groupNavRefetch,
  } = useQuery(GROUP_INFO_QUERY, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
  });

  const groupNavRefresh = async () => {
    setRefreshing(true);
    await groupNavRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    groupNavRefetch();
    navigation.setOptions({
      title: data?.seeGroup?.name,
    });
  }, [route.params, data]);

  return (
    <ScreenLayout loading={loading}>
      <GroupHeader
        groupData={data?.seeGroup}
        navigation={navigation}
        refresh={groupNavRefresh}
      />
      <GroupBottomContainer>
        <Tab.Navigator
          tabBarPosition="top"
          screenOptions={{
            tabBarStyle: {
              backgroundColor: isDark ? "#000000" : "#ffffff",
            },
            tabBarActiveTintColor: isDark ? "#ffffff" : "#000000",
            tabBarIndicatorStyle: {
              backgroundColor: "#01aa73",
            },
          }}
        >
          <Tab.Screen
            name="GroupBoard"
            options={{
              title: "게시판",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: isDark ? "#ffffff" : "#000000",
            }}
            initialParams={{ data: data?.seeGroup }}
            component={GroupBoard}
          />
          {/*}
          <Tab.Screen
            name="GroupCalendar"
            options={{
              title: "캘린더",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "ffffff",
            }}
            component={GroupCalendar}
          />
          {*/}
          <Tab.Screen
            name="GroupInfo"
            options={{
              title: "정보",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "ffffff",
            }}
            initialParams={{ data: data?.seeGroup }}
            component={GroupInfo}
          />
        </Tab.Navigator>
      </GroupBottomContainer>
    </ScreenLayout>
  );
}
