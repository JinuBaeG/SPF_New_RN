import { FlatList, useColorScheme } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { cache } from "../../apollo";
import BlockList from "../../components/Profile/BlockList";

const SEE_BLOCKUSERS_QUERY = gql`
  query seeBlockUsers {
    seeBlockUsers {
      id
      blockedBy {
        id
        username
        avatar
      }
    }
  }
`;

export default function BlockUsers({ navigation, route }: any) {
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, refetch } = useQuery(SEE_BLOCKUSERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: block }: any) => {
    return <BlockList {...block} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "차단 목록",
    });
  }, []);

  return (
    <ScreenLayout>
      <FlatList
        data={data?.seeBlockUsers}
        keyExtractor={(blockId) => "" + blockId.id}
        refreshing={refreshing}
        onRefresh={refresh}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
