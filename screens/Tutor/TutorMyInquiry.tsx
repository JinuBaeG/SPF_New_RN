import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import InquiryList from "../../components/shared/InquiryList";
import { TUTOR_INQUIRY_FRAGMENT_NATIVE } from "../../fragments";

const SEE_MY_INQUIRIES_QUERY = gql`
  query seeMyInquiries($offset: Int) {
    seeMyInquiries(offset: $offset) {
      ...TutorInquiryFragmentNative
    }
  }
  ${TUTOR_INQUIRY_FRAGMENT_NATIVE}
`;

export default function TutorMyInquiry({ navigation, route }: any) {
  const {
    data,
    loading: inquiryLoading,
    refetch: inquiryRefetch,
    fetchMore: inquiryFetchMore,
  } = useQuery(SEE_MY_INQUIRIES_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderInquiryList = ({ item: inquiry }: any) => {
    return <InquiryList {...inquiry} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await inquiryRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "내 문의",
    });
  }, []);

  return (
    <ScreenLayout loading={inquiryLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return inquiryFetchMore({
            variables: {
              offset: data?.seeMyInquiries?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeMyInquiries}
        renderItem={renderInquiryList}
      />
    </ScreenLayout>
  );
}
