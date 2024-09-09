import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ScreenLayout from "../../components/ScreenLayout";
import { FlatList } from "react-native";
import TutorRequestList from "../../components/tutor/TutorRequestList";

const CHECK_MY_ADD_TUTOR_LIST = gql`
  query checkMyRequest($offset: Int) {
    checkMyRequest(offset: $offset) {
      id
      user {
        id
      }
      title
      discription
      createdAt
    }
  }
`;

export default function CheckMyAddTutor({ navigation }: any) {
  const { data, loading, refetch, fetchMore } = useQuery(
    CHECK_MY_ADD_TUTOR_LIST,
    {
      variables: {
        offset: 0,
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const renderRequestList = ({ item: request }: any) => {
    return <TutorRequestList {...request} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "튜터 신청 리스트",
    });
  }, []);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return fetchMore({
            variables: {
              offset: data?.checkMyRequest?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.checkMyRequest}
        renderItem={renderRequestList}
      />
    </ScreenLayout>
  );
}
