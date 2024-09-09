import { gql, useQuery } from "@apollo/client";
import styled from "styled-components/native";
import ScreenLayout from "../ScreenLayout";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";

type BannerCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "BannerDetail"
>;

const SEE_BANNERS_QUERY = gql`
  query seeNewsBanner($offset: Int, $sortation: String) {
    seeNewsBanner(offset: $offset, sortation: $sortation) {
      id
      bannerImagePath
      sortation
    }
  }
`;

const ContestContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const ContestTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => props.theme.textColor};
`;

const ContestBannerWrap = styled.View`
  position: relative;
  margin: 8px 0;
`;

const ContestBanner = styled.Image`
  border-radius: 8px;
`;

const ContetsBtn = styled.TouchableOpacity``;

const ContestText = styled.Text`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.whiteColor};
`;

export default function HomeNewsBanner({ setNewsBannerLoading }: any) {
  const navigation = useNavigation<BannerCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 8);
  const { data, loading: newLoading } = useQuery(SEE_BANNERS_QUERY, {
    variables: {
      offset: 3,
      sortation: "news",
    },
  });
  useEffect(() => {
    setNewsBannerLoading(newLoading);
  }, [newLoading]);
  return (
    <ScreenLayout loading={newLoading}>
      <ContestContainer>
        <ContestTitle>대회정보 모아보기</ContestTitle>
        {data?.seeNewsBanner !== undefined && data?.seeNewBanner !== null ? (
          data?.seeNewsBanner?.map((item: any) => {
            return (
              <ContestBannerWrap key={item.id}>
                <ContetsBtn
                  onPress={() =>
                    navigation.navigate("BannerDetail", { id: item.id })
                  }
                >
                  <ContestBanner
                    resizeMode="contain"
                    style={{ width: "100%", height: imageHeight }}
                    source={{ uri: item.bannerImagePath }}
                  />
                </ContetsBtn>
              </ContestBannerWrap>
            );
          })
        ) : (
          <></>
        )}
      </ContestContainer>
    </ScreenLayout>
  );
}
