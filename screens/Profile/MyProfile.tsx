import React, { useEffect } from "react";
import { View, Text, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { cache, isLoggedInVar, logUserOut } from "../../apollo";
import useMe from "../../hooks/useMe";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MyProfileCount from "../../components/Profile/MyProfieCount";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import { useReactiveVar } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";

// Header Style
const MyPageTitleWrap = styled.View`
  padding: 8px 16px;
`;

const MyPageTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const EditWrap = styled.View`
  padding: 8px 16px;
`;

const EditBtn = styled.TouchableOpacity``;

// In Container Style
// Container Top
const ProfileContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.grayBackground};
`;

const ProfilePrivacyInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 4px;
`;

const ProfileImageNameWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImageWrap = styled.View`
  border-radius: 50px;
`;

const ProfileImage = styled.Image``;

const ProfileName = styled.Text`
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const ProfileBtnWrap = styled.View``;

const LogoutBtn = styled.TouchableOpacity`
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;

const LogoutText = styled.Text`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.greenActColor};
`;

const MyFeedBtn = styled.TouchableOpacity`
  border-radius: 8px;
  background-color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const MyFeedText = styled.Text`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.whiteColor};
`;
// Container Top
// Container GTF
const GTFContainer = styled.View`
  margin-bottom: 4px;
`;
const GTFCounterWrap = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

// Container Main
const Wrapper = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 4px;
`;

const TitleContainer = styled.View`
  padding: 8px 0;
`;

const TitleLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayColor};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;
const MainContainer = styled.View``;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayLineColor};
`;

// Container Bottom
const BottomContainer = styled.View`
  margin-bottom: 4px;
`;

export default function MyProfile({ navigation }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDark = useColorScheme() === "dark";
  const { data } = useMe();

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => {
        return (
          <MyPageTitleWrap>
            <MyPageTitle>마이페이지</MyPageTitle>
          </MyPageTitleWrap>
        );
      },
      headerRight: () => {
        if (isLoggedIn) {
          return (
            <EditWrap>
              <EditBtn onPress={() => navigation.navigate("EditProfile")}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={24}
                  color={isDark ? "white" : "#000000"}
                />
              </EditBtn>
            </EditWrap>
          );
        } else {
          return <></>;
        }
      },
    });
  }, []);

  return (
    <ProfileContainer>
      <ProfilePrivacyInfo>
        <ProfileImageNameWrap>
          <ProfileImageWrap>
            <ProfileImage
              source={
                data?.me?.avatar === null
                  ? isDark
                    ? require(`../../assets/emptyAvatar_white.png`)
                    : require(`../../assets/emptyAvatar.png`)
                  : { uri: data?.me?.avatar }
              }
            />
          </ProfileImageWrap>
          <ProfileName>{data?.me?.username}</ProfileName>
        </ProfileImageNameWrap>
        <ProfileBtnWrap>
          {isLoggedIn ? (
            <>
              <MyFeedBtn
                onPress={() =>
                  navigation.navigate("Profile", {
                    id: data?.me?.id,
                    username: data?.me?.username,
                  })
                }
              >
                <MyFeedText>내 피드</MyFeedText>
              </MyFeedBtn>
              <LogoutBtn
                onPress={() => {
                  cache.gc();
                  cache.evict({ id: `ROOT_QUERY` });
                  logUserOut();
                  navigation.reset({
                    routes: [{ name: "Tabs" }],
                  });
                }}
              >
                <LogoutText>로그아웃</LogoutText>
              </LogoutBtn>
            </>
          ) : (
            <LogoutBtn
              onPress={() => {
                navigation.navigate("LoggedOutNav");
              }}
            >
              <LogoutText>로그인</LogoutText>
            </LogoutBtn>
          )}
        </ProfileBtnWrap>
      </ProfilePrivacyInfo>
      {/*
      <GTFContainer>
        <GTFCounterWrap>
          <MyProfileCount name={"내 그룹"} count={data?.me?.groupCount} />
          <MyProfileCount name={"내 튜터"} count={data?.me?.tutorCount} />
          <MyProfileCount name={"내 시설 예약"} count={0} />
        </GTFCounterWrap>
      </GTFContainer>
       */}
      <Wrapper>
        <BottomContainer>
          <ProfileMenu
            title={"차단 목록 관리"}
            navi={"BlockUsers"}
            params={{ id: data?.me?.id }}
          />
          <ProfileMenu title={"공지사항"} navi={"AdminNotice"} />
          <ProfileMenu title={"FAQ"} navi={"AdminFaq"} />
          <ProfileMenu
            title={"내 신고내역"}
            disc={"내가 신고한 내역을 확인합니다."}
            navi={"MyReport"}
            params={{ id: data?.me?.id }}
          />
        </BottomContainer>
      </Wrapper>
      <Wrapper>
        <TitleContainer>
          <Title>튜터 관리</Title>
        </TitleContainer>
        <BoardLine />
        <MainContainer>
          <ProfileMenu
            title={"튜터 신청"}
            disc={"튜터가 되어보세요."}
            navi={"RequestAddTutor"}
          />
          <ProfileMenu title={"튜터 신청 확인"} navi={"CheckMyAddTutor"} />
          <ProfileMenu
            title={"내 문의"}
            disc={"내가 문의한 내역을 확인합니다."}
            navi={"TutorMyInquiry"}
            params={{ id: data?.me?.id }}
          />
          <ProfileMenu
            title={"문의확인"}
            disc={"나에게 온 문의를 확인합니다."}
            navi={"TutorInquiry"}
            params={{ id: data?.me?.tutor.id }}
          />
        </MainContainer>
      </Wrapper>

      <Wrapper>
        <TitleContainer>
          <Title>약관</Title>
        </TitleContainer>
        <BoardLine />
        <BottomContainer>
          <ProfileMenu title={"이용약관"} navi={"UseTerms"} />

          <ProfileMenu title={"개인정보처리방침"} navi={"Privacy"} />

          <ProfileMenu title={"위치기반서비스 이용약관"} navi={"GPSTerms"} />
        </BottomContainer>
      </Wrapper>
    </ProfileContainer>
  );
}
