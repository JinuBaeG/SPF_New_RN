import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import PhotoComp from "../../components/feed/PhotoComp";
import ScreenLayout from "../../components/ScreenLayout";
import {
  COMMENT_FRAGMENT_NATIVE,
  PHOTO_FRAGMENT_NATIVE,
} from "../../fragments";
import HeaderNav from "../../components/nav/HeaderNav";
import Category from "../../components/Category";
import SharedWriteButton from "../../components/shared/SharedWriteButton";

const USER_FEED_QUERY = gql`
  query seeUserFeed($offset: Int!, $id: Int) {
    seeUserFeed(offset: $offset, id: $id) {
      ...PhotoFragmentNative
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragmentNative
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT_NATIVE}
  ${COMMENT_FRAGMENT_NATIVE}
`;

export default function ProfileFeed({ navigation, route }: any) {
  const { data, loading, refetch, fetchMore } = useQuery(USER_FEED_QUERY, {
    variables: {
      offset: 0,
      id: route.params.id,
    },
  });

  const renderPhoto = ({ item: photo }: any) => {
    return <PhotoComp {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };
  useEffect(() => {
    navigation.setOptions({
      title: "피드",
      headerRight: MessageButton,
    });
  }, []);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeUserFeed?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: "100%", marginTop: 1 }}
        showsVerticalScrollIndicator={false}
        data={data?.seeUserFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
