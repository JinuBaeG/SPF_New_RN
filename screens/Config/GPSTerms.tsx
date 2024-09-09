import { gql, useQuery } from "@apollo/client";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import RenderHTML from "react-native-render-html";
import { useEffect } from "react";

const SEE_GPSTERMS_CONFIG_QUERY = gql`
  query seeGPSTerm {
    seeGPSTerm {
      gpsTerms
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

export default function GPSTerms({ navigation }: any) {
  const { width } = useWindowDimensions();
  const { data: configData, loading: configLoading } = useQuery(
    SEE_GPSTERMS_CONFIG_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const source = { html: configData?.seeGPSTerm?.gpsTerms };

  useEffect(() => {
    navigation.setOptions({
      title: "위치기반서비스 이용약관",
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
