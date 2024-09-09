import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { ActivityIndicator, useColorScheme } from "react-native";
import useMe from "../../hooks/useMe";

const TutorHeaderContainer = styled.View`
  flex: 0.5;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const TutorHeaderWrap = styled.View`
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.blackColor};
  position: relative;
`;

const TutorHeaderImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid black;
  position: absolute;
  top: 80px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const TutorHeaderInfoContainer = styled.View`
  height: 150px;
  padding: 16px;
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const TutorHeaderInfoWrap = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
`;

const TutorHeaderInfoTitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const TutorHeaderTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const TutorHeaderEvent = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorHeaderPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.grayColor};
  margin: 4px;
`;

const TutorHeaderMember = styled.View`
  flex-direction: row;
`;

const TutorHeaderUserCount = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorHeaderActiveArea = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const TutorHeaderDisc = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const TutorHeaderTagWrap = styled.View`
  flex-direction: row;
`;

const TutorHeaderButtonWrap = styled.View``;

const TutorHeaderButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const TutorHeaderButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.whiteColor};
`;

const TutorHeaderEditButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.whiteColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const TutorHeaderEditButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.greenActColor};
`;

export default function TutorHeader({ navigation, route, tutorData }: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <TutorHeaderContainer>
      <TutorHeaderWrap>
        <TutorHeaderImage
          source={
            tutorData.tutorImage?.imagePath !== undefined
              ? { uri: tutorData.tutorImage?.imagePath }
              : isDark
              ? require("../../assets/emptyAvatar_white.png")
              : require("../../assets/emptyAvatar.png")
          }
        />
      </TutorHeaderWrap>
      <TutorHeaderInfoContainer>
        <TutorHeaderInfoWrap>
          <TutorHeaderInfoTitleWrap>
            <TutorHeaderTitle>{tutorData.name}</TutorHeaderTitle>
            {tutorData.tutorSportsEvent.map((info: any) => (
              <TutorHeaderEvent key={info.id}>
                {info.name + " "}
              </TutorHeaderEvent>
            ))}
          </TutorHeaderInfoTitleWrap>
          <TutorHeaderActiveArea>{tutorData.activeArea}</TutorHeaderActiveArea>
          <TutorHeaderDisc>{tutorData.discription}</TutorHeaderDisc>
          <TutorHeaderTagWrap></TutorHeaderTagWrap>
        </TutorHeaderInfoWrap>
        {tutorData.isTutor ? (
          <TutorHeaderButtonWrap>
            {/* 
            <TutorHeaderButton onPress={() => {}}>
              <TutorHeaderButtonText>정보수정</TutorHeaderButtonText>
        </TutorHeaderButton> */}
            <TutorHeaderEditButton
              onPress={() => {
                navigation.navigate("TutorInquiry", { id: tutorData.id });
              }}
            >
              <TutorHeaderEditButtonText>문의보기</TutorHeaderEditButtonText>
            </TutorHeaderEditButton>
          </TutorHeaderButtonWrap>
        ) : (
          <TutorHeaderButtonWrap>
            <TutorHeaderButton
              onPress={() => {
                navigation.navigate("Profile", {
                  username: tutorData.user.username,
                  id: tutorData.user.id,
                });
              }}
            >
              <TutorHeaderButtonText>피드보기</TutorHeaderButtonText>
            </TutorHeaderButton>
            <TutorHeaderEditButton
              onPress={() => {
                navigation.navigate("AddInquiry", {
                  id: tutorData.id,
                  name: tutorData.name,
                });
              }}
            >
              <TutorHeaderEditButtonText>문의하기</TutorHeaderEditButtonText>
            </TutorHeaderEditButton>
          </TutorHeaderButtonWrap>
        )}
      </TutorHeaderInfoContainer>
    </TutorHeaderContainer>
  );
}
