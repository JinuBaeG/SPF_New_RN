import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Comments from "../screens/Feed/Comments";
import Feed from "../screens/Feed/Feed";
import Group from "../screens/Group/Group";
import Home from "../screens/Home";
import MyProfile from "../screens/Profile/MyProfile";
import Photo from "../screens/Feed/Photo";
import PhotoDetail from "../screens/Feed/PhotoDetail";
import GroupNav from "../screens/Group/GroupNav";
import { TutorFacilityNav } from "./TutorFacilityNav";
import TutorNav from "../screens/Tutor/TutorNav";
import TutorInquiry from "../screens/Tutor/TutorInquiry";
import TutorInquiryDetail from "../screens/Tutor/TutorInquiryDetail";
import TutorInquiryResponse from "../screens/Tutor/TutorInquiryResponse";
import AddBoard from "../screens/Board/AddBoard";
import BoardList from "../screens/Board/BoardList";
import BoardDetail from "../screens/Board/BoardDetail";
import BoardReComments from "../screens/Board/BoardReComments";
import AddNotice from "../screens/Notice/AddNotice";
import NoticeList from "../screens/Notice/NoticeList";
import NoticeDetail from "../screens/Notice/NoticeDetail";
import NoticeReComments from "../screens/Notice/NoticeReComments";
import ReComments from "../screens/Feed/ReComments";
import AdminNoticeDetail from "../screens/Profile/AdminNoticeDetail";
import AdminNotice from "../screens/Profile/AdminNotice";
import AdminFaq from "../screens/Profile/AdminFaq";
import AdminFaqDetail from "../screens/Profile/AdminFaqDetail";
import FindAccount from "../screens/FindAccount";
import BannerDetail from "../screens/Banner/BannerDetail";
import SportsFilter from "../screens/SportsFilter";
import FacilityNav from "../screens/Facility/FacilityNav";
import CheckMyAddTutor from "../screens/Tutor/CheckMyAddTutor";
import TutorRequestDetail from "../screens/Tutor/TutorRequestDetail";
import TutorRequestList from "../components/tutor/TutorRequestList";
import TutorMyInquiry from "../screens/Tutor/TutorMyInquiry";
import EditProfile from "../screens/Profile/EditProfile";
import ChangePassword from "../screens/ChangePassword";
import Report from "../screens/Report/Report";
import MyReport from "../screens/Report/MyReport";
import MyReportDetail from "../screens/Report/MyReportDetail";
import Privacy from "../screens/Config/Privacy";
import UseTerms from "../screens/Config/UseTerms";
import GPSTerms from "../screens/Config/GPSTerms";
import BlockUsers from "../screens/Profile/BlockUsers";

interface IStackNavFactoryProps {
  screenName: string;
}

const Stack = createStackNavigator();

export default function StackNavFactroy({ screenName }: IStackNavFactoryProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerBackTitleVisible: false,
        headerTintColor: isDark ? "#ffffff" : "#000000",
        headerStyle: {
          backgroundColor: isDark ? "#000000" : "#ffffff",
          borderBottomColor: "rgba(255,255,255,0.5)",
        },
        headerBackImage: () => {
          return (
            <Ionicons
              name="chevron-back"
              size={24}
              style={{ marginLeft: 8 }}
              color={isDark ? "#ffffff" : "#000000"}
            />
          );
        },
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen name={"TabHome"} component={Home} />
      ) : null}
      {screenName === "Feed" ? (
        <Stack.Screen name={"TabFeed"} component={Feed} />
      ) : null}
      {screenName === "Group" ? (
        <Stack.Screen name={"TabGroup"} component={Group} />
      ) : null}
      {screenName === "Tutor" ? (
        <Stack.Screen name={"TabTutor"} component={TutorFacilityNav} />
      ) : null}
      {screenName === "MyProfile" ? (
        <Stack.Screen name={"My Profile"} component={MyProfile} />
      ) : null}
      <Stack.Screen
        name="Profile"
        getComponent={() => require("../screens/Profile/Profile").default}
      />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen
        name="Likes"
        getComponent={() => require("../screens/Likes").default}
      />
      <Stack.Screen name="PhotoDetail" component={PhotoDetail} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="ReComments" component={ReComments} />
      <Stack.Screen name="GroupDetail" component={GroupNav} />
      <Stack.Screen name="TutorDetail" component={TutorNav} />
      <Stack.Screen name="FacilityDetail" component={FacilityNav} />
      <Stack.Screen name="TutorInquiry" component={TutorInquiry} />
      <Stack.Screen name="TutorMyInquiry" component={TutorMyInquiry} />
      <Stack.Screen name="TutorInquiryDetail" component={TutorInquiryDetail} />
      <Stack.Screen
        name="TutorInquiryResponse"
        component={TutorInquiryResponse}
      />
      <Stack.Screen name="AddBoard" component={AddBoard} />
      <Stack.Screen name="BoardList" component={BoardList} />
      <Stack.Screen name="BoardDetail" component={BoardDetail} />
      <Stack.Screen name="BoardReComments" component={BoardReComments} />
      <Stack.Screen name="AddNotice" component={AddNotice} />
      <Stack.Screen name="NoticeList" component={NoticeList} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetail} />
      <Stack.Screen name="NoticeReComments" component={NoticeReComments} />
      <Stack.Screen name="AdminNotice" component={AdminNotice} />
      <Stack.Screen name="AdminNoticeDetail" component={AdminNoticeDetail} />
      <Stack.Screen name="AdminFaq" component={AdminFaq} />
      <Stack.Screen name="AdminFaqDetail" component={AdminFaqDetail} />
      <Stack.Screen name="BannerDetail" component={BannerDetail} />
      <Stack.Screen name="SportsFilter" component={SportsFilter} />
      <Stack.Screen name="CheckMyAddTutor" component={CheckMyAddTutor} />
      <Stack.Screen name="TutorRequestDetail" component={TutorRequestDetail} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FindAccount" component={FindAccount} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="MyReport" component={MyReport} />
      <Stack.Screen name="MyReportDetail" component={MyReportDetail} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="UseTerms" component={UseTerms} />
      <Stack.Screen name="GPSTerms" component={GPSTerms} />
      <Stack.Screen name="BlockUsers" component={BlockUsers} />
    </Stack.Navigator>
  );
}
