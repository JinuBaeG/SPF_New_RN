import { gql, useQuery } from "@apollo/client";
import { GROUPINFO_FRAGMENT_NATIVE } from "../fragments";

const SEE_GROUPINFO_QUERY = gql`
  query seeGroupInfo($id: Int!) {
    seeGroupInfo(id: $id) {
      ...GroupInfoFragmentNative
    }
  }
  ${GROUPINFO_FRAGMENT_NATIVE}
`;

export default function useGroupInfo(id: number) {
  const { data: groupInfoList } = useQuery(SEE_GROUPINFO_QUERY, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
  });

  const groupInfoData: any = [];
  if (groupInfoList) {
    groupInfoList?.seeGroupInfo?.map((info: any, index: number) => {
      groupInfoData.push({
        awardDate: info.awardDate,
        discription: info.discription,
      });
    });
  }

  return groupInfoData;
}
