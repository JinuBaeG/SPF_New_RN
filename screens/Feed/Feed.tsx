import { gql, useQuery, useReactiveVar } from "@apollo/client";
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
import { useIsFocused } from "@react-navigation/native";
import HeaderFilter from "../../components/nav/HeaderFilter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useMe from "../../hooks/useMe";
import { cache, isLoggedInVar } from "../../apollo";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!, $sportsEvent: String, $category: String) {
    seeFeed(offset: $offset, sportsEvent: $sportsEvent, category: $category) {
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

export default function Feed({ navigation }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isFocused = useIsFocused();
  const [sportsEvent, setSportsEvent] = useState<any>(undefined);
  const [category, setCategory] = useState<string>("");

  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      sportsEvent,
      category,
    },
    fetchPolicy: "cache-and-network",
  });

  const refresh = async () => {
    const value = await AsyncStorage.getItem("filterSports");
    setSportsEvent(value);
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);

  const renderPhoto = ({ item: photo }: any) => {
    return <PhotoComp {...photo} refresh={refresh} />;
  };

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };

  const FilterButton = () => {
    return <HeaderFilter navigation={navigation} />;
  };

  useEffect(() => {
    refresh();
    async () => {
      const value = await AsyncStorage.getItem("filterSports");
      setSportsEvent(value);
    };
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: FilterButton,
      headerRight: MessageButton,
    });
  }, []);

  return (
    <ScreenLayout loading={loading}>
      <Category
        category={category}
        setCategory={setCategory}
        refresh={refresh}
      />
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
              sportsEvent,
              category,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: "100%", backgroundColor: "rgba(136, 136, 136, 0.1)" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
      <SharedWriteButton />
    </ScreenLayout>
  );
}
