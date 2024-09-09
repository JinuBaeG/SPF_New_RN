import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import HeaderNav from "../components/nav/HeaderNav";
import VirtualizedView from "../components/shared/VirtualizedView";
import useSportsEventMain from "../hooks/useSportsEventMain";
import HomeMainBanner from "../components/home/HomeMainBanner";
import HomeNewsBanner from "../components/home/HomeNewsBanner";
import HeaderFilter from "../components/nav/HeaderFilter";
import ScreenLayout from "../components/ScreenLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: ${(props) => props.theme.size16};
  margin-bottom: 30px;
`;

const SportsEventArea = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
`;

const SportsEvent = styled.TouchableOpacity`
  width: 20%;
  height: 60px;
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: 8px;
  align-items: center;
  margin-bottom: 24px;
`;
const SportsIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
`;

const SportsEventText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
`;

export default function Home({ navigation }: any) {
  const data = useSportsEventMain(undefined);

  const SportsFilter = async (sportsName: string) => {
    await AsyncStorage.setItem("filterSports", sportsName);
  };

  const renderIcon = ({ item: sports, index }: any) => {
    return (
      <SportsEvent
        key={index}
        onPress={() => {
          SportsFilter(sports.name);
          navigation.navigate("TabFeed");
        }}
      >
        <SportsIcon
          source={
            index !== 8 && index !== 9
              ? { uri: sports.imagePath }
              : index !== 8
              ? require("../assets/ALL.png")
              : require("../assets/Contest.png")
          }
          resizeMode="contain"
        />
        <SportsEventText>
          {index !== 8 && index !== 9
            ? sports.name
            : index !== 8
            ? "전체"
            : "대회정보"}
        </SportsEventText>
      </SportsEvent>
    );
  };

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };

  const FilterButton = () => {
    return <HeaderFilter navigation={navigation} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: FilterButton,
      headerRight: MessageButton,
    });
  }, []);

  const [mainBannerLoading, setMainBannerLoading] = useState(false);
  const [newsBannerLoading, setNewsBannerLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    if ((mainBannerLoading && newsBannerLoading) == false) {
      setScreenLoading(false);
    } else {
      setScreenLoading(true);
    }
  }, []);

  return (
    <VirtualizedView>
      <ScreenLayout loading={screenLoading}>
        <HomeContainer>
          <HomeMainBanner setMainBannerLoading={setMainBannerLoading} />
          <SportsEventArea>
            <FlatList
              style={{
                width: "100%",
                marginTop: 1,
                padding: 16,
              }}
              numColumns={5}
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(sports) => "" + sports.id}
              renderItem={renderIcon}
              initialNumToRender={10}
            />
          </SportsEventArea>
          <HomeNewsBanner setNewsBannerLoading={setNewsBannerLoading} />
        </HomeContainer>
      </ScreenLayout>
    </VirtualizedView>
  );
}
