import { gql, useQuery } from "@apollo/client";
import ScreenLayout from "../components/ScreenLayout";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SEE_SPORTSEVENT_QUERY = gql`
  query seeSportsEvent($offset: Int) {
    seeSportsEvent(offset: $offset) {
      id
      name
      imagePath
    }
  }
`;

const SportsButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const SportsText = styled.Text`
  padding: 8px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

export default function SportsFilter({ navigation, route: { params } }: any) {
  const [sportsEventData, setSportsEventData] = useState<any>({
    __typename: "SportsEvent",
    id: 0,
    name: "모든 종목",
    imagePath: "",
  });
  const SportsFilter = async (sportsName: string) => {
    await AsyncStorage.setItem("filterSports", sportsName);
  };

  const renderItem = ({ item }: any) => {
    return (
      <SportsButton
        onPress={() => {
          SportsFilter(item.name);
          navigation.goBack();
        }}
      >
        <SportsText>{item.name}</SportsText>
      </SportsButton>
    );
  };

  const { data, loading, refetch, fetchMore } = useQuery(
    SEE_SPORTSEVENT_QUERY,
    {
      variables: {
        offset: 0,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    navigation.setOptions({
      title: "종목 선택",
    });
    if (data?.seeSportsEvent !== undefined) {
      setSportsEventData([sportsEventData, ...data?.seeSportsEvent]);
    }
  }, [data]);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{
          width: "100%",
          marginTop: 1,
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
        data={sportsEventData}
        keyExtractor={(sports) => "" + sports.id}
        renderItem={renderItem}
        initialNumToRender={10}
      />
    </ScreenLayout>
  );
}
