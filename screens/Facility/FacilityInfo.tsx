import React from "react";
import styled from "styled-components/native";
import FacilityList from "../../components/facility/FacilityList";
import SharedGroupList from "../../components/shared/SharedGroupList";

const MainContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => props.theme.grayBackground};
`;

const InfoContainer = styled.View`
  padding: 8px 16px 16px;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 4px;
`;
const InfoTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  padding: 8px 0;
`;

const InfoWrap = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
  align-items: center;
`;

const InfoLabel = styled.Text`
  width: 100px;
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const UserWrap = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid black;
  margin-right: 16px;
`;

const Username = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
  font-weight: 600;
`;

export default function TutorInfo({ navigation, route }: any) {
  const data = route.params.data;

  return (
    <MainContainer>
      <InfoContainer>
        <InfoTitle>기본 정보</InfoTitle>
        <InfoWrap>
          <InfoLabel>종목</InfoLabel>
          {data?.tutorSportsEvent?.map((info: any) => (
            <InfoText key={info.id}>{info.name + " "}</InfoText>
          ))}
        </InfoWrap>
        <InfoWrap>
          <InfoLabel>활동 지역</InfoLabel>
          <InfoText>{data?.activeArea}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <InfoLabel>태그</InfoLabel>
          <InfoText>없음</InfoText>
        </InfoWrap>
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>활동 정보</InfoTitle>
        {data?.tutorInfo?.map((info: any) => (
          <InfoWrap key={info.id}>
            <InfoLabel>{info.awardDate}</InfoLabel>
            <InfoText>{info.discription}</InfoText>
          </InfoWrap>
        ))}
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>그룹스</InfoTitle>
        {data?.group?.map((group: any) => (
          <SharedGroupList {...group} key={group.id} />
        ))}
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>자주 찾는 시설</InfoTitle>
        {data?.facility?.map((facility: any) => (
          <FacilityList {...facility} key={facility.id} />
        ))}
      </InfoContainer>
    </MainContainer>
  );
}
