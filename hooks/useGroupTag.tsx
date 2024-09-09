import { gql, useQuery } from "@apollo/client";

const SEE_GROUP_TAG_QUERY = gql`
  query seeGroupTag($offset: Int!) {
    seeGroupTag(offset: $offset) {
      id
      name
    }
  }
`;

export default function useGroupTag(groupTag: any | undefined) {
  const { data: tagList } = useQuery(SEE_GROUP_TAG_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const tagData: any = [];
  if (tagList) {
    tagList?.seeGroupTag.map((tag: any) => {
      tagData.push({
        id: tag.id,
        name: tag.name,
        isUse: false,
      });
    });
  }

  if (groupTag) {
    tagData.map((item: any, index: any) => {
      groupTag.map((group: any) => {
        if (item.id === group.id) {
          tagData[index].isUse = true;
        }
      });
    });
  }
  return tagData;
}
