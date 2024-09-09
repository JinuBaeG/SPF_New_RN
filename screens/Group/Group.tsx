import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, useColorScheme } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import { isLoggedInVar, logUserIn, tokenVar } from "../../apollo";
import GroupList from "../../components/group/GroupList";
import MyGroup from "../../components/group/MyGroup";
import HeaderNav from "../../components/nav/HeaderNav";
import ScreenLayout from "../../components/ScreenLayout";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import HeaderFilter from "../../components/nav/HeaderFilter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import useMe from "../../hooks/useMe";

const MYGROUP_QUERY = gql`
  query seeMyGroup($offset: Int!, $sportsEvent: String) {
    seeMyGroup(offset: $offset, sportsEvent: $sportsEvent) {
      id
      name
      groupImage {
        id
        imagePath
      }
    }
  }
`;

const GROUP_QUERY = gql`
  query seeGroups($offset: Int!, $sportsEvent: String) {
    seeGroups(offset: $offset, sportsEvent: $sportsEvent) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const MyGroupWrap = styled.View`
  flex: 0.5;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const MyGroupHeader = styled.View`
  padding: 16px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const MyGroupTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterContainer = styled.View`
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterSmallContainer = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterSmallTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterBtnContainer = styled.View``;

const EmptyBtn = styled.TouchableOpacity``;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
  height: 168px;
  margin-bottom: 1px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
`;

const CreateGroupBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  margin-top: 40px;
  border-radius: 8px;
`;

const CreateGroupText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 20px;
  font-weight: 600;
  padding: 16px;
`;

const CreateGroupSmallBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 8px;
`;

const CreateGroupSmallText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 12px;
  font-weight: 600;
  padding: 8px;
`;

export default function Group({ navigation }: any) {
  const isFocused = useIsFocused();
  const [sportsEvent, setSportsEvent] = useState<any>(undefined);

  useEffect(() => {
    refresh();
    (async () => {
      const value = await AsyncStorage.getItem("filterSports");
      setSportsEvent(value);
    })();
  }, [isFocused]);

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const {
    data: groupData,
    loading: groupLoading,
    refetch: groupRefetch,
    fetchMore: groupFetchMore,
  } = useQuery(GROUP_QUERY, {
    variables: {
      offset: 0,
      sportsEvent,
    },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: myGroupData,
    loading: myGroupLoading,
    refetch: myGroupRefetch,
    fetchMore: myGroyoFetchMore,
  } = useQuery(MYGROUP_QUERY, {
    variables: {
      offset: 0,
      sportsEvent,
    },
    fetchPolicy: "cache-and-network",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [myGroupRefreshing, setMyGroupRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await groupRefetch();
    setRefreshing(false);
  };

  const myGroupRefresh = async () => {
    setMyGroupRefreshing(true);
    await myGroupRefetch();
    setMyGroupRefreshing(false);
  };

  const renderMyGroupList = ({ item: myGroup }: any) => {
    return <MyGroup {...myGroup} navigation={navigation} />;
  };

  const renderGroupList = ({ item: group }: any) => {
    return <GroupList {...group} />;
  };

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };

  const FilterButton = () => {
    return <HeaderFilter navigation={navigation} />;
  };

  useEffect(() => {
    refresh();
    myGroupRefresh();
    navigation.setOptions({
      title: "",
      headerLeft: FilterButton,
      headerRight: MessageButton,
    });
    if (!isLoggedIn) {
      refresh();
      myGroupRefresh();
      navigation.navigate("LoggedOutNav");
    }
  }, []);

  const isDark = useColorScheme() === "dark";

  return (
    <ScreenLayout loading={groupLoading}>
      <MyGroupWrap>
        <MyGroupHeader>
          <MyGroupTitle>My그룹</MyGroupTitle>
        </MyGroupHeader>
        {myGroupData?.seeMyGroup?.length > 0 ? (
          <FlatList
            horizontal
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              return myGroyoFetchMore({
                variables: {
                  offset: myGroupData?.seeMyGroup?.length,
                  sportsEvent,
                },
              });
            }}
            onRefresh={myGroupRefresh}
            refreshing={myGroupRefreshing}
            keyExtractor={(item) => item.id + ""}
            data={myGroupData?.seeMyGroup}
            renderItem={renderMyGroupList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, alignSelf: "center" }}
          />
        ) : (
          <EmptyContainer>
            <EmptyText>동호회나 PT그룹에서 함께 즐겨보세요!</EmptyText>
          </EmptyContainer>
        )}
      </MyGroupWrap>
      <FilterSmallContainer>
        <FilterSmallTitle>우리동네 그룹</FilterSmallTitle>
        <FilterBtnContainer>
          <CreateGroupSmallBtn
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("AddGroup", {
                  sidoName: undefined,
                  gusiName: undefined,
                  dongEubMyunName: undefined,
                  riName: undefined,
                  roadName: undefined,
                  buildingNumber: undefined,
                  address: undefined,
                  addrRoad: undefined,
                  activeArea: undefined,
                  areaLatitude: undefined,
                  areaLongitude: undefined,
                  zipcode: undefined,
                });
              } else {
                navigation.navigate("LoggedOutNav");
              }
            }}
          >
            <CreateGroupSmallText>그룹만들기</CreateGroupSmallText>
          </CreateGroupSmallBtn>
        </FilterBtnContainer>
      </FilterSmallContainer>
      {groupData?.seeGroups?.length > 0 ? (
        <FlatList
          style={{
            flex: 1,
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            return groupFetchMore({
              variables: {
                offset: groupData?.seeGroups?.length,
                sportsEvent,
              },
            });
          }}
          onRefresh={refresh}
          refreshing={refreshing}
          keyExtractor={(item) => item.id + ""}
          data={groupData?.seeGroups}
          renderItem={renderGroupList}
        />
      ) : (
        <>
          <EmptyContainer>
            <EmptyBtn
              onPress={() => {
                refresh();
              }}
            >
              <EmptyText>새로고침</EmptyText>
            </EmptyBtn>
            <EmptyText>우리 지역에 아직 그룹이 없네요!</EmptyText>
            <EmptyText>그룹을 만들어 사람들을 초대해보세요!</EmptyText>
            <CreateGroupBtn
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate("AddGroup", {
                    sidoName: undefined,
                    gusiName: undefined,
                    dongEubMyunName: undefined,
                    riName: undefined,
                    roadName: undefined,
                    buildingNumber: undefined,
                    address: undefined,
                    addrRoad: undefined,
                    activeArea: undefined,
                    areaLatitude: undefined,
                    areaLongitude: undefined,
                    zipcode: undefined,
                  });
                } else {
                  navigation.navigate("LoggedOutNav");
                }
              }}
            >
              <CreateGroupText>그룹만들기</CreateGroupText>
            </CreateGroupBtn>
          </EmptyContainer>
        </>
      )}
    </ScreenLayout>
  );
}
