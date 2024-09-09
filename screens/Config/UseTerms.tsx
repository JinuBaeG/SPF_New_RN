import { gql, useQuery } from "@apollo/client";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import RenderHTML from "react-native-render-html";
import { useEffect } from "react";

const SEE_USETERMS_CONFIG_QUERY = gql`
  query seeUseTerm {
    seeUseTerm {
      useTerms
    }
  }
`;

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.whiteColor};
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 16px;
`;

export default function UseTerms({ navigation }: any) {
  const { width } = useWindowDimensions();
  const { data: configData, loading: configLoading } = useQuery(
    SEE_USETERMS_CONFIG_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const source = { html: configData?.seeUseTerm?.useTerms };

  useEffect(() => {
    navigation.setOptions({
      title: "이용약관",
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
