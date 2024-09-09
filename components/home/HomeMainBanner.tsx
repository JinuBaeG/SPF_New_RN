import { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import ScreenLayout from "../ScreenLayout";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";

type BannerCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "BannerDetail"
>;

const SEE_BANNERS_QUERY = gql`
  query seeMainBanners($offset: Int, $sortation: String) {
    seeMainBanners(offset: $offset, sortation: $sortation) {
      id
      bannerImagePath
      sortation
    }
  }
`;

const HomeMainBannerContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: ${(props) => props.theme.size8};
`;

const BannerBtn = styled.TouchableOpacity``;

const Banner = styled.Image`
  border-radius: 8px;
`;

export default function HomeMainBanner({ setMainBannerLoading }: any) {
  const navigation = useNavigation<BannerCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 5);

  const { data, loading } = useQuery(SEE_BANNERS_QUERY, {
    variables: {
      offset: 3,
      sortation: "main",
    },
  });
  useEffect(() => {
    setMainBannerLoading(loading);
  }, [loading]);
  return (
    <ScreenLayout loading={loading}>
      <HomeMainBannerContainer>
        <Swiper
          loop
          horizontal
          showsButtons={false}
          showsPagination={true}
          autoplay={true}
          autoplayTimeout={3.5}
          containerStyle={{
            height: imageHeight,
          }}
          dot={
            <View
              style={{
                backgroundColor: "rgba(1, 170, 115, 0.4)",
                width: 5,
                height: 5,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: "#01aa73",
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          paginationStyle={{
            bottom: 20,
            left: 20,
            right: undefined,
          }}
        >
          {data?.seeMainBanners !== undefined && data?.seeMainBanners !== null
            ? data?.seeMainBanners?.map((item: any) => {
                return (
                  <BannerBtn
                    key={item.id}
                    onPress={() =>
                      navigation.navigate("BannerDetail", { id: item.id })
                    }
                  >
                    <Banner
                      resizeMode="stretch"
                      style={{
                        width: "100%",
                        height: imageHeight,
                      }}
                      source={{ uri: item.bannerImagePath }}
                    />
                  </BannerBtn>
                );
              })
            : null}
        </Swiper>
      </HomeMainBannerContainer>
    </ScreenLayout>
  );
}
