import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, FlatList } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import UserRow, { IUserRowsProps } from "../components/UserRow";
import { USER_FRAGMENT_NATIVE } from "../fragments";

interface ILikesProps {
  route: {
    key: string;
    name: string;
    params: {
      photoId: number;
    };
    path: string;
  };
}

interface ILikesItemProps {
  item: IUserRowsProps;
}

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragmentNative
    }
  }
  ${USER_FRAGMENT_NATIVE}
`;

export default function Likes({ route }: ILikesProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(LIKES_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params.photoId,
  });
  const renderUser = ({ item: user }: ILikesItemProps) => {
    return <UserRow {...user} />;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          ></View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data?.seePhotoLikes}
        keyExtractor={(item) => "" + item.id}
        renderItem={renderUser}
        style={{ width: "100%" }}
      ></FlatList>
    </ScreenLayout>
  );
}
