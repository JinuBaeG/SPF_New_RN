import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { ActivityIndicator, useColorScheme } from "react-native";
import useMe from "../../hooks/useMe";

const FacilityHeaderContainer = styled.View`
  flex: 0.5;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const FacilityHeaderWrap = styled.View`
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.blackColor};
  position: relative;
`;

const FacilityHeaderImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid black;
  position: absolute;
  top: 80px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const FacilityHeaderInfoContainer = styled.View`
  height: 150px;
  padding: 16px;
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const FacilityHeaderInfoWrap = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
`;

const FacilityHeaderInfoTitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const FacilityHeaderTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const FacilityHeaderEvent = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
`;

const FacilityHeaderPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.grayColor};
  margin: 4px;
`;

const FacilityHeaderMember = styled.View`
  flex-direction: row;
`;

const FacilityHeaderUserCount = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
`;

const FacilityHeaderActiveArea = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const FacilityHeaderDisc = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const FacilityHeaderTagWrap = styled.View`
  flex-direction: row;
`;

const FacilityHeaderButtonWrap = styled.View``;

const FacilityHeaderButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const FacilityHeaderButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.whiteColor};
`;

const FacilityHeaderEditButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: ${(props) => props.theme.whiteColor};
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  margin-bottom: 4px;
`;

const FacilityHeaderEditButtonText = styled.Text`
  padding: 4px 8px;
  color: ${(props) => props.theme.greenActColor};
`;

export default function FacilityHeader({
  navigation,
  route,
  facilityData,
}: any) {
  const isDark = useColorScheme() === "dark";
  return (
    <FacilityHeaderContainer>
      <FacilityHeaderWrap>
        <FacilityHeaderImage
          source={
            facilityData.facilityImage?.imagePath !== undefined
              ? { uri: facilityData.facilityImage?.imagePath }
              : isDark
              ? require("../../assets/emptyAvatar_white.png")
              : require("../../assets/emptyAvatar.png")
          }
        />
      </FacilityHeaderWrap>
      <FacilityHeaderInfoContainer>
        <FacilityHeaderInfoWrap>
          <FacilityHeaderInfoTitleWrap>
            <FacilityHeaderTitle>{facilityData.name}</FacilityHeaderTitle>
            {facilityData.facilitySports.map((info: any) => (
              <FacilityHeaderEvent key={info.id}>
                {info.name + " "}
              </FacilityHeaderEvent>
            ))}
          </FacilityHeaderInfoTitleWrap>
          <FacilityHeaderActiveArea>
            {facilityData.activeArea}
          </FacilityHeaderActiveArea>
          <FacilityHeaderDisc>{facilityData.discription}</FacilityHeaderDisc>
          <FacilityHeaderTagWrap></FacilityHeaderTagWrap>
        </FacilityHeaderInfoWrap>
      </FacilityHeaderInfoContainer>
    </FacilityHeaderContainer>
  );
}
