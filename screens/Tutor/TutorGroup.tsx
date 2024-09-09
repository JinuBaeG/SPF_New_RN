import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import ScreenLayout from "../../components/ScreenLayout";
import TutorGroupList from "../../components/tutor/TutorGroupList";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";

const GROUP_QUERY = gql`
  query seeGroups($offset: Int!) {
    seeGroups(offset: $offset) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

export default function TutorGroup({ navigation, route }: any) {
  const {
    data: groupData,
    loading: groupLoading,
    refetch: groupRefetch,
    fetchMore: groupFetchMore,
  } = useQuery(GROUP_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState([]);
  const refresh = async () => {
    setRefreshing(true);
    await groupRefetch();
    setRefreshing(false);
  };

  const renderGroupList = ({ item: group, index }: any) => {
    return (
      <TutorGroupList
        {...group}
        navigation={navigation}
        route={route}
        selected={selected}
        setSelected={setSelected}
      />
    );
  };

  return (
    <ScreenLayout loading={groupLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return groupFetchMore({
            variables: {
              offset: groupData?.seeGroups?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id + ""}
        data={groupData?.seeGroups}
        renderItem={renderGroupList}
      />
    </ScreenLayout>
  );
}
