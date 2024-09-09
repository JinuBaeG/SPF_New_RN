import { gql, useQuery } from "@apollo/client";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import RenderHTML from "react-native-render-html";
import { useEffect } from "react";

const SEE_PRIVACY_CONFIG_QUERY = gql`
  query seePrivacy {
    seePrivacy {
      privacyTerms
    }
  }
`;

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 0 16px 0 0;
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 16px;
`;

export default function Privacy({ navigation }: any) {
  const { width } = useWindowDimensions();
  const { data: configData, loading: configLoading } = useQuery(
    SEE_PRIVACY_CONFIG_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const source = { html: configData?.seePrivacy?.privacyTerms };

  useEffect(() => {
    navigation.setOptions({
      title: "개인정보처리방침",
    });
  }, []);

  return (
    <ScreenLayout loading={configLoading}>
      <Container style={{ width: width }}>
        <Caption>
          <RenderHTML contentWidth={width} source={source} />
        </Caption>
      </Container>
    </ScreenLayout>
  );
}
