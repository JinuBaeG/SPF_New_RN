import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { useEffect } from "react";

const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.mainBgColor};
  width: 100%;
`;

const Header = styled.TouchableOpacity`
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

const UserInfoWrap = styled.View``;

const BoardInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CreateDate = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  margin-right: 8px;
`;

const Hits = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 4px 16px 16px;
`;

const CaptionText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.textColor};
`;

const Category = styled.View`
  flex-direction: row;
  padding: 16px 16px 4px;
`;

const CategoryText = styled.Text`
  margin-left: 10px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

export default function TutorRequestDetail({ navigation, route }: any) {
  const getDate = new Date(parseInt(route?.params?.createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  useEffect(() => {
    navigation.setOptions({
      title:
        route?.params?.title !== null
          ? route?.params?.title > 10
            ? route?.params?.title.substring(0, 9) + "..."
            : route?.params?.title
          : "제목없음",
    });
  });

  return (
    <ScreenLayout>
      <Container>
        <Header>
          <UserInfoWrap>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        <Category>
          <CategoryText>제목 : {route?.params?.title}</CategoryText>
        </Category>
        <Caption>
          <CaptionText>{route?.params?.discription}</CaptionText>
        </Caption>
      </Container>
    </ScreenLayout>
  );
}
